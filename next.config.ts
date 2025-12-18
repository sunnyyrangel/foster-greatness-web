import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatar.vercel.sh',
      },
      {
        protocol: 'https',
        hostname: 'beehiiv-images-production.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'assets-v2.circle.so',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },

  // Security headers for privacy and protection
  async headers() {
    // Content Security Policy - strict XSS protection
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline'
        https://js.stripe.com
        https://embed.typeform.com
        https://*.vercel-scripts.com
        https://vercel.live;
      style-src 'self' 'unsafe-inline'
        https://js.stripe.com;
      img-src 'self' blob: data:
        https://*.vercel.sh
        https://beehiiv-images-production.s3.amazonaws.com
        https://assets-v2.circle.so
        https://placehold.co
        https://*.typeform.com;
      font-src 'self' data:;
      connect-src 'self'
        https://api.beehiiv.com
        https://circle-events-widget-23sx.vercel.app
        https://*.sentry.io
        https://*.ingest.sentry.io
        https://vercel.live
        https://*.vercel-scripts.com;
      frame-src 'self'
        https://js.stripe.com
        https://form.typeform.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self'
        https://api.beehiiv.com;
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();

    return [
      {
        source: '/:path*',
        headers: [
          // Content Security Policy - XSS protection
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          // Prevent clickjacking attacks
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Control referrer information
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Restrict browser features for privacy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Force HTTPS connections
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          // XSS protection (legacy browsers)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

// Sentry configuration options
const sentryWebpackPluginOptions = {
  // Organization and project for Sentry
  org: process.env.SENTRY_ORG || 'doing-good-works',
  project: process.env.SENTRY_PROJECT || 'foster-greatness-main',

  // Auth token for uploading source maps (set in .env.local)
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Only upload source maps in production builds
  silent: !process.env.CI,

  // Suppress all Sentry webpack plugin logs in production
  widenClientFileUpload: true,

  // Hide source maps from being publicly accessible
  hideSourceMaps: true,

  // Webpack-specific options (updated syntax)
  webpack: {
    // Automatically annotate React components for better error tracking
    reactComponentAnnotation: {
      enabled: true,
    },

    // Automatically tree-shake Sentry debug code in production
    treeshake: {
      removeDebugLogging: true,
    },

    // Automatically create Vercel monitors
    automaticVercelMonitors: true,
  },
};

// Wrap Next.js config with Sentry
export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "doing-good-works",

  project: "foster-greatness-main",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
