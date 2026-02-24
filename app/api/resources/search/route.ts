import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import { validateCors, getCorsHeaders } from '@/lib/cors';
import { searchResources } from '@/lib/resources';

const querySchema = z.object({
  zip: z.string().regex(/^\d{5}$/, 'ZIP code must be exactly 5 digits'),
  category: z.string().min(1, 'Category is required'),
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
      zip: searchParams.get('zip'),
      category: searchParams.get('category'),
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

    const results = await searchResources({
      zip: validation.data.zip,
      sdohCategory: validation.data.category,
    });

    return NextResponse.json(
      { success: true, data: results },
      {
        headers: {
          ...rateLimitHeaders(rateLimitResult),
          ...getCorsHeaders(origin, CORS_METHODS),
        },
      }
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Resources search error:', error);
    }
    return NextResponse.json(
      { error: 'Failed to search community resources' },
      {
        status: 500,
        headers: getCorsHeaders(origin, CORS_METHODS),
      }
    );
  }
}
