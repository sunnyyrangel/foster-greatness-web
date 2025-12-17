'use client';

import { useEffect } from 'react';

/**
 * Client-side Sentry initializer
 * Loads instrumentation-client.ts which initializes Sentry
 */
export default function SentryInit() {
  useEffect(() => {
    // Dynamic import to ensure it only runs client-side
    import('@/instrumentation-client').then((module) => {
      // Expose Sentry globally for testing
      if (typeof window !== 'undefined') {
        import('@sentry/nextjs').then((Sentry) => {
          (window as any).Sentry = Sentry;
          console.log('[SentryInit] Sentry available globally');
        });
      }
    });
  }, []);

  return null;
}
