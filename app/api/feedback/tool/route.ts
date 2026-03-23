import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import { validateCors, getCorsHeaders } from '@/lib/cors';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

const bodySchema = z.object({
  rating: z.number().int().min(1).max(5),
  confident_find_help: z.number().int().min(1).max(4).optional(),
  feel_less_alone: z.number().int().min(1).max(4).optional(),
  zip: z.string().regex(/^\d{5}$/).optional(),
  category: z.string().optional(),
  comment: z.string().max(1000).optional().transform((v) => v?.trim()),
  contact_name: z.string().max(200).optional(),
  contact_email: z.string().email().optional(),
  consent_to_share: z.boolean().default(false),
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

  // Rate limit: 5/min
  const rateLimitResult = rateLimit(request, undefined, {
    limit: 5,
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

  // Always return 200 — feedback failures never propagate to client
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

    const { error } = await supabase.from('tool_feedback').insert(validation.data);

    if (error && process.env.NODE_ENV === 'development') {
      console.error('Tool feedback insert error:', error);
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
