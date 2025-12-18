/**
 * CORS (Cross-Origin Resource Sharing) utilities for API routes
 * Restricts API access to trusted domains only
 */

/**
 * Allowed origins for Foster Greatness API routes
 */
const ALLOWED_ORIGINS = [
  'https://www.fostergreatness.co',
  'https://fostergreatness.co',
  'https://storytellers-collective.com',
  'https://www.storytellers-collective.com',
];

// Allow localhost in development
if (process.env.NODE_ENV === 'development') {
  ALLOWED_ORIGINS.push('http://localhost:3000', 'http://127.0.0.1:3000');
}

/**
 * Check if origin is allowed
 */
export function isOriginAllowed(origin: string | null): boolean {
  if (!origin) {
    // No origin header (same-origin requests or direct API calls)
    // Allow in development, block in production for security
    return process.env.NODE_ENV === 'development';
  }

  return ALLOWED_ORIGINS.includes(origin);
}

/**
 * Get CORS headers for API responses
 */
export function getCorsHeaders(origin: string | null): HeadersInit {
  const isAllowed = isOriginAllowed(origin);

  if (!isAllowed) {
    // Don't set CORS headers for disallowed origins
    return {};
  }

  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
}

/**
 * Handle OPTIONS preflight requests
 */
export function handleCorsPreflightRequest(request: Request): Response {
  const origin = request.headers.get('origin');

  if (!isOriginAllowed(origin)) {
    return new Response(null, { status: 403 });
  }

  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

/**
 * Validate CORS for incoming request
 * Returns null if allowed, or error Response if blocked
 */
export function validateCors(request: Request): Response | null {
  const origin = request.headers.get('origin');

  // Handle OPTIONS preflight
  if (request.method === 'OPTIONS') {
    return handleCorsPreflightRequest(request);
  }

  // Check if origin is allowed
  if (!isOriginAllowed(origin)) {
    return new Response(
      JSON.stringify({ error: 'Origin not allowed' }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Origin is allowed
  return null;
}
