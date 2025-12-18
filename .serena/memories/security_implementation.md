# Security Implementation

**Last Updated:** December 2025

## Overview
Foster Greatness website has enterprise-grade security protecting donor data, newsletter subscribers, and community member privacy. All security measures are production-ready and tested.

---

## Security Stack

### 1. HTTP Security Headers (7 Total)

All routes protected by security headers in `next.config.ts`:

```typescript
Content-Security-Policy: [Comprehensive CSP - see below]
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
X-XSS-Protection: 1; mode=block
```

**What This Protects:**
- XSS (Cross-Site Scripting) attacks
- Clickjacking attacks
- MIME type confusion attacks
- Man-in-the-middle attacks
- Privacy leakage via referrer
- Unauthorized browser feature access

---

## 2. Content Security Policy (CSP)

### Whitelisted Services

| Service | Purpose | CSP Directive |
|---------|---------|---------------|
| Stripe | Payment processing | script-src, style-src, frame-src |
| Typeform | Form embeds | script-src, img-src, frame-src |
| Vercel Analytics | Analytics | script-src, connect-src |
| Sentry | Error tracking | connect-src |
| Beehiiv | Newsletter API | connect-src, img-src, form-action |
| Circle Events | Events widget | connect-src, img-src |

### Key CSP Directives

```
default-src 'self'                    - Only load from same origin
script-src [whitelist]                - Only approved scripts
connect-src [whitelist]               - Only approved API calls
frame-src [whitelist]                 - Only approved embeds
object-src 'none'                     - Block Flash/Java
base-uri 'self'                       - Prevent base tag injection
form-action [whitelist]               - Only submit to approved URLs
frame-ancestors 'none'                - Prevent framing (clickjacking)
upgrade-insecure-requests             - Force HTTPS
```

**What This Protects:**
- XSS attacks (primary defense)
- Data exfiltration
- Malicious script injection
- Third-party compromise
- Unauthorized form submissions

---

## 3. API Rate Limiting

**Implementation:** `lib/rate-limit.ts`
**Strategy:** IP-based sliding window with in-memory storage

### Rate Limits

| Endpoint | Limit | Reason |
|----------|-------|--------|
| `/api/subscribe` | 5 req/min | Prevent spam subscriptions |
| `/api/newsletter` | 20 req/min | Higher limit for read-only |

### Features
- Automatic cleanup of expired entries
- Standard rate limit headers (X-RateLimit-Limit, Remaining, Reset, Retry-After)
- Works with Vercel, Cloudflare, and standard proxy headers
- Friendly error messages with retry instructions

**What This Protects:**
- API quota abuse (Beehiiv has limits)
- Spam/fake subscriptions
- Denial-of-service attacks
- Cost overruns from excessive API calls

---

## 4. CORS (Cross-Origin Resource Sharing)

**Implementation:** `lib/cors.ts`

### Allowed Origins

```
Production:
- https://www.fostergreatness.co
- https://fostergreatness.co
- https://storytellers-collective.com
- https://www.storytellers-collective.com

Development:
- http://localhost:3000
- http://127.0.0.1:3000
```

### Behavior
- Blocks requests from unauthorized domains with 403 Forbidden
- Handles OPTIONS preflight requests
- Returns proper CORS headers only for whitelisted origins

**What This Protects:**
- Unauthorized API access from other websites
- Resource stealing
- API quota abuse from third parties

---

## 5. Input Validation

**Implementation:** Zod schema validation in API routes

### `/api/subscribe` Validation

```typescript
{
  email: z.string().email('Please enter a valid email address'),
  name: z.string().optional(),
  source: z.enum(['newsletter', 'storytelling_guide'])
}
```

### Features
- Email format validation
- Source parameter whitelist
- Automatic lowercase/trim
- Helpful error messages

**What This Protects:**
- Invalid data reaching Beehiiv
- Spam/malformed submissions
- SQL injection (defense in depth)
- Data integrity issues

---

## 6. Privacy Protection

### Production Logging Policy

**Rule:** NO PII (Personally Identifiable Information) in production logs

**Implementation:**
```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info here');
}
```

### Protected Data
- Email addresses
- Names
- Source tracking
- API keys

**Why This Matters:**
- Vercel logs visible to all team members
- Logs may be exported/shared
- Compliance with privacy policies
- Reduces data breach risk

---

## 7. Dependency Security

### Current Status
- **Next.js:** 16.0.10 (HIGH severity CVE fixed)
- **All packages:** Latest versions
- **npm audit:** 0 vulnerabilities
- **Last updated:** December 2025

### Process
1. Run `npm audit` regularly
2. Update packages with security patches
3. Test build after updates
4. Monitor for new vulnerabilities

---

## Testing Security

### Manual Tests

**Test Security Headers:**
```bash
curl -I https://www.fostergreatness.co | grep -E "Content-Security-Policy|X-Frame"
```

**Test Rate Limiting:**
```bash
# Make 6 rapid requests - 6th should be blocked
for i in {1..6}; do
  curl -X POST https://www.fostergreatness.co/api/subscribe \
    -H "Content-Type: application/json" \
    -d '{"email":"test'$i'@example.com","source":"newsletter"}'
done
```

**Test CORS:**
```bash
# Should be blocked
curl -X POST https://www.fostergreatness.co/api/subscribe \
  -H "Origin: https://evil-site.com" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","source":"newsletter"}'
```

### Online Tools

**SecurityHeaders.com:**
1. Go to https://securityheaders.com
2. Enter: https://www.fostergreatness.co
3. Should see A+ grade with all headers

---

## Adding Security to New API Routes

**Template:**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import { validateCors, getCorsHeaders } from '@/lib/cors';

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

  // Apply rate limiting
  const rateLimitResult = rateLimit(request, undefined, {
    limit: 5,
    windowMs: 60000
  });

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          ...rateLimitHeaders(rateLimitResult),
          ...getCorsHeaders(origin),
        }
      }
    );
  }

  // Your API logic here

  return NextResponse.json(
    { success: true },
    {
      headers: {
        ...rateLimitHeaders(rateLimitResult),
        ...getCorsHeaders(origin),
      }
    }
  );
}
```

---

## Security Files Reference

- `next.config.ts` - Security headers and CSP
- `lib/rate-limit.ts` - Rate limiting utility
- `lib/cors.ts` - CORS validation utility
- `app/api/subscribe/route.ts` - Example with all security
- `app/api/newsletter/route.ts` - Example with all security
- `CLAUDE.md` - Complete security documentation

---

## Threat Model

### Protected Against ✅
- XSS (Cross-Site Scripting)
- Clickjacking
- MIME sniffing attacks
- Man-in-the-middle (MITM)
- API abuse/spam
- Rate limit DoS
- CORS attacks
- Data exfiltration
- Third-party compromise
- Privacy leakage

### NOT Protected Against ❌
- DDoS at infrastructure level (handled by Vercel)
- Social engineering
- Compromised credentials
- Zero-day vulnerabilities in dependencies
- Physical access attacks

---

## Maintenance

### Monthly Tasks
- [ ] Run `npm audit` and update vulnerable packages
- [ ] Check SecurityHeaders.com score
- [ ] Review rate limit logs for abuse patterns
- [ ] Verify CSP not blocking legitimate requests

### When Adding New Services
- [ ] Add domain to CSP whitelist
- [ ] Add domain to CORS allowed origins
- [ ] Test in development first
- [ ] Verify in production after deploy

### When Creating New API Routes
- [ ] Add rate limiting
- [ ] Add CORS validation
- [ ] Add input validation (Zod)
- [ ] Gate logging behind NODE_ENV check
- [ ] Test all security features

---

## Compliance

### Privacy
- ✅ No PII in production logs
- ✅ GDPR-compliant analytics (Vercel)
- ✅ Proper referrer policy
- ✅ Cookie-less tracking
- ✅ Permissions policy restricts invasive features

### Best Practices
- ✅ OWASP Top 10 protections implemented
- ✅ Industry-standard headers (same as Google, GitHub, Stripe)
- ✅ Zero-trust architecture for API routes
- ✅ Defense in depth strategy
- ✅ Regular dependency updates

---

## Emergency Response

### If Security Issue Detected

1. **Immediate:** Disable affected endpoint via Vercel environment variables
2. **Investigate:** Check Sentry for error patterns
3. **Fix:** Patch vulnerability
4. **Test:** Verify fix in development
5. **Deploy:** Push to production
6. **Monitor:** Watch logs for 24 hours
7. **Document:** Update this file with lessons learned

### Contacts
- **Vercel Support:** support@vercel.com
- **Sentry Issues:** Via Sentry dashboard
- **npm Security:** security@npmjs.com

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CSP Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Vercel Security Best Practices](https://vercel.com/docs/security)
- [Next.js Security Headers](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
