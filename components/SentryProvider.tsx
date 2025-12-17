'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

/**
 * Client-side Sentry initialization component
 * Must be a client component to access browser-only APIs
 */
export default function SentryProvider() {
  useEffect(() => {
    // Initialize Sentry on the client side
    if (typeof window !== 'undefined' && !Sentry.getCurrentScope().getClient()) {
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        environment: process.env.NODE_ENV || 'development',
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

        integrations: [
          Sentry.browserTracingIntegration(),
        ],

        // Enable debug mode temporarily
        debug: true,

        beforeSend(event, hint) {
          // Basic PII filtering
          if (event.user) {
            const { id, username, ...pii } = event.user;
            event.user = { id: id ? 'anonymized' : undefined };
          }
          return event;
        },

        ignoreErrors: [
          /chrome-extension:/i,
          /moz-extension:/i,
          /Failed to fetch/i,
          'AbortError',
        ],
      });
    }
  }, []);

  return null;
}
