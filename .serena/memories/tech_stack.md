# Tech Stack

## Core Framework
- **Next.js 16.0.10** - App Router with Server Components and Turbopack (security updates applied)
- **React 19.2.1** - Latest React with Server Components
- **TypeScript 5** - Strict mode enabled

## Styling & UI
- **Tailwind CSS 3.4.18** - Utility-first CSS framework
- **Framer Motion 12.23.24** - Animation library
- **Radix UI** - Accessible component primitives (Accordion, Dialog, Popover, Radio Group, Slot)
- **Headless UI 2.2.9** - Unstyled accessible components
- **Tabler Icons** - Icon library
- **Lucide React** - Additional icon library
- **class-variance-authority** - Component variant management
- **clsx** & **tailwind-merge** - Utility class merging

## Backend & Data
- **Supabase** - Database for Gift Drive features
- **Stripe** - Payment processing for donations
- **Axios** - HTTP client
- **Zod 4.1.12** - Schema validation

## APIs Integrated
- **Beehiiv API** - Newsletter content
- **Circle.so API** - Community events
- **Stripe API** - Donation processing
- **Supabase** - Gift recipient data

## Analytics & Monitoring
- **Vercel Web Analytics** - GDPR-compliant page view tracking
- **Sentry** - Error tracking and performance monitoring with Supabase integration

## Security
- **Rate Limiting** - Custom IP-based rate limiting (5 req/min for subscriptions, 20 req/min for newsletter)
- **CORS Protection** - Whitelist-based origin validation
- **7 Security Headers** - CSP, X-Frame-Options, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-XSS-Protection
- **Input Validation** - Zod schema validation for API routes
- **0 Vulnerabilities** - All dependencies updated and audited

## Development Tools
- **ESLint 9** - Linting with Next.js config
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## Additional Libraries
- **date-fns** - Date manipulation
- **react-day-picker** - Date picker component
- **vaul** - Drawer component
- **dotenv** - Environment variables
- **cors** - CORS middleware
- **express** - Server framework (for API routes)
