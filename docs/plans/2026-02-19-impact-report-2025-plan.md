# 2025 Impact Report Page — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current `/impact` page with a narrative-scroll impact report that alternates 2025 data with member testimonials, telling the story of fighting isolation through community.

**Architecture:** Single client component page (`'use client'`) using Framer Motion for scroll-triggered animations. All data is static (no API calls). CSS-driven bar chart for resource needs breakdown — no chart library. The page follows the existing site pattern: gradient hero, white card sections with alternating backgrounds, staggered reveal animations.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, Lucide React icons

**Design doc:** `docs/plans/2026-02-19-impact-report-2025-design.md`

---

### Task 1: Replace Impact Page — Data, Metadata, and Skeleton

**Files:**
- Modify: `app/(site)/impact/page.tsx` (replace entirely)

**Step 1: Create the new page file with metadata and data constants**

Replace the entire contents of `app/(site)/impact/page.tsx` with:

```tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users,
  Heart,
  Calendar,
  ArrowRight,
  HandHeart,
  Mic,
  Quote,
  Home,
  Briefcase,
  GraduationCap,
  Car,
  DollarSign,
  UsersRound,
  ShoppingBasket,
  Handshake,
  Sparkles,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Animation variants (matching About page patterns)
// ---------------------------------------------------------------------------
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const heroStats = [
  { value: 2147, label: 'Community Members', icon: Users },
  { value: 178, label: 'Individuals Supported', icon: HandHeart },
  { value: 62, label: 'Events Hosted', icon: Calendar },
];

const communityStats = [
  { value: '2,147', label: 'Total Members', icon: Users },
  { value: '1,042', label: 'New Members in 2025', icon: Sparkles },
  { value: '11', label: 'Partners', icon: Handshake },
];

const eventStats = [
  { value: '62', label: 'Events Hosted', icon: Calendar },
  { value: '34', label: 'Community Gatherings', icon: Heart },
  { value: '22', label: 'Workshops', icon: GraduationCap },
  { value: '24', label: 'Lived Experience Panelists', icon: Mic },
];

const resourceStats = [
  { value: '220', label: 'Resource Requests Received', icon: HandHeart },
  { value: '178', label: 'Individuals Served', icon: Users },
  { value: '463', label: 'Connected to Wish Opportunities', icon: Heart },
];

const resourceNeeds = [
  { label: 'Housing & Rent', count: 94, icon: Home },
  { label: 'Employment', count: 65, icon: Briefcase },
  { label: 'Education', count: 52, icon: GraduationCap },
  { label: 'Transportation', count: 48, icon: Car },
  { label: 'Financial & Bills', count: 43, icon: DollarSign },
  { label: 'Community & Connection', count: 37, icon: UsersRound },
  { label: 'Food & Groceries', count: 25, icon: ShoppingBasket },
];

const storyStats = [
  { value: '25', label: 'Thriver Stories Told', icon: Mic },
  { value: '70', label: 'Hours of Storytelling', icon: Heart },
  { value: '11', label: 'Conferences Attended', icon: Calendar },
];

const testimonials = {
  community: {
    quote:
      'I aged out at 18 years old, Christmas Day, with nowhere to go, no money in my pocket and no idea what to do. It was a very lonely time. This is when I found Foster Greatness and One Simple Wish. It felt like a dream come true to find people who actually cared and wanted to help me achieve my goals. Having a support system like FG has given me hope again.',
    name: 'Cara',
    role: 'Community Member',
  },
  events: {
    quote:
      "When I arrived at the Mother's Day celebration with my son, I felt that it was a very caring and thoughtful community that truly celebrated mothers. It wasn't just a place with food and sandwiches — it was a space where moms were seen, valued, and uplifted.",
    name: 'Jessica',
    role: 'Community Member',
  },
  resources: {
    quote:
      "As someone who struggles financially, it's been hard trying to stay on top of even the basic things like hygiene which can get surprisingly expensive. But thanks to the support of Foster Greatness and the gift cards they've provided, I've been able to take care of my well-being without feeling so overwhelmed.",
    name: 'Josalinda',
    role: 'Community Member',
  },
  stories: {
    quote:
      "Foster Greatness didn't just help me grow, it reminded me that my past doesn't define my future. It gave me tools, guidance, and a sense of belonging I never thought I'd have.",
    name: 'Lauryn',
    role: 'Community Member',
  },
};

// ---------------------------------------------------------------------------
// Animated counter hook
// ---------------------------------------------------------------------------
function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [hasStarted, end, duration]);

  return { count, ref };
}

// ---------------------------------------------------------------------------
// Subcomponents
// ---------------------------------------------------------------------------

function HeroCounter({ stat }: { stat: (typeof heroStats)[number] }) {
  const { count, ref } = useCountUp(stat.value);
  const Icon = stat.icon;

  return (
    <motion.div variants={itemVariants} ref={ref} className="text-center">
      <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-sm mb-3">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-4xl md:text-5xl font-bold text-white mb-1">
        {count.toLocaleString()}
      </div>
      <div className="text-sm text-white/70">{stat.label}</div>
    </motion.div>
  );
}

function StatCard({
  value,
  label,
  icon: Icon,
}: {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center"
    >
      <div className="inline-flex p-3 rounded-xl bg-fg-blue/10 mb-4">
        <Icon className="w-6 h-6 text-fg-blue" />
      </div>
      <div className="text-3xl md:text-4xl font-bold text-fg-navy mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </motion.div>
  );
}

function TestimonialCard({
  quote,
  name,
  role,
}: {
  quote: string;
  name: string;
  role: string;
}) {
  return (
    <motion.blockquote
      variants={itemVariants}
      className="relative bg-white rounded-2xl p-8 md:p-10 shadow-md border-l-4 border-fg-teal"
    >
      <Quote className="w-8 h-8 text-fg-teal/30 mb-4" />
      <p className="text-lg md:text-xl text-gray-700 leading-relaxed italic mb-6">
        &ldquo;{quote}&rdquo;
      </p>
      <footer className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fg-navy to-fg-blue flex items-center justify-center">
          <span className="text-white font-bold text-sm">{name[0]}</span>
        </div>
        <div>
          <div className="font-semibold text-fg-navy">{name}</div>
          <div className="text-sm text-gray-500">{role}</div>
        </div>
      </footer>
    </motion.blockquote>
  );
}

function NeedsBar({
  label,
  count,
  maxCount,
  icon: Icon,
}: {
  label: string;
  count: number;
  maxCount: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const percentage = (count / maxCount) * 100;

  return (
    <motion.div variants={itemVariants} className="flex items-center gap-4">
      <div className="hidden sm:flex p-2 rounded-lg bg-fg-blue/10 shrink-0">
        <Icon className="w-5 h-5 text-fg-blue" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-sm font-medium text-fg-navy">{label}</span>
          <span className="text-sm font-bold text-fg-navy ml-2">{count}</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-fg-blue to-fg-teal rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: `${percentage}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function ImpactPage() {
  const maxNeed = Math.max(...resourceNeeds.map((r) => r.count));

  return (
    <main className="relative min-h-screen bg-[#fafbfc]">
      {/* ----------------------------------------------------------------- */}
      {/* Hero */}
      {/* ----------------------------------------------------------------- */}
      <section className="relative bg-gradient-to-br from-fg-navy via-fg-navy to-fg-blue py-24 md:py-32 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-fg-blue/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-fg-orange/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-fg-teal/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
          >
            <Heart className="w-4 h-4 text-fg-teal" />
            <span className="text-sm font-semibold text-white/90">2025 Impact Report</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            No One Should Navigate
            <br />
            Life Alone
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-16"
          >
            In 2025, our community proved that belonging changes everything.
            Here&apos;s the impact we made&nbsp;&mdash; together.
          </motion.p>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-3 gap-6 md:gap-12 max-w-2xl mx-auto"
          >
            {heroStats.map((stat) => (
              <HeroCounter key={stat.label} stat={stat} />
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Section 2: Community — Building Belonging */}
      {/* ----------------------------------------------------------------- */}
      <section className="py-16 md:py-24 px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="max-w-5xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4">
              Building Belonging
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Foster youth are among the most isolated populations in the country.
              We&apos;re changing that&nbsp;&mdash; one connection at a time.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {communityStats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          <TestimonialCard {...testimonials.community} />
        </motion.div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Section 3: Events — Showing Up for Each Other */}
      {/* ----------------------------------------------------------------- */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="max-w-5xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4">
              Showing Up for Each Other
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From holiday celebrations that brought families together to workshops
              that equipped our members with real-world skills&nbsp;&mdash; every
              gathering is a chance to belong.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {eventStats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          <TestimonialCard {...testimonials.events} />
        </motion.div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Section 4: Resources — Meeting Real Needs */}
      {/* ----------------------------------------------------------------- */}
      <section className="py-16 md:py-24 px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="max-w-5xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4">
              Meeting Real Needs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We help our members navigate the systems that weren&apos;t built for
              them, connecting them to opportunities and resources that meet them
              where they are.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {resourceStats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          {/* Needs breakdown chart */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl p-6 md:p-10 shadow-md border border-gray-100 mb-12"
          >
            <h3 className="text-xl font-bold text-fg-navy mb-2">
              What Our Community Needs
            </h3>
            <p className="text-sm text-gray-500 mb-8">
              Top resource request themes from our members in 2025
            </p>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="space-y-5"
            >
              {resourceNeeds.map((need) => (
                <NeedsBar
                  key={need.label}
                  {...need}
                  maxCount={maxNeed}
                />
              ))}
            </motion.div>
          </motion.div>

          <TestimonialCard {...testimonials.resources} />
        </motion.div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Section 5: Stories — Our Stories Matter */}
      {/* ----------------------------------------------------------------- */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="max-w-5xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-4">
              Our Stories Matter
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              When foster youth tell their stories, they reclaim their
              narrative&nbsp;&mdash; and inspire others to do the same.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {storyStats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          <TestimonialCard {...testimonials.stories} />
        </motion.div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Section 6: Call to Action */}
      {/* ----------------------------------------------------------------- */}
      <section className="py-16 md:py-24 px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            variants={itemVariants}
            className="relative bg-gradient-to-br from-fg-navy via-fg-navy to-fg-blue rounded-3xl p-10 md:p-16 text-center overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-fg-teal/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-fg-orange/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Help Us Meet the Need
              </h2>
              <p className="text-lg text-white/80 max-w-xl mx-auto mb-10">
                Every dollar helps us connect foster youth to the resources,
                community, and belonging they deserve.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/donate"
                  className="inline-flex items-center justify-center gap-2 bg-white text-fg-navy px-8 py-4 rounded-full font-bold hover:bg-fg-light-blue transition-all shadow-lg"
                >
                  Support Our Mission
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="https://community.fostergreatness.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all"
                >
                  Join Our Community
                  <Users className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
```

Note: Because this is a `'use client'` component, the `export const metadata` pattern won't work. We need a separate layout or `generateMetadata` approach — see Task 2.

**Step 2: Verify it compiles**

Run: `npm run build 2>&1 | head -40`

Expected: Successful build (or only metadata warning — addressed in Task 2).

**Step 3: Commit**

```bash
git add app/(site)/impact/page.tsx
git commit -m "feat: rebuild impact page with 2025 data and testimonials"
```

---

### Task 2: Add SEO Metadata via Layout File

Since the page is `'use client'`, metadata must be exported from a layout or a separate metadata file.

**Files:**
- Create: `app/(site)/impact/layout.tsx`

**Step 1: Create the layout with metadata**

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '2025 Impact Report',
  description:
    'See how Foster Greatness is fighting isolation and building community for foster youth. 2,147 members strong — read our 2025 impact report.',
  openGraph: {
    title: '2025 Impact Report | Foster Greatness',
    description:
      'See how Foster Greatness is fighting isolation and building community for foster youth. 2,147 members strong.',
  },
};

export default function ImpactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

**Step 2: Verify build succeeds**

Run: `npm run build 2>&1 | head -40`

Expected: Clean build, no metadata warnings.

**Step 3: Commit**

```bash
git add app/(site)/impact/layout.tsx
git commit -m "feat: add SEO metadata for 2025 impact report"
```

---

### Task 3: Visual QA and Responsive Testing

**Step 1: Run dev server and test**

Run: `npm run dev`

Manually verify in browser at `http://localhost:3000/impact`:

- [ ] Hero renders with animated counters counting up on scroll
- [ ] Three hero stats display and animate
- [ ] Community section shows 3 stat cards + Cara's testimonial
- [ ] Events section shows 4 stat cards + Jessica's testimonial
- [ ] Resources section shows 3 stat cards + bar chart + Josalinda's testimonial
- [ ] Bar chart bars animate on scroll with correct proportions (Housing is longest)
- [ ] Stories section shows 3 stat cards + Lauryn's testimonial
- [ ] CTA section has two buttons: donate + join community
- [ ] Donate links to `/donate`, community opens `community.fostergreatness.co`
- [ ] Mobile responsive: all grids stack to 1-column on small screens
- [ ] No horizontal scroll on mobile
- [ ] Testimonial cards show teal left border and quote icon
- [ ] Animations trigger on scroll (not all at once on page load)

**Step 2: Fix any issues found**

Address layout, spacing, or animation issues discovered during QA.

**Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix: polish impact page responsive layout and animations"
```

---

### Task 4: Production Build Verification

**Step 1: Run production build**

Run: `npm run build`

Expected: Clean build with no errors or warnings.

**Step 2: Commit if any build-related fixes were needed**

```bash
git add -A
git commit -m "fix: resolve build issues for impact page"
```
