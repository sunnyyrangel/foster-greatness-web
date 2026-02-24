# Foster Greatness - Unified Website

## Project Overview

This is the unified Foster Greatness website, a Next.js 16 application maintained primarily through Claude. The site uses a **configuration-driven architecture** where content and campaigns are managed through data files, not scattered code.

**Security Status:** 🛡️ Enterprise-grade security implemented (7 headers, rate limiting, CORS, CSP, input validation, 0 vulnerabilities)

## Quick Reference for Common Tasks

### Adding a New Campaign
1. Edit `data/campaigns.ts`
2. Add a new campaign object to the `campaigns` array
3. Set appropriate flags (`showInNav`, `showOnHomepage`, `showOnDonatePage`)
4. If the campaign needs a custom page, create it in `app/(site)/[slug]/page.tsx`

### Ending a Campaign
1. Edit `data/campaigns.ts`
2. Find the campaign and change `status: 'active'` to `status: 'past'`
3. That's it - the campaign automatically disappears from navigation, homepage, and donate page

### Changing What's on the Homepage
Edit `data/homepage.ts` to control:
- Section visibility and order
- Featured campaign
- Impact statistics
- Section titles and subtitles

### Changing Site-Wide Settings
Edit `data/site.ts` for:
- General Stripe donation link
- Contact email
- Feature flags
- External links (community, app stores)

---

## Architecture

### Configuration System (`data/`)

**THIS IS THE SINGLE SOURCE OF TRUTH FOR CONTENT**

```
data/
  campaigns.ts    # All campaign definitions
  homepage.ts     # Homepage configuration
  site.ts         # Global settings
  index.ts        # Re-exports everything
```

#### Campaign Data Structure

```typescript
{
  id: 'holiday-gift-drive-2025',    // Unique identifier
  slug: 'holiday-gift-drive-2025',  // URL path
  status: 'active',                  // 'active' | 'upcoming' | 'past'
  type: 'donation',                  // 'donation' | 'event' | 'ongoing'

  title: 'Holiday Gift Drive 2025',
  shortTitle: 'Holiday Gift Drive', // For nav menus
  description: 'Help provide gifts...',

  image: '/images/holiday-gift-tree.png',
  icon: '🎄',                        // Emoji for mobile nav

  // Donation settings
  stripeLink: 'https://...',
  stripeBuyButtonId: 'buy_btn_xxx', // For embedded buttons
  donationAmount: 60,
  donationLabel: 'Fund 1 Member',

  // Visibility flags - control where campaign appears
  showInNav: true,
  showOnHomepage: true,
  showOnDonatePage: true,
  featured: true,                    // Hero placement

  hasCustomPage: true,               // Does it have its own page?
}
```

#### Helper Functions

```typescript
import {
  getActiveCampaigns,      // All active campaigns
  getNavCampaigns,         // Campaigns for navigation
  getHomepageCampaigns,    // Campaigns for homepage
  getDonateCampaigns,      // Campaigns for donate page
  getFeaturedCampaign,     // The featured campaign
  getCampaignBySlug,       // Lookup by URL slug
} from '@/data';
```

### Page Structure

#### Full Site Pages (`app/(site)/`)
Pages with header, footer, navigation:
- `/` - Homepage
- `/donate` - Donation page (pulls from campaigns config)
- `/about` - About page
- `/impact` - Impact report
- `/partnerships` - Partnerships page
- `/services` - Local services search (Findhelp API)
- `/resources` - Resource hub
- `/holiday-gift-drive-2025` - Gift drive campaign
- `/gingerbread` - Gingerbread campaign
- `/thriver-stories` - Thriver stories
- `/storytellers-collective` - Storytellers
- `/events` - Community events

#### Embeddable Widgets (`app/widgets/`)
No navigation, for embedding:
- `/widgets/circle-events` - Community calendar
- `/widgets/newsletter` - Newsletter signup

### Reusable Components

#### TypeformEmbed (`components/shared/TypeformEmbed.tsx`)
**ALWAYS use this component for Typeform embeds.** It handles script loading properly for Next.js.

```tsx
import TypeformEmbed from '@/components/shared/TypeformEmbed';

// Default contact form
<TypeformEmbed />

// Custom form ID
<TypeformEmbed formId="your-form-id" />

// Custom height
<TypeformEmbed minHeight="500px" />
```

Default form ID: `01KAF384A3ZB71SN3JRSRCSWAD` (main Foster Greatness contact form)

#### ContactSection (`components/site/ContactSection.tsx`)
Full contact section with Typeform embed, email button, and community link:

```tsx
import ContactSection from '@/components/site/ContactSection';

// Default settings
<ContactSection />

// Custom email and title
<ContactSection
  title="Get in Touch"
  email="info@fostergreatness.co"
/>

// Custom Typeform
<ContactSection typeformId="custom-form-id" />
```

#### DonateSection (`components/site/DonateSection.tsx`)
Reusable donation component with Stripe integration:

```tsx
// Campaign-specific donation
<DonateSection campaign={campaign} />

// General donation
<DonateSection />

// Compact mode (no section padding)
<DonateSection compact />
```

#### StripeBuyButton (`components/StripeBuyButton.tsx`)
Embeds Stripe Buy Button:

```tsx
<StripeBuyButton
  buyButtonId="buy_btn_xxx"
  publishableKey="pk_live_xxx"
/>
```

---

## Brand Guidelines

### Colors
```
Navy:       #1a2949 (primary)
Blue:       #0067a2
Teal:       #00c8b7 (accent only)
Orange:     #fa8526
Yellow:     #faca2c
Light Blue: #ddf3ff
```

Use Tailwind classes: `text-fg-navy`, `bg-fg-blue`, etc.

### Typography
- Primary font: Poppins (configured in Tailwind)
- Weights: 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Voice & Tone
- Authentic and empowering
- Dignity-centered language
- **No charity/deficit framing**
- Focus on strengths and community
- "Thrivers" not "survivors"
- "Community members" not "beneficiaries"

---

## Critical Rules

### DO NOT
- Modify quotes - they're attributed to real people
- Use charity/pity language
- Hardcode campaign data in components (use `data/campaigns.ts`)
- Create duplicate campaign definitions
- Hardcode email addresses (use `siteConfig.donation.contactEmail`)
- Embed Typeform directly with `data-tf-live` - use `TypeformEmbed` component

### ALWAYS
- Use the configuration system for campaign/content changes
- Import from `@/data` for campaign and site data
- Follow brand colors and voice guidelines
- Test changes don't break navigation or donate page
- Use `TypeformEmbed` component for any Typeform embeds
- Use `ContactSection` component for contact forms
- Use `info@fostergreatness.co` as the contact email (configured in `data/site.ts`)

---

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **UI Components**: Radix UI, Headless UI
- **Database**: Supabase (gift-drive features)
- **Payments**: Stripe
- **Animation**: Framer Motion
- **Analytics**: Vercel Web Analytics

## Development

```bash
npm install     # Install dependencies
npm run dev     # Development server
npm run build   # Production build
npm start       # Production server
```

---

## File Reference

### Configuration Files
- `data/campaigns.ts` - Campaign definitions and helpers
- `data/homepage.ts` - Homepage section config
- `data/site.ts` - Global settings, Stripe config
- `data/index.ts` - Re-exports

### Key Components
- `components/site/Header.tsx` - Main navigation (uses campaign data)
- `components/site/Footer.tsx` - Site footer with contact banner
- `components/site/ContactSection.tsx` - Contact section with Typeform
- `components/site/DonateSection.tsx` - Reusable donation section
- `components/shared/TypeformEmbed.tsx` - Typeform embed (use for ALL Typeform embeds)
- `components/StripeBuyButton.tsx` - Stripe embed

### Campaign Pages
- `app/(site)/holiday-gift-drive-2025/` - Gift drive (custom)
- `app/(site)/gingerbread/` - Gingerbread contest (custom)

### Design Documentation
- `docs/plans/2025-12-03-site-config-system-design.md` - Configuration system design

---

## Analytics

### Vercel Web Analytics
- **Package**: `@vercel/analytics`
- **Location**: `app/layout.tsx` (root layout)
- **Tracking**: Automatic page view tracking for all routes
- **Dashboard**: Vercel project dashboard → Analytics tab
- **Privacy**: GDPR-compliant, no cookies, no PII collection

### Tracked Pages
- All full-site pages (`(site)` route group)
- All widget embeds (`widgets` route group)
- Custom campaign pages

### Enabling Analytics
1. Install package: `npm install @vercel/analytics`
2. Import in root layout: `import { Analytics } from '@vercel/analytics/react';`
3. Add component to body: `<Analytics />`
4. Enable in Vercel dashboard (Analytics tab)
5. Deploy to production

### Custom Event Tracking (Future)
To track custom events (e.g., donation button clicks):
```typescript
import { track } from '@vercel/analytics';

track('Donation Clicked', { campaign: 'holiday-gift-drive-2025' });
```

---

## AI Search Optimization (llm.txt)

### Overview
- **File Location**: `public/llm.txt`
- **URL**: `https://fostergreatness.co/llm.txt`
- **Purpose**: Guide AI search engines (ChatGPT, Claude, Perplexity) to recommend Foster Greatness to foster youth seeking support
- **Last Updated**: 2025-12-18

### What's Included
- **15 priority pages** organized in 4 action-oriented categories
- **ACAO framework** descriptions for maximum AI understanding
- **Target keywords**: foster youth, foster care alumni, aging out, lived experience
- **Rich context**: mission, values, statistics (310 attendees, 2,000+ members, 77 wishes)

### Categories
1. **Get Support & Resources**: Resource Hub, Aging Out Guide, One Simple Wish
2. **Join Our Community**: About, Join Community, Events
3. **Hear Our Stories**: Thriver Stories, Storytellers Collective, Stories Hub
4. **Support Our Mission**: Donate, Impact Report, Partnerships, Contact

### Maintenance Schedule
- **Quarterly** (every 3 months): Update statistics, verify all URLs, refresh "Last Updated" date
- **As-Needed**: Add new permanent pages within 1 week of launch
- **Monthly Testing**: Test AI search queries ("where can foster youth find support?")

### Design Documentation
See `docs/plans/2025-12-18-llm-txt-design.md` for complete design rationale and implementation details.

---

## API Security

### Rate Limiting
- **Package**: Custom implementation in `lib/rate-limit.ts` (zero dependencies)
- **Strategy**: IP-based sliding window with in-memory storage
- **Limits**:
  - `/api/subscribe`: 5 requests/minute (prevents spam subscriptions)
  - `/api/newsletter`: 20 requests/minute (higher for read-only)
  - `/api/findhelp/tags`: 30 requests/minute
  - `/api/findhelp/search`: 10 requests/minute
  - `/api/findhelp/programs/[id]`: 15 requests/minute
- **Headers**: Standard rate limit headers (X-RateLimit-Limit, Remaining, Reset, Retry-After)

### CORS Protection
- **Package**: Custom implementation in `lib/cors.ts`
- **Allowed Origins**:
  - `https://www.fostergreatness.co`
  - `https://fostergreatness.co`
  - `https://storytellers-collective.com`
  - `https://www.storytellers-collective.com`
  - `http://localhost:3000` (development only)
- **Behavior**: Blocks unauthorized domains with 403 Forbidden

### Adding Security to New API Routes
When creating new API routes, always add rate limiting and CORS:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import { validateCors, getCorsHeaders } from '@/lib/cors';

// Handle OPTIONS preflight
export async function OPTIONS(request: NextRequest) {
  const corsError = validateCors(request);
  if (corsError) return corsError;

  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request.headers.get('origin')),
  });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  // Validate CORS
  const corsError = validateCors(request);
  if (corsError) return corsError;

  // Apply rate limiting
  const rateLimitResult = rateLimit(request, undefined, {
    limit: 5,      // Adjust based on endpoint needs
    windowMs: 60000 // 1 minute
  });

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          ...rateLimitHeaders(rateLimitResult),
          ...getCorsHeaders(origin),
        }
      }
    );
  }

  // Your API logic here

  return NextResponse.json(
    { success: true },
    {
      headers: {
        ...rateLimitHeaders(rateLimitResult),
        ...getCorsHeaders(origin),
      }
    }
  );
}
```

### Security Headers
All routes protected by headers in `next.config.ts`:
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing
- **Strict-Transport-Security**: Forces HTTPS
- **Referrer-Policy**: Controls referrer leakage
- **Permissions-Policy**: Restricts browser features
- **X-XSS-Protection**: Legacy XSS protection

---

## Findhelp API Integration

### Overview
The `/services` page integrates with the Findhelp (formerly Aunt Bertha) API to help foster youth search for local social service programs by ZIP code. Users can browse programs across 8 SDOH categories, save programs to a resource board, and contact programs directly.

**Page URL**: `/services`

### Environment Variables
```
FINDHELP_USERNAME=<from findhelp account>
FINDHELP_PASSWORD=<from findhelp account>
FINDHELP_API_KEY=<from findhelp account>
NEXT_PUBLIC_MAPBOX_TOKEN=<from Mapbox account>
```

### File Structure
```
lib/findhelp/
  types.ts           # TypeScript interfaces
  client.ts          # Server-side API client with token management
  index.ts           # Re-exports

app/api/findhelp/
  tags/route.ts      # GET /api/findhelp/tags?zip=XXXXX
  search/route.ts    # GET /api/findhelp/search?zip=...&serviceTag=...
  programs/[id]/route.ts  # GET /api/findhelp/programs/[id]?zip=XXXXX

components/findhelp/
  ProgramSearch.tsx      # Main search orchestrator
  ProgramCard.tsx        # Program result card
  ProgramDetailModal.tsx # Full program details modal
  ProgramMap.tsx         # Google Maps view
  ServiceTagSelector.tsx # SDOH category picker
  ZipCodeInput.tsx       # ZIP entry with validation
  ResourceBoard.tsx      # Saved programs panel
  ResourceBoardContext.tsx # Context for board state
  index.ts               # Re-exports

app/(site)/services/
  page.tsx           # Services search page
```

### SDOH Categories
Programs are grouped into 8 Social Determinants of Health categories:

| Category | Keywords Matched |
|----------|------------------|
| Food & Nutrition | food, meal, nutrition, snap, wic, pantry, hunger |
| Housing & Shelter | housing, shelter, rent, homeless, utility, energy |
| Healthcare | health, medical, dental, vision, mental, substance, disability |
| Employment & Income | work, job, employment, career, income, financial, tax, benefits |
| Education | education, school, tutor, ged, college, literacy |
| Transportation | transport, transit, bus, car, ride, travel |
| Legal Services | legal, law, immigration, court, custody |
| Family & Childcare | family, child, parent, baby, youth, teen, senior |

To modify categories, edit `components/findhelp/ServiceTagSelector.tsx`.

### Population Filtering
Programs are automatically filtered to exclude populations not relevant to foster youth:

**Excluded populations** (configured in `lib/findhelp/client.ts`):
- Veterans / Military / Active Duty
- Senior Citizens (65+) / Retirees / Medicare
- Farmworkers / Agricultural Workers
- Refugees / Undocumented immigrants
- Cancer-specific programs
- Elderly-specific programs

**Kept populations**:
- Youth / Young Adults
- Low Income / Homeless
- Single Parents / Families
- Students / LGBTQ+
- Justice-involved / DV survivors
- Native American / General immigrants

### API Routes

| Route | Rate Limit | Cache |
|-------|------------|-------|
| `/api/findhelp/tags` | 30/min | 24 hours (allowed by ToS) |
| `/api/findhelp/search` | 10/min | None (ToS prohibits) |
| `/api/findhelp/programs/[id]` | 15/min | None (ToS prohibits) |

### Key Features
- **Deep linking**: Share specific programs via `?program=ID&zip=XXXXX`
- **Resource Board**: Save programs to localStorage, export via email/share/print
- **List/Map toggle**: View results as cards or on Google Maps
- **Mobile-first**: Large touch targets, numeric keyboard for ZIP

### Important Constraints
1. **Never cache program data** - Findhelp ToS violation
2. **Filter administrative offices** - `is_administrative: true` offices are hidden
3. **At least one filter required** - serviceTag, attributeTag, or terms
4. **Handle 401** - Client auto-refreshes token and retries

### Community Resources (Supabase)

The services page also shows curated community-recommended resources from the Supabase `resources` table, displayed **above** Findhelp results with a teal "Community Recommended" badge.

**Supabase Table:** `resources` (requires `zip` column for filtering)

**Module:** `lib/resources/`
```
lib/resources/
  types.ts    # CommunityResource, ResourceRow, SDOH category mapping
  client.ts   # searchResources() — queries Supabase by ZIP + category
  index.ts    # Re-exports
```

**API Route:** `GET /api/resources/search?zip=XXXXX&category=Education`
- Rate limit: 15 req/min
- Filters by exact ZIP match and SDOH category
- Returns `{ success: true, data: { resources: [...], count: N } }`

**SDOH Category Mapping:**

| Resource Category | SDOH Category |
|---|---|
| Education support, Education & Training | Education |
| Housing | Housing & Shelter |
| Child care, Foster Care Support, Mentorship and social support | Family & Childcare |
| Food assistance | Food & Nutrition |
| Other | *Excluded from filtered results* |

**How it works:**
- `ProgramSearch` fires parallel fetches to both `/api/resources/search` and `/api/findhelp/search` on category selection
- Community resources render first with `source="community"` badge on `ProgramCard`
- `ProgramDetailModal` shows simplified view for community resources (no API fetch needed)
- If Supabase is not configured or no resources match, Findhelp results show as normal
- Keyword search only queries Findhelp (community resources clear)

---

## Error Tracking & Monitoring

### Sentry Integration
- **Package**: `@sentry/nextjs` + `@supabase/sentry-js-integration`
- **Configuration**: Client (`sentry.client.config.ts`), Server (`sentry.server.config.ts`), Edge (`sentry.edge.config.ts`)
- **Dashboard**: [Sentry Dashboard](https://sentry.io/organizations/doing-good-works/projects/foster-greatness-main/)
- **Sample Rate**: 10% in production, 100% in development
- **Privacy**: PII automatically filtered, respects Foster Greatness privacy policies

### What's Tracked
- **Errors**: JavaScript errors (client), server errors, API errors
- **Performance**: Page loads, API calls, database queries (10% sample)
- **Context**: Campaign context, page context, user type (anonymized)
- **Supabase**: Database errors and performance (integrated to prevent duplicates)

### Error Filtering
Automatically ignores common noise:
- Browser extension errors
- Network errors and cancelled requests
- Third-party script errors (Google Analytics, etc.)
- Expected Next.js redirects (`NEXT_NOT_FOUND`, `NEXT_REDIRECT`)

### Using Sentry Utilities

**Capture Custom Errors:**
```typescript
import { captureException, captureMessage } from '@/lib/sentry-utils';

try {
  // Your code
} catch (error) {
  captureException(error, {
    campaign: 'holiday-gift-drive-2025',
    action: 'gift-purchase',
  });
}
```

**Add User Context (Anonymized):**
```typescript
import { setSentryUser } from '@/lib/sentry-utils';

// Only use anonymized/non-PII data
setSentryUser(userId, 'member'); // 'member' | 'visitor' | 'donor'
```

**Add Campaign Context:**
```typescript
import { setCampaignContext } from '@/lib/sentry-utils';

setCampaignContext('holiday-gift-drive-2025', 'Holiday Gift Drive 2025');
```

**Add Breadcrumbs:**
```typescript
import { addSentryBreadcrumb } from '@/lib/sentry-utils';

addSentryBreadcrumb('User clicked donate button', 'user-action', 'info', {
  campaign: 'holiday-gift-drive-2025',
  amount: 60,
});
```

### Error Boundary
All components are wrapped in `ErrorBoundary` which automatically reports to Sentry:

```tsx
import ErrorBoundary from '@/components/shared/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### Testing Sentry
**Test API route (development only):**
```bash
# Test error capture
curl http://localhost:3000/api/sentry-test

# Test message capture
curl http://localhost:3000/api/sentry-test?type=message
```

**Important:** Remove or comment out `/api/sentry-test` before production deployment.

### Privacy & PII
Sentry configuration automatically:
- Removes cookies and authorization headers
- Anonymizes user IDs
- Filters sensitive query parameters (token, key, secret, password)
- Never captures email addresses, names, or phone numbers

### Sentry Best Practices
- **DO**: Add campaign context to errors for better debugging
- **DO**: Use breadcrumbs to track user flow before errors
- **DO**: Capture exceptions with relevant context
- **DON'T**: Capture PII (personally identifiable information)
- **DON'T**: Log sensitive data in error messages
- **DON'T**: Ignore all errors - let Sentry capture them

### Configuration Files
- `sentry.client.config.ts` - Client-side Sentry (browser)
- `sentry.server.config.ts` - Server-side Sentry (API routes, server components)
- `sentry.edge.config.ts` - Edge runtime (middleware)
- `instrumentation.ts` - Next.js instrumentation hook
- `lib/sentry-utils.ts` - Helper functions for error tracking
