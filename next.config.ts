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
export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
