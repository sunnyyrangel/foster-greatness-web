import * as Sentry from '@sentry/nextjs';

// Initialize Sentry for edge runtime (middleware, edge functions)
// Keep this minimal for performance
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Environment detection
  environment: process.env.NODE_ENV || 'development',

  // Lower sample rate for edge to reduce overhead
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.05 : 1.0,

  // Minimal integrations for edge runtime
  integrations: [
    // WinterCG Fetch integration for edge runtime
    Sentry.winterCGFetchIntegration({
      breadcrumbs: true,
      shouldCreateSpanForRequest: (url) => {
        // Don't create spans for Supabase REST requests
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (supabaseUrl && url.startsWith(`${supabaseUrl}/rest`)) {
          return false;
        }
        return true;
      },
    }),
  ],

  // Basic error filtering for edge
  ignoreErrors: [
    'NEXT_NOT_FOUND',
    'NEXT_REDIRECT',
    'AbortError',
  ],

  // Disable debug in edge
  debug: false,
});
