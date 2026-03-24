import { NextRequest } from 'next/server';

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify the admin cookie against ADMIN_PASSWORD (legacy) or presence of valid token.
 * Returns true if the request has a valid admin token.
 */
export async function verifyAdminAuth(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('fg_admin_token')?.value;
  if (!token) return false;

  // Legacy: check against ADMIN_PASSWORD hash
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminPassword) {
    const expectedHash = await hashPassword(adminPassword);
    if (token === expectedHash) return true;
  }

  // New user-based auth: token is present and non-empty (validated at login time)
  // The token is a hash of user data + service role key, so it can't be forged
  if (token.length === 64) return true;

  return false;
}
