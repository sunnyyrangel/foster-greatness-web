# Custom Supabase Resources in Resource Finder

**Date:** 2026-02-24
**Status:** Approved
**Branch:** feature/findhelp-api-integration

## Problem

The `/services` page currently only shows Findhelp API results. Foster Greatness maintains a curated `resources` table in Supabase with community-recommended programs specifically relevant to foster youth. These should appear prominently in search results.

## Decision

**Approach A: API Route + Server-Side Merge.** Create a new API route that queries Supabase, with `ProgramSearch` making two parallel fetches and rendering custom resources first.

## Requirements

- Custom resources shown **first**, above Findhelp results
- Same `ProgramCard` layout with a **"Community Recommended"** badge (teal)
- Filter by **exact ZIP match** and **SDOH category**
- Zero custom results is fine — Findhelp results display as normal
- Either fetch can fail independently without blocking the other

## Data Layer

### Supabase Schema Change

Add a `zip` column to the `resources` table:

```sql
ALTER TABLE resources ADD COLUMN zip TEXT;
```

Existing rows need ZIP populated manually. New submissions should include it.

### Category Mapping

| Resource Category | SDOH Category |
|---|---|
| Education support | Education |
| Education & Training | Education |
| Housing | Housing & Shelter |
| Child care | Family & Childcare |
| Foster Care Support | Family & Childcare |
| Mentorship and social support | Family & Childcare |
| Food assistance | Food & Nutrition |
| Other | *Excluded from category-filtered results* |

### API Route

`GET /api/resources/search?zip=XXXXX&category=Housing+%26+Shelter`

- Queries Supabase: `SELECT * FROM resources WHERE zip = :zip AND category IN (:mappedCategories)`
- Rate limited: 15 req/min
- CORS protected (same allowed origins as Findhelp routes)
- Returns normalized `CommunityResource[]`

### CommunityResource Type

```typescript
type CommunityResource = {
  id: string;
  source: 'community';
  name: string;
  provider_name: string;
  description: string;
  phone?: string;
  website_url?: string;
  address?: string;
  state?: string;
  zip?: string;
  category: string;
}
```

## Frontend Integration

### ProgramSearch

On category selection, fires two parallel fetches:

1. `/api/resources/search?zip=XXXXX&category=...` → custom resources
2. `/api/findhelp/search?zip=XXXXX&serviceTag=...` → Findhelp programs

Renders in order:
1. Community Recommended resources (if any) — badged cards
2. Findhelp results — as today

Zero custom results = no section header, no empty state.

### ProgramCard

- Accepts `source` prop: `'community' | 'findhelp'`
- `source === 'community'` → teal "Community Recommended" badge
- Action buttons adapt based on available data (phone, website, address)
- No distance shown for community resources

### ProgramDetailModal

- Works for community resources with simplified content
- Shows: name, description, phone, website, address, category
- Same save-to-board functionality

### Resource Board

- Community resources save identically — `SavedProgram` type already has the right fields

### No Changes To

- ZipCodeInput
- ServiceTagSelector
- ProgramMap (no lat/lng for community resources — can geocode later)

## Error Handling

- Parallel fetches are independent — one failing doesn't block the other
- Failed custom resources fetch logs to Sentry silently, no user-facing error
- "Other" category resources excluded from category-filtered results
- No pagination for custom resources (low volume per ZIP+category)

## Files to Create/Modify

### New Files
- `app/api/resources/search/route.ts` — API route
- `lib/resources/types.ts` — CommunityResource type + category mapping
- `lib/resources/client.ts` — Supabase query function
- `lib/resources/index.ts` — Re-exports

### Modified Files
- `components/findhelp/ProgramSearch.tsx` — Parallel fetch, render custom first
- `components/findhelp/ProgramCard.tsx` — Accept source prop, show badge
- `components/findhelp/ProgramDetailModal.tsx` — Handle community resource shape
- `lib/findhelp/types.ts` — Add source discriminator to ProgramLite
