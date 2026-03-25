 GEO Audit Report: getoios.com

**Date:** March 23, 2026
**Business Type:** SaaS / B2B — AI Operations Platform for Service Businesses
**Framework:** Next.js (SSR) on Vercel
**Brand:** OIOS by Om#nia Intelligence AI

---

## Composite GEO Score: 28/100 [POOR]

```
 0        25        50        75       100
 |---------|---------|---------|---------|
 ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░  28/100
            ^
```

| Category                    | Weight | Score   | Weighted |
|-----------------------------|--------|---------|----------|
| AI Citability & Visibility  | 25%    | 27/100  | 6.75     |
| Brand Authority Signals     | 20%    | 12/100  | 2.40     |
| Content Quality & E-E-A-T   | 20%    | 38/100  | 7.60     |
| Technical Foundations       | 15%    | 58/100  | 8.70     |
| Structured Data             | 10%    | 0/100   | 0.00     |
| Platform Optimization       | 10%    | 22/100  | 2.20     |
| **TOTAL**                   | **100%** |       | **27.65 → 28** |

**Interpretation:**
- 0-20: Critical — Invisible to AI search
- **21-40: Poor — Minimal AI discoverability** ← OIOS is here
- 41-60: Fair — Some visibility, significant gaps
- 61-80: Good — Solid presence, room to grow
- 81-100: Excellent — Strong AI search visibility

---

## Executive Summary

OIOS has a well-built Next.js website with clear messaging and good sales copy, but it is **effectively invisible to AI search engines**. Three compounding problems drive the low score:

1. **Zero external footprint** — No Reddit, YouTube, Wikipedia, G2, Capterra, news, or forum presence. AI models have no third-party sources to learn about OIOS.
2. **Marketing-first content, not reference-first** — Every statistic is unsourced. Every passage reads as sales copy. AI models prefer authoritative, educational, data-backed content they can cite.
3. **Missing technical signals** — No robots.txt, no sitemap.xml, no llms.txt, no structured data, no canonical tags. The site sends zero proactive signals to help AI crawlers understand it.

**The site is not indexed in Google or Bing.** This is the foundational blocker — every other optimization is pointless until the site is discoverable.

---

## Category Breakdown

### 1. AI Citability & Visibility — 27/100

| Component        | Score  |
|------------------|--------|
| Citability       | 42/100 |
| Brand Mentions   | 12/100 |
| Crawler Access   | 75/100 |
| llms.txt         | 0/100  |

**Top citable passage (62/100):**
> "OIOS is a team of AI agents that runs operations for your service business — answering calls, managing leads, automating follow-ups, tracking revenue, and giving you real-time visibility into every part of your company."

**Key problems:**
- All statistics are unsourced ("40% more booked calls" — based on what?)
- FAQ answers are hidden behind JavaScript accordions — crawlers can't extract them
- Industry pages are thin (one-line taglines, no substantive content)
- Content reads as marketing copy, not authoritative reference material
- **llms.txt completely absent** — no AI-readable site summary exists
- **Brand naming conflict** — "OIOS" is already the UN Office of Internal Oversight Services in all major knowledge bases

**Crawler access is permissive** (75/100) since no robots.txt means default allow. But no sitemap.xml means crawlers must discover pages by link-following, potentially missing deep pages.

---

### 2. Brand Authority Signals — 12/100

| Platform            | Status     | Score |
|---------------------|------------|-------|
| Wikipedia/Wikidata  | Absent     | 0/30  |
| Reddit              | Absent     | 0/20  |
| YouTube             | Absent     | 0/15  |
| LinkedIn            | Minimal    | 5/10  |
| Twitter/X           | Absent     | 0     |
| G2/Capterra/Reviews | Absent     | 0/25  |
| Crunchbase          | Absent     | 0     |
| News/Press          | Absent     | 0     |
| Industry Forums     | Absent     | 0     |

**This is the single biggest gap.** AI models cannot cite what they've never encountered. OIOS exists in a complete vacuum of external validation. Competitors like Avoca have podcast appearances, case studies with named customers, and active community discussion.

---

### 3. Content Quality & E-E-A-T — 38/100

| Dimension        | Score  |
|------------------|--------|
| Experience       | 4/25   |
| Expertise        | 7/25   |
| Authoritativeness| 5/25   |
| Trustworthiness  | 12/25  |

**Critical findings:**

- **Zero case studies.** Not a single named customer, verified result, or before/after metric from a real engagement.
- **No team bios.** The only named person is "Wes" (mentioned once on pricing page with no context). No founder story, no credentials, no photos.
- **Privacy policy returns 404.** Terms of service also 404. For a company requesting phone, email, CRM, and calendar access — this is a dealbreaker.
- **SOC 2 claim unsubstantiated.** The About page claims "SOC 2 Compliant" with no proof, no audit firm named, no certification link.
- **Industry pages are ~70% identical.** HVAC, Plumbing, and Electrical pages share copy-paste content. Search engines devalue this.
- **No blog, no educational content.** Zero informational content for AI to cite.
- **All statistics unsourced.** "62% of HVAC emergency calls go to the first company that answers" — where does this come from?

---

### 4. Technical Foundations — 58/100

| Area                    | Score  | Status   |
|-------------------------|--------|----------|
| Server-Side Rendering   | 82/100 | Good     |
| URL Structure           | 85/100 | Good     |
| Security Headers        | 80/100 | Good     |
| Mobile Optimization     | 75/100 | Fair     |
| Response & Status       | 70/100 | Fair     |
| Core Web Vitals Risk    | 60/100 | Fair     |
| Meta Tags & Indexability| 40/100 | Poor     |
| Additional Checks       | 35/100 | Poor     |
| Crawlability            | 20/100 | Critical |

**What's working:**
- Next.js SSR delivers full HTML content to crawlers
- Clean, semantic URL structure (`/hvac`, `/plumbing`, `/pricing`)
- Strong security headers from Vercel (HSTS, X-Frame-Options, X-Content-Type-Options)
- Brotli compression active

**What's broken:**
- **No robots.txt** (404)
- **No sitemap.xml** (404)
- **No canonical tags** on any page
- **OG tags broken** — every page's `og:url`, `og:title`, `og:description` point to the homepage
- **Duplicate titles** — `/hvac` and `/demo` use the homepage's title tag
- **www redirect uses 307** (temporary) instead of 301/308 (permanent)
- **3 industry pages return 404** (`/roofing`, `/cleaning`, `/garage-door`)
- **No structured data** of any kind

---

### 5. Structured Data — 0/100

**Zero structured data exists on any page.** No JSON-LD, no Microdata, no RDFa.

| Required Schema        | Status  | Impact   |
|------------------------|---------|----------|
| Organization + sameAs  | Missing | Critical |
| SoftwareApplication    | Missing | Critical |
| FAQPage                | Missing | High     |
| WebSite                | Missing | High     |
| Service (industry)     | Missing | High     |
| BreadcrumbList         | Missing | Medium   |
| Person (author)        | Missing | Medium   |
| speakable              | Missing | Medium   |
| Article                | Missing | Low      |

The codebase has zero references to `application/ld+json`, `schema.org`, or any structured data construct. AI models cannot identify OIOS as a software entity, cannot parse the FAQ as Q&A, and cannot resolve the organization's identity.

---

### 6. Platform Optimization — 22/100

| Platform              | Score  | Status   |
|-----------------------|--------|----------|
| Google AI Overviews   | 28/100 | Poor     |
| Google Gemini         | 18/100 | Critical |
| Bing Copilot          | 16/100 | Critical |
| ChatGPT Web Search    | 15/100 | Critical |
| Perplexity AI         | 12/100 | Critical |

**The site is not indexed in Google or Bing.** `site:getoios.com` returns zero results. This means every AI platform that relies on search index data (all of them) cannot discover the site.

**Platform-specific gaps:**
- **Google AIO:** No FAQPage schema, headings aren't question-based, no google-site-verification
- **ChatGPT:** Zero entity recognition — no Wikipedia, no sameAs, no third-party validation
- **Perplexity:** Zero community validation — no Reddit, no forums, no review sites
- **Gemini:** No Google Business Profile, no YouTube, no Knowledge Graph entry
- **Bing Copilot:** No LinkedIn company page, no IndexNow, no Bing Webmaster Tools

---

## Prioritized Action Plan

### Quick Wins (Days 1-7) — Technical foundations

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 1 | **Create robots.txt** with Sitemap directive and explicit AI crawler permissions | Critical | Low |
| 2 | **Create sitemap.xml** listing all pages with lastmod dates | Critical | Low |
| 3 | **Add canonical tags** to every page | Critical | Low |
| 4 | **Submit to Google Search Console** and Bing Webmaster Tools | Critical | Low |
| 5 | **Deploy llms.txt** with curated site summary | Critical | Low |
| 6 | **Fix OG tags** — each page needs its own og:url, og:title, og:description | High | Low |
| 7 | **Fix unique title/description** on /hvac, /demo, and all industry pages | High | Low |
| 8 | **Add Organization + WebSite JSON-LD** to layout.tsx | Critical | Low |
| 9 | **Add FAQPage JSON-LD** to homepage and pricing page | High | Low |
| 10 | **Add SoftwareApplication JSON-LD** to features page | High | Low |
| 11 | **Fix www redirect** from 307 to 301/308 | Medium | Low |
| 12 | **Implement IndexNow** for real-time Bing indexing | Medium | Low |

### Medium-Term (Weeks 2-4) — Content & trust

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 13 | **Fix Privacy Policy and Terms of Service** (both currently 404) | Critical | Medium |
| 14 | **Add team bios and founder story** to About page with credentials | Critical | Medium |
| 15 | **Substantiate SOC 2 claim** — link to report or remove the claim | High | Low |
| 16 | **Add source citations** to all statistical claims across the site | High | Medium |
| 17 | **Create 3 case studies** with named customers and verified metrics | Critical | High |
| 18 | **Differentiate industry pages** — each needs 50%+ unique content | High | High |
| 19 | **Add Service JSON-LD** to all industry pages | High | Medium |
| 20 | **Create Google Business Profile** for Omnia Intelligence AI | High | Low |
| 21 | **Create LinkedIn Company Page** for OIOS | High | Low |
| 22 | **Add publication/update dates** to all content pages | Medium | Low |
| 23 | **Rewrite H2 headings** as question-based for AIO eligibility | Medium | Medium |
| 24 | **Build remaining industry pages** (/roofing, /cleaning, /garage-door) | Medium | Medium |

### Strategic (Months 2-6) — Authority & brand

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 25 | **Launch blog/resource center** — 2-4 posts/month, 1,500+ words each | Critical | High |
| 26 | **Get listed on G2/Capterra** — AI models heavily cite these for "best tool" queries | Critical | Medium |
| 27 | **Build Reddit presence** — participate in r/HVAC, r/Plumbing, r/smallbusiness | High | High |
| 28 | **Launch YouTube channel** — demo videos, customer testimonials, educational content | High | High |
| 29 | **Pursue trade press coverage** — HVAC Business, Plumbing & Mechanical, Contracting Business | High | High |
| 30 | **Publish original research** — "State of AI in Home Services 2026" with proprietary data | High | High |
| 31 | **Create comparison pages** — /oios-vs-jobber, /oios-vs-servicetitan, /oios-vs-answering-service | Medium | Medium |
| 32 | **Address OIOS brand disambiguation** — consistently use "OIOS by Omnia Intelligence AI" | Medium | Low |

---

## Projected Score Impact

| Phase | Actions | Current Score | Projected Score |
|-------|---------|---------------|-----------------|
| Quick Wins (Week 1) | #1-12 | 28/100 | 42-48/100 |
| Medium-Term (Month 1) | #13-24 | 42-48 | 55-62/100 |
| Strategic (Months 2-6) | #25-32 | 55-62 | 72-80/100 |

The fastest gains come from technical foundations (robots.txt, sitemap, schema, canonical tags) which can be implemented in days. The highest-impact work is building external brand presence (G2 listings, Reddit, YouTube, press), which requires sustained effort over months.

---

## Appendix: llms.txt (Ready to Deploy)

```
# OIOS by Omnia Intelligence AI

> OIOS is an AI operations platform for service businesses (HVAC, plumbing, electrical, roofing, and more). It provides six AI departments — receptionist, sales, marketing, operations, finance, and client success — that run 24/7 for a fraction of hiring cost.

## Core Pages
- [What OIOS Does](https://getoios.com/features): Three-pillar platform overview (AI Receptionist, AI Back Office, AI Command Center)
- [How It Works](https://getoios.com/how-it-works): Three-step onboarding process (Audit, Build, Run)
- [Pricing](https://getoios.com/pricing): Pricing plans and comparison
- [About](https://getoios.com/about): Company story, mission, and security commitments

## Industry Solutions
- [HVAC](https://getoios.com/hvac): AI operations for HVAC contractors
- [Plumbing](https://getoios.com/plumbing): AI operations for plumbing businesses
- [Electrical](https://getoios.com/electrical): AI operations for electrical contractors
- [Roofing](https://getoios.com/roofing): AI operations for roofing companies
- [Pest Control](https://getoios.com/pest-control): AI operations for pest control services
- [Locksmith](https://getoios.com/locksmith): AI operations for locksmith services
- [Cleaning](https://getoios.com/cleaning): AI operations for cleaning businesses
- [Garage Door](https://getoios.com/garage-door): AI operations for garage door services
- [Landscape Lighting](https://getoios.com/landscape-lighting): AI operations for landscape lighting

## Optional
- [Book an Audit](https://getoios.com/audit): Free 30-minute AI operations audit
- [Live Demo](https://getoios.com/demo): Interactive product demonstration
```

## Appendix: JSON-LD Templates (Ready to Implement)

### Organization (add to layout.tsx)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://getoios.com/#organization",
  "name": "Omnia Intelligence AI",
  "alternateName": "OIOS",
  "url": "https://getoios.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://getoios.com/logo-oios.jpg",
    "width": 512,
    "height": 512
  },
  "description": "OIOS is an AI-powered operations platform for service businesses. It answers calls 24/7, automates back office workflows, and provides real-time visibility into leads, jobs, and revenue.",
  "email": "team@getoios.com",
  "telephone": "+1-480-305-0357",
  "contactPoint": [{
    "@type": "ContactPoint",
    "telephone": "+1-480-305-0357",
    "email": "team@getoios.com",
    "contactType": "sales",
    "availableLanguage": "English"
  }],
  "sameAs": [
    "REPLACE_WITH_LINKEDIN_URL",
    "REPLACE_WITH_YOUTUBE_URL",
    "REPLACE_WITH_TWITTER_URL"
  ],
  "areaServed": { "@type": "Country", "name": "United States" }
}
```

### FAQPage (add to homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is my business data secure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. All data is encrypted in transit and at rest. We use enterprise-grade infrastructure with SOC 2 compliant providers. Your business data is never shared with third parties or used to train AI models."
      }
    },
    {
      "@type": "Question",
      "name": "How long does setup take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most businesses are up and running within 24 hours. We connect to your phone system, email, and calendar — no software to install, no hardware to buy."
      }
    },
    {
      "@type": "Question",
      "name": "How is this different from Jobber or ServiceTitan?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Those are CRM tools that require your team to log in and operate them. OIOS is an AI team that operates autonomously — answering calls, following up on leads, tracking finances, and running marketing."
      }
    }
  ]
}
```

### SoftwareApplication (add to features page)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://getoios.com/#software",
  "name": "OIOS",
  "alternateName": "OIOS AI Operations Platform",
  "description": "AI-powered operations platform for service businesses. Includes 24/7 AI receptionist, automated scheduling, follow-up automation, CRM management, revenue tracking, and marketing content generation.",
  "url": "https://getoios.com",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web-based (SaaS)",
  "featureList": [
    "24/7 AI Receptionist",
    "Automated Lead Capture",
    "Appointment Scheduling",
    "Follow-Up Automation",
    "Proposal Generation",
    "CRM Management",
    "Revenue Tracking",
    "Marketing Content Generation"
  ],
  "publisher": { "@id": "https://getoios.com/#organization" }
}
```

---

*Generated by GEO Audit Tool — March 23, 2026*
