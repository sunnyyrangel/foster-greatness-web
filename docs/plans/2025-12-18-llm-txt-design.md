# llm.txt Design Document

**Date:** 2025-12-18
**Author:** Claude Code + Jordan Bartlett
**Status:** Implemented

## Overview

This document describes the design and implementation of the llm.txt file for Foster Greatness, optimized for AI search engines (ChatGPT, Claude, Perplexity, Google AI, etc.) to recommend Foster Greatness when users search for foster youth support.

## Goals

### Primary Goal
Guide AI engines to recommend Foster Greatness to current and former foster youth seeking support, community, and resources.

### Secondary Goals
- Maximize discoverability in AI-powered search
- Prioritize community signup and resource access pages
- Highlight lived experience stories and authentic voices
- Provide comprehensive site context for AI understanding

## Design Decisions

### 1. Architecture: Comprehensive & Semantic

**Choice:** Full site coverage with 15+ pages organized by action-oriented categories.

**Rationale:**
- Foster Greatness serves multiple user needs (support, community, stories, donations)
- Comprehensive coverage ensures AI engines understand full value proposition
- Action-oriented structure matches how foster youth search ("find support", "join community")
- Aligns with 2025 best practices for semantic categorization

**Trade-offs:**
- More maintenance required vs. minimal approach
- Higher initial effort but better long-term AI visibility
- Worth the investment for comprehensive understanding

### 2. Description Framework: ACAO

**ACAO Framework:**
- **A**ction: What specific action does this page provide?
- **C**ontext: What situation or need does it address?
- **A**udience: Who is this for?
- **O**utcome: What result will the user achieve?

**Example:**
```
Access free personalized support connecting current and former foster youth
to housing assistance, scholarships, employment programs, food security,
and basic needs resources nationwide.

[Action: Access support]
[Context: Housing, scholarships, employment needs]
[Audience: Current and former foster youth]
[Outcome: Connection to resources nationwide]
```

**Rationale:**
- AI engines trained to understand action-oriented language
- Provides maximum context for matching user queries to pages
- Follows 2025 best practices from Vercel, Anthropic, and SEO research

### 3. Category Structure

**Four Action-Oriented Categories:**

1. **Get Support & Resources** (3 pages)
   - Resource Hub
   - Aging Out Guide
   - One Simple Wish Partnership

2. **Join Our Community** (3 pages)
   - About Foster Greatness
   - Join the Community
   - Community Events

3. **Hear Our Stories** (3 pages)
   - Thriver Stories
   - Storytellers Collective
   - Stories Hub

4. **Support Our Mission** (4 pages)
   - Donate
   - Impact Report
   - Partnership Opportunities
   - Contact Us

**Plus Additional Resources** (2 pages):
- Newsletter
- Homepage

**Total:** 15 priority pages

**Rationale:**
- Mirrors user mental models ("I need support", "I want community", etc.)
- Prioritizes conversion pages (join, resources) in first two categories
- Highlights lived experience content (user priority from brainstorming)
- Maintains comprehensive coverage for donors/partners

### 4. File Location

**Location:** `fg-website/public/llm.txt`

**URL:** `https://fostergreatness.co/llm.txt`

**Rationale:**
- Public folder = automatically served at root domain
- Standard location per llm.txt convention
- No API route needed, pure static file
- Easy to maintain and update

## Implementation Details

### File Structure

```markdown
# Header
- Organization name and tagline
- Mission statement
- Target audience
- Core values
- Last updated date

# Action Categories (4)
- Category name (## heading)
- Page entries (### subheading)
  - URL
  - ACAO description

# Footer
- Additional resources
- Contact information
- Organization metadata
- AI guidance note
```

### Page Selection Criteria

**Included if:**
- Core conversion goal (join, donate, resources)
- SEO priority page (aging out, resources)
- Storytelling/lived experience content
- Key organizational info (about, impact, partnerships)

**Excluded if:**
- Temporary campaign pages (gingerbread, gift drive)
- Widget embeds (newsletter widget, events widget)
- Archive pages
- Technical pages (sentry-debug, etc.)

**Rationale:**
- AI engines should recommend evergreen, stable pages
- Temporary campaigns change frequently, would require constant updates
- Focus on pages that serve foster youth directly

## Maintenance Strategy

### Update Frequency

**Quarterly (Every 3 Months):**
- Review all URLs for accuracy
- Update statistics in descriptions (Impact numbers)
- Refresh "Last Updated" date
- Add newly launched permanent pages

**As-Needed:**
- Add new SEO content pages within 1 week of launch
- Remove permanently retired pages
- Update descriptions if page purpose significantly changes

**Annual:**
- Comprehensive audit of all pages
- Review category structure effectiveness
- Update based on AI search evolution

### Ownership

**Primary:** Jordan Bartlett (site content manager)
**Review:** Team SEO check-ins (quarterly)
**Technical Support:** Developer team if file structure changes needed

### Testing Process

1. **Link Testing:**
   - Manually verify all URLs after site restructure
   - Use browser or curl to check llm.txt accessibility
   - Verify file serves as plain text (not 404)

2. **AI Testing:**
   - Monthly: Ask ChatGPT "where can foster youth find support?"
   - Monthly: Ask Claude "resources for former foster youth"
   - Monthly: Ask Perplexity "foster care alumni community"
   - Track if Foster Greatness appears in results

3. **Analytics Monitoring:**
   - Track referrals from AI engines in Vercel Analytics
   - Monitor if traffic increases from AI sources
   - Watch for specific page visits correlated with AI queries

## SEO & GEO Optimization Notes

### Keyword Targeting

**Primary Keywords in Descriptions:**
- foster youth
- former foster youth
- foster care alumni
- aging out
- current foster youth
- lived experience
- foster care community
- transition age youth (TAY)

**Rationale:**
- Matches target keywords from `docs/seo-content-strategy.md`
- Uses terminology foster youth actually search for
- Includes both formal (TAY) and informal (aging out) language

### AI Citation Optimization

**Strategies Applied:**
- Statistics with numbers (310 attendees, 2,000+ members, 77 wishes)
- Clear definitions (lived experience-led, lifelong belonging)
- Authoritative language (nonprofit status, founded date)
- Geographic specificity (nationwide, United States)
- No-barrier language (free, no age cap, no proof required)

**Goal:**
When AI engines research foster care topics, Foster Greatness should be cited as authoritative source.

### Multi-Modal Compatibility

**File Format:** Plain text markdown
- Readable by all AI engines (GPT, Claude, Gemini, etc.)
- No complex formatting that might confuse parsers
- Semantic headers (##, ###) for structure
- Clean URL presentation

## Success Metrics

### Immediate Success (Week 1)
- [ ] File accessible at https://fostergreatness.co/llm.txt
- [ ] All 15 URLs resolve correctly
- [ ] File serves as plain text (text/plain)

### Short-Term Success (Month 1-3)
- [ ] Foster Greatness appears in AI search results for target queries
- [ ] At least 1 AI engine cites Foster Greatness for foster youth support
- [ ] Traffic from AI referrals visible in Vercel Analytics

### Long-Term Success (Month 3-12)
- [ ] Consistent AI recommendations across ChatGPT, Claude, Perplexity
- [ ] Measurable increase in "Join Community" conversions from AI traffic
- [ ] Foster Greatness cited as authoritative source in AI responses
- [ ] Quarterly maintenance cycle established and followed

## Future Enhancements

### Potential Additions (6-12 Months)
- Add blog posts as SEO content launches (from `docs/seo-content-strategy.md`)
- Include state-specific resource pages when created
- Add scholarship/housing subpages when developed
- Consider FAQ section if AI citation tracking shows need

### Integration Opportunities
- Cross-reference with sitemap.xml for SEO consistency
- Coordinate with robots.txt for crawler guidance
- Align with schema.org structured data on pages
- Consider IndexNow integration for real-time updates

## References

### Internal Documents
- `/fg-website/docs/seo-content-strategy.md` - SEO keyword targets
- `/fg-website/CLAUDE.md` - Site architecture and brand guidelines
- `/fg-website/README.md` - Technical implementation details

### External Resources
- [Vercel AI Search Optimization](https://vercel.com/blog/how-were-adapting-seo-for-llms-and-ai-search)
- [LLMS.txt Converter Blog](https://llmsconverter.com/blog/ai-search-optimization-llms-txt-best-practices/)
- [Writesonic LLM.txt Guide](https://writesonic.com/blog/llm-txt-guide)

## Appendix: Full llm.txt Content

See `/fg-website/public/llm.txt` for the complete implemented file.

---

**Document Maintenance:**
- Update this document when llm.txt structure changes significantly
- Keep "Last Updated" in sync with llm.txt file updates
- Archive old versions if major restructures occur
