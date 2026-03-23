# Resource Finder Feedback Collection — Design

## Summary

Two-layer feedback system for the resource finder, designed with validated psychometric instruments (CEL Tool, adapted UCLA ULS) and trauma-informed principles to measure whether the tool is actually fighting isolation for foster youth.

1. **Program-level** — Emoji reaction (sad/neutral/happy) on the program detail modal, with a connection-focused follow-up prompt
2. **Tool-level** — 5-star rating + 2 validated belonging pulse items at the bottom of search results

Both layers: quick reaction → belonging items → optional comment → optional contact with consent → crisis resources on thank-you.

## Validated Instruments Used

### Campaign to End Loneliness (CEL) Tool
- **License:** Freely available, no licensing required
- **Why:** All positive framing, measures intervention change (pre/post), 3 items
- **Adapted for tool-level feedback** (2 of 3 items, reworded to 6th-grade reading level)

### UCLA Loneliness Scale (ULS)
- **License:** Public domain with citation
- **Why:** Gold standard for loneliness measurement
- **Adapted:** 1 item from FG-adapted positive-framing version for program-level follow-up

## Trauma-Informed Design Rules Applied

1. **Positive framing** — All items ask about what IS present, not what's missing
2. **Every item skippable** — "Prefer not to answer" always available
3. **No institutional jargon** — No "placement," "case," "system," "beneficiary"
4. **6th-8th grade reading level** — Foster youth may have disrupted education
5. **Affirm after submission** — "Thank you — your voice helps shape our community"
6. **Crisis resources on every thank-you** — Non-intrusive, always present
7. **Never tied to services** — Participation doesn't affect access to anything

## Data Model

### `resource_feedback` table (program-level)

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | gen_random_uuid() |
| created_at | timestamptz | now() |
| program_id | text NOT NULL | Findhelp or community resource ID |
| program_name | text | For reporting without joins |
| source | text | 'findhelp' or 'community' |
| category | text | SDOH category at time of feedback |
| zip | text | User's searched ZIP |
| rating | smallint NOT NULL | 1=not helpful, 2=neutral, 3=helpful |
| connection_rating | smallint | 1-4 Likert on "helped me feel more connected" (nullable, skippable) |
| comment | text | Optional, max 1000 chars |
| contact_name | text | Optional opt-in |
| contact_email | text | Optional opt-in |
| consent_to_share | boolean | Default false |

### `tool_feedback` table (tool-level)

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | gen_random_uuid() |
| created_at | timestamptz | now() |
| zip | text | User's searched ZIP |
| category | text | SDOH category searched |
| rating | smallint NOT NULL | 1-5 stars (tool quality) |
| confident_find_help | smallint | 1-4 Likert: CEL-adapted "I feel confident I can find help" |
| feel_less_alone | smallint | 1-4 Likert: CEL-adapted "Knowing these resources exist, I feel less alone" |
| comment | text | Optional, max 1000 chars |
| contact_name | text | Optional opt-in |
| contact_email | text | Optional opt-in |
| consent_to_share | boolean | Default false |

### RLS Policies
- anon: INSERT only (no select/update/delete)
- service_role: full access (admin dashboard)

## UI Design

### Program-Level (ProgramDetailModal)

**Trigger:** Appears at bottom of modal content after 3 seconds or scroll.

**Step 1 — Quick reaction:**
> "Was this resource helpful?"
> [not really] [it's okay] [yes, helpful]  ← emoji buttons (styled, not raw emoji)

**Step 2 — Connection item (slides open after reaction):**
> "Did this resource help you feel more connected or supported?"
> [Not at all] [A little] [Quite a bit] [Very much] [Prefer not to answer]

Adapted from UCLA ULS positive-framing item: "I feel connected to others."

**Step 3 — Optional comment:**
> "Anything else you'd like to share? (optional)"
> [textarea, max 1000 chars]

**Step 4 — Optional contact:**
> "Want us to follow up with you?"
> [toggle] → name + email fields
> [ ] "It's okay to share my words on the Foster Greatness website"

**On submit → Thank you with crisis resources:**
> "Thank you — your voice helps shape our community."
>
> "Support is always available:"
> "988 Suicide & Crisis Lifeline — call or text 988"
> "Crisis Text Line — text HOME to 741741"
> "Foster Greatness Community — community.fostergreatness.co"

**Dedup:** localStorage keyed by program_id. Shows "You shared feedback on this — thank you!" if already submitted.

### Tool-Level (ProgramSearch results)

**Position:** After program cards, before "Suggest a Resource" CTA. Not shown in widget mode.

**Trigger:** Appears after results load. Only on the results step.

**Step 1 — Star rating:**
> "How helpful was this search?"
> [5 clickable stars]

**Step 2 — Belonging pulse items (slide open after star tap):**
> "Two quick questions to help us understand our impact (you can skip either):"
>
> "After using this tool, I feel more confident I can find help when I need it."
> [Strongly disagree] [Disagree] [Agree] [Strongly agree] [Prefer not to answer]
>
> "Knowing these resources exist, I feel less alone."
> [Strongly disagree] [Disagree] [Agree] [Strongly agree] [Prefer not to answer]

Item 1 adapted from CEL item: "I have enough people I feel comfortable asking for help at any time."
Item 2 adapted from CEL item: "I am content with my friendships and relationships" → reframed for resource discovery context.

**Step 3 — Optional comment:**
> "How could we make this tool better for you? (optional)"
> [textarea]

**Step 4 — Optional contact + consent:**
Same pattern as program-level.

**On submit → Same thank-you with crisis resources.**

**Dedup:** sessionStorage keyed by zip+category. Resets per browser session so we get repeat feedback over time.

## API Routes

### POST /api/feedback/resource
- Rate limit: 10/min
- Validates: rating (1-3 required), connection_rating (1-4 optional), program_id required, zip 5 digits
- Sanitizes: comment trimmed, max 1000 chars; email basic regex if provided

### POST /api/feedback/tool
- Rate limit: 5/min
- Validates: rating (1-5 required), confident_find_help (1-4 optional), feel_less_alone (1-4 optional), zip 5 digits
- Sanitizes: comment trimmed, max 1000 chars

Both follow existing CORS + rate limit patterns from analytics track route.

## Scoring & Reporting

### Program Quality Score
- Aggregate emoji ratings per program: % helpful (rating=3)
- Flag programs with <40% helpful for review
- Compare community vs. findhelp source quality

### Belonging Pulse Index (tool-level)
- 4-point Likert items: Strongly disagree=1, Disagree=2, Agree=3, Strongly agree=4
- Average across both items = Belonging Pulse (1.0-4.0)
- Thresholds: 1.0-1.9 = Low (tool not reducing isolation), 2.0-2.9 = Moderate, 3.0-4.0 = Strong (tool is helping)
- Track monthly trend for grant reporting

### Connection Impact Score (program-level)
- connection_rating average per category/source
- "X% of users reported feeling more connected after finding a resource"
- Breakdowns by SDOH category show which service types most reduce isolation

### Grant-Ready Metrics
- "N users searched for resources in [period]"
- "X% reported the tool helped them feel more confident finding help"
- "Y% reported feeling less alone knowing these resources exist"
- "Z users shared their story (with consent) about how the tool helped"

## Use Cases Served
- **Grant reporting**: Validated belonging metrics with CEL/UCLA citations, aggregate stats
- **Product improvement**: Per-program/category ratings to flag bad data, star ratings for tool UX
- **Community storytelling**: Consent-flagged quotes for website/fundraising, connection narratives

## Citations (for grant applications)
- Russell, D. (1996). UCLA Loneliness Scale (Version 3). *Journal of Personality Assessment*, 66, 20-40.
- Campaign to End Loneliness Measurement Tool. campaigntoendloneliness.org
