import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import { verifyAdminAuth } from '@/lib/admin/auth';
import { supabaseAdmin, isAdminConfigured } from '@/lib/supabase/admin';
import { captureException } from '@/lib/sentry-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuthed = await verifyAdminAuth(request);
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isAdminConfigured || !supabaseAdmin) {
    return NextResponse.json({ error: 'Admin not configured' }, { status: 503 });
  }

  try {
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from('resources')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Supabase query failed: ${error.message}`);
    }

    return NextResponse.json({ data });
  } catch (error) {
    captureException(error instanceof Error ? error : new Error(String(error)), {
      endpoint: { route: '/api/admin/submissions/[id]' },
    });
    return NextResponse.json(
      { error: 'Failed to fetch submission' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;
    const body = await request.json();
    const { action, ...fields } = body;

    let updateData: Record<string, unknown> = {};

    if (action === 'approve') {
      updateData = {
        status: 'approved',
        reviewed_by: fields.reviewed_by ?? 'admin',
        reviewed_at: new Date().toISOString(),
        ...fields,
      };
      delete updateData.action;
    } else if (action === 'reject') {
      updateData = {
        status: 'rejected',
        reviewed_by: fields.reviewed_by ?? 'admin',
        reviewed_at: new Date().toISOString(),
        rejection_reason: fields.rejection_reason ?? '',
      };
    } else {
      // General field update (enrichment data, etc.)
      updateData = fields;
    }

    const { data, error } = await supabaseAdmin
      .from('resources')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Supabase update failed: ${error.message}`);
    }

    return NextResponse.json(
      { data },
      { headers: rateLimitHeaders(rateLimitResult) }
    );
  } catch (error) {
    captureException(error instanceof Error ? error : new Error(String(error)), {
      endpoint: { route: '/api/admin/submissions/[id]' },
    });
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500, headers: rateLimitHeaders(rateLimitResult) }
    );
  }
}
