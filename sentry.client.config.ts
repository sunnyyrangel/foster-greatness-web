import * as Sentry from '@sentry/nextjs';
import { supabaseIntegration } from '@supabase/sentry-js-integration';
import { SupabaseClient } from '@supabase/supabase-js';

// Import utilities for error filtering
import { shouldIgnoreError, beforeSendFilter } from './lib/sentry-utils';

// Initialize Sentry for client-side
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment detection
  environment: process.env.NODE_ENV || 'development',

  // Performance monitoring - 10% in production, 100% in development
  tracesSampleRate:
    process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Session replay sampling
  // replaysSessionSampleRate: 0.1, // 10% of sessions
  // replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

  // Integrations
  integrations: [
    // Supabase integration - prevents double error reporting
    supabaseIntegration(SupabaseClient, Sentry, {
      tracing: true,
      breadcrumbs: true,
      errors: true,
    }),

    // Browser tracing for performance monitoring
    Sentry.browserTracingIntegration({
      // Don't create spans for Supabase REST requests (handled by supabaseIntegration)
      shouldCreateSpanForRequest: (url) => {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (supabaseUrl && url.startsWith(`${supabaseUrl}/rest`)) {
          return false;
        }
        return true;
      },
    }),

    // Replay integration for session recording (currently commented out)
    // Sentry.replayIntegration({
    //   maskAllText: true,
    //   blockAllMedia: true,
    // }),
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

  // Ignore certain errors by message
  ignoreErrors: [
    // Browser extension errors
    /chrome-extension:\/\//i,
    /moz-extension:\/\//i,
    /safari-extension:\/\//i,

    // Network errors
    /Failed to fetch/i,
    /NetworkError/i,
    /Network request failed/i,
    'ECONNREFUSED',
    'ENOTFOUND',
    'ETIMEDOUT',

    // Cancelled requests
    'AbortError',
    'cancelled',

    // Common browser errors
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',

    // Third-party script errors
    /gtm\.js/i,
    /analytics\.js/i,
    /google-analytics/i,
  ],

  // Ignore errors from these URLs
  denyUrls: [
    // Browser extensions
    /extensions\//i,
    /^chrome:\/\//i,
    /^chrome-extension:\/\//i,
    /^moz-extension:\/\//i,
    /^safari-extension:\/\//i,

    // Third-party scripts
    /googletagmanager\.com/i,
    /google-analytics\.com/i,
    /gtm\.js/i,
    /analytics\.js/i,
  ],

  // Add context to events
  beforeBreadcrumb(breadcrumb) {
    // Don't capture console breadcrumbs in production
    if (process.env.NODE_ENV === 'production' && breadcrumb.category === 'console') {
      return null;
    }
    return breadcrumb;
  },

  // Enable debug mode temporarily to diagnose integration
  debug: true,

  // Release tracking (set by build process)
  // release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
});
