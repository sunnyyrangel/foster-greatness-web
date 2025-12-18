# Foster Greatness Website Maintenance Schedule

> **Owner:** Jordan Bartlett (Site Content Manager)
> **Last Updated:** 2025-12-18

This document outlines what should be reviewed and how often to keep the Foster Greatness website up-to-date, secure, and optimized.

---

## Quick Reference

| Task | Frequency | Time Required | Priority |
|------|-----------|---------------|----------|
| Security updates | Weekly | 5 min | 🔴 Critical |
| llm.txt AI testing | Monthly | 10 min | 🟡 Medium |
| Content freshness | Monthly | 15 min | 🟡 Medium |
| llm.txt statistics update | Quarterly | 15 min | 🟡 Medium |
| SEO content audit | Quarterly | 30 min | 🟢 Low |
| Dependency updates | Quarterly | 20 min | 🟡 Medium |
| Analytics review | Monthly | 15 min | 🟢 Low |

---

## Weekly Tasks (5 minutes)

### Security & Vulnerability Monitoring

**What to check:**
- [ ] Review Vercel deployment dashboard for any security alerts
- [ ] Check npm audit for new vulnerabilities: `npm audit`
- [ ] Review Sentry dashboard for critical errors

**How to do it:**
1. Open Vercel dashboard → Your project → Deployments
2. Look for any red security warnings
3. Run `npm audit` in terminal from project directory
4. Open [Sentry Dashboard](https://sentry.io/organizations/doing-good-works/projects/foster-greatness-main/)
5. Review any new critical/high severity errors

**When to act:**
- **Critical vulnerabilities**: Update immediately
- **High severity**: Update within 48 hours
- **Medium/Low**: Include in quarterly dependency update

**How to update:**
```bash
# Update a specific package
npm update package-name

# Or update all dependencies
npm update

# Test that everything still works
npm run build
```

---

## Monthly Tasks (40 minutes total)

### 1. AI Search Testing (10 minutes)

**Purpose:** Verify Foster Greatness appears in AI search results for foster youth support queries.

**What to test:**

Test these queries in ChatGPT, Claude, and Perplexity:
- "where can foster youth find support?"
- "resources for former foster youth"
- "foster care alumni community"
- "help for youth aging out of foster care"

**What to look for:**
- Does Foster Greatness appear in the response?
- Which pages are recommended?
- Is the information accurate?

**Record results:**
Create a simple tracking sheet (Google Sheets):
| Date | Query | AI Engine | Appeared? | Pages Mentioned | Notes |
|------|-------|-----------|-----------|-----------------|-------|
| 2025-12-18 | "where can foster youth find support?" | ChatGPT | Yes | About, Resources | Mentioned as top option |

**When to act:**
- If Foster Greatness doesn't appear: Review llm.txt file, verify URLs still work
- If information is outdated: Update llm.txt descriptions
- If wrong pages recommended: Adjust priority/order in llm.txt

### 2. Content Freshness Check (15 minutes)

**Purpose:** Keep content current and relevant.

**What to review:**
- [ ] Homepage "What's Happening" section - Are updates current?
- [ ] Impact statistics on `/impact` page - Need updating?
- [ ] Active campaigns - Should any be marked as "past" in `data/campaigns.ts`?
- [ ] Events - Are upcoming events accurate?
- [ ] Team bios on `/about` - Any changes needed?

**Files to check:**
- `data/updates.json` - Homepage featured content
- `data/campaigns.ts` - Active campaign status
- `app/(site)/impact/page.tsx` - Impact statistics
- `app/(site)/about/page.tsx` - Team information

**How to update:**
1. Edit the relevant data file
2. Test locally: `npm run dev`
3. Commit and push to GitHub
4. Verify changes in production after deployment

### 3. Analytics Review (15 minutes)

**Purpose:** Track site performance and identify opportunities.

**What to review:**
- Open Vercel Analytics → Your project
- Review top pages, traffic sources, visitor behavior
- Check for unusual patterns or drop-offs

**Questions to ask:**
- Which pages are getting the most traffic?
- Are donation/join pages converting?
- Any pages with high bounce rates?
- Traffic trends up or down?

**Record insights:**
Note any significant findings in a simple document for quarterly strategy discussions.

---

## Quarterly Tasks (Every 3 Months - 65 minutes total)

### 1. llm.txt Statistics Update (15 minutes)

**Purpose:** Keep AI search engines informed with current impact data.

**What to update:**

1. **Gather current statistics:**
   - Total community members
   - Event attendees (quarter total)
   - Panels/workshops delivered (quarter total)
   - Wishes granted (quarter total)

2. **Update llm.txt file:**
   - Open `public/llm.txt`
   - Find "Review measurable outcomes" description under Impact Report
   - Update the statistics
   - Update "Last Updated" date at top of file
   - Commit and push changes

**Example update:**
```markdown
**Last Updated:** 2025-03-18

...

### Impact Report
https://fostergreatness.co/impact
Review measurable outcomes from Foster Greatness programs: 450 event attendees, 22 panels and workshops delivered, 95 wishes granted, and 2,500+ community members served.
```

### 2. SEO Content Audit (30 minutes)

**Purpose:** Ensure content aligns with SEO strategy and keywords.

**What to review:**

1. **Check target keyword performance:**
   - Open Google Search Console
   - Review impressions/clicks for target keywords from `docs/seo-content-strategy.md`
   - Identify opportunities for new content

2. **Review existing pages:**
   - Are meta descriptions optimized?
   - Are H1 tags using target keywords?
   - Is content still accurate and helpful?

3. **Plan next content:**
   - Should you create new pages from the SEO strategy?
   - Do existing pages need refreshing?

**Files to reference:**
- `docs/seo-content-strategy.md` - Target keywords and content plan
- `docs/plans/2025-12-18-llm-txt-design.md` - llm.txt keyword targets

### 3. Dependency Updates (20 minutes)

**Purpose:** Keep dependencies secure and up-to-date.

**What to update:**

1. **Review outdated packages:**
```bash
npm outdated
```

2. **Update packages:**
```bash
# Update all non-breaking changes
npm update

# For major version updates, update package.json manually
# and test thoroughly
```

3. **Test thoroughly:**
```bash
npm run build
npm run dev
# Click through key pages to verify everything works
```

4. **Commit updates:**
```bash
git add package.json package-lock.json
git commit -m "chore: update dependencies to latest versions"
git push origin main
```

**Special attention:**
- **Next.js updates**: May require code changes, review changelog
- **React updates**: Test all interactive components
- **Stripe updates**: Verify donation flows still work
- **Sentry updates**: Check error tracking still functions

---

## Annual Tasks (Once per year - 2 hours)

### 1. Comprehensive llm.txt Audit (30 minutes)

**Purpose:** Major review of AI search optimization.

**What to review:**
- Are all categories still relevant?
- Should category structure change?
- Are there new pages that should be added?
- Should any pages be removed?
- Do descriptions still accurately reflect pages?

**Actions:**
- Update llm.txt structure if needed
- Review against latest AI search best practices
- Test comprehensive queries across all AI engines
- Document findings in `docs/plans/2025-12-18-llm-txt-design.md`

### 2. SEO Strategy Review (60 minutes)

**Purpose:** Evaluate SEO performance and plan content for next year.

**What to review:**
- Google Search Console full year data
- Top performing keywords and pages
- Keywords you want to target that you're not ranking for
- Competitor analysis updates

**Actions:**
- Update `docs/seo-content-strategy.md` with findings
- Create content calendar for next year
- Identify new keyword opportunities

### 3. Security & Performance Audit (30 minutes)

**Purpose:** Comprehensive security and performance review.

**What to review:**
- Run Lighthouse audit on key pages
- Review security headers in production
- Test rate limiting on API endpoints
- Review Sentry error patterns over the year
- Check CORS configuration still appropriate

**Tools:**
- Chrome DevTools → Lighthouse
- https://securityheaders.com (check your domain)
- Sentry dashboard annual error trends

---

## As-Needed Tasks

### When Launching New Pages

**Checklist:**
- [ ] Add page to sitemap.xml (auto-generated by Next.js)
- [ ] Add to llm.txt if it's a permanent page (within 1 week)
- [ ] Update navigation if needed (`components/site/Header.tsx`)
- [ ] Verify SEO meta tags included
- [ ] Test on mobile and desktop
- [ ] Check accessibility with screen reader

### When Ending Campaigns

**Checklist:**
- [ ] Update `data/campaigns.ts` - change status to 'past'
- [ ] Verify campaign removed from navigation
- [ ] Keep campaign page live for historical reference
- [ ] Update homepage if featured campaign
- [ ] Update donate page if campaign was listed

### When Security Alerts Appear

**Immediate actions:**
1. Assess severity (critical/high/medium/low)
2. Check if it affects production (npm audit in production environment)
3. Update vulnerable packages
4. Test thoroughly
5. Deploy immediately if critical
6. Document incident in Sentry or internal notes

---

## Tools & Access

### Required Access
- **Vercel Dashboard**: Deployment, analytics, environment variables
- **GitHub**: Code repository, version control
- **Sentry**: Error tracking and monitoring
- **Google Search Console**: SEO performance
- **Stripe Dashboard**: Donation monitoring
- **Circle.so**: Community events management
- **Beehiiv**: Newsletter content

### Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Test production build
npm start               # Run production build locally

# Security
npm audit               # Check for vulnerabilities
npm audit fix           # Auto-fix vulnerabilities
npm update              # Update all packages

# Git
git status              # Check what changed
git add .               # Stage all changes
git commit -m "message" # Commit changes
git push origin main    # Push to GitHub

# Testing URLs
curl -I https://fostergreatness.co/llm.txt  # Test llm.txt
```

---

## Maintenance Log Template

Create a simple document (Google Doc or Notion) to track maintenance:

```
# Foster Greatness Maintenance Log

## December 2025

### Week of Dec 16
- [x] Security check: No vulnerabilities
- [x] Sentry review: 2 minor errors, not urgent

### Month of December
- [x] llm.txt AI testing: Foster Greatness appearing in 3/3 AI engines
- [x] Content freshness: Updated holiday campaign status
- [x] Analytics: Traffic up 15% month-over-month

## March 2026 - Quarterly Review

### llm.txt Update
- Updated statistics: 2,500 members, 450 attendees, 95 wishes
- All URLs verified working
- AI testing: 100% appearance rate

### SEO Audit
- Top keywords: "foster youth community" (position 8), "aging out support" (position 12)
- Plan: Create new page on "transition age youth resources"

### Dependencies
- Updated Next.js 16.0.10 → 16.0.15
- Updated all minor versions
- Build successful, all tests passing
```

---

## Questions or Issues?

**Technical issues:**
- Check Sentry dashboard for error details
- Review Vercel deployment logs
- Contact: jordanb@doinggoodworks.com

**Content questions:**
- Review brand guidelines in CLAUDE.md
- Check existing patterns in similar pages
- Use Foster Greatness voice & tone guidelines

**Emergency:**
- Site down: Check Vercel status and deployment logs
- Security breach: Immediately contact hosting/development team
- Critical bug: Create GitHub issue, deploy hotfix if needed

---

## Additional Resources

- **Development Guidelines**: See `CLAUDE.md`
- **SEO Strategy**: See `docs/seo-content-strategy.md`
- **llm.txt Design**: See `docs/plans/2025-12-18-llm-txt-design.md`
- **Site Config System**: See `docs/plans/2025-12-03-site-config-system-design.md`
- **README**: See `README.md` for technical setup

---

**Remember:** Consistent small maintenance is easier than big cleanup projects. Set calendar reminders for weekly, monthly, and quarterly tasks!
