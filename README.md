# Foster Greatness Website

A unified Next.js website for Foster Greatness, consolidating multiple campaign pages, community updates, and interactive experiences into one cohesive platform.

## Project Overview

This project merges 7 separate Foster Greatness initiatives into a single Next.js 16 application:

- **Community Updates** (Home page) - Latest news, events, and opportunities
- **Holiday Gift Drive 2025** - Interactive Christmas tree gift selection
- **Gingerbread Contest** - Community gingerbread house building campaign
- **Storytellers Collective** - Member stories and storytelling guide
- **Meal Kit Sponsors** - Thanksgiving meal kit partnership program
- **Newsletter Widget** - Beehiiv newsletter integration
- **Circle Events** - Community events from Circle.so

## Tech Stack

- **Next.js 16.0.7** with App Router and Turbopack
- **React 19.2.1** with Server Components
- **TypeScript 5.9**
- **Tailwind CSS 3.4.18**
- **Framer Motion 12.23.24** for animations
- **Radix UI** for accessible components
- **Supabase** for Gift Drive database
- **Stripe** for donation processing
- **Vercel Web Analytics** for website tracking
- **Beehiiv API** for newsletter content
- **Circle.so API** for community events

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Environment variable access (API keys)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd foster-greatness-web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Copy the example file and fill in your values:
   ```bash
   cp .env.local.example .env.local
   ```

   Required environment variables:
   ```env
   # Beehiiv Newsletter API
   BEEHIIV_API_KEY=your_beehiiv_api_key

   # Circle.so Community Events API
   CIRCLE_API_KEY=your_circle_api_key

   # Supabase (for Gift Drive)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Stripe (for donations)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

   # Sentry (for error tracking - optional for local dev)
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_url
   SENTRY_AUTH_TOKEN=your_sentry_auth_token
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the site.

### Development Commands

```bash
# Run development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Project Structure

```
foster-greatness-web/
├── app/
│   ├── (site)/                    # Full pages with header/footer
│   │   ├── gingerbread-contest/
│   │   ├── holiday-gift-drive-2025/
│   │   ├── meal-kit-sponsors/
│   │   ├── storytellers-collective/
│   │   ├── layout.tsx             # Site layout with Header/Footer
│   │   └── page.tsx               # Home page (community updates)
│   ├── api/
│   │   └── newsletter/
│   │       └── route.ts           # Beehiiv API endpoint
│   └── widgets/                   # Embeddable widgets (no navigation)
│       └── layout.tsx
├── components/
│   ├── site/                      # Site-wide components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── NewsletterSignup.tsx
│   ├── shared/                    # Reusable components
│   │   └── StripeBuyButton.tsx
│   └── ui/                        # Radix UI components
├── data/
│   └── updates.json               # Home page content configuration
├── lib/
│   └── supabase/
│       └── client.ts              # Supabase client setup
├── public/
│   └── images/                    # Static images
└── CLAUDE.md                      # Development guidelines
```

## Pages and Routes

### Full Site Pages (with navigation)

| Route | Description | Key Features |
|-------|-------------|--------------|
| `/` | Community Updates (Home) | Featured updates, events, newsletters, testimonials |
| `/gingerbread-contest` | Gingerbread House Contest | Animated counters, cost breakdown, Stripe donations |
| `/holiday-gift-drive-2025` | Holiday Gift Drive | Interactive SVG tree, gift modals, Supabase integration |
| `/storytellers-collective` | Storyteller Guide | YouTube playlist, cohort members, flip card animations |
| `/meal-kit-sponsors` | Meal Kit Partnership | Partnership information, contact CTAs |

### API Routes

| Route | Purpose | Integration |
|-------|---------|-------------|
| `/api/newsletter` | Fetch newsletter posts | Beehiiv API with 1-hour cache |

## API Integrations

### Beehiiv Newsletter API

**Purpose:** Display latest newsletter posts on home page

**Configuration:**
- API Key required in `BEEHIIV_API_KEY`
- Publication ID: `pub_e597ede6-38aa-4b38-a981-ae7c8f63a77e`
- Caching: 1-hour revalidation

**Usage:**
```typescript
// app/api/newsletter/route.ts handles the API call
// Home page fetches from /api/newsletter endpoint
```

### Circle.so Events API

**Purpose:** Display upcoming community events

**Configuration:**
- API Key required in `CIRCLE_API_KEY`
- Community ID: `171808`
- Fetches next 3 upcoming events

**Usage:**
```typescript
// Fetched server-side in app/(site)/page.tsx
const eventsResponse = await fetch(
  'https://app.circle.so/api/v1/events?community_id=171808&status=upcoming',
  { headers: { Authorization: `Token ${process.env.CIRCLE_API_KEY}` } }
);
```

### Supabase Database

**Purpose:** Gift Drive recipient data and purchase tracking

**Configuration:**
- Project URL: `NEXT_PUBLIC_SUPABASE_URL`
- Anon Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Schema:** See `docs/SUPABASE_SETUP.md` in holiday-gift-drive-2025 directory

**Tables:**
- `gift_recipients` - Gift recipient information and purchase status

**Features:**
- Real-time updates when gifts are purchased
- Falls back to static data if Supabase not configured

### Stripe Integration

**Purpose:** Process donations for campaigns

**Configuration:**
- Publishable Key: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Uses Stripe Buy Button embeds

**Buy Button IDs:**
- Gingerbread Contest: `buy_btn_1QP9i3FhDZPFQacGHVYEjWXJ`

### Sentry Error Tracking

**Purpose:** Error tracking, performance monitoring, and debugging

**Configuration:**
- DSN: `NEXT_PUBLIC_SENTRY_DSN` (client & server)
- Auth Token: `SENTRY_AUTH_TOKEN` (for source map uploads)
- Organization: `doing-good-works`
- Project: `foster-greatness-main`

**Features:**
- Automatic error capture (client & server)
- Performance monitoring (10% sample rate in production)
- Supabase integration (prevents duplicate error reporting)
- PII filtering (respects privacy policies)
- Source maps for readable stack traces

**Testing:**
```bash
# Test error tracking (development only)
curl http://localhost:3000/api/sentry-test
```

**Configuration Files:**
- `sentry.client.config.ts` - Client-side configuration
- `sentry.server.config.ts` - Server-side configuration
- `sentry.edge.config.ts` - Edge runtime configuration
- `lib/sentry-utils.ts` - Helper functions

See `CLAUDE.md` for detailed usage guidelines.

## Brand Guidelines

### Colors

The Foster Greatness brand uses the following color palette:

```typescript
// Tailwind config
colors: {
  'fg-navy': '#1a2949',      // Primary dark
  'fg-teal': '#0067a2',      // Primary action
  'fg-light-blue': '#ddf3ff', // Backgrounds
  'fg-orange': '#fa8526',     // Accent
  'fg-yellow': '#faca2c',     // Accent
  'fg-accent-teal': '#00c8b7', // Accent
  'fg-coral': '#ff6f61',      // Accent
}
```

### Typography

- **Font Family:** Montserrat (Google Fonts)
- **Weights:** 300, 400, 500, 600, 700

### Voice and Messaging

- **Authentic** - Lived experience-led, real stories
- **Empowering** - Strengths-based, not deficit language
- **Dignity-centered** - Respect and belonging for all
- **Avoid:** Charity language, savior narratives, pity-based messaging

**Important:** Never modify quotes or testimonials - they are attributed to real community members.

## Image Optimization

Next.js Image component is configured for external image hosts:

```typescript
// next.config.ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'avatar.vercel.sh' },
    { protocol: 'https', hostname: 'beehiiv-images-production.s3.amazonaws.com' },
    { protocol: 'https', hostname: 'assets-v2.circle.so' },
  ],
}
```

## Deployment

### Vercel (Recommended)

1. **Connect repository to Vercel:**
   ```bash
   npx vercel
   ```

2. **Configure environment variables** in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`

3. **Deploy:**
   ```bash
   npx vercel --prod
   ```

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform:
- `BEEHIIV_API_KEY`
- `CIRCLE_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SENTRY_DSN` (for error tracking)
- `SENTRY_DSN` (for server-side error tracking)
- `SENTRY_AUTH_TOKEN` (for source map uploads)
- `SENTRY_ORG=doing-good-works`
- `SENTRY_PROJECT=foster-greatness-main`

### Vercel Analytics

**Enable Web Analytics in Vercel Dashboard:**
1. Go to your Vercel project dashboard
2. Navigate to Analytics tab
3. Click "Enable Web Analytics"
4. Analytics will activate after deployment

**What's tracked:**
- Page views across all routes (including campaigns and widgets)
- Referrer sources
- Device and browser information
- Geographic location (approximate)

**Privacy:** GDPR-compliant, no cookies, no PII collection

## Troubleshooting

### Image Loading Errors

**Error:** `Invalid src prop ... hostname "..." is not configured`

**Solution:** Add the hostname to `next.config.ts` under `images.remotePatterns`:
```typescript
{
  protocol: 'https',
  hostname: 'your-hostname.com',
}
```

### API Errors

**Newsletter not loading:**
- Check `BEEHIIV_API_KEY` is set correctly
- Verify API key has access to publication `pub_e597ede6-38aa-4b38-a981-ae7c8f63a77e`
- Check browser console and server logs for specific error messages

**Events not loading:**
- Check `CIRCLE_API_KEY` is set correctly
- Verify API key has access to community `171808`
- Events fetch happens server-side, check build logs

### Supabase Issues

**Gift Drive not loading:**
- Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- App will fall back to static data if Supabase is not configured
- See `docs/SUPABASE_SETUP.md` for database schema setup

### Build Errors

**Tailwind CSS errors:**
- Project uses Tailwind CSS v3 (not v4)
- Ensure `@import` statements come before `@tailwind` directives in CSS files

**Type errors:**
- Run `npm run build` to check for TypeScript errors
- Common issue: Missing environment variable types - add to `next-env.d.ts` if needed

## Development Guidelines

See `CLAUDE.md` for detailed development guidelines including:
- Widget embed context
- UX improvement guidelines
- Brand compliance rules
- Quote modification policy

## Contributing

This is a private project for Foster Greatness. For questions or contributions, contact:
- **Email:** jordanb@doinggoodworks.com

## License

Proprietary - Foster Greatness
