import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { rateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import { verifyAdminAuth } from '@/lib/admin/auth';
import { supabaseAdmin, isAdminConfigured } from '@/lib/supabase/admin';
import { captureException } from '@/lib/sentry-utils';

const ENRICHMENT_PROMPT = `You are extracting structured information about a social service program for a resource directory that serves foster youth and young adults.

Program: {program_name}
Organization: {provider_name}
Website content:
---
{website_text}
---

Extract the following as JSON (no markdown code fences, just raw JSON):
{
  "eligibility": "Brief summary of who is eligible (1-2 sentences)",
  "populations": ["array", "of", "populations", "served"],
  "languages": ["en", "es"],
  "hours": { "monday": "9am-5pm", "tuesday": "9am-5pm" },
  "free_or_reduced": "free | reduced | indeterminate",
  "availability": "available | limited | unavailable",
  "address": "Full address if found",
  "city": "City name",
  "state": "Two-letter state abbreviation",
  "description_enhanced": "A concise, empowering 2-3 sentence description suitable for foster youth"
}

For populations, use these values where applicable: foster_youth, young_adults, low_income, homeless, single_parents, families, students, lgbtq, justice_involved, dv_survivors, immigrants, native_american, general

Only include fields you can determine from the content. Use null for fields you cannot determine.`;

async function fetchWebsiteText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'FosterGreatness-ResourceEnrichment/1.0',
      'Accept': 'text/html',
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch website: ${response.status}`);
  }

  const html = await response.text();

  // Simple HTML to text: strip tags, decode entities, collapse whitespace
  const text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

  // Limit to ~8000 chars to stay within context limits
  return text.slice(0, 8000);
}

export async function POST(request: NextRequest) {
  const isAuthed = await verifyAdminAuth(request);
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rateLimitResult = rateLimit(request, undefined, {
    limit: 5,
    windowMs: 60000,
  });

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: rateLimitHeaders(rateLimitResult) }
    );
  }

  if (!isAdminConfigured || !supabaseAdmin) {
    return NextResponse.json(
      { error: 'Admin not configured' },
      { status: 503, headers: rateLimitHeaders(rateLimitResult) }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'AI enrichment not configured (missing GEMINI_API_KEY)' },
      { status: 503, headers: rateLimitHeaders(rateLimitResult) }
    );
  }

  try {
    const { resource_id } = await request.json();

    if (!resource_id) {
      return NextResponse.json(
        { error: 'resource_id is required' },
        { status: 400, headers: rateLimitHeaders(rateLimitResult) }
      );
    }

    // Fetch the resource
    const { data: resource, error: fetchError } = await supabaseAdmin
      .from('resources')
      .select('id, program_name, provider_name, website_url, description')
      .eq('id', resource_id)
      .single();

    if (fetchError || !resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404, headers: rateLimitHeaders(rateLimitResult) }
      );
    }

    if (!resource.website_url) {
      return NextResponse.json(
        { error: 'Resource has no website URL to enrich from' },
        { status: 400, headers: rateLimitHeaders(rateLimitResult) }
      );
    }

    // Fetch and parse website
    const websiteText = await fetchWebsiteText(resource.website_url);

    // Build prompt
    const prompt = ENRICHMENT_PROMPT
      .replace('{program_name}', resource.program_name)
      .replace('{provider_name}', resource.provider_name ?? resource.program_name)
      .replace('{website_text}', websiteText);

    // Call Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        maxOutputTokens: 1024,
      },
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse JSON from response
    let enrichmentData: Record<string, unknown>;
    try {
      enrichmentData = JSON.parse(responseText);
    } catch {
      // Try to extract JSON from response if wrapped in text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        enrichmentData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response as JSON');
      }
    }

    // Store enrichment data
    const { error: updateError } = await supabaseAdmin
      .from('resources')
      .update({
        enrichment_data: enrichmentData,
        enriched_at: new Date().toISOString(),
      })
      .eq('id', resource_id);

    if (updateError) {
      throw new Error(`Failed to store enrichment: ${updateError.message}`);
    }

    return NextResponse.json(
      { data: enrichmentData },
      { headers: rateLimitHeaders(rateLimitResult) }
    );
  } catch (error) {
    captureException(error instanceof Error ? error : new Error(String(error)), {
      endpoint: { route: '/api/admin/enrich' },
    });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Enrichment failed' },
      { status: 500, headers: rateLimitHeaders(rateLimitResult) }
    );
  }
}
