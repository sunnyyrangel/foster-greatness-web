import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import { validateCors, getCorsHeaders } from '@/lib/cors';
import { searchInformationalResources } from '@/lib/resources';

const querySchema = z.object({
  category: z.string().min(1, 'Category is required'),
  zip: z.string().regex(/^\d{5}$/, 'ZIP code must be exactly 5 digits').optional(),
});

const CORS_METHODS = 'GET, OPTIONS';

export async function OPTIONS(request: NextRequest) {
  const corsError = validateCors(request);
  if (corsError) return corsError;

  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request.headers.get('origin'), CORS_METHODS),
  });
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');

  const corsError = validateCors(request);
  if (corsError) return corsError;

  const rateLimitResult = rateLimit(request, undefined, {
    limit: 15,
    windowMs: 60000,
  });

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          ...rateLimitHeaders(rateLimitResult),
          ...getCorsHeaders(origin, CORS_METHODS),
        },
      }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const params = {
      category: searchParams.get('category'),
      zip: searchParams.get('zip') || undefined,
    };

    const validation = querySchema.safeParse(params);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return NextResponse.json(
        { error: firstError.message },
        {
          status: 400,
          headers: {
            ...rateLimitHeaders(rateLimitResult),
            ...getCorsHeaders(origin, CORS_METHODS),
          },
        }
      );
    }

    // DEBUG: direct table query to bypass RPC and isolate the issue
    const { createClient } = await import('@supabase/supabase-js');
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    let directCount = -1;
    let rpcCount = -1;
    let rpcError = null;
    let stateResult = null;
    if (url && key) {
      const sb = createClient(url, key);
      // Test 1: direct table query
      const { data: directData } = await sb.from('informational_resources').select('id, category').eq('category', validation.data.category).limit(5);
      directCount = directData?.length ?? -1;
      // Test 2: zip_to_state RPC
      const { data: stData, error: stErr } = await sb.rpc('zip_to_state', { zip: validation.data.zip || '92618' });
      stateResult = { data: stData, error: stErr?.message ?? null };
      // Test 3: search RPC
      const { data: rpcData, error: rErr } = await sb.rpc('search_informational_resources', { search_text: null, user_state: stData ?? null });
      rpcCount = Array.isArray(rpcData) ? rpcData.length : -1;
      rpcError = rErr?.message ?? null;
    }

    const results = await searchInformationalResources({
      category: validation.data.category,
      zip: validation.data.zip,
    });

    return NextResponse.json(
      { success: true, data: results, _debug: { category: validation.data.category, zip: validation.data.zip, count: results.count, directCount, rpcCount, rpcError, stateResult, supabaseConfigured: !!(url && key) } },
      {
        headers: {
          ...rateLimitHeaders(rateLimitResult),
          ...getCorsHeaders(origin, CORS_METHODS),
        },
      }
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Informational resources search error:', error);
    }
    return NextResponse.json(
      { error: 'Failed to search informational resources' },
      {
        status: 500,
        headers: getCorsHeaders(origin, CORS_METHODS),
      }
    );
  }
}
