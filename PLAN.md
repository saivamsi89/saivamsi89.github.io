# Nanofab Innovations Website — Build Plan

## Goal
A fast, professional, multi-page marketing website for **Nanofab Innovations Pvt. Ltd.** that
presents it as a full-stack electronics engineering & manufacturing company, and turns visitors
into enquiries (contact form, quote requests, BOM uploads).

**Tagline:** Engineering Innovation. Enabling Possibilities.

### Success criteria
- Every section of the content brief is live on its own page, with copy as provided.
- Clear calls to action on every page: Start Your Project / Request a Quote / Upload Your BOM.
- Responsive (phone → desktop), accessible (semantic HTML, keyboard nav, contrast), light/fast (static HTML, minimal JS).
- Easy to extend without code changes to layouts: products, blog posts, and team members are content files.
- SEO basics: per-page titles/descriptions, Open Graph tags, sitemap, robots.txt.

## Tech stack
| Choice | Why |
|---|---|
| **Astro 5** (static output) | Multi-page content site, ships almost zero JS, great SEO, content collections for blog/products/team |
| **Tailwind CSS 4** | Consistent design system, fast iteration |
| **Content collections (Markdown)** | Non-developers can add products, blog posts, team profiles |
| Forms → configurable endpoint (`PUBLIC_FORM_ENDPOINT`) | Static site stays host-agnostic; plug in Formspree / own API / CRM later |

## Site map
```
/                   Home
/about              About Us (mission, vision, approach)
/services           Services (5 service groups, product dev process)
/industries         Industries (8 sectors)
/products           Products (catalog from content collection) + /products/[slug]
/capabilities       Engineering Capabilities
/resources          Resources hub
/resources/blog     Engineering blog + /resources/blog/[slug]
/resources/faq      FAQ
/resources/bom-upload  BOM Upload & Quotation tool
/infrastructure     Nanofab Infrastructure — Smart Street Lighting
/team               Management Team
/contact            Contact (form, audience cards, global presence map)
/privacy-policy, /terms, /disclaimer   Legal
/404
```

## Tasks

### Phase 1 — Foundation
- [x] 1. Project scaffold (Astro + Tailwind, folder structure, config)
- [x] 2. Design system: colors, typography, spacing, buttons, cards, section patterns, icons
- [x] 3. Base layout: SEO head, header with responsive nav (mobile menu), footer

### Phase 2 — Core pages
- [x] 4. Home (hero, What We Do, 6-stage journey, Why Nanofab, CTAs)
- [x] 5. About Us
- [x] 6. Services (5 groups + 8-step development process)
- [x] 7. Industries
- [x] 8. Engineering Capabilities
- [x] 9. Infrastructure (Smart Street Lighting)

### Phase 3 — Content-driven pages
- [x] 10. Products catalog + product detail template (specs, datasheet, configurations, enquiry)
- [x] 11. Management Team (profile cards from content; placeholders until real profiles arrive)
- [x] 12. Resources hub, Blog (list + post), FAQ

### Phase 4 — Conversion
- [x] 13. Contact page (full form w/ file attachment, audience cards, global presence map)
- [x] 14. BOM Upload & Quotation tool (file upload, project details, 5-step "how it works")
- [x] 15. Legal pages (placeholder text for legal review) + 404

### Phase 5 — Polish & ship
- [x] 16. SEO: sitemap, robots.txt, Open Graph, favicon
- [x] 17. Build verification (production build passes, links resolve)
- [x] 18. Hand-off: README with how to run, edit content, connect forms, deploy

## Needed from the Nanofab team (blocking final launch, not the build)
- Logo files (SVG preferred) and any brand colours — a placeholder wordmark is used for now
- Product list: names, images, specs, datasheets (PDF), configurations
- Leadership profiles: photo, name, designation, bio, LinkedIn URL
- Office / partner locations for the Global Presence map
- Contact email, phone, address
- Form destination (email inbox, Formspree account, or CRM)
- Legal text reviewed by counsel (Privacy, Terms, Disclaimer)
- Final domain name

---

# Round 2 — Hardening, Credibility & Polish (started 2026-11-23)

### Phase 6 — Platform upgrade
- [x] 19. Install Node.js 22 (via nvm) and pin it in the project (`.nvmrc`, `engines`)
- [x] 20. Upgrade Astro 5 → latest major plus integrations; fix breaking changes; `npm audit` clean

### Phase 7 — Legal review pass (drafting, not a substitute for counsel)
- [x] 21. Privacy Policy rewritten for India's DPDP Act 2023 and IT Act 2000 / SPDI Rules 2011: purposes, consent & withdrawal, data principal rights, Grievance Officer, retention, cross-border transfer, cookies/analytics, children
- [x] 22. Terms & Conditions: quotations, IP and NDA, file uploads, acceptable use, liability, governing law
- [x] 23. Disclaimer tightened; on-site promises (BOM confidentiality, form consent text) aligned with the policy
- [x] 24. Single source for legal entity details (CIN, registered address, grievance contact) in `site.ts`

### Phase 8 — Credibility (Recommendation 2)
- [x] 25. Case studies: content collection, listing page, detail template (problem → solution → result), home and industry teasers
- [x] 26. Trust signals: stats band, client logos, certifications, all data-driven and hidden until real data is filled in
- [x] 27. Capability specs table: PCB fabrication and assembly limits, data-driven, with "on request" fallback
- [x] 28. Real photography support: optional photo slots for hero, about (facility), services; gallery component

### Phase 9 — Technical polish (Section 4)
- [x] 29. Image optimisation: move product/team/case-study images to `astro:assets` (responsive, WebP/AVIF)
- [x] 30. Reveal-animation safety fallback (content never stays hidden)
- [x] 31. Analytics: privacy-friendly and configurable (Plausible or GA4), consent banner for GA4, form-submit events
- [x] 32. Automated tests: Playwright smoke tests (every page 200, no console errors, no overflow, forms validate) + link check
- [x] 33. Lighthouse and accessibility audit, then fix findings
- [x] 34. Dark mode (respects system setting, with toggle)
- [x] 35. Update README / PLAN; final build and verification

---

# Round 3 — Home page redesign (started 2026-11-24)
Goal: move from "template" to a distinctive, premium engineering brand, on the home page first, then roll out.

- [x] 36. Display typeface for headlines (Space Grotesk) and an editorial type scale, applied site-wide
- [x] 37. New hero: oversized headline, angled 3D circuit board, capability marquee
- [x] 38. "Concept to Creation" scroll story: a sticky section where the board is built stage by stage (6 stages)
- [x] 39. Bento "What We Do" grid with custom mini-illustrations instead of icon cards
- [x] 40. Editorial "Why Nanofab" (numbered list) and expanding industry panels
- [x] 41. Micro-interactions: cursor spotlight on dark sections, glowing trace hover, native page transitions
- [x] 42. Reduced-motion and mobile versions of every animation; tests and Lighthouse stay green
- [ ] 43. Review with the team, then roll the new style out to inner pages

---

# Round 4 — Manufacturing-portal homepage (started 2026-11-26)
Reference: JLCPCB's homepage features (quote tool, promo carousel, brand video, ordering steps), rebuilt in
Nanofab's own cleaner, more premium design. No copied branding or text, and no invented prices or stats.

- [x] 44. Brand motion videos: render 3–4 short looping clips (MP4 + WebM + poster) from Nanofab's own graphics; real footage drops into `public/videos/` later
- [x] 45. Hero video carousel: auto-advancing slides with video backgrounds, progress bars, pause/play, arrows, swipe, keyboard; pauses off-screen; reduced-motion fallback
- [x] 46. Instant quote panel: tabs for PCB Fabrication / Assembly / Stencil / Engineering; submits a pre-filled request to Contact or BOM upload (engineer-reviewed, no fake pricing)
- [x] 47. Scrolling announcement bar above the header (dismissible, pausable)
- [x] 48. "How to order" 4-step strip and a featured "See how we build" video section with modal player
- [x] 49. Home FAQ teaser and a floating "Get a quote" button
- [x] 50. Tests, Lighthouse, mobile and dark-mode checks

---

# Round 5 — Rolling banner hero (started 2026-11-26)
Reference: JLCPCB hero (screenshots from the user): sideways-rolling full-width slides, product picture on
the right, headline + bullets + CTA on the left, slim quote bar, side arrows, segmented progress.
Pictures are Nanofab's own illustrations (no third-party images); real photos can replace them per slide.

- [x] 51. Slide pictures: angled PCBs with magnified layer cross-section, IoT device, smart street lighting, pick-and-place assembly
- [x] 52. Rolling carousel: horizontal slide transition with seamless loop, arrows, segmented progress, pause, swipe/keyboard, a video slide
- [x] 53. Slim instant-quote bar in the hero (layers, size, quantity), plus a full quote section (all four tabs) below
- [x] 54. Value tiles strip under the hero; header adapts to light slides
- [x] 55. Tests, mobile, dark mode, Lighthouse

---

# Round 6 — Tighten, unify, finish (started 2026-11-26)
- [x] 56. Trim the home page to one clear story (~9 sections): remove duplicate scrolling strip, merge "Who we are" with "Why Nanofab", move "How to order + quote" to the end, drop repeated blocks
- [x] 57. Picture-led page banner (same style as the home slides) on every inner page
- [x] 58. Services page redesign: sticky section menu with scroll-spy, illustrated service blocks, process timeline
- [x] 59. About page redesign: statement intro, mission/vision feature cards, approach timeline, expertise
- [x] 60. Unfinished pages: hide Team from menus until profiles exist, Products shows real offerings (smart lighting, custom development), Contact map only appears once locations exist
- [x] 61. Tests, mobile, dark mode, Lighthouse

---

# Round 7 — Robust theme / design system (started 2026-11-26)
Audit: 46 hardcoded colours outside artwork, 10 duplicated banner gradients, dark mode via palette
re-dyeing, `!important` button overrides, 5 ad-hoc radii, gradient text invisible in High Contrast, no
regression guardrails.

- [x] 62. Semantic design tokens: text/surface/line colours with explicit light, dark and on-dark values; named brand gradients; radius, shadow and micro type-size tokens
- [x] 63. Migrate pages/components to the tokens (remove hardcoded colours and pasted gradients outside artwork)
- [x] 64. Component variants: button sizes (sm/lg/pill) instead of `!important` overrides; consistent card/panel radii
- [x] 65. Accessibility: High Contrast (forced-colors) fallbacks, 3-way theme switch (System / Light / Dark), automated axe scan of every page in both themes
- [x] 66. Living style guide at /styleguide (noindex) showing tokens and components
- [x] 67. Guardrails: test that blocks new hardcoded colours, visual regression snapshots of key pages in light and dark

---

# Round 8 — Photography, remaining pages, performance (2026-11-26)
- [x] 68. Licensed photo pipeline: banner photos in src/assets/hero/ (auto-optimised, blended into slides and page banners), credits register + /credits page, test that every photo is credited
- [x] 69. First licensed photo (street lamp at dusk, CC BY 2.0) on the Smart Lighting slide and the Infrastructure banner
- [x] 70. Industries redesign (large gradient tiles, related services), Capabilities redesign (rows + prototype→production), Contact "what happens next"
- [x] 71. Performance: off-screen rendering skipped, fonts preloaded, cheaper masks (an attempted global animation-pausing change was reverted because it made things slower)
- [ ] 72. Replace remaining slide illustrations with real imagery: Nanofab's own renders/photos (preferred) or licensed stock chosen by the team
