import * as Sentry from '@sentry/nextjs';
import { supabaseIntegration } from '@supabase/sentry-js-integration';
import { SupabaseClient } from '@supabase/supabase-js';

// Import utilities for error filtering
import { shouldIgnoreError, beforeSendFilter } from './lib/sentry-utils';

// Initialize Sentry for server-side
Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment detection
  environment: process.env.NODE_ENV || 'development',

  // Performance monitoring - 10% in production, 100% in development
  tracesSampleRate:
    process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Integrations
  integrations: [
    // Supabase integration - prevents double error reporting
    supabaseIntegration(SupabaseClient, Sentry, {
      tracing: true,
      breadcrumbs: true,
      errors: true,
    }),

    // HTTP integration for Node.js fetch
    Sentry.nativeNodeFetchIntegration({
      breadcrumbs: true,
      // Don't create spans for Supabase REST requests
      ignoreOutgoingRequests: (url) => {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (supabaseUrl && url.startsWith(`${supabaseUrl}/rest`)) {
          return true;
        }
        return false;
      },
    }),
  ],

  // Filter errors before sending
  beforeSend(event, hint) {
    // Apply error filtering
    if (shouldIgnoreError(event, hint)) {
      return null;
    }

    // Apply additional filtering and PII removal
    return beforeSendFilter(event, hint);
  },

  // Ignore certain errors by message (server-specific)
  ignoreErrors: [
    // Network errors
    /Failed to fetch/i,
    /NetworkError/i,
    /Network request failed/i,
    'ECONNREFUSED',
    'ENOTFOUND',
    'ETIMEDOUT',
    'ECONNRESET',

    // Cancelled requests
    'AbortError',
    'cancelled',

    // Next.js specific
    'NEXT_NOT_FOUND',
    'NEXT_REDIRECT',
  ],

  // Add context to events
  beforeBreadcrumb(breadcrumb) {
    // Don't capture console breadcrumbs in production
    if (process.env.NODE_ENV === 'production' && breadcrumb.category === 'console') {
      return null;
    }
    return breadcrumb;
  },

  // Enable debug mode in development
  debug: process.env.NODE_ENV === 'development',

  // Release tracking (set by build process)
  // release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
});
