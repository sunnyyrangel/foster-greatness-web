# Feedback Collection Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a two-layer feedback system (program-level + tool-level) to the resource finder with validated belonging measurement items.

**Architecture:** Supabase tables with RLS, two API routes following existing CORS/rate-limit patterns, two React components (ResourceFeedback for modal, ToolFeedback for results page), fire-and-forget submission via existing analytics pattern.

**Tech Stack:** Next.js 16, Supabase, TypeScript, Tailwind CSS

---

### Task 1: Supabase Migration — Create feedback tables

**Files:**
- Create: `supabase/migrations/20260323100000_create_feedback_tables.sql`

**Steps:**
1. Create `resource_feedback` table with all columns from design doc
2. Create `tool_feedback` table with all columns from design doc
3. Enable RLS on both tables
4. Create INSERT-only policy for anon role on both tables
5. Create SELECT policy for service_role on both tables
6. Add indexes on `created_at`, `zip`, `category`, `program_id` (resource_feedback only)

---

### Task 2: API Route — POST /api/feedback/resource

**Files:**
- Create: `app/api/feedback/resource/route.ts`

**Steps:**
1. Implement OPTIONS handler with CORS validation
2. Implement POST handler with:
   - CORS validation
   - Rate limiting (10/min)
   - Zod schema validation: rating (1-3 required), connection_rating (1-4 optional), program_id (required), program_name (optional), source (optional), category (optional), zip (5 digits optional), comment (max 1000 chars optional), contact_name (optional), contact_email (basic email regex optional), consent_to_share (boolean optional, default false)
   - Insert into `resource_feedback` via Supabase anon client
   - Return 200 always (fire-and-forget pattern from analytics track route)

---

### Task 3: API Route — POST /api/feedback/tool

**Files:**
- Create: `app/api/feedback/tool/route.ts`

**Steps:**
1. Same pattern as resource route
2. Rate limiting: 5/min
3. Zod schema: rating (1-5 required), confident_find_help (1-4 optional), feel_less_alone (1-4 optional), zip, category, comment, contact_name, contact_email, consent_to_share

---

### Task 4: ResourceFeedback Component (program-level)

**Files:**
- Create: `components/findhelp/ResourceFeedback.tsx`

**Steps:**
1. Props: `programId`, `programName`, `source` ('findhelp' | 'community'), `category`, `zip`
2. Check localStorage for existing feedback on this program_id — if found, show "You shared feedback on this — thank you!"
3. Show after 3s delay (useEffect timer)
4. Step 1: Three reaction buttons with labels "Not really" / "It's okay" / "Yes, helpful"
5. Step 2 (slides open): Connection rating — 4-point Likert + "Prefer not to answer"
6. Step 3: Optional textarea "Anything else you'd like to share?"
7. Step 4: "Want us to follow up?" toggle → name + email fields + consent checkbox
8. Submit button — POST to /api/feedback/resource, save to localStorage, show thank-you with crisis resources
9. Tailwind styling matching existing modal aesthetic

---

### Task 5: ToolFeedback Component (tool-level)

**Files:**
- Create: `components/findhelp/ToolFeedback.tsx`

**Steps:**
1. Props: `zip`, `category`
2. Check sessionStorage for existing feedback on this zip+category — if found, show thank-you
3. Step 1: "How helpful was this search?" with 5 clickable star icons
4. Step 2 (slides open): Two belonging pulse items with 4-point Likert + "Prefer not to answer"
5. Step 3: Optional textarea "How could we make this tool better for you?"
6. Step 4: Contact + consent (same pattern)
7. Submit → POST to /api/feedback/tool, save to sessionStorage, show thank-you with crisis resources

---

### Task 6: Integrate Components

**Files:**
- Modify: `components/findhelp/ProgramDetailModal.tsx` — Add ResourceFeedback at bottom of modal content
- Modify: `components/findhelp/ProgramSearch.tsx` — Add ToolFeedback after program cards, before "Suggest a Resource" CTA (not in widget mode)

---

### Task 7: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md` — Add feedback tables and API routes to documentation

---
