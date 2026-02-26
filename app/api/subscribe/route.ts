import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import { validateCors, getCorsHeaders } from '@/lib/cors';
import { captureException } from '@/lib/sentry-utils';

// Validation schema for subscription requests
const subscriptionSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  name: z.string().optional(),
  source: z.enum(['newsletter', 'storytelling_guide']).optional().default('newsletter'),
});

// Handle OPTIONS preflight requests
export async function OPTIONS(request: NextRequest) {
  const corsError = validateCors(request);
  if (corsError) return corsError;

  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request.headers.get('origin')),
  });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  // Validate CORS
  const corsError = validateCors(request);
  if (corsError) return corsError;

  // Apply rate limiting: 5 requests per minute per IP
  const rateLimitResult = rateLimit(request, undefined, {
    limit: 5,
    windowMs: 60000, // 1 minute
  });

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many subscription requests. Please try again in a minute.' },
      {
        status: 429,
        headers: {
          ...rateLimitHeaders(rateLimitResult),
          ...getCorsHeaders(origin),
        },
      }
    );
  }

  try {
    const body = await request.json();

    // Validate request body
    const validation = subscriptionSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return NextResponse.json({
        error: firstError.message
      }, { status: 400 });
    }

    const { email, name, source } = validation.data;

    // Log only in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Subscription request:', { source, hasName: !!name });
    }

    const apiKey = process.env.BEEHIIV_API_KEY;
    if (!apiKey) {
      console.error('Missing BEEHIIV_API_KEY environment variable');
      return NextResponse.json({ error: 'API configuration error' }, { status: 500 });
    }

    // Set UTM parameters based on source
    const utmParams = source === 'storytelling_guide'
      ? {
          referring_site: 'https://storytellers-collective.com',
          utm_source: 'website',
          utm_medium: 'pdf_download',
          utm_campaign: 'storytelling_guide'
        }
      : {
          referring_site: 'https://www.fostergreatness.co',
          utm_source: 'website',
          utm_medium: 'newsletter_signup',
          utm_campaign: 'newsletter_page'
        };

    const requestBody = {
      email: email,
      reactivate_existing: true,
      ...utmParams
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('Beehiiv API request:', { source, reactivate: requestBody.reactivate_existing });
    }

    const response = await fetch('https://api.beehiiv.com/v2/publications/pub_e597ede6-38aa-4b38-a981-ae7c8f63a77e/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (process.env.NODE_ENV === 'development') {
      console.log('Beehiiv API response:', { status: response.status, success: response.ok });
    }

    if (!response.ok) {
      // Log errors in development only
      if (process.env.NODE_ENV === 'development') {
        console.error('Beehiiv API error:', {
          status: response.status,
          error: data.errors?.[0]?.detail || data.message
        });
      }
      return NextResponse.json({
        error: data.errors?.[0]?.detail || data.message || 'Subscription failed'
      }, { status: response.status });
    }

    return NextResponse.json(
      {
        success: true,
        subscription: data.data
      },
      {
        headers: {
          ...rateLimitHeaders(rateLimitResult),
          ...getCorsHeaders(origin),
        },
      }
    );

  } catch (error) {
    captureException(error instanceof Error ? error : new Error(String(error)), {
      endpoint: { route: '/api/subscribe' },
    });
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
}