import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import { getAnalyticsSummary } from '@/lib/admin/queries';
import { verifyAdminAuth } from '@/lib/admin/auth';
import { captureException } from '@/lib/sentry-utils';

export async function GET(request: NextRequest) {
  const isAuthed = await verifyAdminAuth(request);
  if (!isAuthed) {
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

  try {
    const data = await getAnalyticsSummary(since);

    return NextResponse.json(
      { data, range },
      { headers: rateLimitHeaders(rateLimitResult) }
    );
  } catch (error) {
    captureException(error instanceof Error ? error : new Error(String(error)), {
      endpoint: { route: '/api/admin/analytics' },
    });
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500, headers: rateLimitHeaders(rateLimitResult) }
    );
  }
}
