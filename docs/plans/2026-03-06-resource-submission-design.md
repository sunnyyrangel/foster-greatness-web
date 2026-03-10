# Resource Submission & Enrichment System Design

**Date:** 2026-03-06
**Status:** Approved
**Branch:** `feature/findhelp-api-integration`

## Problem

The current `resources` table has a simple flat schema that doesn't align with Findhelp's `ProgramLite` data model. Community resources are second-class citizens — they get coerced into the Findhelp shape with lots of defaults (`availability: 'available'`, `free_or_reduced: 'indeterminate'`, empty offices). The category mapping is a manual lookup that doesn't use the same SDOH taxonomy.

We need:
1. A public form for nonprofits and community members to suggest resources
2. A human-in-the-loop approval workflow
3. AI-assisted data enrichment to extract eligibility, hours, populations, etc.
4. Schema alignment with Findhelp so community resources render as first-class citizens

## Architecture Overview

```
Public Form (/suggest-resource)
    ↓ POST /api/resources/submit
Supabase `resources` table (status: 'pending')
    ↓ Admin notification
Admin Review (/admin/submissions)
    ↓ Click "Research"
AI Enrichment (POST /api/admin/enrich)
    ↓ Claude scrapes website, extracts structured data
Admin edits enriched fields → Approves
    ↓ status: 'approved'
Resource appears in /services search results
```

## 1. Schema Redesign — `resources` table

The table gets redesigned to align with Findhelp's `ProgramLite` model while adding submission workflow fields.

```sql
CREATE TABLE resources (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Core identity (submitter provides these)
  program_name    text NOT NULL,
  provider_name   text,
  description     text,
  website_url     text,

  -- Geography (submitter provides ZIP, enrichment adds lat/lng)
  zip             text NOT NULL,
  address         text,
  city            text,
  state           text,
  latitude        double precision,
  longitude       double precision,

  -- Findhelp-aligned fields (enrichment fills these)
  service_tags    text[] NOT NULL DEFAULT '{}',
  availability    text DEFAULT 'available',
  free_or_reduced text DEFAULT 'indeterminate',
  eligibility     text,
  populations     text[] NOT NULL DEFAULT '{}',
  languages       text[] NOT NULL DEFAULT '{en}',
  phone           text,
  email           text,
  hours           jsonb,

  -- Submission workflow
  status          text NOT NULL DEFAULT 'pending',
  submitted_by_role text,
  submitted_by_name text,
  submitted_by_email text,
  submitted_by_is_community_member boolean DEFAULT false,
  submitted_by_used_service boolean DEFAULT false,
  submitted_by_feedback text,
  reviewed_by     text,
  reviewed_at     timestamptz,
  rejection_reason text,

  -- Enrichment
  enrichment_data jsonb,
  enriched_at     timestamptz,

  -- Timestamps
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- Indexes for search
CREATE INDEX idx_resources_status ON resources(status);
CREATE INDEX idx_resources_zip ON resources(zip);
CREATE INDEX idx_resources_service_tags ON resources USING GIN(service_tags);
CREATE INDEX idx_resources_state ON resources(state);
```

**Key decisions:**
- `service_tags` uses the same SDOH labels as `ServiceTagSelector` — eliminates the manual `CATEGORY_TO_RESOURCE_CATEGORIES` mapping
- `hours` is JSONB matching Findhelp's `OfficeHours` structure for consistent display
- `enrichment_data` stores the raw AI response for audit/re-enrichment
- `populations` enables the same filtering logic used for Findhelp programs
- Only `approved` resources appear in search results (query filter on status)
- `submitted_by_feedback` stores first-person experience from people who've used the service — valuable signal for admin reviewers

### RLS Policy

```sql
-- Public can insert (submit) but only read approved resources
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit resources"
  ON resources FOR INSERT
  WITH CHECK (status = 'pending');

CREATE POLICY "Anyone can read approved resources"
  ON resources FOR SELECT
  USING (status = 'approved');

-- Admin operations handled via service role key (server-side only)
```

## 2. Submission Form — `/suggest-resource`

**Route:** `app/(site)/suggest-resource/page.tsx`
**Component:** `components/resources/ResourceSuggestionForm.tsx`

### Form Fields

| Field | Type | Required | DB Column |
|-------|------|----------|-----------|
| I am a... | Select: `nonprofit_staff`, `community_member`, `lived_experience`, `other` | Yes | `submitted_by_role` |
| Are you a Foster Greatness community member? | Yes/No toggle | Yes | `submitted_by_is_community_member` |
| Organization name | Text | Yes | `provider_name` |
| Program/service name | Text | Yes | `program_name` |
| Website URL | URL | No | `website_url` |
| Phone | Tel | No | `phone` |
| Brief description | Textarea (500 char) | Yes | `description` |
| ZIP code(s) served | Text | Yes | `zip` |
| Category | Select (8 SDOH categories) | Yes | `service_tags[0]` |
| Have you used this service? | Yes/No toggle | No | `submitted_by_used_service` |
| Your experience | Textarea (500 char, conditional on above) | No | `submitted_by_feedback` |
| Your name | Text | Yes | `submitted_by_name` |
| Your email | Email | Yes | `submitted_by_email` |

### SDOH Category Options (matching ServiceTagSelector)

1. Food & Nutrition
2. Housing & Shelter
3. Healthcare
4. Employment & Income
5. Education
6. Transportation
7. Legal Services
8. Family & Childcare

### API Route

`POST /api/resources/submit`
- Rate limit: 5 req/min
- CORS: standard site origins
- Validates all required fields
- Inserts into `resources` with `status: 'pending'`
- Returns `{ success: true, message: "..." }`

### UX

- Clean form matching FG brand (navy/white, Poppins font)
- Success state: "Thanks for helping our community! We'll review your suggestion and add it to our resource directory."
- Linked from `/services` with CTA: "Know a great program? Help us grow our resource directory."
- URL params `?zip=XXXXX&category=Education` pre-fill fields when coming from /services search

## 3. Admin Review — `/admin/submissions`

**Route:** `app/admin/submissions/page.tsx`
**Auth:** Existing `ADMIN_PASSWORD` cookie-based auth

### Submissions Table

Columns: Status badge, Program name, Organization, Category, ZIP, Submitted date, Submitter role, Community member badge.

Filters: Status (pending/approved/rejected), Category.

### Review Panel (click a row)

Shows all submitter-provided fields plus:
- Submitter feedback (if provided) with a highlight: "Submitter has used this service"
- **"Research" button** — triggers AI enrichment
- Enriched fields (editable): eligibility, populations, hours, languages, lat/lng, availability, free_or_reduced
- **Approve** button — sets `status: 'approved'`, stores `reviewed_at` and `reviewed_by`
- **Reject** button — prompts for reason, sets `status: 'rejected'`, stores `rejection_reason`

## 4. AI Enrichment — `POST /api/admin/enrich`

### Flow

1. Admin clicks "Research" for a pending submission
2. API route receives `resource_id`
3. Fetches the resource's `website_url` from Supabase
4. Scrapes the website content (fetch + HTML-to-text, or Crawl4AI for complex sites)
5. Sends content to Claude API with structured extraction prompt
6. Returns structured JSON pre-filling enrichment fields
7. Stores raw response in `enrichment_data` column for audit
8. Admin reviews, edits, approves

### Claude Prompt (structured output)

```
Extract the following from this social service program's website content:

1. eligibility - Who is eligible? (brief summary, 1-2 sentences)
2. populations - Which populations does this serve? (array, e.g., ["foster_youth", "low_income", "young_adults"])
3. languages - Languages supported (array, e.g., ["en", "es"])
4. hours - Office hours (structured: { monday: "9am-5pm", ... })
5. free_or_reduced - Is this free, reduced cost, or indeterminate? ("free" | "reduced" | "indeterminate")
6. availability - Current availability ("available" | "limited" | "unavailable")
7. address - Physical address if found
8. description_enhanced - A concise, empowering description (2-3 sentences) suitable for a resource directory serving foster youth

Return as JSON.
```

### Rate Limiting & Cost

- Admin-only: 5 req/min
- Estimated cost: ~$0.01-0.05 per enrichment (small context, structured output)
- Uses Claude Haiku for cost efficiency (structured extraction doesn't need Opus)

## 5. Search Integration Changes

### `lib/resources/client.ts`

- `searchResources()` updated to filter by `service_tags` using array containment (`@>`) instead of `CATEGORY_TO_RESOURCE_CATEGORIES` mapping
- Adds `WHERE status = 'approved'` to all queries
- Returns the richer resource shape

### `lib/resources/types.ts`

- `ResourceRow` updated to match new schema
- `CommunityResource` updated with new fields
- `communityToProgramLite()` gets richer mapping:
  - `availability` from DB (not hardcoded)
  - `free_or_reduced` from DB (not hardcoded)
  - `offices` constructed from address/lat/lng/phone/hours
  - `next_steps` from phone/website/email
  - `eligibility` available for detail modal

### Remove

- `CATEGORY_TO_RESOURCE_CATEGORIES` mapping in `lib/resources/types.ts`
- Manual category coercion in `app/api/resources/search/route.ts`

## 6. Data Migration

For the ~10 existing rows in `resources`:

1. Map old `category` values to `service_tags` using existing `CATEGORY_TO_RESOURCE_CATEGORIES`:
   - `"Education support"`, `"Education & Training"` → `["Education"]`
   - `"Housing"` → `["Housing & Shelter"]`
   - `"Child care"`, `"Foster Care Support"`, `"Mentorship and social support"` → `["Family & Childcare"]`
   - `"Food assistance"` → `["Food & Nutrition"]`
2. Set `status = 'approved'` (already curated data)
3. Set `submitted_by_role = 'admin'` (imported data)
4. Existing fields (phone, website, address, zip, state, description) map directly
5. Rename `website` → `website_url`, `program_name` stays

Migration SQL will handle this in a single `ALTER TABLE` + `UPDATE` statement.

## 7. New Files

```
app/(site)/suggest-resource/page.tsx          # Suggestion form page
components/resources/ResourceSuggestionForm.tsx # Form component
app/api/resources/submit/route.ts             # Submission API
app/admin/submissions/page.tsx                # Admin review page
components/admin/SubmissionReviewPanel.tsx     # Review + enrichment UI
app/api/admin/enrich/route.ts                 # AI enrichment API
app/api/admin/submissions/route.ts            # CRUD for admin (list/approve/reject)
supabase/migrations/YYYYMMDD_redesign_resources.sql  # Schema migration
```

## 8. Modified Files

```
lib/resources/types.ts        # Updated types, remove CATEGORY_TO_RESOURCE_CATEGORIES
lib/resources/client.ts       # Updated queries (service_tags, status filter)
app/api/resources/search/route.ts  # Simplified category matching
components/findhelp/ProgramSearch.tsx  # Add "Suggest a Resource" CTA
components/findhelp/ProgramCard.tsx    # Richer community resource display
components/findhelp/ProgramDetailModal.tsx  # Show eligibility for community resources
```

## 9. Link from /services

Add a CTA to `ProgramSearch.tsx` in the results area:

> "Know a great program? [Help us grow our resource directory →](/suggest-resource?zip=XXXXX&category=Education)"

Pre-fills ZIP and category from current search state via URL params.
