import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // Redirects for SEO
  async redirects() {
    return [
      // Non-www to www
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'fostergreatness.co' }],
        destination: 'https://www.fostergreatness.co/:path*',
        permanent: true,
      },
      // Old site URLs → new pages
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/home', destination: '/', permanent: true },
      { source: '/download', destination: '/join', permanent: true },
      { source: '/donate-1', destination: '/donate', permanent: true },
      { source: '/impact-report', destination: '/impact', permanent: true },
      { source: '/join-our-community', destination: '/join', permanent: true },
      { source: '/faqs', destination: '/about', permanent: true },
      { source: '/resources-provided', destination: '/resources', permanent: true },
      { source: '/donate-meal-kits', destination: '/donate', permanent: true },
      { source: '/get-involved', destination: '/donate', permanent: true },
      { source: '/resource-benefit-screener', destination: '/resources', permanent: true },
      { source: '/resource-support', destination: '/resources', permanent: true },
      { source: '/storytellers-', destination: '/storytellers-collective', permanent: true },
      { source: '/our-community', destination: '/about', permanent: true },
      { source: '/learn-more', destination: '/about', permanent: true },
      { source: '/privacy-policy', destination: '/about', permanent: true },
      { source: '/new-page', destination: '/', permanent: true },
      { source: '/community', destination: '/join', permanent: true },
      { source: '/join-today', destination: '/join', permanent: true },
      // GSC: Crawled - currently not indexed (old WordPress URLs)
      { source: '/donate-gingerbread-kits', destination: '/donate', permanent: true },
      { source: '/fg-programs', destination: '/about', permanent: true },
      { source: '/partner-opportunties', destination: '/partnerships', permanent: true },
      { source: '/404-page', destination: '/', permanent: true },
      // GSC: Excluded by noindex / Page with redirect
      { source: '/cart', destination: '/donate', permanent: true },
      { source: '/contact', destination: '/about', permanent: true },
      { source: '/s/2024-Impact-Report.pdf', destination: '/impact', permanent: true },
      // GSC: Duplicate without canonical - old WordPress page_id URLs
      {
        source: '/',
        has: [{ type: 'query', key: 'page_id' }],
        destination: '/',
        permanent: true,
      },
      // GSC: Duplicate without canonical - LinkedIn tracking params
      {
        source: '/',
        has: [{ type: 'query', key: 'trk' }],
        destination: '/',
        permanent: true,
      },
    ];
  },

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
        https://*.typeform.com
        https://*.vercel-scripts.com
        https://vercel.live
        https://www.googletagmanager.com
        https://www.google.com
        https://googleads.g.doubleclick.net;
      style-src 'self' 'unsafe-inline'
        https://js.stripe.com
        https://*.typeform.com;
      img-src 'self' blob: data:
        https://*.vercel.sh
        https://beehiiv-images-production.s3.amazonaws.com
        https://assets-v2.circle.so
        https://placehold.co
        https://*.typeform.com
        https://api.mapbox.com
        https://www.googletagmanager.com
        https://googleads.g.doubleclick.net;
      font-src 'self' data:;
      connect-src 'self'
        https://api.beehiiv.com
        https://circle-events-widget-23sx.vercel.app
        https://*.sentry.io
        https://*.ingest.sentry.io
        https://vercel.live
        https://*.vercel-scripts.com
        https://api.mapbox.com
        https://events.mapbox.com
        https://*.typeform.com
        https://www.googletagmanager.com
        https://www.google-analytics.com
        https://googleads.g.doubleclick.net;
      frame-src 'self'
        https://js.stripe.com
        https://form.typeform.com
        https://www.youtube.com;
      worker-src 'self' blob:;
      object-src 'none';
      base-uri 'self';
      form-action 'self'
        https://api.beehiiv.com;
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();

    const widgetCspHeader = cspHeader.replace(
      "frame-ancestors 'none'",
      "frame-ancestors *"
    );

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          // X-Frame-Options set via middleware (widgets need different policy)
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      // Widget pages — override CSP to allow Circle.so embedding
      // This MUST come after the catch-all so it overrides the CSP header
      {
        source: '/widgets/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: widgetCspHeader,
          },
        ],
      },
    ];
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
