# GEO Audit Report: Redwoods Landscape Lighting

**Audit Date:** March 23, 2026
**URL:** https://www.redwoodslighting.com/
**Business Type:** Local Business / B2B Manufacturer (Landscape Lighting)
**Pages Analyzed:** 6
**Platform:** Wix (Thunderbolt Framework)

---

## Executive Summary

**Overall GEO Score: 25/100 (Poor)**

Redwoods Landscape Lighting is a real business with real products (11 fixture models, a mobile app with 208 ratings at 4.8 stars, and an established dealer network through Outdoor Lighting Perspectives), but it is **virtually invisible to AI systems**. The root cause is a Wix Thunderbolt-powered website that delivers JavaScript shells instead of crawlable content, combined with zero meta descriptions, minimal schema markup, no llms.txt, and near-zero off-site brand presence (no YouTube, no Reddit, no Wikipedia, no trade press coverage). When a professional asks ChatGPT or Perplexity "What landscape lighting brands use brass fixtures?", Redwoods will not appear in the response.

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability | 18/100 | 25% | 4.5 |
| Brand Authority | 28/100 | 20% | 5.6 |
| Content E-E-A-T | 14/100 | 20% | 2.8 |
| Technical GEO | 48/100 | 15% | 7.2 |
| Schema & Structured Data | 17/100 | 10% | 1.7 |
| Platform Optimization | 27/100 | 10% | 2.7 |
| **Overall GEO Score** | | | **24.5 → 25/100** |

### Platform Readiness

| AI Platform | Score | Status |
|---|---|---|
| Google AI Overviews | 24/100 | Poor |
| ChatGPT Web Search | 22/100 | Poor |
| Perplexity AI | 18/100 | Critical |
| Google Gemini | 30/100 | Poor |
| Bing Copilot | 25/100 | Poor |

---

## Critical Issues (Fix Immediately)

### 1. Zero Meta Descriptions on Any Page
**Severity:** Critical
**Pages Affected:** All 6 pages

No page on the entire site has a `<meta name="description">` tag. This is the most basic SEO requirement — it gives search engines and AI systems explicit control over how the site appears in results. AI models use meta descriptions as primary text snippets for entity understanding.

**Fix:** Add unique, keyword-rich meta descriptions (150-160 characters) to every page:
- **Homepage:** "Redwoods Landscape Lighting designs premium brass landscape lighting fixtures with Cree LEDs for professional installers. Based in Augusta, GA. Ships USA & Canada."
- **Products:** "Shop 11 professional landscape lighting fixtures — path lights, spotlights, accent lights, and the Bonsai Color Series with app-controlled RGB color changing."
- **About:** "Founded in 2018 by TJ Lucero (ex-Apple, ex-John Deere), Redwoods Landscape Lighting manufactures non-recycled brass fixtures in Augusta, GA."
- **Materials:** "Non-recycled brass construction with Cree LED technology — learn why Redwoods fixtures outlast recycled-aluminum competitors."
- **Contact:** "Find a certified Redwoods Pro Install Partner near you. Professional landscape lighting dealers across the USA and Canada."
- **Resources:** "Product guides, installation manuals, and technical documentation for Redwoods landscape lighting fixtures and the Bonsai Color Series."

### 2. JavaScript Rendering Blocks AI Crawlers from Content
**Severity:** Critical
**Pages Affected:** All 6 pages (partial SSR on homepage)

The Wix Thunderbolt framework delivers a 453KB HTML payload that is mostly framework code. While some SSR text content exists on the homepage (hero text, section headings, product names), it is buried in deeply nested `<span>` elements without semantic HTML structure. Inner pages (/about, /products, /materials, /resources, /contact) render content almost entirely via client-side JavaScript.

AI crawlers (GPTBot, ClaudeBot, PerplexityBot) **do not execute JavaScript** and will see empty pages for most of the site. Even GoogleBot's JS rendering is delayed and unreliable for content-heavy Wix sites.

**Fix Options:**
1. **Best:** Migrate to a platform with true SSR (Next.js, Astro, Hugo, WordPress)
2. **Interim:** Verify Wix's SEO/SSR settings are properly enabled; ensure all content appears in `curl` output
3. **Immediate workaround:** Create `/llms.txt` and `/llms-full.txt` files with complete site content in plain text

### 3. No llms.txt File
**Severity:** Critical
**URL:** https://www.redwoodslighting.com/llms.txt → 404

The llms.txt standard provides AI crawlers a structured, JavaScript-free summary of the business. Given the JS rendering barrier, this is especially critical for Redwoods — it's the fastest way to give AI models accurate information.

**Fix:** Deploy this file at `/llms.txt`:

```
# Redwoods Landscape Lighting

> Premium low-voltage landscape lighting fixtures designed in Augusta, GA for professional installers. Non-recycled brass construction with Cree LEDs. B2B sales through approved Pro Install Partners across the USA and Canada.

## Products
- [Landscape Lighting Fixtures](https://www.redwoodslighting.com/products): Full product line including Elm, Magnolia, Aspen, Redwood, Azalea, Pine, Lotus, Dogwood, Palmetto, Almond path/spot/accent lights
- [Bonsai Color Series](https://www.redwoodslighting.com/products): App-controlled RGB color-changing landscape and roofline lighting system

## Materials & Quality
- [Materials](https://www.redwoodslighting.com/materials): Non-recycled brass construction, Cree LED technology, designed for durability

## About
- [Our Story](https://www.redwoodslighting.com/about): Founded 2018 by TJ Lucero in Augusta, GA. Former Apple and John Deere operations manager.

## Resources
- [Product Guides](https://redwoodslighting.stonly.com/kb/en/product-guides-35714): Installation guides, Bonsai setup, Zigbee gateway configuration
- [Redwoods Connect App](https://apps.apple.com/us/app/redwoods-connect/id1474671455): Smart control app for Bonsai Color Series (iOS/Android)

## Contact
- [Find a Pro Install Partner](https://www.redwoodslighting.com/contact): Dealer/installer locator
- Email: info@redwoodslighting.com

## Social
- [Facebook](https://www.facebook.com/redwoodslighting/)
- [Instagram](https://www.instagram.com/redwoodslighting/)
- [LinkedIn](https://www.linkedin.com/company/redwoods-landscape-lighting)
```

### 4. No Phone Number Anywhere on the Site
**Severity:** Critical

A local service/manufacturing business without a visible phone number is a major trust failure. No phone number appears in extractable HTML, meta tags, or structured data. The `telephone` property is missing from the LocalBusiness schema, which means the schema is **not eligible for Google rich results**.

**Fix:** Add phone number to the homepage header, contact page, footer, and LocalBusiness JSON-LD schema.

---

## High Priority Issues

### 5. Title Tags Are Generic and Too Short
**Severity:** High
**Pages Affected:** All 6 pages

Current titles waste the most important on-page SEO signal:
- "Home | Redwoods Lighting" (25 chars — starts with "Home")
- "Our Story | Redwoods Lighting" (30 chars)
- "Products | Redwoods Lighting" (29 chars — lacks "landscape lighting fixtures")
- "Materials | Redwoods Lighting" (30 chars — vague)

**Fix:** Lead with primary keywords:
- "Professional Landscape Lighting Fixtures | Redwoods Lighting" (60 chars)
- "Our Story — Augusta GA Landscape Lighting Manufacturer | Redwoods" (65 chars)
- "Brass Landscape Lighting Fixtures & Bonsai Color Series | Redwoods" (66 chars)
- "Non-Recycled Brass & Cree LED Materials | Redwoods Lighting" (59 chars)

### 6. LocalBusiness Schema Missing Critical Properties
**Severity:** High

The homepage LocalBusiness JSON-LD has only `name`, `url`, `image`, and `address`. Missing:
- `telephone` (required for rich results)
- `email` (info@redwoodslighting.com — found on the site but not in schema)
- `openingHours`
- `geo` (latitude/longitude for Augusta, GA)
- `description`
- `priceRange`
- `areaServed` (USA and Canada per About page)
- `sameAs` (LinkedIn, Facebook, Instagram, Google Business Profile)
- `founder` (Person schema for TJ Lucero)
- `foundingDate` (2018)

**Fix:** Replace with comprehensive LocalBusiness schema (see Schema Deep Dive section).

### 7. Zero Schema Markup on Inner Pages
**Severity:** High
**Pages Affected:** /about, /contact, /products, /materials, /resources

Only the homepage has JSON-LD. The Products page has no Product schema despite listing 11 fixtures. The About page has no Person schema for the founder. No page has BreadcrumbList.

**Fix:**
- `/products`: Add Product schema for each of the 11 fixtures
- `/about`: Add Person schema for TJ Lucero with credentials
- All inner pages: Add BreadcrumbList schema
- Add Service schema to homepage

### 8. Name Inconsistency Between Schemas
**Severity:** High

The LocalBusiness schema uses "Redwoods Landscape Lighting" while the WebSite schema uses "Redwoods Lighting." This confuses entity resolution for AI models.

**Fix:** Use "Redwoods Landscape Lighting" as the primary `name` in both schemas, with `alternateName: "Redwoods Lighting"`.

### 9. No YouTube, Reddit, or Wikipedia Presence
**Severity:** High

These are the three highest-weight platforms for AI training data and citation:
- **YouTube:** Zero videos, no channel. A product manufacturer with no demonstration videos is invisible to Google Gemini.
- **Reddit:** Zero mentions in r/landscaping (1.6M members), r/HomeImprovement (6M), or any lighting subreddits. Perplexity AI weights Reddit heavily.
- **Wikipedia:** No article. Not feasible immediately but should be a long-term goal.

**Fix:**
- Launch YouTube channel with product demos, installation tutorials, before/after projects
- Begin authentic Reddit participation in relevant subreddits
- Build toward Wikipedia notability through trade press coverage

### 10. Only 6 Pages — Extremely Thin Site
**Severity:** High

For a B2B manufacturer with 11 product models, 6 pages is skeletal. Competitors have 20-50+ pages. AI systems need substantial, crawlable content to build topical authority.

**Missing pages:**
- Individual product pages (11 products × 1 page each)
- Detailed materials/technology page
- FAQ page
- Portfolio/gallery of installations
- Blog/educational content
- Service area pages
- Installation guides (currently on external Stonly platform)

**Fix:** Expand to 25+ pages. Migrate Stonly knowledge base content to the primary domain.

---

## Medium Priority Issues

### 11. Missing og:description and twitter:description
**Severity:** Medium
**Pages Affected:** All pages

Open Graph and Twitter Card tags exist but lack descriptions. Social sharing and AI preview snippets have no descriptive text.

### 12. Heading Hierarchy Uses Styled Spans Instead of Semantic HTML
**Severity:** Medium
**Pages Affected:** Homepage

Key section headings like "What We Offer," "Why Choose Redwoods," and "Unleash The Light" are rendered as styled `<span>` elements instead of proper H1-H6 tags. Only one `<h3>` found in homepage HTML. AI crawlers rely on heading hierarchy for content comprehension.

**Fix:** In Wix editor, set section headings as proper heading elements (H1, H2, H3).

### 13. No AI Crawler Directives in robots.txt
**Severity:** Medium

No explicit rules for GPTBot, ClaudeBot, PerplexityBot, Google-Extended, or other AI crawlers. The default `Allow: /` applies, but this is a passive non-decision rather than intentional policy.

**Fix:** Add explicit `User-agent` directives for major AI crawlers with `Allow: /` to signal proactive openness.

### 14. Missing Page in Sitemap
**Severity:** Medium

`/become-a-pro-install-partner` returns 200 OK and is linked in navigation but is absent from the XML sitemap.

### 15. Address Inconsistency
**Severity:** Medium

Website schema shows "3825 Wrightsboro Road" while LinkedIn shows "4278 Belair Frontage Rd." NAP inconsistency undermines local SEO trust signals.

### 16. Product Documentation on External Platform
**Severity:** Medium

Product guides and technical documentation are hosted on `redwoodslighting.stonly.com` (a third-party knowledge base). This content provides zero SEO or AI citability value to the primary domain.

**Fix:** Migrate all documentation to the primary domain as server-rendered pages.

### 17. Missing Security Headers
**Severity:** Medium

Missing: Content-Security-Policy, X-Frame-Options, Referrer-Policy, Permissions-Policy. These are platform-level (Wix) limitations but affect trust signals.

### 18. Core Web Vitals Risk
**Severity:** Medium

- 453KB HTML payload (excessive for a 6-page brochure site)
- Zero images use `loading="lazy"`
- 62 script tags, most without async/defer
- No `<link rel="preload">` for critical resources
- Font-display: swap causes text reflow (CLS risk)

### 19. Outdated Copyright Year
**Severity:** Medium

Footer shows "© 2024 Redwoods Landscape Lighting" — should be 2026. Suggests the site isn't actively maintained.

---

## Low Priority Issues

### 20. No Bing Webmaster Tools Verification
**Severity:** Low

No `msvalidate.01` meta tag detected. No IndexNow protocol support.

### 21. LinkedIn Company Page Under-Optimized
**Severity:** Low

Company page exists (2-10 employees) but has minimal activity and incomplete information.

### 22. Facebook Reviews Minimal
**Severity:** Low

Facebook page has 875 likes but only 2 visible reviews. Low engagement for a B2B manufacturer.

### 23. App Store Listing Not Leveraged
**Severity:** Low

Redwoods Connect app has 208 ratings at 4.8 stars — one of the strongest brand signals available — but is not referenced or linked from the website schema.

---

## Category Deep Dives

### AI Citability (18/100)

The Wix Thunderbolt framework is the primary barrier. AI crawlers receive JavaScript shells with framework code instead of readable content. Even the SSR fragments on the homepage are buried in deeply nested Wix markup without semantic structure.

**Content Block Analysis:**

| Block | Location | Citability Score | Issue |
|---|---|---|---|
| "Unleash The Light" hero | Homepage | 10/100 | Generic marketing tagline, not an answer to any query |
| Product names (11 fixtures) | Homepage/Products | 8/100 | Names only, no descriptions, specs, or context |
| "Why Choose Redwoods" | Homepage | 10/100 | Heading visible, body text JS-dependent |
| Founder story (TJ Lucero) | About page | 34/100 | Rich narrative but entirely JS-rendered |
| Bonsai Color Series | Products | 28/100 | Product info exists but only on third-party sites |
| Materials page | /materials | 0/100 | Entire content JS-rendered |
| Resources page | /resources | 0/100 | Entire content JS-rendered |

**Citation-ready passages (score >70):** NONE

**Key Recommendations:**
1. Every product page needs a 2-3 sentence self-contained description answering "What is [product] and what is it used for?"
2. Add technical specifications: wattage, lumen output, beam angle, voltage, material, finish options, dimensions
3. Create FAQ content with question-based headings and concise direct-answer paragraphs
4. Add comparison tables (Redwoods brass vs. competitor aluminum) — Google AI Overviews frequently pulls table content

### Brand Authority (28/100)

**Platform Presence Map:**

| Platform | Status | Details |
|---|---|---|
| Wikipedia | Absent | No article, no mentions |
| Reddit | Absent | Zero mentions across all subreddits |
| YouTube | Absent | No channel, no videos |
| LinkedIn | Present (Minimal) | Company page, 2-10 employees, founded 2018 |
| Facebook | Present (Minimal) | 875 likes, 2 reviews, active posting |
| Instagram | Present (Minimal) | @redwoodslighting, 597 followers |
| Google Business | Present (Minimal) | 4.4 stars, limited reviews |
| App Store | Present (Strong) | Redwoods Connect: 4.8 stars, 208 ratings |
| Yelp | Absent | Not found |
| BBB | Absent | Not listed |
| Houzz | Absent | Not found |
| Angi/HomeAdvisor | Absent | Not found |
| Trade Press | Absent | No coverage in lighting trade publications |
| Industry Directories | Minimal | AOLP certified professional, ContractorLink (unclaimed) |

**Strongest Signal:** App Store listing (4.8 stars, 208 ratings) — genuinely unique differentiator most competitors lack.

**Third-Party Mentions Found:**
- Outdoor Lighting Perspectives of Jacksonville: partnership blog post (2019)
- Outdoor Lighting Perspectives of Pittsburgh: Bonsai fixture video reference
- theClubhou.se: Founder profile (2019)
- ImportGenius: 27 import shipments documented
- ZoomInfo: Basic company listing

### Content E-E-A-T (14/100)

| Dimension | Score | Key Evidence |
|---|---|---|
| **Experience** | 3/25 | No portfolio, case studies, before/after photos, or project descriptions accessible |
| **Expertise** | 5/25 | Founder TJ Lucero identified via LinkedIn; podcast on "Lighting For Profits"; no credentials on site |
| **Authoritativeness** | 4/25 | No BBB, no awards, no media mentions; 8 years operating history (founded 2018) |
| **Trustworthiness** | 6/25 | HTTPS present, physical address in schema; missing phone, email, hours, privacy policy |

**Critical E-E-A-T Gaps:**
- Founder's impressive background (Apple iPhone Operations PM, John Deere) is only discoverable via LinkedIn, not on the website
- Zero customer testimonials or reviews on the website
- No project portfolio despite being a visual product business
- No certifications displayed (AOLP membership exists but isn't shown)
- No author attribution on any page
- Address discrepancy between website and LinkedIn
- No privacy policy or terms of service detected

### Technical GEO (48/100)

| Category | Score | Status |
|---|---|---|
| Server-Side Rendering | 55/100 | Partial SSR — core text on homepage is server-rendered but buried in framework markup |
| Meta Tags & Indexability | 40/100 | Zero meta descriptions; titles too short/generic |
| Crawlability | 55/100 | Robots.txt and sitemap OK; JS rendering degrades effective crawlability |
| Security Headers | 40/100 | Missing CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy |
| Core Web Vitals Risk | 35/100 | 453KB HTML, 62 scripts, no lazy loading, CLS risk from font-display:swap |
| Mobile Optimization | 65/100 | Viewport tag correct, responsive images present, but heavy payload |
| URL Structure | 85/100 | Clean, readable, consistent, flat hierarchy |
| Response & Status | 90/100 | All pages 200 OK, proper redirects, HTTP/3 support |

**Positive Technical Findings:**
- All AI crawlers receive 200 OK responses (no differential blocking)
- HTTPS enforced with HSTS (1-year max-age)
- Fastly CDN with proper cache control
- Clean URL structure with proper canonical tags
- Sitemap present and referenced in robots.txt
- Self-referencing canonicals on all pages

### Schema & Structured Data (17/100)

**Detected Schema:**

| Type | Page | Status |
|---|---|---|
| LocalBusiness | Homepage | Present — severely incomplete (missing telephone, email, geo, hours, sameAs) |
| WebSite | Homepage | Present — minimal (missing SearchAction, description, publisher) |
| Product | /products | **MISSING** — 11 products with no schema |
| Service | Any | **MISSING** — service business with no Service schema |
| Person | /about | **MISSING** — founder story with no Person schema |
| FAQPage | Any | **MISSING** — no FAQ content or schema |
| BreadcrumbList | Any | **MISSING** — no navigation schema on any page |
| Article | /resources | **MISSING** — no content schema |

**sameAs Entity Linking:** Zero links. This is the single most damaging gap for AI entity recognition. Without `sameAs`, AI models cannot cross-reference "Redwoods Landscape Lighting" as a verified entity.

### Platform Optimization (27/100)

**Google AI Overviews (24/100):** No question-based content, no comparison tables, no FAQ sections, poor indexing (only 1 result in site: search). The site lacks the structured, answer-oriented content Google AIO requires.

**ChatGPT Web Search (22/100):** Entity recognition is weak — no Wikipedia, no Wikidata, no sameAs links. Content lacks factual, quotable statements with statistics. No author bylines or publication dates. No llms.txt.

**Perplexity AI (18/100):** The weakest platform. Zero Reddit presence is devastating — Perplexity heavily weights community-validated content. No forum discussions reference the brand. The Wix JS rendering blocks PerplexityBot from extracting content.

**Google Gemini (30/100):** The strongest platform due to Google ecosystem signals (Google Play app, Google Business listing). However, no YouTube channel, no Knowledge Panel, and the 6-page site is far too thin for topical authority.

**Bing Copilot (25/100):** No Bing Webmaster Tools verification, no IndexNow support. LinkedIn presence is the strongest Microsoft ecosystem signal but is under-optimized.

---

## Quick Wins (Implement This Week)

1. **Add meta descriptions to all 6 pages** — zero effort in Wix's SEO panel, massive impact across all AI platforms. Use the descriptions provided in Critical Issue #1.

2. **Deploy `/llms.txt`** — upload the provided template as a plain text file to the site root. Bypasses the JS rendering barrier for all AI crawlers. ~30 minutes of work.

3. **Add `telephone` and `email` to LocalBusiness schema** — in Wix's SEO settings or custom code, update the JSON-LD. Makes the schema eligible for Google rich results.

4. **Fix the title tags** — in Wix's SEO panel, update each page title to lead with primary keywords instead of generic labels. ~15 minutes.

5. **Update copyright year to 2026** — in the footer. Trivial but signals active maintenance.

---

## 30-Day Action Plan

### Week 1: Foundation Fixes (Technical Quick Wins)
- [ ] Add meta descriptions to all 6 pages
- [ ] Deploy `/llms.txt` file at site root
- [ ] Update all page title tags with keyword-rich versions
- [ ] Add `telephone`, `email`, `geo`, `openingHours`, `description`, and `sameAs` to LocalBusiness schema
- [ ] Fix WebSite schema name to match LocalBusiness ("Redwoods Landscape Lighting")
- [ ] Add `og:description` and `twitter:description` to all pages
- [ ] Update copyright year to 2026
- [ ] Add `/become-a-pro-install-partner` to sitemap
- [ ] Standardize business address across website and LinkedIn

### Week 2: Content Expansion
- [ ] Create individual product pages for all 11 fixtures with descriptions, specs, and images
- [ ] Add Product schema (JSON-LD) to each product page
- [ ] Migrate Stonly knowledge base content to primary domain
- [ ] Add founder bio with credentials to About page (name, background, headshot)
- [ ] Add Person schema for TJ Lucero on About page
- [ ] Create FAQ page with 15-20 common questions about landscape lighting
- [ ] Add FAQPage schema to FAQ content

### Week 3: Brand Building
- [ ] Launch YouTube channel — upload 3-5 product demo/installation videos
- [ ] Claim and optimize Google Business Profile (photos, posts, review solicitation)
- [ ] Register with Bing Webmaster Tools and submit sitemap
- [ ] Begin authentic Reddit participation in r/landscaping, r/HomeImprovement
- [ ] Claim/create listings on BBB, Houzz, Angi
- [ ] Add BreadcrumbList schema to all inner pages
- [ ] Add explicit AI crawler directives to robots.txt

### Week 4: Authority & Content Marketing
- [ ] Publish 2-3 educational blog posts (lighting design principles, brass vs. aluminum, LED technology)
- [ ] Add Article schema to blog posts with author attribution and dates
- [ ] Create a project portfolio/gallery page with 5-10 installation showcases
- [ ] Pitch Bonsai Color Series story to landscape lighting trade publications
- [ ] Optimize LinkedIn company page with complete description and regular posting
- [ ] Create comparison table content (Redwoods vs. big-box alternatives)
- [ ] Add Service schema to homepage

---

## Appendix: Pages Analyzed

| URL | Title | Status | GEO Issues |
|---|---|---|---|
| https://www.redwoodslighting.com/ | Home \| Redwoods Lighting | 200 | No meta description, generic title, incomplete schema, JS rendering, no heading hierarchy |
| https://www.redwoodslighting.com/about | Our Story \| Redwoods Lighting | 200 | No meta description, no schema, JS rendering, no author attribution, no Person schema |
| https://www.redwoodslighting.com/products | Products \| Redwoods Lighting | 200 | No meta description, no Product schema, JS rendering, no specs, generic title |
| https://www.redwoodslighting.com/materials | Materials \| Redwoods Lighting | 200 | No meta description, no schema, JS rendering, vague title |
| https://www.redwoodslighting.com/resources | Resources \| Redwoods Lighting | 200 | No meta description, no schema, JS rendering, vague title |
| https://www.redwoodslighting.com/contact | Find a Pro Install Partner \| Redwoods Lighting | 200 | No meta description, no schema, JS rendering, no phone/email in HTML |

**Not in Sitemap but Exists:**

| URL | Title | Status | Notes |
|---|---|---|---|
| https://www.redwoodslighting.com/become-a-pro-install-partner | (JS-rendered) | 200 | Linked in navigation, missing from sitemap |

---

## Appendix: External Brand Presence

| Source | URL | Type |
|---|---|---|
| LinkedIn (Company) | https://www.linkedin.com/company/redwoods-landscape-lighting | Social |
| LinkedIn (Founder) | https://www.linkedin.com/in/tjlucero | Social |
| Facebook | https://www.facebook.com/redwoodslighting/ | Social |
| Instagram | https://www.instagram.com/redwoodslighting/ | Social |
| App Store (iOS) | https://apps.apple.com/us/app/redwoods-connect/id1474671455 | App |
| Google Play | https://play.google.com/store/apps/developer?id=Redwoods+Landscape+Lighting,+LLC | App |
| Stonly Knowledge Base | https://redwoodslighting.stonly.com/kb/en/product-guides-35714 | Documentation |
| theClubhou.se (Founder) | https://www.theclubhou.se/new-blog/2019/8/23/tjlucero-redwoods | Profile |
| OLP Jacksonville (Partnership) | https://www.outdoorlights.com/jacksonville/resources/blog/2019/may/outdoor-lighting-perspectives-of-jacksonville-re/ | Mention |
| OLP Pittsburgh (Bonsai Video) | https://www.outdoorlights.com/pittsburgh/resources/video-gallery/olp-pittsburgh-videos/using-the-redwoods-app-with-olp-redwoods-bonsai-/ | Mention |
| ContractorLink | https://contractorlink.pro/redwoods-landscape-lighting | Directory |
| ZoomInfo | https://www.zoominfo.com/c/redwoods-landscape-lighting-llc/480484783 | Directory |
| ImportGenius | https://www.importgenius.com/importers/redwoods-landscape-lighting | Trade Data |
| GA Business Registration | https://opengovus.com/georgia-business/2622760 | Government |

---

## Appendix: Recommended Schema Templates

### Enhanced LocalBusiness (Replace Existing)

```json
{
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "additionalType": "https://schema.org/ElectricalContractor",
  "name": "Redwoods Landscape Lighting",
  "alternateName": "Redwoods Lighting",
  "url": "https://www.redwoodslighting.com",
  "telephone": "[ADD PHONE NUMBER]",
  "email": "info@redwoodslighting.com",
  "description": "Redwoods Landscape Lighting designs and manufactures premium low-voltage landscape lighting fixtures with non-recycled brass construction and Cree LEDs for professional installers. Based in Augusta, GA, serving the USA and Canada.",
  "image": "https://static.wixstatic.com/media/452ad3_69ea1762f068467396dacfb984a9c6fe~mv2.png",
  "logo": {
    "@type": "ImageObject",
    "url": "[LOGO URL]"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "3825 Wrightsboro Road",
    "addressLocality": "Augusta",
    "addressRegion": "GA",
    "postalCode": "30909-9543",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "33.4735",
    "longitude": "-82.0105"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "17:00"
    }
  ],
  "priceRange": "$$",
  "areaServed": [
    {
      "@type": "Country",
      "name": "United States"
    },
    {
      "@type": "Country",
      "name": "Canada"
    }
  ],
  "sameAs": [
    "https://www.facebook.com/redwoodslighting/",
    "https://www.instagram.com/redwoodslighting/",
    "https://www.linkedin.com/company/redwoods-landscape-lighting",
    "[GOOGLE BUSINESS PROFILE URL]",
    "[YOUTUBE CHANNEL URL]"
  ],
  "founder": {
    "@type": "Person",
    "name": "TJ Lucero",
    "jobTitle": "Founder",
    "sameAs": "https://www.linkedin.com/in/tjlucero"
  },
  "foundingDate": "2018",
  "knowsAbout": [
    "landscape lighting",
    "outdoor lighting design",
    "LED landscape lighting",
    "brass lighting fixtures",
    "smart landscape lighting",
    "low voltage lighting"
  ]
}
```

### Product Schema (For Each Fixture)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "[PRODUCT NAME, e.g., Elm Path Light]",
  "description": "[2-3 sentence product description]",
  "image": "[PRODUCT IMAGE URL]",
  "brand": {
    "@type": "Brand",
    "name": "Redwoods Landscape Lighting"
  },
  "manufacturer": {
    "@type": "Organization",
    "name": "Redwoods Landscape Lighting",
    "url": "https://www.redwoodslighting.com"
  },
  "category": "Landscape Lighting Fixtures",
  "material": "Non-recycled brass",
  "url": "https://www.redwoodslighting.com/products"
}
```

### Person Schema (For About Page)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "TJ Lucero",
  "jobTitle": "Founder",
  "worksFor": {
    "@type": "HomeAndConstructionBusiness",
    "name": "Redwoods Landscape Lighting",
    "url": "https://www.redwoodslighting.com"
  },
  "url": "https://www.redwoodslighting.com/about",
  "description": "Founder of Redwoods Landscape Lighting. Former Apple iPhone Operations Program Manager and John Deere operations leader. Based in Augusta, GA.",
  "sameAs": [
    "https://www.linkedin.com/in/tjlucero"
  ],
  "knowsAbout": [
    "landscape lighting design",
    "outdoor lighting installation",
    "LED lighting systems",
    "product manufacturing",
    "operations management"
  ]
}
```

---

*Report generated by GEO Audit System — March 23, 2026*
*Methodology: 5-category parallel analysis with weighted composite scoring*
