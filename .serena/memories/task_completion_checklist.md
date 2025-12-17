# Task Completion Checklist

## Before Considering a Task Complete

### 1. Code Quality
- [ ] Run `npm run lint` - All ESLint errors resolved
- [ ] TypeScript strict mode compliance - No type errors
- [ ] Build succeeds - `npm run build` completes without errors

### 2. Testing & Validation
- [ ] Test locally - Run `npm run dev` and verify changes work
- [ ] Test all affected pages - Navigate through impacted routes
- [ ] Test responsive design - Check mobile, tablet, desktop viewports
- [ ] Test browser compatibility - Verify in multiple browsers if critical changes

### 3. Configuration & Data
- [ ] No hardcoded campaign data - Use `data/campaigns.ts` helpers
- [ ] No hardcoded email addresses - Use `siteConfig.donation.contactEmail`
- [ ] Environment variables documented - If new vars added, update `.env.local.example`
- [ ] Data imports correct - Using `@/data` path alias

### 4. Brand & Content Compliance
- [ ] Brand colors used correctly - Use Tailwind `fg-*` classes
- [ ] Voice & tone appropriate - Authentic, empowering, dignity-centered
- [ ] No charity/pity language - Strengths-based framing only
- [ ] Quotes/testimonials unmodified - Never alter attributed quotes

### 5. Component Usage
- [ ] TypeformEmbed used for Typeforms - Not direct `data-tf-live` embeds
- [ ] ContactSection used for contact forms - Reusable component pattern
- [ ] DonateSection used for donations - Not custom implementations

### 6. Navigation & Routing
- [ ] Header navigation updated - If campaign visibility changed
- [ ] Donate page reflects changes - If campaign added/removed
- [ ] All links work - No broken internal links
- [ ] Proper route groups used - `(site)` for full pages, `widgets` for embeds

### 7. Documentation
- [ ] CLAUDE.md updated - If architectural changes made
- [ ] README.md updated - If setup process changed
- [ ] Comments added - For complex logic or non-obvious decisions

### 8. Git & Deployment
- [ ] Changes committed - Meaningful commit message
- [ ] Branch up to date - Pulled latest from main
- [ ] No merge conflicts - Resolved if present
- [ ] Environment variables set in Vercel - If deploying new features

## Special Considerations

### Campaign Changes
- [ ] Campaign added to `data/campaigns.ts` with all required fields
- [ ] Visibility flags set correctly (`showInNav`, `showOnHomepage`, `showOnDonatePage`)
- [ ] Custom page created if `hasCustomPage: true`
- [ ] Stripe button ID added if donation campaign

### API Integration Changes
- [ ] API keys documented in environment setup
- [ ] Error handling implemented for API failures
- [ ] Loading states implemented
- [ ] Caching strategy appropriate (e.g., 1-hour revalidation for newsletter)

### Performance
- [ ] Images optimized - Using Next.js Image component
- [ ] Remote image patterns configured - In `next.config.ts` if needed
- [ ] Bundle size checked - Large dependencies justified
- [ ] Server vs Client components - Correct directive usage

## Final Verification
- [ ] Run full build: `npm run build`
- [ ] Start production server: `npm start`
- [ ] Smoke test critical paths: homepage, donate page, campaign pages
- [ ] Verify analytics still tracking (Vercel Analytics component present)

## Definition of "Done"
A task is complete when:
1. Code passes all checks (lint, type-check, build)
2. Changes work as expected in development and production modes
3. No regressions introduced in existing features
4. Brand and content guidelines followed
5. Documentation updated appropriately
6. Ready for deployment without additional work
