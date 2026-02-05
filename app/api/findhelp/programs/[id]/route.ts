import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import { validateCors, getCorsHeaders } from '@/lib/cors';
import { getProgramDetails } from '@/lib/findhelp';

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const origin = request.headers.get('origin');

  // Validate CORS
  const corsError = validateCors(request);
  if (corsError) return corsError;

  // Apply rate limiting: 15 requests per minute per IP
  const rateLimitResult = rateLimit(request, undefined, {
    limit: 15,
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
    // Get program ID from route params
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Program ID is required' },
        {
          status: 400,
          headers: {
            ...rateLimitHeaders(rateLimitResult),
            ...getCorsHeaders(origin, CORS_METHODS),
          },
        }
      );
    }

    // Parse query params
    const { searchParams } = new URL(request.url);
    const zip = searchParams.get('zip');

    // Validate ZIP
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

    // Fetch program details from Findhelp API
    const program = await getProgramDetails(validation.data.zip, id);

    return NextResponse.json(
      { success: true, data: program },
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
    if (process.env.NODE_ENV === 'development') {
      console.error('Findhelp program details error:', error);
    }

    // Handle 404 specifically
    if (error instanceof Error && error.message.includes('404')) {
      return NextResponse.json(
        { error: 'Program not found' },
        {
          status: 404,
          headers: getCorsHeaders(origin, CORS_METHODS),
        }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch program details' },
      {
        status: 500,
        headers: getCorsHeaders(origin, CORS_METHODS),
      }
    );
  }
}
