# Custom Supabase Resources Integration — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Show community-recommended resources from Supabase above Findhelp results in the resource finder, filtered by ZIP and SDOH category.

**Architecture:** New `lib/resources/` module with types and Supabase client. New `/api/resources/search` route following existing Findhelp route patterns. `ProgramSearch` fires parallel fetches and renders community resources first with a "Community Recommended" badge. `ProgramCard` and `ProgramDetailModal` gain awareness of the `community` source.

**Tech Stack:** Next.js 16 App Router, TypeScript, Supabase JS client, Zod validation, Tailwind CSS

---

### Task 1: Create CommunityResource types and category mapping

**Files:**
- Create: `lib/resources/types.ts`

**Step 1: Create the types file**

```typescript
// lib/resources/types.ts

/**
 * A community-recommended resource from the Foster Greatness Supabase database.
 * Normalized for display alongside Findhelp programs.
 */
export interface CommunityResource {
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

/**
 * Raw row shape from the Supabase `resources` table.
 */
export interface ResourceRow {
  id: string;
  program_name: string;
  category: string;
  phone: string | null;
  website: string | null;
  state: string | null;
  address: string | null;
  description: string | null;
  zip: string | null;
  submitted_at: string;
  created_at: string;
}

/**
 * Maps SDOH category labels (from ServiceTagSelector) to the resource
 * category values stored in Supabase.
 *
 * Key = SDOH category label (e.g. "Education")
 * Value = array of Supabase category values that belong to that SDOH group
 */
export const SDOH_TO_RESOURCE_CATEGORIES: Record<string, string[]> = {
  'Education': ['Education support', 'Education & Training'],
  'Housing & Shelter': ['Housing'],
  'Family & Childcare': ['Child care', 'Foster Care Support', 'Mentorship and social support'],
  'Food & Nutrition': ['Food assistance'],
  'Healthcare': [],
  'Employment & Income': [],
  'Transportation': [],
  'Legal Services': [],
};

/**
 * Get the Supabase resource categories that match a given SDOH label.
 * Returns empty array if no mapping exists (meaning no custom resources for that category).
 */
export function getResourceCategoriesForSDOH(sdohLabel: string): string[] {
  return SDOH_TO_RESOURCE_CATEGORIES[sdohLabel] ?? [];
}

/**
 * Convert a raw Supabase row into a normalized CommunityResource.
 */
export function toCommunitResource(row: ResourceRow): CommunityResource {
  return {
    id: row.id,
    source: 'community',
    name: row.program_name,
    provider_name: row.program_name, // Resources don't have a separate provider
    description: row.description ?? '',
    phone: row.phone ?? undefined,
    website_url: row.website ?? undefined,
    address: row.address ?? undefined,
    state: row.state ?? undefined,
    zip: row.zip ?? undefined,
    category: row.category,
  };
}
```

**Step 2: Commit**

```bash
git add lib/resources/types.ts
git commit -m "feat: add CommunityResource types and SDOH category mapping"
```

---

### Task 2: Create Supabase query client for resources

**Files:**
- Create: `lib/resources/client.ts`
- Create: `lib/resources/index.ts`

**Step 1: Create the client**

```typescript
// lib/resources/client.ts
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import type { ResourceRow, CommunityResource } from './types';
import { toCommunitResource, getResourceCategoriesForSDOH } from './types';

export interface SearchResourcesParams {
  zip: string;
  sdohCategory: string; // SDOH label like "Education" or "Housing & Shelter"
}

export interface SearchResourcesResult {
  resources: CommunityResource[];
  count: number;
}

/**
 * Search community resources by ZIP and SDOH category.
 * Returns empty result if Supabase is not configured or no categories map.
 */
export async function searchResources(
  params: SearchResourcesParams
): Promise<SearchResourcesResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { resources: [], count: 0 };
  }

  const categories = getResourceCategoriesForSDOH(params.sdohCategory);
  if (categories.length === 0) {
    return { resources: [], count: 0 };
  }

  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('zip', params.zip)
    .in('category', categories);

  if (error) {
    throw new Error(`Supabase query failed: ${error.message}`);
  }

  const resources = (data as ResourceRow[]).map(toCommunitResource);

  return { resources, count: resources.length };
}
```

```typescript
// lib/resources/index.ts
export type { CommunityResource, ResourceRow } from './types';
export { SDOH_TO_RESOURCE_CATEGORIES, getResourceCategoriesForSDOH, toCommunitResource } from './types';
export { searchResources } from './client';
export type { SearchResourcesParams, SearchResourcesResult } from './client';
```

**Step 2: Commit**

```bash
git add lib/resources/client.ts lib/resources/index.ts
git commit -m "feat: add Supabase client for community resources search"
```

---

### Task 3: Create the API route

**Files:**
- Create: `app/api/resources/search/route.ts`

**Context:** Follow the exact pattern from `app/api/findhelp/search/route.ts` — Zod validation, rate limiting, CORS.

**Step 1: Create the route**

```typescript
// app/api/resources/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import { validateCors, getCorsHeaders } from '@/lib/cors';
import { searchResources } from '@/lib/resources';

const querySchema = z.object({
  zip: z.string().regex(/^\d{5}$/, 'ZIP code must be exactly 5 digits'),
  category: z.string().min(1, 'Category is required'),
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
      zip: searchParams.get('zip'),
      category: searchParams.get('category'),
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

    const results = await searchResources({
      zip: validation.data.zip,
      sdohCategory: validation.data.category,
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
      console.error('Resources search error:', error);
    }
    return NextResponse.json(
      { error: 'Failed to search community resources' },
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
git add app/api/resources/search/route.ts
git commit -m "feat: add /api/resources/search route with rate limiting and CORS"
```

---

### Task 4: Update ProgramCard to show "Community Recommended" badge

**Files:**
- Modify: `components/findhelp/ProgramCard.tsx`

**Step 1: Add source prop and badge**

Changes to make:

1. **Update props interface** (line 23-31) — add optional `source` prop:
   ```typescript
   interface ProgramCardProps {
     program: ProgramLite;
     onClick: () => void;
     isHighlighted?: boolean;
     onMouseEnter?: () => void;
     onMouseLeave?: () => void;
     id?: string;
     compact?: boolean;
     source?: 'community' | 'findhelp';
   }
   ```

2. **Update function signature** (line 173) — destructure `source`:
   ```typescript
   export default function ProgramCard({ program, onClick, isHighlighted, onMouseEnter, onMouseLeave, id, compact, source }: ProgramCardProps) {
   ```

3. **Add badge in compact card** (inside the compact card, after the provider name span around line 222) — add community badge:
   ```tsx
   {source === 'community' && (
     <span className="flex-shrink-0 text-xs font-medium text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">
       Community
     </span>
   )}
   ```

4. **Add badge in full card** (in the badges div around line 277, as the first child) — add community badge:
   ```tsx
   {source === 'community' && (
     <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
       Community Recommended
     </span>
   )}
   ```

5. **Conditionally hide availability badge** — only show for Findhelp programs (source !== 'community') since community resources don't have availability data.

**Step 2: Commit**

```bash
git add components/findhelp/ProgramCard.tsx
git commit -m "feat: add Community Recommended badge to ProgramCard"
```

---

### Task 5: Update ProgramDetailModal to handle community resources

**Files:**
- Modify: `components/findhelp/ProgramDetailModal.tsx`

**Step 1: Add community resource support**

The modal currently fetches from `/api/findhelp/programs/{id}` on open. For community resources, the data is already available from the search results — no additional API call needed.

Changes to make:

1. **Update props** (line 40-46) — add optional `communityResource` prop:
   ```typescript
   interface ProgramDetailModalProps {
     programId: string;
     zip: string;
     isOpen: boolean;
     onClose: () => void;
     onTagSearch?: (tagId: string, label: string) => void;
     communityResource?: CommunityResource | null;
   }
   ```

2. **Add import** at the top:
   ```typescript
   import type { CommunityResource } from '@/lib/resources';
   ```

3. **Skip API fetch when communityResource is provided** — in the `useEffect` that fetches details (line 223-254), add early return:
   ```typescript
   if (communityResource) {
     setLoading(false);
     return;
   }
   ```

4. **Render community resource details** — after the loading/error checks (around line 370), add a branch:
   ```tsx
   {communityResource && !loading && (
     <div className="space-y-6">
       <div className="flex items-start justify-between gap-4">
         <div>
           <div className="mb-2">
             <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
               Community Recommended
             </span>
           </div>
           <h2 className="text-2xl font-bold text-fg-navy">{communityResource.name}</h2>
         </div>
         {/* Save button — same as existing */}
       </div>

       <div>
         <h3 className="font-semibold text-fg-navy mb-2">About this program</h3>
         <p className="text-gray-600 whitespace-pre-line">{communityResource.description}</p>
       </div>

       {/* Contact info */}
       <div className="space-y-3">
         {communityResource.phone && (
           <a href={`tel:${communityResource.phone}`} className="flex items-center gap-2 text-sm text-fg-blue hover:underline">
             <Phone className="w-4 h-4" />{communityResource.phone}
           </a>
         )}
         {communityResource.website_url && (
           <a href={communityResource.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-fg-blue hover:underline">
             <Globe className="w-4 h-4" />Visit website
           </a>
         )}
         {communityResource.address && (
           <a href={`https://maps.google.com/?q=${encodeURIComponent(communityResource.address)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-fg-blue hover:underline">
             <MapPin className="w-4 h-4" />{communityResource.address}
           </a>
         )}
       </div>

       {/* Category tag */}
       <div>
         <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
           {communityResource.category}
         </span>
       </div>
     </div>
   )}
   ```

5. **Update footer actions** to also work for community resources — show phone/website/directions buttons when `communityResource` is present.

**Step 2: Commit**

```bash
git add components/findhelp/ProgramDetailModal.tsx
git commit -m "feat: add community resource detail view to ProgramDetailModal"
```

---

### Task 6: Update ProgramSearch to fetch and render community resources

**Files:**
- Modify: `components/findhelp/ProgramSearch.tsx`

This is the main integration task. Changes:

**Step 1: Add community resources state and fetch**

1. **Add import** at top:
   ```typescript
   import type { CommunityResource } from '@/lib/resources';
   ```

2. **Add state** (after existing state declarations around line 31):
   ```typescript
   const [communityResources, setCommunityResources] = useState<CommunityResource[]>([]);
   const [communityLoading, setCommunityLoading] = useState(false);
   ```

3. **Add state for modal community resource**:
   ```typescript
   const [modalCommunityResource, setModalCommunityResource] = useState<CommunityResource | null>(null);
   ```

4. **Create fetchCommunityResources function** (after `fetchPrograms`):
   ```typescript
   const fetchCommunityResources = useCallback(async (zipCode: string, categoryLabel: string) => {
     setCommunityLoading(true);
     try {
       const params = new URLSearchParams({ zip: zipCode, category: categoryLabel });
       const response = await fetch(`/api/resources/search?${params}`);
       const data = await response.json();
       if (response.ok && data.data?.resources) {
         setCommunityResources(data.data.resources);
       } else {
         setCommunityResources([]);
       }
     } catch {
       // Silently fail — community resources are supplementary
       setCommunityResources([]);
     } finally {
       setCommunityLoading(false);
     }
   }, []);
   ```

5. **Update handleCategorySelect** (line 137-142) — fire both fetches in parallel:
   ```typescript
   const handleCategorySelect = (tagIds: string, label: string) => {
     setSelectedTag(tagIds);
     setSelectedTagLabel(label);
     setCursor(0);
     setCommunityResources([]);
     fetchPrograms(tagIds, 0, false);
     fetchCommunityResources(zip, label);
   };
   ```

6. **Update handleCategorySwitch** (line 207-213) — same parallel fetch:
   ```typescript
   const handleCategorySwitch = (tagIds: string, label: string) => {
     setSelectedTag(tagIds);
     setSelectedTagLabel(label);
     setSearchTerms('');
     setCursor(0);
     setCommunityResources([]);
     fetchPrograms(tagIds, 0, false);
     fetchCommunityResources(zip, label);
   };
   ```

7. **Clear community resources on back/zip change:**
   - In `handleBack` (line 152): add `setCommunityResources([]);`
   - In `handleZipChange` (line 232): add `setCommunityResources([]);`
   - In `handleTermsSearch` (line 197): add `setCommunityResources([]);` (keyword search doesn't query custom resources)

**Step 2: Update handleProgramClick for community resources**

```typescript
const handleProgramClick = (programId: string) => {
  // Check if this is a community resource
  const communityMatch = communityResources.find(r => r.id === programId);
  setModalCommunityResource(communityMatch || null);
  setModalProgramId(programId);
  setModalOpen(true);

  const url = new URL(window.location.href);
  url.searchParams.set('program', programId);
  url.searchParams.set('zip', zip);
  window.history.pushState({}, '', url.toString());
};
```

**Step 3: Render community resources above Findhelp results**

In the results view section (around line 510-638), add community resources rendering. In all three rendering paths (desktop split, mobile list, widget compact), insert community resource cards before the Findhelp program cards.

For the desktop split view list panel (line 520-531), wrap existing program map with community resources above:

```tsx
{/* Community Recommended */}
{communityResources.length > 0 && (
  <>
    {communityResources.map((resource) => (
      <ProgramCard
        key={resource.id}
        id={`program-card-${resource.id}`}
        program={{
          ...resource,
          availability: 'available',
          free_or_reduced: 'indeterminate',
          next_steps: [],
          offices: [],
          service_tags: [],
        } as ProgramLite}
        source="community"
        onClick={() => handleProgramClick(resource.id)}
        isHighlighted={hoveredProgramId === resource.id}
        onMouseEnter={() => handleCardHover(resource.id)}
        onMouseLeave={() => handleCardHover(null)}
      />
    ))}
  </>
)}
{/* Findhelp programs */}
{programs.map((program) => (
  ...existing code...
))}
```

Apply same pattern to the mobile grid and widget compact views.

**Step 4: Update the results count**

Update the count display (line 367-368) to include community resources:
```tsx
<p className="text-gray-500">
  {communityResources.length > 0 && (
    <>{communityResources.length} recommended + </>
  )}
  {totalCount} {totalCount === 1 ? 'program' : 'programs'} found
</p>
```

**Step 5: Update empty state check**

Update the empty state condition (line 497) to also check community resources:
```tsx
{!programsLoading && !programsError && programs.length === 0 && communityResources.length === 0 && (
```

**Step 6: Update the modal invocation**

Pass `communityResource` to the modal (line 657-663):
```tsx
<ProgramDetailModal
  programId={modalProgramId || ''}
  zip={zip}
  isOpen={modalOpen}
  onClose={handleModalClose}
  onTagSearch={handleTagSearch}
  communityResource={modalCommunityResource}
/>
```

**Step 7: Commit**

```bash
git add components/findhelp/ProgramSearch.tsx
git commit -m "feat: fetch and render community resources above Findhelp results"
```

---

### Task 7: Update CLAUDE.md documentation

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Add documentation**

Add to the Findhelp API Integration section:

- Document the new `/api/resources/search` route and its rate limit (15/min)
- Document the `lib/resources/` module
- Document the SDOH-to-resource-category mapping
- Note that the `resources` table requires a `zip` column

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add community resources integration to CLAUDE.md"
```

---

### Task 8: Manual verification and smoke test

**Step 1: Start the dev server**

```bash
npm run dev
```

**Step 2: Verify the API route**

Open browser to: `http://localhost:3000/api/resources/search?zip=10001&category=Education`

Expected: JSON response with `{ success: true, data: { resources: [...], count: N } }` (may be empty if no resources match that ZIP — depends on your data).

**Step 3: Verify the UI**

1. Go to `http://localhost:3000/services`
2. Enter a ZIP code that matches one of your resources (e.g., `10001` for NY resources)
3. Select a matching SDOH category (e.g., Education)
4. Verify community resources appear above Findhelp results with teal badge
5. Click a community resource card — verify the modal shows simplified details
6. Save a community resource to the board — verify it appears in Saved list

**Step 4: Verify edge cases**

1. Enter a ZIP with no custom resources — verify only Findhelp results show (no empty community section)
2. Switch categories — verify community resources update
3. Use keyword search — verify community resources clear (only Findhelp for keyword search)

**Step 5: Build check**

```bash
npm run build
```

Expected: Clean build with no TypeScript errors.

**Step 6: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: address issues found during smoke testing"
```
