# Federal Recommendation Feature — Design

**Date:** 2026-03-17

## Context

Foster Greatness was named as a "Trusted Source of Information and Resource Navigation" in a coalition memo to federal officials (ACF Deputy Assistant Secretary and National Design Studio Chief Design Officer) regarding the "Fostering the Future" Executive Order platform. This is a significant endorsement from lived experience experts that should be featured prominently on the website.

## Design

### 1. Dedicated Page (`/federal-recommendation`)

A professionally styled page presenting the full memo with context. Structure:

- **Hero**: Dark gradient, headline emphasizing the federal endorsement
- **Context section**: Brief explainer about the Executive Order and the coalition
- **Foster Greatness highlight**: Pull out the specific section naming FG as a trusted platform
- **Full memo**: Formatted version of the complete memo with all 8 recommendations
- **Other organizations**: List of coalition partners (iFoster, FosterClub, Think of Us, MIT Media Lab)
- **CTA**: Links to partnerships page and community

### 2. Credibility Banner Component (`FederalEndorsementBanner`)

A reusable component that appears on:
- **Homepage**: As a distinct section (between impact and contact)
- **About page**: After the mission section
- **Partnerships page**: Near the top, high visibility for funders
- **Impact page**: Reinforces credibility

The banner is a compact callout with:
- Icon or small shield/badge visual
- One-line statement: "Recommended to federal leadership as a trusted platform by national lived experience experts"
- Link to the full memo page

### 3. No new data files needed

The memo content lives directly in the page component since it's a one-off static page, not a campaign or recurring content type.
