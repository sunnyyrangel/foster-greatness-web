import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isAdminConfigured } from '@/lib/supabase/admin';

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

const COOKIE_OPTS = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60, // 7 days
};

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    // Try Supabase admin_users table first
    if (isAdminConfigured && supabaseAdmin) {
      const passwordHash = await hashPassword(password);

      const { data: user, error } = await supabaseAdmin
        .from('admin_users')
        .select('id, username, name')
        .eq('username', username.toLowerCase().trim())
        .eq('password', passwordHash)
        .eq('active', true)
        .single();

      if (!error && user) {
        // Update last_login
        await supabaseAdmin
          .from('admin_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', user.id);

        const tokenPayload = JSON.stringify({ id: user.id, username: user.username });
        const tokenHash = await hashPassword(tokenPayload + process.env.SUPABASE_SERVICE_ROLE_KEY);

        const response = NextResponse.json({ success: true, user: { username: user.username, name: user.name } });
        response.cookies.set('fg_admin_token', tokenHash, { ...COOKIE_OPTS, httpOnly: true });
        response.cookies.set('fg_admin', '1', { ...COOKIE_OPTS, httpOnly: false });
        response.cookies.set('fg_admin_user', user.username, { ...COOKIE_OPTS, httpOnly: false });
        return response;
      }
    }

    // Fallback to ADMIN_PASSWORD env var (legacy single-password auth)
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminPassword && password === adminPassword) {
      const hash = await hashPassword(adminPassword);
      const response = NextResponse.json({ success: true, user: { username: 'admin', name: 'Admin' } });
      response.cookies.set('fg_admin_token', hash, { ...COOKIE_OPTS, httpOnly: true });
      response.cookies.set('fg_admin', '1', { ...COOKIE_OPTS, httpOnly: false });
      response.cookies.set('fg_admin_user', 'admin', { ...COOKIE_OPTS, httpOnly: false });
      return response;
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  const clearOpts = { ...COOKIE_OPTS, maxAge: 0 };
  response.cookies.set('fg_admin_token', '', { ...clearOpts, httpOnly: true });
  response.cookies.set('fg_admin', '', { ...clearOpts, httpOnly: false });
  response.cookies.set('fg_admin_user', '', { ...clearOpts, httpOnly: false });
  return response;
}
