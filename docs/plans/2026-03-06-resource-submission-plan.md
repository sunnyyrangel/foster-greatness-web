# Resource Submission & Enrichment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a public resource suggestion form, admin review/approval workflow with AI enrichment, and redesign the Supabase `resources` table to align with Findhelp's data model.

**Architecture:** Public form submits to Supabase → admin reviews at /admin/submissions → AI enrichment scrapes website + extracts structured data via Claude → admin approves → resource appears in /services search. The `resources` table is redesigned with `service_tags[]`, `availability`, `free_or_reduced`, `eligibility`, `populations[]`, etc. to match Findhelp's `ProgramLite` shape.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Supabase (Postgres + RLS), Anthropic Claude API (Haiku for enrichment), Tailwind CSS, Zod validation

**Design Doc:** `docs/plans/2026-03-06-resource-submission-design.md`

---

## Task 1: Supabase Schema Migration

Redesign the `resources` table to align with Findhelp's ProgramLite model and add submission workflow columns.

**Files:**
- Create: `supabase/migrations/20260306100000_redesign_resources.sql`

**Step 1: Write the migration SQL**

```sql
-- Migration: Redesign resources table for Findhelp alignment + submission workflow
-- This is an ALTER TABLE migration preserving existing data

-- ============================================================================
-- Add new columns
-- ============================================================================

-- Rename website → website_url
ALTER TABLE resources RENAME COLUMN website TO website_url;

-- Rename submitted_at → created_at (if not already)
-- (submitted_at exists, created_at exists — keep both, submitted_at becomes legacy)

-- Add provider_name (organization name, separate from program_name)
ALTER TABLE resources ADD COLUMN IF NOT EXISTS provider_name text;

-- Geography columns
ALTER TABLE resources ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS latitude double precision;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS longitude double precision;

-- Findhelp-aligned fields
ALTER TABLE resources ADD COLUMN IF NOT EXISTS service_tags text[] NOT NULL DEFAULT '{}';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS availability text DEFAULT 'available';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS free_or_reduced text DEFAULT 'indeterminate';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS eligibility text;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS populations text[] NOT NULL DEFAULT '{}';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS languages text[] NOT NULL DEFAULT '{en}';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS hours jsonb;

-- Submission workflow
ALTER TABLE resources ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'approved';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS submitted_by_role text;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS submitted_by_name text;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS submitted_by_email text;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS submitted_by_is_community_member boolean DEFAULT false;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS submitted_by_used_service boolean DEFAULT false;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS submitted_by_feedback text;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS reviewed_by text;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS rejection_reason text;

-- Enrichment
ALTER TABLE resources ADD COLUMN IF NOT EXISTS enrichment_data jsonb;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS enriched_at timestamptz;

-- Updated_at timestamp
ALTER TABLE resources ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- ============================================================================
-- Indexes for search
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_resources_status ON resources(status);
CREATE INDEX IF NOT EXISTS idx_resources_zip ON resources(zip);
CREATE INDEX IF NOT EXISTS idx_resources_service_tags ON resources USING GIN(service_tags);
CREATE INDEX IF NOT EXISTS idx_resources_state ON resources(state);

-- ============================================================================
-- Migrate existing data
-- ============================================================================

-- Map old category values to service_tags
UPDATE resources SET service_tags = ARRAY['Education']
  WHERE category IN ('Education support', 'Education & Training') AND service_tags = '{}';

UPDATE resources SET service_tags = ARRAY['Housing & Shelter']
  WHERE category = 'Housing' AND service_tags = '{}';

UPDATE resources SET service_tags = ARRAY['Family & Childcare']
  WHERE category IN ('Child care', 'Foster Care Support', 'Mentorship and social support') AND service_tags = '{}';

UPDATE resources SET service_tags = ARRAY['Food & Nutrition']
  WHERE category = 'Food assistance' AND service_tags = '{}';

-- Set all existing rows as approved (they were manually curated)
UPDATE resources SET status = 'approved' WHERE status = 'approved';
UPDATE resources SET submitted_by_role = 'admin' WHERE submitted_by_role IS NULL;

-- Copy program_name to provider_name where provider_name is null
UPDATE resources SET provider_name = program_name WHERE provider_name IS NULL;

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Public can insert pending resources
CREATE POLICY "Anyone can submit resources"
  ON resources FOR INSERT
  WITH CHECK (status = 'pending');

-- Public can read approved resources
CREATE POLICY "Anyone can read approved resources"
  ON resources FOR SELECT
  USING (status = 'approved');

-- ============================================================================
-- Updated_at trigger
-- ============================================================================

CREATE OR REPLACE FUNCTION update_resources_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_resources_updated_at();
```

**Step 2: Commit**

```bash
git add supabase/migrations/20260306100000_redesign_resources.sql
git commit -m "feat: add migration to redesign resources table for Findhelp alignment"
```

**Note:** This migration must be run manually on Supabase before deploying the app code changes. The `ALTER TABLE` approach preserves existing data.

---

## Task 2: Update TypeScript Types

Update `ResourceRow`, `CommunityResource`, and remove the manual `CATEGORY_TO_RESOURCE_CATEGORIES` mapping.

**Files:**
- Modify: `lib/resources/types.ts` (lines 15-94)

**Step 1: Update ResourceRow to match new schema**

Replace the `ResourceRow` interface (lines 15-27) with:

```typescript
export interface ResourceRow {
  id: string;
  program_name: string;
  provider_name: string | null;
  description: string | null;
  website_url: string | null;
  zip: string;
  address: string | null;
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  service_tags: string[];
  availability: string;
  free_or_reduced: string;
  eligibility: string | null;
  populations: string[];
  languages: string[];
  phone: string | null;
  email: string | null;
  hours: Record<string, unknown> | null;
  status: string;
  submitted_by_role: string | null;
  submitted_by_name: string | null;
  submitted_by_email: string | null;
  submitted_by_is_community_member: boolean;
  submitted_by_used_service: boolean;
  submitted_by_feedback: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  enrichment_data: Record<string, unknown> | null;
  enriched_at: string | null;
  category: string; // Legacy column, kept for backwards compat
  created_at: string;
  updated_at: string;
}
```

**Step 2: Update CommunityResource to include enrichment fields**

Replace the `CommunityResource` interface (lines 37-49) with:

```typescript
export interface CommunityResource {
  id: string;
  source: 'community';
  name: string;
  provider_name: string;
  description: string;
  phone?: string;
  email?: string;
  website_url?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  latitude?: number;
  longitude?: number;
  service_tags: string[];
  availability: string;
  free_or_reduced: string;
  eligibility?: string;
  populations: string[];
  languages: string[];
  hours?: Record<string, unknown>;
}
```

**Step 3: Remove CATEGORY_TO_RESOURCE_CATEGORIES and getResourceCategoriesForCategory**

Delete lines 51-74 (the category mapping constant and helper function).

**Step 4: Update toCommunityResource**

Replace `toCommunityResource` (lines 80-94) with:

```typescript
export function toCommunityResource(row: ResourceRow): CommunityResource {
  return {
    id: row.id,
    source: 'community',
    name: row.program_name,
    provider_name: row.provider_name ?? row.program_name,
    description: row.description ?? '',
    ...(row.phone != null && { phone: row.phone }),
    ...(row.email != null && { email: row.email }),
    ...(row.website_url != null && { website_url: row.website_url }),
    ...(row.address != null && { address: row.address }),
    ...(row.city != null && { city: row.city }),
    ...(row.state != null && { state: row.state }),
    ...(row.zip != null && { zip: row.zip }),
    ...(row.latitude != null && { latitude: row.latitude }),
    ...(row.longitude != null && { longitude: row.longitude }),
    service_tags: row.service_tags ?? [],
    availability: row.availability ?? 'available',
    free_or_reduced: row.free_or_reduced ?? 'indeterminate',
    ...(row.eligibility != null && { eligibility: row.eligibility }),
    populations: row.populations ?? [],
    languages: row.languages ?? ['en'],
    ...(row.hours != null && { hours: row.hours }),
  };
}
```

**Step 5: Add SDOH_CATEGORIES constant**

Add after the toCommunityResource function:

```typescript
/**
 * SDOH categories used by both ServiceTagSelector and the submission form.
 * These are the canonical labels stored in service_tags[].
 */
export const SDOH_CATEGORIES = [
  'Food & Nutrition',
  'Housing & Shelter',
  'Healthcare',
  'Employment & Income',
  'Education',
  'Transportation',
  'Legal Services',
  'Family & Childcare',
] as const;

export type SdohCategory = (typeof SDOH_CATEGORIES)[number];
```

**Step 6: Commit**

```bash
git add lib/resources/types.ts
git commit -m "feat: update resource types for Findhelp-aligned schema"
```

---

## Task 3: Update Supabase Client Queries

Update `searchResources()` to use `service_tags` array containment instead of category mapping.

**Files:**
- Modify: `lib/resources/client.ts` (lines 1-44)
- Modify: `lib/resources/index.ts` (update re-exports if needed)

**Step 1: Update imports**

Replace line 3:
```typescript
import { toCommunityResource, toInformationalResource } from './types';
```
(Remove `getResourceCategoriesForCategory` from the import since it no longer exists.)

**Step 2: Update searchResources**

Replace the `searchResources` function (lines 19-44) with:

```typescript
export async function searchResources(
  params: SearchResourcesParams
): Promise<SearchResourcesResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { resources: [], count: 0 };
  }

  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('zip', params.zip)
    .eq('status', 'approved')
    .contains('service_tags', [params.category]);

  if (error) {
    throw new Error(`Supabase query failed: ${error.message}`);
  }

  const resources = (data as ResourceRow[]).map(toCommunityResource);

  return { resources, count: resources.length };
}
```

Key changes:
- Uses `.eq('status', 'approved')` to filter out pending/rejected
- Uses `.contains('service_tags', [params.category])` for array containment (the `@>` operator in Postgres)
- No more `getResourceCategoriesForCategory` call

**Step 3: Commit**

```bash
git add lib/resources/client.ts
git commit -m "feat: update resource queries to use service_tags and status filter"
```

---

## Task 4: Supabase Admin Client

The admin workflows (list all submissions, approve/reject, enrich) need to bypass RLS. Create a server-side Supabase client using the service role key.

**Files:**
- Create: `lib/supabase/admin.ts`

**Step 1: Create admin client**

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isAdminConfigured = !!(supabaseUrl && supabaseServiceRoleKey);

export const supabaseAdmin = isAdminConfigured && supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;
```

**Step 2: Add env var to .env.local**

Add `SUPABASE_SERVICE_ROLE_KEY=<from Supabase dashboard>` to `.env.local`. Also add to Vercel environment variables.

**Step 3: Commit**

```bash
git add lib/supabase/admin.ts
git commit -m "feat: add Supabase admin client with service role key"
```

---

## Task 5: Admin Auth Helper

Extract the admin cookie verification into a reusable helper since it's duplicated across admin routes.

**Files:**
- Create: `lib/admin/auth.ts`

**Step 1: Create auth helper**

```typescript
import { NextRequest } from 'next/server';

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify the admin cookie against ADMIN_PASSWORD.
 * Returns true if the request has a valid admin token.
 */
export async function verifyAdminAuth(request: NextRequest): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const token = request.cookies.get('fg_admin_token')?.value;
  if (!token) return false;

  const expectedHash = await hashPassword(adminPassword);
  return token === expectedHash;
}
```

**Step 2: Commit**

```bash
git add lib/admin/auth.ts
git commit -m "feat: extract admin auth verification into reusable helper"
```

---

## Task 6: Resource Submission API

Public POST endpoint for the suggestion form.

**Files:**
- Create: `app/api/resources/submit/route.ts`

**Step 1: Write the API route**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import { validateCors, getCorsHeaders } from '@/lib/cors';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { captureException } from '@/lib/sentry-utils';
import { SDOH_CATEGORIES } from '@/lib/resources/types';

const submitSchema = z.object({
  program_name: z.string().min(1, 'Program name is required').max(200),
  provider_name: z.string().min(1, 'Organization name is required').max(200),
  description: z.string().min(1, 'Description is required').max(500),
  website_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  zip: z.string().regex(/^\d{5}$/, 'ZIP code must be exactly 5 digits'),
  category: z.enum(SDOH_CATEGORIES as unknown as [string, ...string[]]),
  submitted_by_role: z.enum(['nonprofit_staff', 'community_member', 'lived_experience', 'other']),
  submitted_by_name: z.string().min(1, 'Your name is required').max(100),
  submitted_by_email: z.string().email('Must be a valid email'),
  submitted_by_is_community_member: z.boolean(),
  submitted_by_used_service: z.boolean().optional().default(false),
  submitted_by_feedback: z.string().max(500).optional().or(z.literal('')),
});

const CORS_METHODS = 'POST, OPTIONS';

export async function OPTIONS(request: NextRequest) {
  const corsError = validateCors(request);
  if (corsError) return corsError;

  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request.headers.get('origin'), CORS_METHODS),
  });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  const corsError = validateCors(request);
  if (corsError) return corsError;

  const rateLimitResult = rateLimit(request, undefined, {
    limit: 5,
    windowMs: 60000,
  });

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          ...rateLimitHeaders(rateLimitResult),
          ...getCorsHeaders(origin, CORS_METHODS),
        },
      }
    );
  }

  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      {
        status: 503,
        headers: {
          ...rateLimitHeaders(rateLimitResult),
          ...getCorsHeaders(origin, CORS_METHODS),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const validation = submitSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      return NextResponse.json(
        { error: firstError.message },
        {
          status: 400,
          headers: {
            ...rateLimitHeaders(rateLimitResult),
            ...getCorsHeaders(origin, CORS_METHODS),
          },
        }
      );
    }

    const data = validation.data;

    const { error } = await supabase.from('resources').insert({
      program_name: data.program_name,
      provider_name: data.provider_name,
      description: data.description,
      website_url: data.website_url || null,
      phone: data.phone || null,
      zip: data.zip,
      service_tags: [data.category],
      status: 'pending',
      submitted_by_role: data.submitted_by_role,
      submitted_by_name: data.submitted_by_name,
      submitted_by_email: data.submitted_by_email,
      submitted_by_is_community_member: data.submitted_by_is_community_member,
      submitted_by_used_service: data.submitted_by_used_service,
      submitted_by_feedback: data.submitted_by_feedback || null,
    });

    if (error) {
      throw new Error(`Supabase insert failed: ${error.message}`);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! Your resource suggestion has been submitted for review.',
      },
      {
        headers: {
          ...rateLimitHeaders(rateLimitResult),
          ...getCorsHeaders(origin, CORS_METHODS),
        },
      }
    );
  } catch (error) {
    captureException(error instanceof Error ? error : new Error(String(error)), {
      endpoint: { route: '/api/resources/submit' },
    });
    return NextResponse.json(
      { error: 'Failed to submit resource suggestion' },
      {
        status: 500,
        headers: getCorsHeaders(origin, CORS_METHODS),
      }
    );
  }
}
```

**Step 2: Commit**

```bash
git add app/api/resources/submit/route.ts
git commit -m "feat: add resource submission API endpoint"
```

---

## Task 7: Resource Suggestion Form Component

Build the public-facing form component.

**Files:**
- Create: `components/resources/ResourceSuggestionForm.tsx`

**Step 1: Write the form component**

This is a client component with controlled form state, validation, and submission handling.

Key design:
- `'use client'` directive
- Form state managed with `useState` for each field
- Client-side validation mirrors the Zod schema
- `submitted_by_used_service` toggle reveals the feedback textarea
- URL params (`zip`, `category`) pre-fill fields from `/services` link
- Success state replaces form with thank-you message
- Uses FG brand styles (navy, Poppins, rounded inputs)

Fields (in order):
1. Role select (`submitted_by_role`)
2. Community member toggle (`submitted_by_is_community_member`)
3. Organization name (`provider_name`)
4. Program/service name (`program_name`)
5. Website URL (`website_url`) — optional
6. Phone (`phone`) — optional
7. Brief description (`description`) — textarea, 500 char
8. ZIP code served (`zip`)
9. Category select (`category`) — SDOH_CATEGORIES dropdown
10. Used this service toggle (`submitted_by_used_service`)
11. Experience feedback (`submitted_by_feedback`) — conditional textarea, 500 char
12. Your name (`submitted_by_name`)
13. Your email (`submitted_by_email`)

Submit button: "Submit Suggestion"
Loading state: "Submitting..."
Error: red text below submit button

**SDOH category labels:** Import `SDOH_CATEGORIES` from `@/lib/resources/types`.

**Pre-fill from URL params:** Use `useSearchParams()` to read `zip` and `category` params.

**Step 2: Commit**

```bash
git add components/resources/ResourceSuggestionForm.tsx
git commit -m "feat: add resource suggestion form component"
```

---

## Task 8: Suggestion Form Page

Wire up the form component as a page route.

**Files:**
- Create: `app/(site)/suggest-resource/page.tsx`

**Step 1: Write the page**

```typescript
import { Metadata } from 'next';
import ResourceSuggestionForm from '@/components/resources/ResourceSuggestionForm';

export const metadata: Metadata = {
  title: 'Suggest a Resource | Foster Greatness',
  description: 'Help us grow our resource directory by suggesting programs and services that support foster youth.',
};

export default function SuggestResourcePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-fg-navy font-poppins mb-3">
          Suggest a Resource
        </h1>
        <p className="text-gray-600 max-w-lg mx-auto">
          Know a great program or service? Help us grow our resource directory
          so more community members can find the support they need.
        </p>
      </div>
      <ResourceSuggestionForm />
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add "app/(site)/suggest-resource/page.tsx"
git commit -m "feat: add suggest-resource page"
```

---

## Task 9: "Suggest a Resource" CTA on /services

Add a link from the services search results to the suggestion form.

**Files:**
- Modify: `components/findhelp/ProgramSearch.tsx`

**Step 1: Find the results section**

Look for where community resources and Findhelp programs are rendered (around line 920-950 in the list panel). Add a CTA card after all results.

**Step 2: Add the CTA**

After the last program card in the results list, add:

```tsx
{/* Suggest a Resource CTA */}
<div className="mt-6 p-6 bg-fg-lightblue/30 rounded-lg border border-fg-blue/10 text-center">
  <p className="text-fg-navy font-medium mb-2">
    Know a great program?
  </p>
  <a
    href={`/suggest-resource${zipCode || selectedCategoryLabel ? '?' : ''}${zipCode ? `zip=${zipCode}` : ''}${zipCode && selectedCategoryLabel ? '&' : ''}${selectedCategoryLabel ? `category=${encodeURIComponent(selectedCategoryLabel)}` : ''}`}
    className="inline-block px-5 py-2.5 bg-fg-navy text-white rounded-md hover:bg-fg-navy/90 transition-colors font-medium text-sm"
  >
    Help us grow our resource directory
  </a>
</div>
```

This passes the current ZIP and category as URL params for pre-filling the form.

**Step 3: Commit**

```bash
git add components/findhelp/ProgramSearch.tsx
git commit -m "feat: add 'Suggest a Resource' CTA to services search results"
```

---

## Task 10: Admin Submissions API

CRUD endpoints for the admin to list, approve, reject, and update submissions.

**Files:**
- Create: `app/api/admin/submissions/route.ts`
- Create: `app/api/admin/submissions/[id]/route.ts`

**Step 1: Write the list endpoint (GET /api/admin/submissions)**

Pattern: Copy from `app/api/admin/analytics/route.ts` (same auth pattern).

```typescript
// GET /api/admin/submissions?status=pending
// Returns all submissions, filterable by status
```

Uses `supabaseAdmin` (service role) to bypass RLS and see all statuses.
Returns: `{ data: ResourceRow[], count: number }`
Default filter: `status=pending`

**Step 2: Write the single-resource endpoint (GET/PATCH /api/admin/submissions/[id])**

```typescript
// GET /api/admin/submissions/[id] — get full submission details
// PATCH /api/admin/submissions/[id] — approve, reject, or update fields
```

PATCH body for approve: `{ action: 'approve', reviewed_by: 'admin' }`
PATCH body for reject: `{ action: 'reject', rejection_reason: '...', reviewed_by: 'admin' }`
PATCH body for update fields: `{ eligibility: '...', populations: [...], ... }`

Both endpoints verify admin auth cookie, use rate limiting (30/min), and use `supabaseAdmin`.

**Step 3: Commit**

```bash
git add app/api/admin/submissions/route.ts app/api/admin/submissions/\[id\]/route.ts
git commit -m "feat: add admin submissions API (list, approve, reject, update)"
```

---

## Task 11: AI Enrichment API

Admin-only endpoint that scrapes a website and extracts structured data via Claude.

**Files:**
- Create: `app/api/admin/enrich/route.ts`

**Step 1: Write the enrichment endpoint**

```typescript
// POST /api/admin/enrich
// Body: { resource_id: string }
// 1. Verify admin auth
// 2. Fetch resource from Supabase (get website_url)
// 3. Fetch + scrape website content (HTML → text)
// 4. Send to Claude Haiku with structured extraction prompt
// 5. Return extracted JSON + store in enrichment_data column
```

**Dependencies:**
- `@anthropic-ai/sdk` — Anthropic Node SDK for Claude API
- `ANTHROPIC_API_KEY` env var

**Claude prompt for extraction:**
```
You are extracting structured information about a social service program for a resource directory that serves foster youth and young adults.

Program: {program_name}
Organization: {provider_name}
Website content:
---
{website_text}
---

Extract the following as JSON:
{
  "eligibility": "Brief summary of who is eligible (1-2 sentences)",
  "populations": ["array", "of", "populations", "served"],
  "languages": ["en", "es"],
  "hours": { "monday": "9am-5pm", "tuesday": "9am-5pm", ... },
  "free_or_reduced": "free" | "reduced" | "indeterminate",
  "availability": "available" | "limited" | "unavailable",
  "address": "Full address if found",
  "city": "City name",
  "state": "State abbreviation",
  "description_enhanced": "A concise, empowering 2-3 sentence description suitable for foster youth"
}

For populations, use these values where applicable: foster_youth, young_adults, low_income, homeless, single_parents, families, students, lgbtq, justice_involved, dv_survivors, immigrants, native_american, general

Only include fields you can determine from the content. Use null for fields you cannot determine.
```

**Rate limit:** 5 req/min (admin only)

**Step 2: Install Anthropic SDK**

```bash
npm install @anthropic-ai/sdk
```

**Step 3: Commit**

```bash
git add app/api/admin/enrich/route.ts
git commit -m "feat: add AI enrichment API endpoint for resource data extraction"
```

---

## Task 12: Admin Submissions Page

Build the admin review UI.

**Files:**
- Create: `app/admin/submissions/page.tsx`
- Create: `components/admin/SubmissionReviewPanel.tsx`

**Step 1: Write the submissions page**

Pattern: Follow `app/admin/analytics/page.tsx` structure.

```typescript
// 'use client'
// Fetches from /api/admin/submissions
// Renders a table of submissions with status filter tabs (Pending | Approved | Rejected)
// Clicking a row opens the SubmissionReviewPanel
```

Table columns:
- Status badge (yellow=pending, green=approved, red=rejected)
- Program name
- Organization
- Category (from service_tags[0])
- ZIP
- Submitted date
- Role badge
- Community member indicator

**Step 2: Write the review panel component**

```typescript
// Slide-out panel or modal showing full submission details
// Sections:
// 1. Submitter Info (role, name, email, community member badge)
// 2. Program Info (name, org, description, website, phone, ZIP, category)
// 3. Submitter Feedback (if provided, highlighted)
// 4. Enrichment section:
//    - "Research" button → calls POST /api/admin/enrich
//    - Loading state while enriching
//    - Editable fields: eligibility, populations, hours, languages, availability, free_or_reduced, address, city, state
// 5. Action buttons: Approve (green), Reject (red, prompts for reason)
```

**Step 3: Commit**

```bash
git add app/admin/submissions/page.tsx components/admin/SubmissionReviewPanel.tsx
git commit -m "feat: add admin submissions review page with enrichment UI"
```

---

## Task 13: Update Admin Navigation

Add a link to the submissions page in the admin layout.

**Files:**
- Modify: `app/admin/layout.tsx`

**Step 1: Add navigation links**

Update the admin header (line 21-23) to include nav links:

```tsx
<header className="bg-fg-navy text-white px-6 py-4 flex items-center justify-between">
  <div className="flex items-center gap-6">
    <h1 className="text-lg font-semibold font-poppins">
      Foster Greatness Admin
    </h1>
    {!isLoginPage && (
      <nav className="flex gap-4 text-sm">
        <a href="/admin/analytics" className="text-white/80 hover:text-white transition-colors">
          Analytics
        </a>
        <a href="/admin/submissions" className="text-white/80 hover:text-white transition-colors">
          Submissions
        </a>
      </nav>
    )}
  </div>
  {!isLoginPage && (
    <button
      onClick={handleLogout}
      className="text-sm text-white/80 hover:text-white transition-colors"
    >
      Logout
    </button>
  )}
</header>
```

**Step 2: Commit**

```bash
git add app/admin/layout.tsx
git commit -m "feat: add submissions link to admin navigation"
```

---

## Task 14: Update ProgramCard + ProgramDetailModal for Richer Community Data

Now that community resources have richer data (eligibility, availability, etc.), update the display components.

**Files:**
- Modify: `components/findhelp/ProgramSearch.tsx` — update `communityToProgramLite()` helper
- Modify: `components/findhelp/ProgramDetailModal.tsx` — show eligibility for community resources

**Step 1: Update communityToProgramLite in ProgramSearch.tsx**

Find the `communityToProgramLite` function (around line 525-538) and update to use the richer fields:

```typescript
function communityToProgramLite(resource: CommunityResource): ProgramLite {
  const nextSteps: NextStep[] = [];
  if (resource.phone) nextSteps.push({ channel: 'phone', action: 'call', contact: resource.phone });
  if (resource.website_url) nextSteps.push({ channel: 'website', action: 'visit', contact: resource.website_url });
  if (resource.email) nextSteps.push({ channel: 'email', action: 'email', contact: resource.email });

  const offices: Office[] = [];
  if (resource.address || resource.latitude) {
    offices.push({
      address1: resource.address,
      city: resource.city,
      state: resource.state,
      postal: resource.zip,
      is_administrative: false,
      ...(resource.latitude && resource.longitude && {
        location: { latitude: resource.latitude, longitude: resource.longitude },
      }),
      ...(resource.phone && { phone_number: resource.phone }),
      ...(resource.website_url && { website_url: resource.website_url }),
      ...(resource.hours && { hours: resource.hours as OfficeHours }),
      ...(resource.languages && { supported_languages: resource.languages }),
    });
  }

  return {
    id: resource.id,
    name: resource.name,
    provider_name: resource.provider_name,
    description: resource.description,
    availability: (resource.availability as Availability) ?? 'available',
    free_or_reduced: (resource.free_or_reduced as FreeOrReduced) ?? 'indeterminate',
    next_steps: nextSteps,
    offices,
    service_tags: resource.service_tags ?? [],
  };
}
```

**Step 2: Update ProgramDetailModal for eligibility**

In `ProgramDetailModal.tsx`, find the community resource display section (around line 361-433). Add an eligibility block:

```tsx
{/* Show eligibility if available (from enrichment) */}
{communityResource?.eligibility && (
  <div className="mt-4">
    <h4 className="text-sm font-semibold text-fg-navy mb-1">Eligibility</h4>
    <p className="text-sm text-gray-600">{communityResource.eligibility}</p>
  </div>
)}
```

**Step 3: Commit**

```bash
git add components/findhelp/ProgramSearch.tsx components/findhelp/ProgramDetailModal.tsx
git commit -m "feat: update program display for richer community resource data"
```

---

## Task 15: Update Search API Route

Simplify the search API route now that category mapping is handled by service_tags.

**Files:**
- Modify: `app/api/resources/search/route.ts`

**Step 1: Simplify the route**

The route's logic is already simple — it passes `zip` and `category` to `searchResources()`. The key change is that `searchResources()` now handles the category differently (array containment instead of category mapping). No changes needed to the API route itself — the client function handles it.

Verify the route still works by checking that the `category` param value matches SDOH labels (e.g., "Education", "Housing & Shelter"). The `ServiceTagSelector` component already sends these labels.

**Step 2: Commit (if changes needed)**

```bash
git add app/api/resources/search/route.ts
git commit -m "chore: verify search API route works with updated client"
```

---

## Task 16: Build Verification

Run the full build to catch any TypeScript errors from the schema changes.

**Step 1: Run build**

```bash
npm run build
```

**Step 2: Fix any TypeScript errors**

Common issues to watch for:
- `getResourceCategoriesForCategory` import removed — check all importers
- `ResourceRow.website` → `ResourceRow.website_url` rename
- `CommunityResource` new required fields (service_tags, availability, etc.)
- `communityToProgramLite` parameter type changes

**Step 3: Run dev server and test manually**

```bash
npm run dev
```

Test:
1. Visit `/services`, search by ZIP + category → verify community resources still appear
2. Visit `/suggest-resource` → fill out form → submit → verify success message
3. Visit `/admin/login` → login → go to `/admin/submissions` → verify pending submission appears
4. Click submission → click "Research" → verify enrichment populates fields
5. Approve submission → verify it appears in search results

**Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve build errors from resource schema migration"
```

---

## Task 17: Update CLAUDE.md Documentation

Update the project CLAUDE.md with the new routes, files, and patterns.

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Add to File Reference section**

Add under "Community Resources":

```markdown
### Resource Submissions
- `components/resources/ResourceSuggestionForm.tsx` - Public suggestion form
- `app/(site)/suggest-resource/page.tsx` - Suggestion form page
- `app/api/resources/submit/route.ts` - Submission API (5 req/min)
- `app/admin/submissions/page.tsx` - Admin review dashboard
- `components/admin/SubmissionReviewPanel.tsx` - Review + enrichment panel
- `app/api/admin/submissions/route.ts` - Admin submissions CRUD API
- `app/api/admin/submissions/[id]/route.ts` - Single submission operations
- `app/api/admin/enrich/route.ts` - AI enrichment via Claude Haiku
- `lib/supabase/admin.ts` - Supabase service role client (bypasses RLS)
- `lib/admin/auth.ts` - Admin auth verification helper
- `supabase/migrations/20260306100000_redesign_resources.sql` - Schema migration
```

**Step 2: Update environment variables section**

Add:
```
SUPABASE_SERVICE_ROLE_KEY=<from Supabase dashboard>
ANTHROPIC_API_KEY=<from Anthropic console>
```

**Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with resource submission system"
```

---

## Summary

| Task | Description | New Files | Modified Files |
|------|-------------|-----------|----------------|
| 1 | Schema migration | 1 SQL | — |
| 2 | TypeScript types | — | types.ts |
| 3 | Supabase client queries | — | client.ts |
| 4 | Admin Supabase client | admin.ts | — |
| 5 | Admin auth helper | auth.ts | — |
| 6 | Submission API | submit/route.ts | — |
| 7 | Suggestion form component | ResourceSuggestionForm.tsx | — |
| 8 | Suggestion form page | suggest-resource/page.tsx | — |
| 9 | CTA on /services | — | ProgramSearch.tsx |
| 10 | Admin submissions API | 2 route files | — |
| 11 | AI enrichment API | enrich/route.ts | — |
| 12 | Admin submissions page | page.tsx + panel component | — |
| 13 | Admin navigation | — | layout.tsx |
| 14 | Richer program display | — | ProgramSearch.tsx, ProgramDetailModal.tsx |
| 15 | Verify search API | — | search/route.ts |
| 16 | Build verification | — | various |
| 17 | Documentation | — | CLAUDE.md |

**Total: 8 new files, 7 modified files, 1 SQL migration**
