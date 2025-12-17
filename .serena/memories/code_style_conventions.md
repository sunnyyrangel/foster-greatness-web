# Code Style & Conventions

## TypeScript Configuration
- **Strict mode enabled** - All strict type checking options on
- **Target**: ES2017
- **Module resolution**: bundler (Next.js)
- **Path aliases**: `@/*` maps to project root
- **JSX**: react-jsx (automatic runtime)

## Code Organization

### Architecture Pattern
**Configuration-driven system** - Content is managed through centralized data files:
- `data/campaigns.ts` - All campaign definitions (single source of truth)
- `data/homepage.ts` - Homepage section configuration
- `data/site.ts` - Global settings and feature flags

### File Structure
```
app/(site)/          # Full pages with header/footer
app/widgets/         # Embeddable widgets (no navigation)
components/site/     # Site-wide components
components/shared/   # Reusable components
components/ui/       # Base UI components (Radix)
data/                # Configuration files (SINGLE SOURCE OF TRUTH)
lib/                 # Utility functions
public/images/       # Static assets
```

## Naming Conventions
- **Files**: kebab-case for pages (`holiday-gift-drive-2025`), PascalCase for components (`TypeformEmbed.tsx`)
- **Components**: PascalCase (`Header`, `DonateSection`)
- **Functions**: camelCase (`getActiveCampaigns`, `getCampaignBySlug`)
- **Constants**: camelCase for exports (`campaigns`, `siteConfig`)
- **Types/Interfaces**: PascalCase (`Campaign`, `CampaignStatus`)

## Component Patterns

### Server Components (Default)
- Default for all components in Next.js 16 App Router
- Fetch data directly in components
- No 'use client' directive unless needed

### Client Components
- Add `'use client'` directive when using:
  - React hooks (useState, useEffect)
  - Event handlers
  - Browser APIs
  - Animation libraries

### Reusable Components
- Export from index files for clean imports
- Props typed with TypeScript interfaces
- Support both controlled and uncontrolled usage where appropriate

## Data Management

### Campaign Management
- **ALWAYS** use helper functions from `data/campaigns.ts`:
  - `getActiveCampaigns()` - Get all active campaigns
  - `getNavCampaigns()` - Campaigns for navigation
  - `getHomepageCampaigns()` - Campaigns for homepage
  - `getCampaignBySlug(slug)` - Get specific campaign
  - `getFeaturedCampaign()` - Get featured campaign

### Import Pattern
```typescript
import { getActiveCampaigns, getCampaignBySlug } from '@/data';
```

## Critical Rules

### DO NOT
- Modify quotes/testimonials (attributed to real people)
- Use charity/pity language or deficit framing
- Hardcode campaign data in components
- Create duplicate campaign definitions
- Hardcode email addresses (use `siteConfig.donation.contactEmail`)
- Embed Typeform directly with `data-tf-live` attribute

### ALWAYS
- Use configuration system for campaign/content changes
- Import from `@/data` for campaign and site data
- Follow brand voice guidelines (authentic, empowering, dignity-centered)
- Use `TypeformEmbed` component for Typeform embeds
- Use `ContactSection` component for contact forms
- Test changes don't break navigation or donate page

## Brand Guidelines

### Voice & Tone
- **Authentic** - Lived experience-led
- **Empowering** - Strengths-based language
- **Dignity-centered** - Respect and belonging
- **Terminology**: "Thrivers" not "survivors", "Community members" not "beneficiaries"

### Colors (Tailwind Classes)
- Navy: `text-fg-navy`, `bg-fg-navy` (#1a2949)
- Blue: `text-fg-blue`, `bg-fg-blue` (#0067a2)
- Teal: `text-fg-teal`, `bg-fg-teal` (#00c8b7) - accent only
- Orange: `text-fg-orange`, `bg-fg-orange` (#fa8526)
- Yellow: `text-fg-yellow`, `bg-fg-yellow` (#faca2c)
- Light Blue: `text-fg-light-blue`, `bg-fg-light-blue` (#ddf3ff)

### Typography
- Font: Poppins (configured in Tailwind, loaded from Google Fonts)
- Weights: 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
