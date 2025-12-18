'use client';

import { useEffect } from 'react';

/**
 * Client-side Sentry initializer
 * Loads instrumentation-client.ts which initializes Sentry
 */
export default function SentryInit() {
  useEffect(() => {
    // Dynamic import to ensure it only runs client-side
    import('@/instrumentation-client').then(() => {
      // Expose Sentry globally for testing in development
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        import('@sentry/nextjs').then((Sentry) => {
          (window as any).Sentry = Sentry;
        });
      }
    });
  }, []);

  return null;
}
