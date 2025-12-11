# Technical SEO & Core Web Vitals 2026

## Core Web Vitals Overview

Google's three critical performance metrics that directly impact rankings:

### 1. Largest Contentful Paint (LCP)
**What**: Time for largest visible element to load
**Target**: ≤ 2.5 seconds
**Impact**: Loading performance

### 2. Interaction to Next Paint (INP)
**What**: Responsiveness to ALL user interactions throughout page lifecycle
**Target**: ≤ 200 milliseconds  
**Change**: Replaced FID (First Input Delay) in 2024
**Impact**: Interactivity performance

### 3. Cumulative Layout Shift (CLS)
**What**: Visual stability - unexpected layout shifts
**Target**: ≤ 0.1
**Impact**: Visual stability

**Critical**: Google uses mobile-first indexing. Mobile CWV scores determine rankings.

## LCP Optimization (≤2.5s)

### Primary Fixes
**Image Optimization** (Most Common Issue)
- Use WebP or AVIF formats
- Implement responsive images (srcset)
- Compress aggressively
- Set explicit width/height attributes
- Use lazy loading for below-fold images
- Preload hero images: `<link rel="preload" as="image" href="hero.jpg">`

**Server Response Time**
- Use CDN for global delivery
- Enable HTTP/2 or HTTP/3
- Implement browser caching (Cache-Control headers)
- Optimize Time to First Byte (TTFB)
- Use fast, reliable hosting

**Remove Render-Blocking Resources**
- Minify CSS and JavaScript
- Defer non-critical JavaScript
- Inline critical CSS
- Remove unused CSS/JS

**Code Splitting**
- Load only what's needed for initial view
- Defer offscreen content
- Use dynamic imports for JavaScript

### Advanced LCP Techniques
- Implement preconnect for external domains
- Use resource hints (dns-prefetch, preload)
- Optimize web fonts with font-display: swap
- Reduce server-side processing time
- Enable compression (Gzip/Brotli)

## INP Optimization (≤200ms)

### Understanding INP
INP measures ALL interactions (clicks, taps, keyboard), not just first input. Evaluates:
- Input delay (time to start processing)
- Processing time (event handler execution)
- Presentation delay (rendering response)

### JavaScript Optimization
**Reduce Execution Time**
- Identify long-running tasks with Chrome DevTools Performance panel
- Break up long tasks into smaller chunks
- Use requestIdleCallback for non-essential work
- Defer non-critical scripts

**Minimize JavaScript**
- Remove unused code
- Tree-shake dependencies
- Code-split large bundles
- Lazy load JavaScript modules

**Third-Party Scripts**
- Audit all analytics, ads, chatbots
- Load asynchronously where possible
- Consider removing low-value scripts
- Use Partytown for web workers offload

### Framework Optimization
For React/Vue/Angular:
- Minimize re-renders
- Use production builds
- Implement code splitting
- Optimize event handlers
- Avoid expensive operations in render paths

### Input Handler Optimization
- Debounce expensive operations
- Use passive event listeners
- Avoid layout thrashing
- Minimize DOM manipulations

## CLS Optimization (≤0.1)

### Reserve Space for Dynamic Content
**Images & Videos**
- Always set explicit width and height
- Use aspect-ratio CSS property
- Reserve space before loading

**Ads & Embeds**
- Reserve minimum dimensions
- Use placeholder containers
- Prevent late-loading content from pushing layout

**Web Fonts**
- Use font-display: swap or optional
- Preload critical fonts
- Match fallback font metrics

### Layout Best Practices
- Never insert content above existing content (unless user-initiated)
- Use CSS transforms for animations (not layout-changing properties)
- Avoid banner/popups that push content down
- Maintain consistent spacing and grid structure
- Test on slow connections to catch shifts

## Structured Data (Schema Markup)

Essential for both traditional search and AI engines in 2026.

### Critical Schema Types

**Article Schema** (All content pages)
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Your Title",
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "author-profile-url"
  },
  "datePublished": "2026-01-01",
  "dateModified": "2026-01-15",
  "publisher": {
    "@type": "Organization",
    "name": "Your Brand",
    "logo": "logo-url"
  }
}
```

**FAQPage Schema**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What is X?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "X is..."
    }
  }]
}
```

**Product Schema** (E-commerce)
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "offers": {
    "@type": "Offer",
    "price": "99.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "127"
  }
}
```

**Organization Schema** (Site-wide)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company",
  "url": "https://yoursite.com",
  "logo": "logo-url",
  "sameAs": [
    "https://facebook.com/yourpage",
    "https://twitter.com/yourhandle"
  ]
}
```

**HowTo Schema** (Tutorials/Guides)
- Step-by-step instructions
- Images for each step
- Estimated time
- Tools/materials needed

### Implementation Best Practices
- Use JSON-LD format (preferred by Google)
- Test with Google Rich Results Test
- Implement on ALL relevant pages
- Keep schema data accurate and current
- Don't markup content not visible to users

## Mobile-First Optimization

Google uses mobile version for indexing and ranking.

### Critical Mobile Requirements
**Content Parity**
- Mobile and desktop content must match
- Same structured data on both versions
- Equivalent internal links
- Matching metadata (titles, descriptions)

**Mobile UX**
- Responsive design (not separate m. URLs)
- Touch targets ≥48px
- Readable text without zooming (16px minimum)
- No horizontal scrolling
- Avoid intrusive interstitials

**Mobile Performance**
- Optimize for 3G/4G connections
- Prioritize mobile Core Web Vitals
- Test on actual devices, not just simulators
- Use mobile-friendly test tool

## Crawlability & Indexing

### XML Sitemap
- Submit to Google Search Console
- Update automatically on content changes
- Include only canonical URLs
- Respect 50,000 URL limit per sitemap
- Use sitemap index for large sites

### Robots.txt
- Allow crawling of important content
- Block admin, duplicate, parameter URLs
- Don't block CSS/JS (needed for rendering)
- Test with robots.txt tester

### URL Structure
- Use clean, descriptive URLs
- Include target keywords naturally
- Avoid excessive parameters
- Use hyphens (not underscores) as separators
- Keep URLs under 100 characters when possible

### Internal Linking
- Use descriptive anchor text
- Link to important pages from homepage
- Create topic clusters (pillar + cluster content)
- Audit and fix broken links regularly
- Limit links per page to ~150

### Canonical URLs
- Set canonical tags to prevent duplicates
- Use self-referencing canonicals
- Ensure mobile/desktop versions match
- Check cross-domain canonicals carefully

### Pagination
- Use rel="next" and rel="prev" (deprecated but useful)
- Implement "View All" page when appropriate
- Consider infinite scroll with proper indexing
- Ensure paginated content is crawlable

## HTTPS & Security

### Requirements
- HTTPS everywhere (ranking signal since 2014)
- Valid SSL certificate
- No mixed content warnings
- HSTS header for enhanced security
- Secure payment pages (PCI compliance)

### Implementation
- Redirect all HTTP to HTTPS
- Update internal links to HTTPS
- Update canonical tags
- Test for mixed content issues

## Technical SEO Audit Checklist

**Performance**
- [ ] LCP ≤ 2.5s on mobile
- [ ] INP ≤ 200ms on mobile
- [ ] CLS ≤ 0.1 on mobile
- [ ] Page speed optimized (PageSpeed Insights score)

**Crawlability**
- [ ] XML sitemap submitted and error-free
- [ ] Robots.txt configured correctly
- [ ] No crawl errors in Search Console
- [ ] Internal linking structure optimized

**Mobile**
- [ ] Mobile-friendly test passes
- [ ] Content parity across mobile/desktop
- [ ] Touch targets adequate size
- [ ] No intrusive interstitials

**Structured Data**
- [ ] Article schema on content pages
- [ ] FAQ schema where applicable
- [ ] Product schema on e-commerce pages
- [ ] Organization schema site-wide
- [ ] No schema errors in Rich Results Test

**Indexing**
- [ ] Canonical tags implemented
- [ ] Duplicate content resolved
- [ ] URL structure clean and logical
- [ ] HTTPS properly configured

**Site Architecture**
- [ ] Clear navigation hierarchy
- [ ] Important pages within 3 clicks
- [ ] Breadcrumbs implemented
- [ ] 404 pages handled gracefully

## Measurement Tools

### Google Tools
- **Search Console**: Field data, indexing issues, mobile usability
- **PageSpeed Insights**: Lab + field CWV data, recommendations
- **Lighthouse**: Comprehensive performance audit
- **Mobile-Friendly Test**: Mobile optimization check
- **Rich Results Test**: Schema markup validation

### Third-Party Tools
- **Chrome DevTools**: Performance profiling, INP debugging
- **WebPageTest**: Detailed performance analysis
- **Screaming Frog**: Technical audit, crawl simulation
- **GTmetrix**: Performance monitoring
- **Schema.org Validator**: Schema markup testing

### Real User Monitoring (RUM)
- Track actual user experience data
- Monitor CWV over time
- Segment by device, connection, geography
- Identify problematic pages/flows

## Common Technical SEO Issues

1. **Slow server response**: Upgrade hosting, use CDN
2. **Unoptimized images**: Compress, use modern formats, lazy load
3. **JavaScript bloat**: Remove unused code, split bundles
4. **Missing schema markup**: Implement JSON-LD structured data
5. **Mobile/desktop content mismatch**: Ensure parity
6. **Crawl budget waste**: Block unnecessary URLs
7. **Broken internal links**: Audit and fix regularly
8. **Missing canonicals**: Prevents duplicate content issues
9. **Slow INP**: Optimize JavaScript execution
10. **Layout shifts**: Reserve space for dynamic content

## 2026 Technical SEO Priorities

1. **INP optimization** (new metric, many sites struggling)
2. **Mobile-first excellence** (not optional)
3. **Structured data everywhere** (critical for AI)
4. **Core Web Vitals maintenance** (ranking factor)
5. **Fast, stable, secure** (baseline expectations)

**Remember**: Technical SEO is the foundation. Without it, even great content struggles to rank.
