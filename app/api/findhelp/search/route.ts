import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import { validateCors, getCorsHeaders } from '@/lib/cors';
import { searchPrograms } from '@/lib/findhelp';
import { captureException } from '@/lib/sentry-utils';

// Validation schema for query params
const querySchema = z.object({
  zip: z.string().regex(/^\d{5}$/, 'ZIP code must be exactly 5 digits'),
  serviceTag: z.string().optional(),
  attributeTag: z.string().optional(),
  terms: z.string().optional(),
  cursor: z.string().transform(Number).pipe(z.number().min(0)).optional(),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(50)).optional(),
  sort_by: z.enum(['relevance', 'distance']).optional(),
}).refine(
  (data) => data.serviceTag || data.attributeTag || data.terms,
  { message: 'At least one of serviceTag, attributeTag, or terms is required' }
);

const CORS_METHODS = 'GET, OPTIONS';

// Handle OPTIONS preflight requests
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

  // Validate CORS
  const corsError = validateCors(request);
  if (corsError) return corsError;

  // Apply rate limiting: 10 requests per minute per IP
  const rateLimitResult = rateLimit(request, undefined, {
    limit: 10,
    windowMs: 60000, // 1 minute
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
    // Parse query params
    const { searchParams } = new URL(request.url);
    const params = {
      zip: searchParams.get('zip'),
      serviceTag: searchParams.get('serviceTag') || undefined,
      attributeTag: searchParams.get('attributeTag') || undefined,
      terms: searchParams.get('terms') || undefined,
      cursor: searchParams.get('cursor') || undefined,
      limit: searchParams.get('limit') || undefined,
      sort_by: searchParams.get('sort_by') || undefined,
    };

    // Validate
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

    const { zip, cursor, limit, sort_by, ...filters } = validation.data;

    // Search programs via Findhelp API
    const results = await searchPrograms({
      postal: zip,
      cursor: cursor ?? 0,
      limit: limit ?? 50,
      sort_by: sort_by,
      ...filters,
    });

    return NextResponse.json(
      { success: true, data: results },
      {
        headers: {
          ...rateLimitHeaders(rateLimitResult),
          ...getCorsHeaders(origin, CORS_METHODS),
          // Program data CANNOT be cached (per Findhelp ToS)
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    captureException(error instanceof Error ? error : new Error(String(error)), {
      endpoint: { route: '/api/findhelp/search' },
    });
    return NextResponse.json(
      { error: 'Failed to search programs' },
      {
        status: 500,
        headers: getCorsHeaders(origin, CORS_METHODS),
      }
    );
  }
}
