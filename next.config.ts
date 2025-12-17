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
