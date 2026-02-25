# DOI-33: Display Informational Resources on /services Page

**Date:** 2026-02-25
**Status:** Approved
**Branch:** `feature/findhelp-api-integration`
**Related:** DOI-32 (informational_resources table — done), DOI-12 (community resources — done)

## Context

The `informational_resources` table is live in Supabase with 25 curated resources (immigration rights, family preparedness, child welfare guides). The `search_informational_resources()` RPC and `zip_to_state()` helper are deployed. PDFs are stored as static assets. This design covers surfacing these resources in the `/services` page UI.

## Decision: Separate Section Above Programs

Informational resources display in a collapsible "Guides & Resources" section above community + Findhelp program cards. This gives curated guides their own visual space without hiding them behind a tab or mixing them with location-based programs.

- Show up to 4 cards initially, with "Show all N guides" expand button
- Section only renders when resources exist for the selected category
- Uses a distinct `InformationalResourceCard` component (not `ProgramCard`)

## Data Types

### InformationalResourceRow (Supabase row)

```typescript
interface InformationalResourceRow {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  resource_type: string;  // guide, fact_sheet, toolkit, referral_tool, video, flyer, kyr
  category: string;       // SDOH label
  geography: string;      // 'national' | state code
  languages: string[];
  audience: string[];
  source_org: string | null;
  tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  relevance: number;
}
```

### InformationalResource (display type)

```typescript
interface InformationalResource {
  id: string;
  source: 'informational';
  title: string;
  description: string;
  url: string | null;
  resource_type: string;
  category: string;
  geography: string;
  languages: string[];
  source_org: string;
  relevance: number;
}
```

## API Route

`GET /api/resources/informational?category=Legal+Services&zip=90210`

- `category` required, `zip` optional (5 digits)
- When `zip` provided: derives state via Supabase RPC `zip_to_state(zip)`, passes to `search_informational_resources(null, state)`
- When `zip` omitted: passes `null` state (all resources)
- Filters by `category` post-RPC in the API route
- Rate limit: 15 req/min
- CORS: same allowed origins as other routes
- Returns: `{ success: true, data: { resources: InformationalResource[], count: number } }`

## InformationalResourceCard Component

Document-style card distinct from ProgramCard:

- Title (bold), source org (small gray), description (2-line clamp)
- Badges: resource type with icon, language badges (only if multilingual), teal "Guides & Resources" badge
- Action: external link (or "Download PDF" for .pdf URLs)
- Info-only resources (null URL): no action button, just display
- No save-to-board, no detail modal
- Visual: `bg-blue-50/50` with teal left border accent

### Resource Type Icons

| Type | Icon |
|------|------|
| guide | BookOpen |
| fact_sheet | FileText |
| toolkit | Wrench |
| video | Play |
| flyer | FileSpread |
| kyr / referral_tool | Scale |

## ProgramSearch Integration

### New state
- `informationalResources: InformationalResource[]`
- `informationalLoading: boolean`

### Fetch trigger
Category selection fires 3 parallel fetches:
1. `/api/findhelp/search` (existing)
2. `/api/resources/search` (existing community)
3. `/api/resources/informational` (new)

Always fetch for all categories (no hardcoded mapping of which have data).

### Keyword search
Clears informational resources (keyword search only queries Findhelp).

### Render
"Guides & Resources" section above community + Findhelp cards. Shows 4 initially, expand to see all. Only renders when resources exist.

### Results header
Shows: "N guides · M recommended · P programs found"

### Empty state
Accounts for all three: `programs.length === 0 && communityResources.length === 0 && informationalResources.length === 0`

## Error Handling

- Supabase not configured: empty array, section doesn't render
- RPC fails: silent catch, log in dev
- No resources for category: section doesn't render
- Null URL resources: info-only display, no action button
- zip_to_state returns null: shows all national resources
- Category filter returns 0: section doesn't render

## Geography Behavior

- CA ZIPs: see 25 resources (20 national + 5 CA-specific)
- Non-CA ZIPs: see 20 resources (national only)
- No ZIP: see all 25

## Files Changed

| File | Action |
|------|--------|
| `lib/resources/types.ts` | Add `InformationalResourceRow`, `InformationalResource`, `toInformationalResource()` |
| `lib/resources/client.ts` | Add `searchInformationalResources()` |
| `lib/resources/index.ts` | Re-export new types and function |
| `app/api/resources/informational/route.ts` | New API route (GET + OPTIONS) |
| `components/findhelp/InformationalResourceCard.tsx` | New component |
| `components/findhelp/ProgramSearch.tsx` | Add state, fetch, render section |
| `components/findhelp/index.ts` | Re-export InformationalResourceCard |
