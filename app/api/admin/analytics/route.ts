import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import { getAnalyticsSummary } from '@/lib/admin/queries';

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function verifyAdmin(request: NextRequest): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const token = request.cookies.get('fg_admin_token')?.value;
  if (!token) return false;

  // We can't await here easily, so we'll do the check in the handler
  return true;
}

export async function GET(request: NextRequest) {
  // Defense-in-depth: verify admin cookie
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = request.cookies.get('fg_admin_token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const expectedHash = await hashPassword(adminPassword);
  if (token !== expectedHash) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limit: 30/min
  const rateLimitResult = rateLimit(request, undefined, {
    limit: 30,
    windowMs: 60000,
  });

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: rateLimitHeaders(rateLimitResult) }
    );
  }

  // Parse range parameter
  const range = request.nextUrl.searchParams.get('range') ?? '30d';
  const now = new Date();
  let since: Date;

  switch (range) {
    case '1d':
      since = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'all':
      since = new Date('2020-01-01');
      break;
    default:
      since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  const data = await getAnalyticsSummary(since);

  return NextResponse.json(
    { data, range },
    { headers: rateLimitHeaders(rateLimitResult) }
  );
}
