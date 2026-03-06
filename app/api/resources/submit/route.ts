import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import { validateCors, getCorsHeaders } from '@/lib/cors';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { captureException } from '@/lib/sentry-utils';
import { SDOH_CATEGORIES } from '@/lib/resources/types';

const submitSchema = z.object({
  program_name: z.string().min(1, 'Program name is required').max(200),
  provider_name: z.string().min(1, 'Organization name is required').max(200),
  description: z.string().min(1, 'Description is required').max(500),
  website_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  zip: z.string().regex(/^\d{5}$/, 'ZIP code must be exactly 5 digits'),
  category: z.enum(SDOH_CATEGORIES as unknown as [string, ...string[]]),
  submitted_by_role: z.enum(['nonprofit_staff', 'community_member', 'lived_experience', 'other']),
  submitted_by_name: z.string().min(1, 'Your name is required').max(100),
  submitted_by_email: z.string().email('Must be a valid email'),
  submitted_by_is_community_member: z.boolean(),
  submitted_by_used_service: z.boolean().optional().default(false),
  submitted_by_feedback: z.string().max(500).optional().or(z.literal('')),
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

  const corsError = validateCors(request);
  if (corsError) return corsError;

  const rateLimitResult = rateLimit(request, undefined, {
    limit: 5,
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

  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      {
        status: 503,
        headers: {
          ...rateLimitHeaders(rateLimitResult),
          ...getCorsHeaders(origin, CORS_METHODS),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const validation = submitSchema.safeParse(body);

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

    const data = validation.data;

    const { error } = await supabase.from('resources').insert({
      program_name: data.program_name,
      provider_name: data.provider_name,
      description: data.description,
      website_url: data.website_url || null,
      phone: data.phone || null,
      zip: data.zip,
      service_tags: [data.category],
      status: 'pending',
      submitted_by_role: data.submitted_by_role,
      submitted_by_name: data.submitted_by_name,
      submitted_by_email: data.submitted_by_email,
      submitted_by_is_community_member: data.submitted_by_is_community_member,
      submitted_by_used_service: data.submitted_by_used_service,
      submitted_by_feedback: data.submitted_by_feedback || null,
    });

    if (error) {
      throw new Error(`Supabase insert failed: ${error.message}`);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! Your resource suggestion has been submitted for review.',
      },
      {
        headers: {
          ...rateLimitHeaders(rateLimitResult),
          ...getCorsHeaders(origin, CORS_METHODS),
        },
      }
    );
  } catch (error) {
    captureException(error instanceof Error ? error : new Error(String(error)), {
      endpoint: { route: '/api/resources/submit' },
    });
    return NextResponse.json(
      { error: 'Failed to submit resource suggestion' },
      {
        status: 500,
        headers: getCorsHeaders(origin, CORS_METHODS),
      }
    );
  }
}
