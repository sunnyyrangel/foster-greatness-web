/**
 * Rate limiting utilities for API routes
 * Implements IP-based rate limiting with sliding window
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limit tracking
// In production, consider using Redis for distributed environments
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitOptions {
  /**
   * Maximum number of requests allowed in the time window
   * @default 5
   */
  limit?: number;

  /**
   * Time window in milliseconds
   * @default 60000 (1 minute)
   */
  windowMs?: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Get client IP address from request headers
 * Works with Vercel, Cloudflare, and standard proxies
 */
function getClientIp(request: Request): string {
  const headers = request.headers;

  // Check common proxy headers in order of preference
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can be: "client, proxy1, proxy2"
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  const cfConnectingIp = headers.get('cf-connecting-ip'); // Cloudflare
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback to 'unknown' - this should rarely happen on Vercel
  return 'unknown';
}

/**
 * Check if request should be rate limited
 *
 * @param request - The incoming request
 * @param identifier - Custom identifier (defaults to IP address)
 * @param options - Rate limit configuration
 * @returns Rate limit result with success/failure and metadata
 *
 * @example
 * ```typescript
 * const result = rateLimit(request, undefined, { limit: 5, windowMs: 60000 });
 * if (!result.success) {
 *   return NextResponse.json(
 *     { error: 'Too many requests' },
 *     {
 *       status: 429,
 *       headers: {
 *         'X-RateLimit-Limit': result.limit.toString(),
 *         'X-RateLimit-Remaining': result.remaining.toString(),
 *         'X-RateLimit-Reset': result.reset.toString(),
 *       }
 *     }
 *   );
 * }
 * ```
 */
export function rateLimit(
  request: Request,
  identifier?: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const { limit = 5, windowMs = 60000 } = options;

  // Use custom identifier or fall back to IP address
  const key = identifier || getClientIp(request);
  const now = Date.now();

  // Get existing entry or create new one
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetTime < now) {
    // No entry or window expired - create new entry
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(key, newEntry);

    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: newEntry.resetTime,
    };
  }

  // Entry exists and window is still active
  if (entry.count >= limit) {
    // Rate limit exceeded
    return {
      success: false,
      limit,
      remaining: 0,
      reset: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    reset: entry.resetTime,
  };
}

/**
 * Helper function to create rate limit headers
 */
export function rateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
    'Retry-After': result.success
      ? '0'
      : Math.ceil((result.reset - Date.now()) / 1000).toString(),
  };
}
