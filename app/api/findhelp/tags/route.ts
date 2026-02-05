import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import { validateCors, getCorsHeaders } from '@/lib/cors';
import { getServiceTags } from '@/lib/findhelp';

// Validation schema for query params
const querySchema = z.object({
  zip: z.string().regex(/^\d{5}$/, 'ZIP code must be exactly 5 digits'),
});

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

  // Apply rate limiting: 30 requests per minute per IP
  const rateLimitResult = rateLimit(request, undefined, {
    limit: 30,
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
    const zip = searchParams.get('zip');

    // Validate
    const validation = querySchema.safeParse({ zip });
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

    // Fetch service tags from Findhelp API
    const tags = await getServiceTags(validation.data.zip);

    return NextResponse.json(
      { success: true, data: tags },
      {
        headers: {
          ...rateLimitHeaders(rateLimitResult),
          ...getCorsHeaders(origin, CORS_METHODS),
          // Service tags CAN be cached (per Findhelp ToS)
          'Cache-Control': 'public, max-age=86400', // 24 hours
        },
      }
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Findhelp tags error:', error);
    }
    return NextResponse.json(
      { error: 'Failed to fetch service tags' },
      {
        status: 500,
        headers: getCorsHeaders(origin, CORS_METHODS),
      }
    );
  }
}
