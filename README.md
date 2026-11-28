# Nanofab Innovations — Website

Marketing website for **Nanofab Innovations Pvt. Ltd.**, built with [Astro 7](https://astro.build) and Tailwind CSS 4.
It builds to plain static HTML, so it can be hosted anywhere: Netlify, Vercel, Cloudflare Pages, S3, or nginx.

See [PLAN.md](PLAN.md) for the goals, site map, task list and the content still needed from the team.

## Run it

Requires **Node.js 22.23.4 or newer** (pinned in `.nvmrc`; with nvm, run `nvm use`).

```bash
npm install
npm run dev        # http://localhost:4321, live reload, shows draft content
npm run build      # production build → dist/
npm run preview    # serve dist/ locally (add --background to keep it running)
npm test           # build, then run the Playwright test suite
```

## Where things live

| What | Where |
|---|---|
| Site-wide copy: services, industries, nav, footer, contact details | `src/data/site.ts` |
| Company legal details (CIN, address, Grievance Officer) | `src/data/site.ts` → `site.legal` |
| Stats, client logos, certifications, testimonials | `src/data/site.ts` → `trust` |
| Manufacturing capability figures | `src/data/capability-specs.ts` |
| FAQ questions and answers | `src/data/faq.ts` |
| Products, blog posts, leadership, case studies | `src/content/<collection>/` (one Markdown file each) |
| Photos (hero, facility gallery, per-service) | `src/assets/photos/` |
| Client logos / certification badges | `src/assets/clients/`, `src/assets/certifications/` |
| Pages | `src/pages/` (file path = URL); inner-page banners take an `art` (illustration) or `image` prop |
| Hero slides, announcement ticker, instant-quote options | `src/data/home.ts` |
| Hero/brand videos and posters | `public/videos/` |
| Home page sections (banner, who we are, bento, scroll story, showreel, industries, blogs, how to order) | `src/components/home/` |
| Shared components (header, footer, forms, map…) | `src/components/` |
| Colours, fonts, dark mode, buttons, cards | `src/styles/global.css` |
| Favicon, OG image, datasheet PDFs | `public/` |

## Common edits

**Sections that stay hidden until filled in.** Stats, client logos, certifications, testimonials, case
studies, the capability-spec tables and the photo gallery render nothing until real data exists. The
Management Team and Case Studies pages are also left out of the menus and the sitemap (and marked
`noindex`) until their first real entry is published, and the Contact page's world map only appears
once `locations` has entries. That
way the site never shows empty or made-up proof. Fill them in and they appear automatically.

**Add a product.** Copy `src/content/products/_example-product.md` to e.g. `iot-gateway.md`
(the URL becomes `/products/iot-gateway`). Put the images **next to the Markdown file** and reference
them as `./photo.jpg`. Astro generates resized WebP versions automatically. Datasheet PDFs go in
`public/datasheets/`. Delete the `draft: true` line to publish.

**Add a case study.** Copy `src/content/case-studies/_example-case-study.md`. Only publish real
projects, and name the client only with permission. The "Case Studies" menu link appears once the first
one is published.

**Add a leader.** Copy `src/content/team/_example-member.md`. Set `role` to one of `leadershipRoles` in
`src/data/site.ts`, and that person's card replaces the "Profile coming soon" placeholder.

**Add photos.**
- `src/assets/photos/facility/*.jpg` fills the "Inside Nanofab" gallery on Home and About. The file name
  becomes the caption: `02-smt-line.jpg` → "Smt line". A leading number sets the order.
- `src/assets/photos/services/<id>.jpg` adds a photo to a service section. The ids are `pcb`,
  `embedded`, `product`, `iot` and `talent`.

**Hero banner slides.** The rolling banner at the top of the home page is defined in `heroSlides` in
`src/data/home.ts`: headline, accent line, bullets, button, background and picture for each slide. All
slides deliberately share one dark style, so the banner never flips between light and dark while it
rolls. Each slide currently shows a Nanofab illustration (`art`). To use a real product photo or 3D render
instead, put it in `public/hero/` (about 1200×900, transparent or dark background) and set the slide's
`image`. Slides roll every 6.5 s and pause on hover, focus or the pause button. The "See how we build"
showreel further down the page is `public/videos/showreel.mp4`.

**Banner photos.** Put a landscape photo or render (ideally ≥2000 px wide) in `src/assets/hero/`, add it to
`src/data/credits.ts` (title, author, licence, source, changes), then set `photo: 'file.jpg'` on a slide in
`src/data/home.ts` or `photo="file.jpg"` on a `<PageHero>`. It's optimised to WebP automatically and blended into the
banner. A test fails if a photo isn't registered, and `/credits` lists every image (that page satisfies CC BY
attribution). Only use images you have the right to use: your own, licensed stock, or open licences (CC0, CC BY,
Unsplash, Pexels). Never use images found on Google or other companies' sites.

**Announcement ticker.** Edit `announcements` in `src/data/home.ts`. Bump `announcementVersion` to
show the bar again to people who dismissed it.

**Instant-quote panel.** Options (layers, finishes, quantities…) live in `quoteOptions` in
`src/data/home.ts`; ask the engineering team to keep them in line with real capabilities. The panel does
not calculate prices. It sends the chosen specs to the Contact form (PCB, stencil, engineering) or to
BOM upload (assembly), pre-filled in the message.

**Add a blog post.** Add a Markdown file to `src/content/blog/` with `title`, `description` and `date`.

**Office locations on the map.** Fill `locations` in `src/data/site.ts` (`name`, `type`: Office / Partner /
Representative, `city`, `lon`, `lat`).

Any entry with `draft: true` appears only in `npm run dev`, never in the production build.

## Configuration (`.env`)

Copy `.env.example` to `.env`, set the values, then rebuild.

| Variable | Purpose |
|---|---|
| `PUBLIC_FORM_ENDPOINT` | Where the Contact and BOM forms POST (`multipart/form-data`, files up to 10 MB). Until set, submitting shows a "not connected yet" notice. Formspree (paid), Basin, Getform or your own API all work. |
| `PUBLIC_ANALYTICS` | `plausible`, `ga4`, or empty for none |
| `PUBLIC_PLAUSIBLE_DOMAIN` / `PUBLIC_PLAUSIBLE_SRC` | Plausible: cookieless, no consent banner needed |
| `PUBLIC_GA4_ID` | Google Analytics 4: loads **only after** the visitor accepts the cookie banner; a "Cookie settings" link appears in the footer |

Analytics events: `contact_enquiry`, `bom_upload` (successful submissions), `quote_start` (instant-quote panel) and `video_play` (showreel).

## Design system

Open **`/styleguide`** on the running site to see every token and component as it renders. The page is not linked anywhere and isn't indexed.

- **Theme:** matches the logo (white surfaces, logo navy with a soft purple glow on dark bands, logo green `#0ac30d` accent with navy text on buttons, square uppercase buttons). Token names `signal-*` are the logo green, `ink-*` the logo navy, `copper-*` a mint highlight.
- **Fonts:** Poppins for headlines and body text, JetBrains Mono for technical labels.
- **Colour, by role:** use semantic tokens in markup, never palette shades for text, surfaces or lines:
  `text-fg` (headings), `text-fg-body`, `text-fg-muted`, `text-fg-subtle`, `text-fg-faint` (decorative only),
  `bg-surface`, `bg-surface-2`, `border-line`, `border-line-strong`, `text-accent` (links, eyebrows),
  `text-accent-2` (copper labels), `--color-danger` (errors). Each role has a light value, a dark-theme value and a
  dark-section value, all defined once in `src/styles/global.css`.
- **Dark sections:** wrap anything dark by design in `.on-dark`. The same token classes then render light-on-dark
  automatically, in both themes.
- **Brand colours** (`ink-*`, `signal-*`, `copper-*`) are fixed and meant for brand surfaces, accents on dark backgrounds
  and illustrations. **Gradients:** `bg-grad-hero | showcase | deep | ocean | teal | night | mission | vision`, or
  `var(--grad-*)` in data. Never paste gradient values into pages.
- **Shape and size:** `rounded-control` (buttons, inputs), `rounded-card`, `rounded-panel`, `rounded-full`. Buttons are
  `btn` + `btn-primary | btn-outline | btn-copper | btn-ghost`, plus optional `btn-sm | btn-lg | btn-pill`.
  Fields: `field` (+ `field-sm`). Don't use `!important` utility overrides.
- **Light/dark:** follows the visitor's device setting. There is no manual switch.
- **Accessibility:** every animation has a reduced-motion fallback. Windows High Contrast (forced colours) falls back to
  system colours, so gradient text and buttons stay visible.
- **Performance:** off-screen banner slides and the sections below the scroll story use `content-visibility` (`.cv-auto`) so the browser skips rendering them until needed. Don't add it above sticky sections (it changes their position while scrolling). The two main fonts are preloaded to avoid layout shift.
- **Effects:** `data-spotlight` (cursor glow on dark sections) and `.trace` (glowing edge on hover). Pages fade
  between each other with native view transitions.

## Quality checks

- `npm test` builds the site and runs the Playwright suite (139 tests on desktop and mobile):
  - every page loads without errors, overflow or missing alt text
  - internal links, forms, quote flows, carousel, theme menu, mobile menu
  - an **axe accessibility audit of every page in light and dark themes**
  - a **design-system check** that fails if a hardcoded colour, raw grey class, retired class, palette variable or
    `!important` override is added outside the illustration files
  - **visual regression snapshots** of key pages in light and dark (`tests/visual.spec.ts`)
- After an intentional design change, refresh the snapshots with
  `npx playwright test tests/visual.spec.ts --update-snapshots`, then review and commit the new images. Snapshots are
  rendered with the local Chrome on Linux; regenerate them if your CI uses a different browser build.
- Lighthouse (mobile, 26 Nov 2026): accessibility, best practices and SEO **100**; performance in the 90s, measured
  locally without compression.

## Hosting on Bluehost (dashboard, forms, visitor email)

The production site is intended for Bluehost: see **[DEPLOY-BLUEHOST.md](DEPLOY-BLUEHOST.md)**. `npm run package` builds
the site plus the PHP dashboard and form handler in `server/`. Test the package on Apache + PHP with
`npm run package && tests/bluehost_check.sh` (needs Docker). The dashboard and cookie email box exist only in this build,
not in `npm run preview`.

## Deployment (GitHub Pages preview)

`.github/workflows/deploy.yml` builds the site, runs the functional and accessibility tests, and deploys to GitHub
Pages on every push to `main`. **A deploy only happens if the tests pass.** Check progress in the repository's
**Actions** tab.

- **One-time setup:** repository **Settings → Pages → Source: GitHub Actions**.
- **Preview vs live:** the site deploys as a hidden preview (`noindex`, robots.txt blocks crawlers). To launch, add
  the repository variable `SITE_MODE` = `production` (Settings → Secrets and variables → Actions → Variables) and
  re-run the workflow.
- **Optional repository variables:** `FORM_ENDPOINT` (contact/BOM forms), `ANALYTICS` + `PLAUSIBLE_DOMAIN` or
  `GA4_ID`.
- **Custom domain:** Settings → Pages → Custom domain, then add the DNS record GitHub shows at your domain registrar.
- The site address (and sub-folder, if any) is detected automatically by the workflow.



- [x] Official logo in place (`src/assets/brand/nanofab-logo.jpg`, `public/favicon.png`); ask for an SVG and a square icon version
- [ ] Set the real domain in `astro.config.mjs` (`site`) and `public/robots.txt`
- [ ] Set `PUBLIC_FORM_ENDPOINT` (and analytics, if wanted)
- [ ] Fill `site.legal` (CIN, registered address, Grievance Officer) and contact details
- [ ] Counsel reviews the legal pages, then set `site.legal.reviewedByCounsel = true`
- [ ] Add photos, products, team profiles, case studies, stats and capability figures
- [ ] Review the FAQ answers and the confidentiality statements on the BOM page and Privacy Policy
