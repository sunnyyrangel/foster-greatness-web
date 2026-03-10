import { NextRequest } from 'next/server';

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify the admin cookie against ADMIN_PASSWORD.
 * Returns true if the request has a valid admin token.
 */
export async function verifyAdminAuth(request: NextRequest): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const token = request.cookies.get('fg_admin_token')?.value;
  if (!token) return false;

  const expectedHash = await hashPassword(adminPassword);
  return token === expectedHash;
}
