# Codebase Structure

## Root Directory Layout
```
fg-website/
├── app/                    # Next.js 16 App Router
├── components/             # React components
├── data/                   # Configuration files (SINGLE SOURCE OF TRUTH)
├── lib/                    # Utility functions
├── public/                 # Static assets
├── docs/                   # Documentation
├── content/                # Content files
├── .serena/                # Serena MCP configuration
├── .claude/                # Claude Code configuration
├── CLAUDE.md               # Development guidelines
├── README.md               # Project documentation
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── eslint.config.mjs       # ESLint configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── next.config.ts          # Next.js configuration
└── postcss.config.mjs      # PostCSS configuration
```

## App Directory Structure
```
app/
├── (site)/                 # Route group: Full pages with header/footer
│   ├── layout.tsx          # Site layout with Header/Footer
│   ├── page.tsx            # Homepage
│   ├── about/              # About page
│   ├── aging-out/          # Aging out info page
│   ├── contact/            # Contact page
│   ├── donate/             # Donation page (pulls from campaigns config)
│   ├── events/             # Events page
│   ├── gingerbread/        # Gingerbread contest campaign
│   ├── gingerbread-contest/
│   ├── gift-drive/
│   ├── holiday-gift-drive-2025/  # Holiday gift drive campaign
│   ├── impact/             # Impact report page
│   ├── join/               # Join community page
│   ├── meal-kit/
│   ├── meal-kit-sponsors/  # Meal kit partnership
│   ├── newsletter/         # Newsletter page
│   ├── partnerships/       # Partnerships page
│   ├── resources/          # Resources page
│   ├── stories/            # Stories hub
│   ├── storytellers/
│   ├── storytellers-collective/  # Storytellers campaign
│   ├── thriver-stories/    # Thriver stories
│   └── updates/            # Updates page
├── api/                    # API routes
│   └── newsletter/
│       └── route.ts        # Beehiiv newsletter API endpoint
├── widgets/                # Route group: Embeddable widgets (no navigation)
│   ├── layout.tsx          # Widget layout (no header/footer)
│   ├── circle-events/      # Circle.so events widget
│   └── newsletter/         # Newsletter signup widget
├── layout.tsx              # Root layout (includes Analytics)
├── favicon.ico             # Site favicon
├── icon.png                # App icon
└── apple-icon.png          # Apple touch icon
```

## Components Directory
```
components/
├── site/                   # Site-wide components
│   ├── Header.tsx          # Main navigation with campaign integration
│   ├── Footer.tsx          # Site footer with contact banner
│   ├── ContactSection.tsx  # Contact section with Typeform
│   ├── DonateSection.tsx   # Reusable donation section
│   ├── NewsletterSignup.tsx
│   ├── CampaignCard.tsx    # Campaign card component
│   └── home/               # Homepage sections (modular)
│       ├── HeroSection.tsx
│       ├── TestimonialSection.tsx
│       ├── UpdateCards.tsx
│       ├── EventsSection.tsx
│       ├── NewsletterSection.tsx
│       ├── WhatYoullGetSection.tsx
│       ├── CommunitySection.tsx
│       ├── AppDownloadSection.tsx
│       ├── VoiceAmplificationSection.tsx
│       ├── DGWBrandedSection.tsx
│       ├── PartnersSection.tsx
│       ├── ContactSection.tsx
│       ├── animations.ts   # Framer Motion variants
│       ├── types.ts        # TypeScript types
│       └── index.ts        # Barrel export
├── shared/                 # Reusable components
│   ├── TypeformEmbed.tsx   # Typeform embed wrapper (ALWAYS USE THIS)
│   ├── ErrorBoundary.tsx   # Error boundary component
│   └── StripeBuyButton.tsx # Stripe Buy Button embed
└── ui/                     # Base UI components (Radix)
    └── [various Radix UI components]
```

## Data Directory (Configuration System)
```
data/
├── campaigns.ts            # Campaign definitions & helper functions
│                          # SINGLE SOURCE OF TRUTH for campaigns
├── homepage.ts             # Homepage section configuration
├── site.ts                 # Global settings, feature flags, Stripe config
└── index.ts                # Re-exports all data
```

## Library Directory
```
lib/
├── seo.ts                  # SEO utilities and metadata generation
└── [other utility modules]
```

## Public Directory
```
public/
├── images/                 # Static images for campaigns and content
├── favicon-16.png
└── favicon-32.png
```

## Documentation Directory
```
docs/
├── plans/                  # Design documents
│   └── 2025-12-03-site-config-system-design.md
└── [other documentation]
```

## Key Architecture Patterns

### Route Groups
- **(site)** - Full pages with header/footer navigation
- **widgets** - Embeddable content without site chrome

### Configuration-Driven Content
- Campaign visibility controlled by flags in `data/campaigns.ts`
- Homepage sections configured in `data/homepage.ts`
- Global settings in `data/site.ts`

### Component Modularity
- Homepage sections extracted into individual components
- Reusable components for common patterns (contact, donate, Typeform)
- Error boundaries for resilient UI

### API Route Strategy
- Server-side API routes for external API integration
- Caching for performance (e.g., 1-hour revalidation for newsletter)
- Type-safe with TypeScript

### Server vs Client Components
- Default to Server Components for data fetching
- Client Components only when needed (interactivity, hooks, browser APIs)

## Import Path Aliases
```typescript
'@/*' → Root directory
```

Examples:
```typescript
import { getActiveCampaigns } from '@/data';
import Header from '@/components/site/Header';
import TypeformEmbed from '@/components/shared/TypeformEmbed';
```
