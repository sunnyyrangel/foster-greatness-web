import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import { verifyAdminAuth } from '@/lib/admin/auth';
import { supabaseAdmin, isAdminConfigured } from '@/lib/supabase/admin';
import { captureException } from '@/lib/sentry-utils';

export async function GET(request: NextRequest) {
  const isAuthed = await verifyAdminAuth(request);
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

  if (!isAdminConfigured || !supabaseAdmin) {
    return NextResponse.json(
      { error: 'Admin not configured' },
      { status: 503, headers: rateLimitHeaders(rateLimitResult) }
    );
  }

  try {
    const status = request.nextUrl.searchParams.get('status') ?? 'pending';

    const { data, error } = await supabaseAdmin
      .from('resources')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Supabase query failed: ${error.message}`);
    }

    return NextResponse.json(
      { data, count: data?.length ?? 0 },
      { headers: rateLimitHeaders(rateLimitResult) }
    );
  } catch (error) {
    captureException(error instanceof Error ? error : new Error(String(error)), {
      endpoint: { route: '/api/admin/submissions' },
    });
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500, headers: rateLimitHeaders(rateLimitResult) }
    );
  }
}
