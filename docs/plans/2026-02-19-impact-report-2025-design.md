# 2025 Impact Report Page Design

**Date:** 2026-02-19
**Replaces:** Current `/impact` page (2024 version)
**Inspiration:** [Children's Society Impact Page](https://www.childrenssociety.org.uk/what-we-do/our-impact) — alternating data + testimonials

## Overview

Redesign the `/impact` page as a narrative-scroll experience that tells the story of fighting isolation and building community with foster youth. The page alternates data sections with real testimonials from community members, building an arc: **Belonging → Connection → Resources → Voice → Action**.

**Primary audiences (equal weight):**
- Donors & partners — proof of impact, where the need is
- Community members — seeing themselves reflected, feeling pride in collective impact

## Page Structure

### Section 1: Hero

- **Headline:** "No One Should Navigate Life Alone"
- **Subtext:** "In 2025, our community proved that belonging changes everything. Here's the impact we made — together."
- **Anchor stats (3):**
  - 2,147 Community Members
  - 178 Individuals Supported
  - 62 Events Hosted
- **Visual:** Navy-to-blue gradient, subtle animated decorative orbs (matching site pattern)

### Section 2: Community — "Building Belonging"

**Stats row:**
- 2,147 total members
- 1,042 new members this year
- 11 partners

**Testimonial — Cara Moulder:**
> "I aged out at 18 years old, Christmas Day, with nowhere to go. It was a very lonely time. This is when I found Foster Greatness. It felt like a dream come true to find people who actually cared. Having a support system like FG has given me hope again."

**Why this quote:** Maps the exact isolation → belonging arc. Strongest before/after in the set.

### Section 3: Events & Programming — "Showing Up for Each Other"

**Stats:**
- 62 events hosted
- 34 community gatherings (holiday celebrations, cookouts, Mother's Day)
- 22 workshops
- 6 panels featuring 24 lived experience voices

**Context (not standalone stats):** Gingerbread kits (100) and EatWell kits (127) are mentioned within narrative framing about holiday events bringing families together — not as headline numbers.

**Testimonial — Jessica Patino:**
> "When I arrived at the Mother's Day celebration with my son, it wasn't just a place with food and sandwiches — it was a space where moms were seen, valued, and uplifted."

**Why this quote:** Names a specific event and captures dignity over charity.

### Section 4: Resources — "Meeting Real Needs" (anchor section)

**Part A — Direct resource support stats:**
- 220 resource requests received
- 178 individuals served
- 463 connected to wish opportunities through One Simple Wish

**Framing:** FG as the connector — "We help our members navigate the systems that weren't built for them, connecting them to opportunities and resources that meet them where they are."

**Part B — Visual needs breakdown (bar chart):**
- Housing/Rent — 94
- Employment — 65
- Education — 52
- Transportation — 48
- Financial/Bills — 43
- Community/Connection — 37
- Food/Groceries — 25

This visual is powerful for donors (shows where need is) and validating for members (they're not alone).

**Testimonial — Josalinda Garcia:**
> "As someone who struggles financially, it's been hard trying to stay on top of even the basic things like hygiene. But thanks to the support of Foster Greatness and the gift cards they've provided, I've been able to take care of my well-being without feeling so overwhelmed."

**Why this quote:** Names a specific, tangible need being met — connects directly to resource data.

### Section 5: Stories & Voice — "Our Stories Matter"

**Stats:**
- 25 thriver stories told
- 70 hours of storytelling
- 11 conferences attended

**Testimonial — Lauryn Treadwell:**
> "Foster Greatness didn't just help me grow — it reminded me that my past doesn't define my future. It gave me tools, guidance, and a sense of belonging I never thought I'd have."

**Why this quote:** Transformation through being heard — maps to storytelling mission.

### Section 6: Call to Action

Two-path CTA for dual audience:
- **Donors/Partners:** "Help us meet the need" → Donate button
- **Community Members:** "You're not alone" → Join community button

## Testimonial Sources

| Person | Section | Note |
|--------|---------|------|
| Cara Moulder | Community | Aging out story, isolation → hope |
| Jessica Patino | Events | Mother's Day, dignity-centered |
| Josalinda Garcia | Resources | Tangible needs met |
| Lauryn Treadwell | Stories | Growth through being heard |
| Jayme Spauto | NOT USED | Requested fake name if posted — use only if name is changed |

**Additional testimonials available** (Taylor Rockhold, Alejandro Rocha, Jennifer Tinoco, Eryka Moyer, Nancy Lizama, Zoey Dunkel, Julie Ong, Laura Bush, Verenice Patino, Kay Riley) — can be rotated in or added to a testimonial carousel in future iterations.

## Technical Approach

- Replace `app/(site)/impact/page.tsx` entirely
- Client component with Framer Motion scroll animations (matching About page patterns)
- Animated stat counters on scroll into view
- CSS-driven horizontal bar chart for resource needs (no chart library)
- Responsive: mobile-first, 1-column on mobile, 2-column layouts on desktop
- Static data — no API calls needed
- Update SEO metadata for 2025

## Design Patterns (from existing site)

- Hero: gradient bg with decorative orbs, centered text
- Stat cards: white rounded cards with icon badges, shadow
- Testimonials: larger quote cards with distinct styling (e.g. left border accent, quote icon)
- Sections: alternating white / subtle gray gradient backgrounds
- Animations: Framer Motion `whileInView` with stagger children
- Typography: Poppins, brand color hierarchy
- CTA buttons: gradient navy-to-blue, rounded-full
