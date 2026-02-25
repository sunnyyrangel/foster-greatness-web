import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import { validateCors, getCorsHeaders } from '@/lib/cors';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

const bodySchema = z.object({
  event_name: z.string().min(1).max(100),
  properties: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).default({}),
});

const CORS_METHODS = 'POST, OPTIONS';

export async function OPTIONS(request: NextRequest) {
  const corsError = validateCors(request);
  if (corsError) return corsError;

  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request.headers.get('origin'), CORS_METHODS),
  });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  // Validate CORS
  const corsError = validateCors(request);
  if (corsError) return corsError;

  // Rate limit: 60/min to accommodate event bursts
  const rateLimitResult = rateLimit(request, undefined, {
    limit: 60,
    windowMs: 60000,
  });

  const corsHeaders = getCorsHeaders(origin, CORS_METHODS);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { stored: false },
      {
        status: 429,
        headers: { ...rateLimitHeaders(rateLimitResult), ...corsHeaders },
      }
    );
  }

  // Always return 200 — analytics failures never propagate to client
  try {
    const body = await request.json();
    const validation = bodySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { stored: false },
        { status: 200, headers: { ...rateLimitHeaders(rateLimitResult), ...corsHeaders } }
      );
    }

    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json(
        { stored: false },
        { status: 200, headers: { ...rateLimitHeaders(rateLimitResult), ...corsHeaders } }
      );
    }

    const { event_name, properties } = validation.data;

    // Auto-detect channel from Referer if not explicitly set
    if (!properties.channel) {
      const referer = request.headers.get('referer') || '';
      properties.channel = referer.includes('/widgets/') ? 'embed' : 'web';
    }

    // Extract indexed columns, put the rest in JSONB
    const { zip, category, program_name, program, ...rest } = properties;

    const { error } = await supabase.from('service_events').insert({
      event_name,
      zip: zip != null ? String(zip) : null,
      category: category != null ? String(category) : null,
      program_name: (program_name ?? program) != null ? String(program_name ?? program) : null,
      properties: Object.keys(rest).length > 0 ? rest : {},
    });

    if (error && process.env.NODE_ENV === 'development') {
      console.error('Analytics insert error:', error);
    }

    return NextResponse.json(
      { stored: !error },
      { status: 200, headers: { ...rateLimitHeaders(rateLimitResult), ...corsHeaders } }
    );
  } catch {
    return NextResponse.json(
      { stored: false },
      { status: 200, headers: corsHeaders }
    );
  }
}
