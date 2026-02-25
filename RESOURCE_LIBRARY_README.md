# Informational Resources Library

Curated guides, fact sheets, toolkits, and know-your-rights materials for foster youth and caseworkers. Stored in the Supabase `informational_resources` table.

## How it relates to existing resources

The `/services` page has three resource layers:

| Layer | Table/API | What it is | Filtering |
|---|---|---|---|
| **Community Recommended** | `resources` (Supabase) | Local programs submitted by community | ZIP + SDOH category |
| **Informational Resources** | `informational_resources` (Supabase) | Curated guides & fact sheets | Text search + state (from ZIP) + SDOH category |
| **Findhelp Programs** | Findhelp API | Location-based social services | ZIP + service tags |

Informational resources are **topic-based, not location-based**. They don't require an exact ZIP match — instead, geography filters by state (CA-specific resources only show for CA ZIPs) while national resources show for everyone.

## Categories

Categories use the same SDOH labels as the Findhelp `ServiceTagSelector` so they surface organically alongside program results:

- **Legal Services** — Know your rights, immigration law, referral tools, policy updates
- **Family & Childcare** — Family preparedness plans, child welfare guidance, parenting toolkits

## Geography behavior

- `national` — Shows for all users regardless of location
- `CA` — Only surfaces when the user's ZIP resolves to California

The `zip_to_state()` SQL function converts a ZIP code to a 2-letter state code using USPS 3-digit prefix ranges.

## Schema

```sql
informational_resources (
  id            uuid PRIMARY KEY,
  title         text NOT NULL,
  description   text,
  url           text,
  resource_type text NOT NULL,        -- guide, fact_sheet, toolkit, referral_tool, etc.
  category      text NOT NULL,        -- SDOH category label (e.g., 'Legal Services')
  geography     text NOT NULL,        -- 'national' or state code (e.g., 'CA')
  languages     text[],               -- e.g., '{en}', '{en,es}', '{es}'
  audience      text[],               -- e.g., '{foster_youth,caseworkers}'
  source_org    text,                 -- Publishing organization
  tags          text[],               -- Keyword tags for search
  is_active     boolean DEFAULT true,
  created_at    timestamptz,
  updated_at    timestamptz           -- Auto-updated via trigger
)
```

## Search function

```sql
-- All active resources
SELECT * FROM search_informational_resources(NULL, NULL);

-- Text search with state filtering
SELECT * FROM search_informational_resources('ICE', 'CA');

-- Text search, no geography filter (returns all)
SELECT * FROM search_informational_resources('family plan', NULL);

-- Convert ZIP to state for geography filtering
SELECT zip_to_state('90210');  -- → 'CA'
SELECT zip_to_state('10001');  -- → 'NY'
```

## Frontend integration pattern

When the services page is extended to include informational resources:

```typescript
// Parallel fetch alongside Findhelp and community resources
const [findhelp, community, informational] = await Promise.all([
  fetch(`/api/findhelp/search?zip=${zip}&serviceTag=${tags}`),
  fetch(`/api/resources/search?zip=${zip}&category=${category}`),
  fetch(`/api/resources/informational?category=${category}&zip=${zip}`),
]);
```

Display as a "Guides & Resources" section, separate from location-based program results. Use the `resource_type` field to show appropriate icons (guide, fact sheet, toolkit, video, etc.).

## Adding new resources

### Via Supabase Dashboard

1. Go to the Supabase dashboard → Table Editor → `informational_resources`
2. Click "Insert Row"
3. Fill in required fields: `title`, `category` (must match an SDOH label), `resource_type`
4. Set `geography` to `national` or a state code
5. Add `tags` for searchability (4-6 keyword tags recommended)

### Via seed script

1. Add card data to the Trello JSON or extend the `CARD_OVERRIDES` map in `supabase/scripts/generate-seed.ts`
2. Run `npx tsx supabase/scripts/generate-seed.ts`
3. Apply the generated SQL

## Current data

- **24 resources** from the Casey Family Programs Trello board
- **Topics**: Immigration rights, family preparedness, child welfare guidance, legal referral tools
- **Geography**: 19 national, 5 California-specific
- **Languages**: Mostly English, 4 bilingual (English + Spanish), 1 Spanish-only

## Files

```
supabase/migrations/20260225130000_create_informational_resources.sql  -- Table schema
supabase/migrations/20260225140000_search_informational_resources.sql  -- Search function + zip_to_state
supabase/scripts/generate-seed.ts                                      -- Seed generator
supabase/seed_informational_resources.sql                              -- Generated seed data (24 rows)
```
