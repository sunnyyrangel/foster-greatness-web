# DOI-33: Display Informational Resources — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Surface the 25 curated informational resources from Supabase's `informational_resources` table on the `/services` page, in a "Guides & Resources" section above program results.

**Architecture:** New API route calls the existing `search_informational_resources()` RPC with geography filtering via `zip_to_state()`. A new `InformationalResourceCard` component renders document-style cards in a collapsible section within `ProgramSearch`. Category selection fires 3 parallel fetches: Findhelp, community resources, and informational resources.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Supabase RPC, Tailwind CSS, Lucide icons, Zod validation

**Design doc:** `docs/plans/2026-02-25-informational-resources-display-design.md`

---

### Task 1: Add TypeScript Types

**Files:**
- Modify: `lib/resources/types.ts` (append after line 101)
- Modify: `lib/resources/index.ts` (append re-exports)

**Step 1: Add types to `lib/resources/types.ts`**

Append after the existing `toCommunityResource` function (line 101):

```typescript
// ============================================================================
// Informational Resource Types (Supabase `informational_resources` table)
// ============================================================================

/**
 * Raw row shape from the Supabase `search_informational_resources()` RPC.
 */
export interface InformationalResourceRow {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  resource_type: string;
  category: string;
  geography: string;
  languages: string[];
  audience: string[];
  source_org: string | null;
  tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  relevance: number;
}

/**
 * Normalized informational resource for display in the services search UI.
 * The `source` discriminator distinguishes these from Findhelp and community resources.
 */
export interface InformationalResource {
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

/**
 * Converts a raw Supabase InformationalResourceRow into a normalized
 * InformationalResource for display in the services search UI.
 */
export function toInformationalResource(row: InformationalResourceRow): InformationalResource {
  return {
    id: row.id,
    source: 'informational',
    title: row.title,
    description: row.description ?? '',
    url: row.url,
    resource_type: row.resource_type,
    category: row.category,
    geography: row.geography,
    languages: row.languages ?? ['en'],
    source_org: row.source_org ?? '',
    relevance: row.relevance,
  };
}
```

**Step 2: Update `lib/resources/index.ts` re-exports**

Add to the existing exports:

```typescript
export type { InformationalResourceRow, InformationalResource } from './types';
export { toInformationalResource } from './types';
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors from `lib/resources/`

**Step 4: Commit**

```bash
git add lib/resources/types.ts lib/resources/index.ts
git commit -m "feat(DOI-33): add InformationalResource types and converter"
```

---

### Task 2: Add Supabase Client Function

**Files:**
- Modify: `lib/resources/client.ts` (append after line 44)
- Modify: `lib/resources/index.ts` (add re-exports)

**Step 1: Add client function to `lib/resources/client.ts`**

Append after the existing `searchResources` function (line 44):

```typescript
// ============================================================================
// Informational Resources
// ============================================================================

export interface SearchInformationalParams {
  category: string;     // SDOH label like "Legal Services"
  zip?: string;         // Optional ZIP for geography filtering
}

export interface SearchInformationalResult {
  resources: InformationalResource[];
  count: number;
}

/**
 * Search informational resources via Supabase RPC.
 * Calls search_informational_resources() with geography filtering,
 * then filters by SDOH category client-side.
 * Returns empty result if Supabase is not configured.
 */
export async function searchInformationalResources(
  params: SearchInformationalParams
): Promise<SearchInformationalResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { resources: [], count: 0 };
  }

  // Derive state from ZIP using the zip_to_state() RPC
  let userState: string | null = null;
  if (params.zip) {
    const { data: stateData } = await supabase.rpc('zip_to_state', { zip: params.zip });
    userState = stateData ?? null;
  }

  // Call the search RPC (no text search — just geography filtering)
  const { data, error } = await supabase.rpc('search_informational_resources', {
    search_text: null,
    user_state: userState,
  });

  if (error) {
    throw new Error(`Supabase RPC failed: ${error.message}`);
  }

  // Filter by category post-RPC
  const filtered = (data as InformationalResourceRow[])
    .filter((row) => row.category === params.category);

  const resources = filtered.map(toInformationalResource);

  return { resources, count: resources.length };
}
```

Also add the missing import at the top of `lib/resources/client.ts`:

```typescript
import type { ResourceRow, CommunityResource, InformationalResourceRow, InformationalResource } from './types';
import { toCommunityResource, getResourceCategoriesForSDOH, toInformationalResource } from './types';
```

(Replace the existing import line that only imports `ResourceRow`, `CommunityResource`, `toCommunityResource`, `getResourceCategoriesForSDOH`.)

**Step 2: Update `lib/resources/index.ts` re-exports**

Add:

```typescript
export { searchInformationalResources } from './client';
export type { SearchInformationalParams, SearchInformationalResult } from './client';
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors from `lib/resources/`

**Step 4: Commit**

```bash
git add lib/resources/client.ts lib/resources/index.ts
git commit -m "feat(DOI-33): add searchInformationalResources client function"
```

---

### Task 3: Create API Route

**Files:**
- Create: `app/api/resources/informational/route.ts`

**Step 1: Create the API route**

Pattern: copy from `app/api/resources/search/route.ts` (the community resources route) and adapt.

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import { validateCors, getCorsHeaders } from '@/lib/cors';
import { searchInformationalResources } from '@/lib/resources';

const querySchema = z.object({
  category: z.string().min(1, 'Category is required'),
  zip: z.string().regex(/^\d{5}$/, 'ZIP code must be exactly 5 digits').optional(),
});

const CORS_METHODS = 'GET, OPTIONS';

export async function OPTIONS(request: NextRequest) {
  const corsError = validateCors(request);
  if (corsError) return corsError;

  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request.headers.get('origin'), CORS_METHODS),
  });
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');

  const corsError = validateCors(request);
  if (corsError) return corsError;

  const rateLimitResult = rateLimit(request, undefined, {
    limit: 15,
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

  try {
    const { searchParams } = new URL(request.url);
    const params = {
      category: searchParams.get('category'),
      zip: searchParams.get('zip') || undefined,
    };

    const validation = querySchema.safeParse(params);
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

    const results = await searchInformationalResources({
      category: validation.data.category,
      zip: validation.data.zip,
    });

    return NextResponse.json(
      { success: true, data: results },
      {
        headers: {
          ...rateLimitHeaders(rateLimitResult),
          ...getCorsHeaders(origin, CORS_METHODS),
        },
      }
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Informational resources search error:', error);
    }
    return NextResponse.json(
      { error: 'Failed to search informational resources' },
      {
        status: 500,
        headers: getCorsHeaders(origin, CORS_METHODS),
      }
    );
  }
}
```

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

**Step 3: Commit**

```bash
git add app/api/resources/informational/route.ts
git commit -m "feat(DOI-33): add /api/resources/informational API route"
```

---

### Task 4: Create InformationalResourceCard Component

**Files:**
- Create: `components/findhelp/InformationalResourceCard.tsx`
- Modify: `components/findhelp/index.ts` (add re-export)

**Step 1: Create the component**

```tsx
'use client';

import { track } from '@vercel/analytics';
import {
  BookOpen,
  FileText,
  Wrench,
  Play,
  Scale,
  ExternalLink,
  Download,
  File,
} from 'lucide-react';
import type { InformationalResource } from '@/lib/resources';

interface InformationalResourceCardProps {
  resource: InformationalResource;
}

const RESOURCE_TYPE_CONFIG: Record<string, { label: string; icon: typeof BookOpen }> = {
  guide: { label: 'Guide', icon: BookOpen },
  fact_sheet: { label: 'Fact Sheet', icon: FileText },
  toolkit: { label: 'Toolkit', icon: Wrench },
  video: { label: 'Video', icon: Play },
  flyer: { label: 'Flyer', icon: File },
  kyr: { label: 'Know Your Rights', icon: Scale },
  referral_tool: { label: 'Referral Tool', icon: Scale },
};

function getTypeConfig(resourceType: string) {
  return RESOURCE_TYPE_CONFIG[resourceType] ?? { label: resourceType, icon: FileText };
}

function isPdfUrl(url: string | null): boolean {
  return url?.toLowerCase().endsWith('.pdf') ?? false;
}

export default function InformationalResourceCard({ resource }: InformationalResourceCardProps) {
  const typeConfig = getTypeConfig(resource.resource_type);
  const TypeIcon = typeConfig.icon;
  const isMultilingual = resource.languages.length > 1 || (resource.languages.length === 1 && resource.languages[0] !== 'en');
  const isPdf = isPdfUrl(resource.url);
  const hasUrl = resource.url != null;

  const handleClick = () => {
    if (!hasUrl) return;
    track('informational_resource_click', {
      title: resource.title,
      type: resource.resource_type,
      source_org: resource.source_org,
    });
    window.open(resource.url!, '_blank', 'noopener,noreferrer');
  };

  return (
    <article
      onClick={handleClick}
      className={`bg-blue-50/50 border-l-4 border-l-teal-400 rounded-xl border border-gray-200 p-4 transition-all ${
        hasUrl ? 'hover:shadow-md hover:border-gray-300 cursor-pointer group' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-fg-navy line-clamp-2 ${hasUrl ? 'group-hover:text-fg-blue transition-colors' : ''}`}>
            {resource.title}
          </h3>
          {resource.source_org && (
            <p className="text-sm text-gray-500 truncate mt-0.5">{resource.source_org}</p>
          )}
        </div>
        {hasUrl && (
          <div className="flex-shrink-0 p-1.5 text-gray-400 group-hover:text-fg-blue transition-colors">
            {isPdf ? <Download className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
          </div>
        )}
      </div>

      {/* Description */}
      {resource.description && (
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{resource.description}</p>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {/* Resource type badge */}
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          <TypeIcon className="w-3 h-3" />
          {typeConfig.label}
        </span>

        {/* Language badges — only show if multilingual */}
        {isMultilingual && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
            {resource.languages.map(l => l.toUpperCase()).join(' | ')}
          </span>
        )}

        {/* Action hint */}
        {hasUrl && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700">
            {isPdf ? 'PDF Download' : 'External Link'}
          </span>
        )}
      </div>
    </article>
  );
}
```

**Step 2: Add re-export to `components/findhelp/index.ts`**

Add line:

```typescript
export { default as InformationalResourceCard } from './InformationalResourceCard';
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

**Step 4: Commit**

```bash
git add components/findhelp/InformationalResourceCard.tsx components/findhelp/index.ts
git commit -m "feat(DOI-33): add InformationalResourceCard component"
```

---

### Task 5: Integrate into ProgramSearch

**Files:**
- Modify: `components/findhelp/ProgramSearch.tsx`

This is the largest task. Make these changes in order:

**Step 1: Add import**

At line 7, add alongside the existing `CommunityResource` import:

```typescript
import type { CommunityResource, InformationalResource } from '@/lib/resources';
```

(Replace the existing `import type { CommunityResource } from '@/lib/resources';`)

Add the new component import after line 14:

```typescript
import InformationalResourceCard from './InformationalResourceCard';
```

**Step 2: Add state**

After line 43 (the `modalCommunityResource` state), add:

```typescript
  // Informational resources state
  const [informationalResources, setInformationalResources] = useState<InformationalResource[]>([]);
  const [informationalLoading, setInformationalLoading] = useState(false);
  const [informationalExpanded, setInformationalExpanded] = useState(false);
```

**Step 3: Add fetch function**

After the existing `fetchCommunityResources` function (after line 152), add:

```typescript
  // Fetch informational resources from Supabase
  const fetchInformationalResources = useCallback(async (zipCode: string, categoryLabel: string) => {
    setInformationalLoading(true);
    setInformationalExpanded(false);
    try {
      const params = new URLSearchParams({ category: categoryLabel, zip: zipCode });
      const response = await fetch(`/api/resources/informational?${params}`);
      const data = await response.json();
      if (response.ok && data.data?.resources) {
        setInformationalResources(data.data.resources);
      } else {
        setInformationalResources([]);
      }
    } catch {
      // Silently fail — informational resources are supplementary
      setInformationalResources([]);
    } finally {
      setInformationalLoading(false);
    }
  }, []);
```

**Step 4: Wire up to category selection handlers**

In `handleCategorySelect` (around line 165), add the informational fetch call. After `fetchCommunityResources(zip, label);`:

```typescript
    fetchInformationalResources(zip, label);
```

Also add clear at the top:

```typescript
    setInformationalResources([]);
```

In `handleCategorySwitch` (around line 250), add the same. After `fetchCommunityResources(zip, label);`:

```typescript
    fetchInformationalResources(zip, label);
```

Also add clear at the top:

```typescript
    setInformationalResources([]);
```

**Step 5: Clear on keyword search**

In `handleTermsSearch` (around line 240), add alongside `setCommunityResources([])`:

```typescript
    setInformationalResources([]);
```

**Step 6: Clear on back navigation**

In `handleBack` (around line 183), in the `step === 'results'` branch, add alongside `setCommunityResources([])`:

```typescript
      setInformationalResources([]);
```

**Step 7: Clear on ZIP change**

In `handleZipChange` (around line 278), add alongside `setCommunityResources([])`:

```typescript
    setInformationalResources([]);
```

**Step 8: Update results header counts**

In the results header `<p>` tag (around line 430), update to include informational count:

```tsx
              <p className="text-gray-500">
                {informationalResources.length > 0 && (
                  <>{informationalResources.length} {informationalResources.length === 1 ? 'guide' : 'guides'}{' '}&bull;{' '}</>
                )}
                {communityResources.length > 0 && (
                  <>{communityResources.length} recommended{' '}&bull;{' '}</>
                )}
                {totalCount} {totalCount === 1 ? 'program' : 'programs'} found
              </p>
```

**Step 9: Update empty state check**

In the empty state condition (around line 563), add informational check:

```tsx
          {!programsLoading && !programsError && programs.length === 0 && communityResources.length === 0 && informationalResources.length === 0 && (
```

**Step 10: Update results view render condition**

In the results view condition (around line 576), add informational check:

```tsx
          {!programsLoading && !programsError && (programs.length > 0 || communityResources.length > 0 || informationalResources.length > 0) && (
```

**Step 11: Add "Guides & Resources" section to desktop list panel**

Inside the desktop list panel `<div>` (after line 586, before the community resources map), add the informational resources section:

```tsx
                      {/* Informational Resources Section */}
                      {informationalResources.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
                              Guides & Resources
                            </span>
                            <span className="text-xs text-gray-400">
                              {informationalResources.length} {informationalResources.length === 1 ? 'resource' : 'resources'}
                            </span>
                          </div>
                          <div className="space-y-3">
                            {(informationalExpanded ? informationalResources : informationalResources.slice(0, 4)).map((resource) => (
                              <InformationalResourceCard key={resource.id} resource={resource} />
                            ))}
                          </div>
                          {informationalResources.length > 4 && !informationalExpanded && (
                            <button
                              onClick={() => setInformationalExpanded(true)}
                              className="mt-2 text-sm font-medium text-fg-blue hover:text-fg-navy transition-colors"
                            >
                              Show all {informationalResources.length} guides
                            </button>
                          )}
                        </div>
                      )}
```

**Step 12: Add the same section to mobile list view**

In the mobile list view grid (around line 669, before the community resources map), add the same informational section. Inside the grid `<div>`:

```tsx
                      {/* Informational Resources Section */}
                      {informationalResources.length > 0 && (
                        <div className="col-span-full mb-2">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
                              Guides & Resources
                            </span>
                            <span className="text-xs text-gray-400">
                              {informationalResources.length} {informationalResources.length === 1 ? 'resource' : 'resources'}
                            </span>
                          </div>
                          <div className="space-y-3">
                            {(informationalExpanded ? informationalResources : informationalResources.slice(0, 4)).map((resource) => (
                              <InformationalResourceCard key={resource.id} resource={resource} />
                            ))}
                          </div>
                          {informationalResources.length > 4 && !informationalExpanded && (
                            <button
                              onClick={() => setInformationalExpanded(true)}
                              className="mt-2 text-sm font-medium text-fg-blue hover:text-fg-navy transition-colors"
                            >
                              Show all {informationalResources.length} guides
                            </button>
                          )}
                        </div>
                      )}
```

**Step 13: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

**Step 14: Commit**

```bash
git add components/findhelp/ProgramSearch.tsx
git commit -m "feat(DOI-33): integrate informational resources into ProgramSearch"
```

---

### Task 6: Update CLAUDE.md and Documentation

**Files:**
- Modify: `CLAUDE.md` (add API route to rate limits, add informational route to file reference)
- Modify: `RESOURCE_LIBRARY_README.md` (update status to reflect frontend is integrated)

**Step 1: Update CLAUDE.md rate limits section**

Add to the rate limiting bullet list:
```
  - `/api/resources/informational`: 15 requests/minute
```

**Step 2: Update CLAUDE.md file reference**

In the "Community Resources" section, add:
```
### Informational Resources
- `app/api/resources/informational/route.ts` - Informational resources search API
- `components/findhelp/InformationalResourceCard.tsx` - Guide/fact sheet card component
```

**Step 3: Update RESOURCE_LIBRARY_README.md**

Update the "Frontend integration pattern" section to reflect that integration is now complete (not pending).

**Step 4: Commit**

```bash
git add CLAUDE.md RESOURCE_LIBRARY_README.md
git commit -m "docs(DOI-33): update documentation for informational resources integration"
```

---

### Task 7: Manual QA + Build Verification

**Step 1: Run production build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 2: Start dev server and test manually**

Run: `npm run dev`

Test scenarios:
1. Go to `/services`, enter ZIP `90210` (CA) → select "Legal Services" → should see "Guides & Resources" section with guides + community resources + Findhelp programs
2. Verify guide cards show title, source org, type badge, and external link
3. Click a guide card → should open external URL in new tab
4. Select "Family & Childcare" → should see 7 informational resources
5. Enter non-CA ZIP `10001` → select "Legal Services" → should see fewer guides (only national, no CA-specific)
6. Select a category with no informational resources (e.g., "Education") → no "Guides & Resources" section appears
7. Use keyword search → informational resources section disappears
8. Click "Show all N guides" expand button when > 4 guides

**Step 3: Final commit if any fixes needed**

---

### Task 8: Update Linear Issue

**Step 1: Move DOI-33 to "In Progress" or "Done"**

Update the Linear issue status to reflect completion.
