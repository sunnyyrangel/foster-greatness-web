'use client';

import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-fg-navy text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-semibold font-poppins">
            Foster Greatness Admin
          </h1>
          {!isLoginPage && (
            <nav className="flex gap-4 text-sm">
              <a
                href="/admin/analytics"
                className={`transition-colors ${pathname === '/admin/analytics' ? 'text-white' : 'text-white/70 hover:text-white'}`}
              >
                Analytics
              </a>
              <a
                href="/admin/submissions"
                className={`transition-colors ${pathname === '/admin/submissions' ? 'text-white' : 'text-white/70 hover:text-white'}`}
              >
                Submissions
              </a>
            </nav>
          )}
        </div>
        {!isLoginPage && (
          <button
            onClick={handleLogout}
            className="text-sm text-white/80 hover:text-white transition-colors"
          >
            Logout
          </button>
        )}
      </header>
      <main>{children}</main>
    </div>
  );
}
