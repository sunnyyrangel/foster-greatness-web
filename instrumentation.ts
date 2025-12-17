// Next.js instrumentation hook for Sentry
// This enables server-side Sentry initialization
// https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation

import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Initialize Sentry for Node.js runtime (server-side)
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Initialize Sentry for Edge runtime (middleware)
    await import('./sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;
