# 18 — Accessibility, performance and SEO

**Prompt 18 of 20**

## Depends on

Before writing anything, read in this order: `prompts/00_INDEX.md` (at least "Owner decisions", "Design direction" and "Build architecture"), then `prompts/BUILD_LOG.md` (what earlier sessions really did, including deviations). An owner decision recorded in the index overrides any default written in this prompt. If the build log shows a dependency below is unfinished, stop and say so instead of improvising it.

- **Prompts 01–17** — all finished; the site is complete, polished and responsive. The build log names the "admin freeze commit" and says whether prompt 14's surface split was kept.
- Read owner decision **D-05** (the site's domain) in `prompts/00_INDEX.md` before the SEO part; the default is restated below.

## Context

IN-ARCH — *In-Arch Architects & Interior Designer*, Boring Road, Patna, Bihar, led by Principal Architect Ar. Mohammad Hassanuddin — is getting a new public website on an existing React boilerplate that still wears a previous client's brand ("Dulcey Lead Services"). The new brand is warm, quiet, editorial luxury: ivory `#F4EFE7` and espresso `#231B15` (both sampled from the logo), deep charcoal-green `#161E19`, one terracotta accent; Fraunces serif headlines with a single italic terracotta phrase, Manrope for text and UI. Logo files are named for the background they sit ON: `logos/in-arch-logo-light-transparent.png` is the espresso lockup for light backgrounds, `logos/in-arch-logo-dark-transparent.png` the ivory lockup for dark backgrounds, and `logos/in-arch-favicon-light-transparent.png` / `logos/in-arch-favicon-dark-transparent.png` are the "IA" monogram under the same rule. Stack reality: React 18 + Create React App (`react-scripts` 5, plain JavaScript), React Router 7 in `BrowserRouter` mode, CSS Modules, GSAP 3.15 with ScrollTrigger. There is no `db.json`: enquiries are POSTed to `public/api/leads.php` (a JSON-file store) and read by the MUI admin panel at `/admin`.

## Objective

Bring the finished site to its three measurable bars and leave the evidence:

- **Accessibility** — WCAG 2.2 level AA on every public page and state.
- **Performance** — strong Core Web Vitals on a mid-range phone on a mobile network, with explicit budgets.
- **SEO** — a correct title, description, canonical and structured data for every page, a truthful static fallback for crawlers that do not run JavaScript, and a sitemap and robots file that match the routes.

Earlier prompts built to these standards; this one audits everything end to end, fixes what the audit finds, and finalises the static SEO layer that was deliberately left until the page set was complete.

## Scope — files/areas to touch

**May edit**

- Any public component, page, shell or kit file for accessibility or performance fixes (markup semantics, ARIA, focus handling, `sizes`, lazy boundaries, `content-visibility`, imports).
- `src/config/seo.js`, `src/utils/seo.js`, `src/components/common/SEO/SEOHead.jsx`.
- `public/index.html` (meta, the static JSON-LD blocks, preloads), `public/sitemap.xml`, `public/robots.txt`, `public/manifest.json`.
- `public/.htaccess` — **one addition only**: a third tagging rule `RewriteRule ^fonts/ - [E=LONG_CACHE:1]` placed directly after the existing `^static/` and `^images/` tagging rules in section 2c, so the three font files get the same immutable caching. Do not reorder, edit or remove any other line; the `^api/` rule must stay above the SPA fallback.
- `package.json` — remove runtime dependencies that nothing imports any more (verify each by search); add `scripts/set-site-url.js` and its npm script.
- `scripts/qa/` — add `perf-check.js` (below).

**Create** — `scripts/set-site-url.js`, `scripts/qa/perf-check.js`.

**May not** change design, copy (beyond metadata and accessible names), routes, the lead contract, or anything under `src/admin/` or `public/api/`.

## Brand & design requirements

### Design contract — identical in every prompt of this series

- **Colour.** Light surfaces: ivory `#F4EFE7` (page canvas, the logo's ivory), paper `#FAF7F2` (raised surfaces, fields), sand `#E9E3D8` (alternate band), stone `#DAD3C6` (placeholders only). Dark surfaces: forest `#161E19`, forest-2 `#1E2823`, forest-3 `#28342E`. Text on light: espresso `#231B15` (the logo's ink), ink-2 `#4F453D`, ink-3 `#6B6058` (never on stone). Text on dark: ivory `#F4EFE7`, mist `#B9BDB6`, mist-2 `#8E958D` (never on forest-3). Accent: terracotta-700 `#8F4A2B` (small text, links and button fill on light — 5.77:1 on ivory, 5.17:1 on sand), terracotta-500 `#B5653F` (display text ≥ 24 px and decoration on light — 3.75:1), terracotta-300 `#DDA27F` (every accent on dark — 7.74:1 on forest). Lines: `#D8D0C3` hairline and `#8A7F74` control border on light; `#28342E` and `#8E958D` on dark. Feedback: success `#3F6B4F` (`#8FBF9F` on dark), error `#A4372A` (`#F0A090` on dark). Terracotta is never a section background and never covers more than about a tenth of a viewport.
- **Type.** Display: Fraunces variable (axes `opsz` 9–144 and `wght` 300–600, roman + italic), weight 300 at ≥ 40 px and 400 below, tracking −0.02em, `font-optical-sizing: auto`. Text and UI: Manrope variable (300–700), body 400, labels 600. Scale: display-2xl `clamp(2.75rem, 1.2rem + 7.2vw, 8.5rem)` (45 px at 360 → 136 px), display-xl `clamp(2.5rem, 1.35rem + 5.2vw, 6.5rem)` (40 → 104), display-lg `clamp(2rem, 1.3rem + 3.2vw, 4.5rem)` (32 → 72), display-md `clamp(1.625rem, 1.25rem + 1.7vw, 2.75rem)` (26 → 44), display-sm `clamp(1.375rem, 1.2rem + 0.8vw, 1.875rem)` (22 → 30), body-lg `clamp(1.0625rem, 0.98rem + 0.38vw, 1.3125rem)` (17 → 21), body `clamp(1rem, 0.97rem + 0.14vw, 1.0625rem)` (16 → 17), small `0.875rem`, caption `0.8125rem`, label `0.75rem` uppercase with `0.18em` tracking. Line-height 1.02 (2xl, xl), 1.08 (lg), 1.15 (md), 1.2 (sm), 1.65 (body). One italic terracotta phrase per headline, never more. Headings `text-wrap: balance`, body `text-wrap: pretty`, measure ≤ 68ch.
- **Space.** 4 px base: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160, 192. Section rhythm `clamp(5rem, 3rem + 9vw, 12rem)` (80 px at 360 → 192 px); compact rhythm `clamp(3.5rem, 2.5rem + 4.5vw, 7.5rem)`; page gutter `clamp(1.25rem, 0.5rem + 3.4vw, 5rem)` (20 px at 360, 57 px at 1440); content max-width 1680 px.
- **Grid and breakpoints.** 4 columns / 16 px gap below 768 px; 8 columns / 24 px from 768; 12 columns / 32 px from 1024; 40 px gap from 1440. Breakpoints are min-width 768, 1024, 1280, 1440, 1920. Every surface is designed at 360–390 px first and then scaled up.
- **Shape.** Square corners on imagery and sections; 2 px radius on buttons, fields and the dock; 1 px hairlines; no drop shadows except `0 24px 60px rgba(22,30,25,.18)` on overlays.
- **Motion.** Transform and opacity only. Durations 150 / 240 / 400 / 700 / 1000 ms. CSS eases `cubic-bezier(0.22,1,0.36,1)` (out), `cubic-bezier(0.65,0,0.35,1)` (in-out), `cubic-bezier(0.16,1,0.3,1)` (expo). GSAP: `power3.out` for reveals, `expo.out` for headline lines, `power3.inOut` for masks and the page curtain, `none` for scrub. Rise 24 px on mobile / 40 px from 1024; stagger 0.08 s; ScrollTrigger start `top 85%`, once. Under `prefers-reduced-motion: reduce` everything is visible at once with no transforms, parallax, pinning, curtain or marquee. No scroll-smoothing library and no scroll-jacking: the page always moves 1:1 with the finger or wheel.
- **CTA family "wipe & swap".** Rectangular, 2 px radius, min-height 52 px (44 px compact), label Manrope 600 `0.75rem` uppercase tracking `0.14em` plus a 16 px arrow. Hover and focus-visible: a fill layer wipes up from the bottom edge (`scaleY` 0 → 1, 400 ms, expo) while the arrow leaves to the top-right and a duplicate arrives from the bottom-left. Press: `scale(0.98)` for 150 ms. Focus ring: 2 px terracotta (`#8F4A2B` on light, `#DDA27F` on dark) at 3 px offset. Touch devices get the press state only; nothing depends on hover.
- **Navigation — the "Index Dock".** A floating bar fixed to the bottom edge at every breakpoint (Menu + primary CTA + WhatsApp on phones; inline page links + CTA from 1024 px), a full-screen index overlay that rises from the bottom, and a masthead that scrolls with the page and carries only the logo. There is no fixed top bar.
- **Imagery.** The client's own photographs first (13 unique interiors, processed into `public/images/inarch/`). Open-licence photographs are atmosphere only — never in the portfolio, never presented as IN-ARCH work. unDraw illustrations and Icons8 icons appear only where they explain something, recoloured to espresso + terracotta.

### Build rules — identical in every prompt of this series

- New public CSS lives in CSS Modules or in `src/styles/inarch/` with `ia-`-prefixed class names. Components opt in by sitting inside an element that carries the class `ia`; colours come from the tone variables (`--ia-bg`, `--ia-fg`, `--ia-fg-2`, `--ia-fg-3`, `--ia-accent`, `--ia-accent-display`, `--ia-line`, `--ia-line-strong`, `--ia-focus`) that flip with `data-tone="light | sand | paper | dark"`. Never add an unscoped element selector and never edit a legacy global stylesheet.
- Legacy tokens and classes (`--ink`, `--red`, `--grad`, `--admin-*`, `.btn`, `.eyebrow`, `.display`, `.container`, `.section`, `.card`, `.reveal`, …) belong to the old site and to the admin. Do not use them in new code and do not reuse their names.
- Motion goes through `src/motion` (one `useMotionScope` per section, driven by `data-m` attributes). GSAP and its plugins are registered once in `gsapSetup.js`; every tween is created inside a `useGSAP` scope so it is reverted on unmount.
- Business facts come from `studio` in `src/data/siteConfig.js` and the other modules in `src/data/`. Never hard-code a name, phone number, address or service title in a component.
- Photographs are referenced through `src/data/imageManifest.json` and the `Picture` primitive, with explicit `width`/`height`, AVIF + WebP + JPEG sources and a `sizes` attribute. Never load anything from `in-arch images/` or `logos/` at runtime.
- Imports stay relative (Create React App does not honour the `paths` in `jsconfig.json`).

### Part A — Accessibility (WCAG 2.2 AA)

Audit every route and every state (index overlay open, lead modal in each of its five states, lightbox open, an accordion open, the portfolio filtered and empty, the 404, the error state) with axe **and** by hand. The by-hand part matters most:

- **Structure.** `<html lang="en-IN">`; one `h1` per page; no skipped heading level; `header`, `nav` (primary and footer navs distinguished by label), `main`, `footer` landmarks; lists are lists; the facts rail is a `dl`; tables have headers.
- **Keyboard.** Everything operable; order follows the visual order; the skip link is first and works; no trap outside dialogs; dialogs trap, close on Escape and return focus; the dock (first in the DOM, last on screen) makes sense in the order; custom controls (chips, accordions, steppers, lightbox, map facade) respond to the expected keys.
- **Focus.** A visible ring ≥ 3:1 on every stop, on every tone and over photographs; the focused element is never hidden by the dock, a sticky bar or an overlay (2.4.11); focus moves to `<main>` after navigation and the route is announced.
- **Names, roles, states.** Every control has an accessible name that includes its visible label (2.5.3); toggles expose `aria-pressed` / `aria-expanded`; the current page is `aria-current="page"`; icons-only buttons are named; decorative images and icons are hidden from the tree.
- **Forms.** Programmatic labels; `autocomplete` tokens (`name`, `tel-national`, `email`); required state exposed; errors identified in text, tied to the field and announced; no information by colour alone; a draft is kept so nothing has to be re-entered (3.3.7).
- **Contrast.** Measure, do not assume: body and small text ≥ 4.5:1; large text ≥ 3:1; text over photographs at its worst pixel; placeholders ≥ 4.5:1; field borders, chips, icons that carry meaning and focus rings ≥ 3:1 (1.4.11). The token pairs that pass are in the design contract — terracotta-500 only at ≥ 24 px on light tones; ink-3 never on stone; mist-2 never on forest-3.
- **Pointer and motion.** Targets ≥ 24 × 24 px minimum and 44 × 44 by design (2.5.8); every swipe or drag has a button alternative (2.5.7); nothing flashes; nothing auto-moves for more than five seconds; reduced motion is honoured everywhere.
- **Reflow, zoom, spacing** (re-confirm prompt 17's results) and **consistent help** (3.2.6): the ways to reach the studio appear in the same places on every page — the dock, the footer.
- **Announcements.** Form results, filter results and route changes use polite live regions; errors use `role="alert"`.

### Part B — Performance

Budgets, measured on the PHP-served production build at 390 × 844 with "Fast 4G" network and 4× CPU throttling, cold cache, for `/`, `/about`, `/expertise`, `/interior-design`, `/portfolio`, one case study and `/contact`:

| Metric | Budget |
|---|---|
| Largest Contentful Paint | ≤ 2.5 s |
| Cumulative Layout Shift (full scroll) | ≤ 0.05 |
| Interaction to Next Paint (open overlay, open modal, toggle accordion, filter) | ≤ 200 ms |
| Total Blocking Time | ≤ 200 ms |
| JavaScript for first render (gzip) | main ≤ 120 KB; any route chunk ≤ 30 KB |
| CSS for first render (gzip) | ≤ 25 KB |
| Fonts | three WOFF2 files, ≤ 130 KB in total, two preloaded |
| First-screen image | ≤ 140 KB at phone width |
| Third-party requests on first load | none |

Work through, in this order: (1) the LCP element of each route is the intended one, is discoverable from the HTML or rendered with `priority`, and is not delayed by fonts or script; (2) fonts — preload the two critical files, `font-display: swap`, fallback metrics so the swap does not shift layout, and trim axes or ranges if the three files exceed the budget; (3) JavaScript — nothing from `@mui`, `@emotion`, `sweetalert2` or the admin in public chunks; GSAP plugins loaded only where used (`Flip` with the portfolio, Lottie with the process icons); no duplicated modules across chunks; dead code and unused exports removed; (4) images — correct `sizes` everywhere (prompt 16's check), AVIF served where supported, nothing eager below the fold; (5) rendering — `content-visibility: auto` with `contain-intrinsic-size` on long below-the-fold sections where it measurably helps and does not break ScrollTrigger positions (call `scheduleRefresh()` when such a section becomes visible), no layout thrash in scroll handlers, passive listeners; (6) caching — hashed bundles and `/images/**` already immutable; add the `/fonts/` tag rule; confirm `index.html` stays `no-cache`.

`scripts/qa/perf-check.js` — Playwright with a CDP session: applies the network and CPU throttling above, loads each route cold, collects LCP (and which element), CLS over a full scroll, TBT from long tasks, transferred bytes by type and the third-party request list, performs the four interactions and measures their duration, prints a table and exits non-zero when a budget is exceeded. If Lighthouse is available in the session run it as a second opinion (mobile preset) and record the scores; it is not required.

### Part C — SEO

**Per-page metadata** (set through `src/config/seo.js`; titles ≤ 60 characters where possible, descriptions 140–160):

| Route | Title | Notes |
|---|---|---|
| `/` | In-Arch Architects & Interior Designer \| Architects in Patna, Bihar | the PDF's suggested title and description |
| `/about` | About In-Arch Architects, Patna | |
| `/expertise` | Architectural Design Services in Patna — IN-ARCH | `Service` list + `FAQPage` |
| `/interior-design` | Interior Designers in Patna, Bihar — IN-ARCH | `FAQPage` (five questions) |
| `/portfolio` | Architecture & Interior Design Portfolio — IN-ARCH | |
| `/portfolio/:slug` | {Project title} — Interior project by IN-ARCH, Patna | `CreativeWork`, three-level breadcrumb, project cover as `og:image` |
| `/contact` | Contact In-Arch Architects, Patna | |
| 404, unknown project, `/admin/*` | unchanged | `noindex, nofollow`, no canonical, no schemas |

Every indexable page has exactly one canonical (absolute, no trailing-slash or query variants — the portfolio's `?category=` filter canonicalises to `/portfolio`), matching `og:url` / `twitter:url`, `og:title` / `og:description` / `og:image` (absolute, 1200 × 630 default) and `twitter:card`.

**Structured data** — only what the visible page supports:

- Organisation: type `ProfessionalService`, `name` and `legalName` "In-Arch Architects & Interior Designer", `url`, `logo`, `image`, `description`, `telephone` "+91-72928-31128", `address` (`streetAddress` "Boring Road", `addressLocality` "Patna", `addressRegion` "Bihar", `addressCountry` "IN" — plus `postalCode` only if `studio` holds one), `areaServed` "Patna, Bihar", `founder` (`Person`: "Mohammad Hassanuddin", `jobTitle` "Principal Architect"), `knowsAbout` (the seven service titles), `sameAs` only for social links that exist in `studio.social`.
- `WebSite`, `WebPage`, `BreadcrumbList` on every indexable page; the `Service` item list on `/` and `/expertise`; `FAQPage` on `/expertise` and `/interior-design`; `CreativeWork` on project pages.
- **Never:** `aggregateRating`, `review`, `openingHoursSpecification` (only an opening time is known), `geo` coordinates, `priceRange`, awards, or an email — none was supplied.

**The domain (owner decision D-05).** If `studio.siteUrl` is set, use it everywhere. If it is still empty: the run-time layer keeps using `window.location.origin`, and the static files use the placeholder origin `https://SITE-URL-NOT-SET.invalid` — a reserved top-level domain that can never resolve to someone else's site — so the gap is impossible to miss; record it as a go-live blocker in the build log. `scripts/set-site-url.js <https://domain>` replaces the placeholder (or a previous value) in `src/data/siteConfig.js`, `public/index.html`, `public/sitemap.xml` and `public/robots.txt` in one step and refuses a value that is not an absolute `https://` URL.

**Static fallback in `public/index.html`** (what a crawler that runs no JavaScript sees — it must match the run-time output for `/`): title, description, canonical, Open Graph and Twitter tags, and the four home-page JSON-LD blocks (`schema-organization`, `schema-website`, `schema-webpage`, `schema-breadcrumb`) plus `schema-services`, with the same element ids `SEOHead` rewrites, so nothing is ever duplicated.

**`public/sitemap.xml`** — every indexable URL: `/`, `/about`, `/expertise`, `/interior-design`, `/portfolio`, the seven `/portfolio/<slug>` URLs and `/contact`, with today's `lastmod`; not `/industries`, not `/admin`, not `/api`. **`public/robots.txt`** — allow all, disallow `/admin`, point to the sitemap. Add a Jest test that derives the expected URL list from the route table and `src/data/projects.js` and fails if the sitemap is out of step.

## Functional guardrails

- **Contract frozen.** `public/api/leads.php` and `public/api/config.example.php` are not edited. The endpoint and its actions stay as they are: `POST /api/leads.php?action=create` with body `{ "lead": { … } }`, plus `list`, `update`, `delete` and `health`. Every lead still carries exactly these keys with the same meaning: `lead_id, name, mobile, email, organization, service_interest, state, message, source, status, submitted_at, updated_at, page_url, user_agent, utm_source, utm_medium, utm_campaign, utm_term, utm_content, notes, activity`. The status keys `new, contacted, consultation_booked, procedure_scheduled, completed, not_interested` are never renamed. `.env` and `.env.example` are not edited (use the git-ignored `.env.development.local` for local overrides). Anything new a lead needs is added as an extra key; nothing existing is renamed, removed or reshaped.
- **Admin-frozen files** — no diff against the "admin freeze commit" that prompt 15 recorded in `prompts/BUILD_LOG.md` (and none against baseline `cc2fc52d90987adcf62a5c286c4eb87d155fc3f3` except what prompt 15 logged): `src/admin/**`, `src/theme/muiTheme.js`, `src/styles/variables.css`, `src/styles/global.css`, `src/styles/animations.css`, `src/styles/responsive.css`, `src/styles/dulcey.css`, `src/App.css`, `src/hooks/useMediaQuery.js`, `src/surfaces/AdminSurface.jsx`, `public/api/**`, `.env`, `.env.example`.
- **Admin-bound values** are final since prompt 15 and must not move again: `siteConfig.brandName`, `siteConfig.legalName`, `siteConfig.logo`, `LOGO_SIZE`, `expertiseTitles`, `seoConfig.pages.admin`, `getConfig()`.
- **`public/.htaccess` keeps every existing rule in its existing order;** the diff against the baseline is exactly one added line. `/api/leads.php` must still be reachable and never rewritten to `index.html`.
- **`SEOHead`'s contract holds:** tags are updated in place by element id, never duplicated; `noindex` routes lose their canonical, `og:url` and schemas; navigating between pages leaves no stale schema behind.
- **Performance work changes nothing a visitor can see or do** except speed: same pixels, same motion, same flows. `content-visibility` and lazy boundaries must not break hash links, the sticky sequences or ScrollTrigger positions.
- **Accessibility fixes do not remove features** (no deleting an animation or a swipe row instead of making it accessible).
- **Dependencies:** only remove a package after proving no import remains in `src/` — including under `src/admin/` (`@mui/*`, `@emotion/*`, `@iconify/react` are the admin's and stay).
- **Truthful content.** Every fact comes from `details of in-arch.pdf` through the modules in `src/data/`. No testimonials, awards, client names, statistics, ratings, years, areas, locations or quotes are invented; where the client supplied nothing the surface stays silent and the gap is listed in `prompts/00_INDEX.md`. Structured data and metadata state only facts present in `studio` and the data modules; nothing is added "for SEO" that the page does not show.
- **Nothing lost.** These keep resolving and behaving: `/`, `/about`, `/expertise` (with its `#e01`… deep links), `/interior-design`, `/portfolio`, `/portfolio/:slug`, `/industries`, `/contact`, the 404 catch-all, `/admin`, `/admin/login`, `/admin/dashboard`, `/admin/lms`, `/admin/lms/lead/:leadId`, `/admin/guideline`, and the static files `/api/leads.php`, `/sitemap.xml`, `/robots.txt`, `/manifest.json`. The lead modal still opens from every CTA through `openLeadModal(source, extras)`, still traps focus, closes on Escape / backdrop / close button / route change, restores focus and scroll position, and still submits through `submitLeadToWebhook`. `ScrollManager` (top on navigation, hash scrolling) and `SEOHead` (per-route title, meta, canonical, JSON-LD; `noindex` on `/admin` and 404) keep working.
- Admin untouched.

## Test & QA

Run it and look — do not infer.

```bash
npm ci
```

```bash
npm run build
```

```bash
php -S 127.0.0.1:8080 -t build scripts/dev-router.php
```

That serves the production build with PHP, so the site, the lead API and the admin share one origin exactly as in production; open `http://127.0.0.1:8080`. For hot reload instead, run `npm start` (port 3000) next to `php -S 127.0.0.1:8080 -t public` and put `REACT_APP_LEADS_API_URL=http://127.0.0.1:8080/api/leads.php` in a git-ignored `.env.development.local` — never edit `.env`.

```bash
npm test -- --watchAll=false
```

```bash
node scripts/qa/public-check.js
```

```bash
node scripts/qa/perf-check.js
```

- **Accessibility evidence** in the build log: the axe result per route and state (zero violations of any impact at AA); a keyboard walkthrough note per page (tab order, traps, Escape, focus return); a screen-reader pass of Home, the lead modal, the Expertise ledger, the portfolio filter and a case study's lightbox (VoiceOver or NVDA if available, otherwise the accessibility tree) with what was announced; the measured contrast of every text-on-photograph placement.
- **Performance evidence:** the `perf-check.js` table for all seven routes, all within budget, plus the bundle listing from `npm run build` (main and per-route chunk sizes). If a budget cannot be met, say which, by how much and why, rather than hiding it.
- **SEO evidence:** for every route, the rendered `<title>`, description, canonical, robots and the list of schema ids present, captured after client-side navigation *and* after a direct load; each JSON-LD block parses as JSON and has the required properties; view-source of `/` shows the static fallback equal to the run-time values; the sitemap test passes; `robots.txt` and `sitemap.xml` are served with the right content types from the PHP-served build; no URL anywhere contains `dulceyleadservices`.
- **`.htaccess`:** `git diff cc2fc52d90987adcf62a5c286c4eb87d155fc3f3 -- public/.htaccess` shows the single added line. (The PHP dev server does not read `.htaccess`; state in the log that caching headers must be confirmed on the real Apache host after deployment.)
- **No regressions from the fixes:** `npm test -- --watchAll=false`, `node scripts/qa/public-check.js --matrix full`, `node scripts/qa/lead-flow.js` all pass.
- **Admin parity:** `node scripts/qa/parity.js --suite admin` between the admin freeze commit's build and this branch: zero differences; the admin still shows `noindex` and no public schemas.
- **Breakpoints.** Check 360, 390, 768, 1024, 1280, 1440 and 1920 px wide, plus one landscape phone (844 × 390): no horizontal scroll, nothing clipped or overlapping, every tap target ≥ 44 × 44 px, no text below 12 px, and the dock never hides a focused control.
- **Keyboard.** Tab through the whole surface: logical order, a visible 2 px focus ring on every stop, no trap outside an open overlay, Escape closes overlays and returns focus to the opener, Enter and Space activate.
- **Contrast.** Text ≥ 4.5:1 (≥ 3:1 from 24 px, or 18.66 px bold); control boundaries and focus rings ≥ 3:1. Measure text that sits on a photograph at its worst pixel.
- **Screen reader.** Exactly one `h1`, headings in order, `nav` / `main` / `footer` landmarks, meaningful `alt` on content images and empty `alt` on decorative ones, an accessible name on every control, results announced through live regions. Inspect the accessibility tree, and use VoiceOver or NVDA if the session has one.
- **Reduced motion.** Emulate `prefers-reduced-motion: reduce`: everything is visible and usable with no transforms, parallax, pinning or curtain.
- **Automated.** `node scripts/qa/public-check.js` reports no console errors, no failed requests, no horizontal overflow and zero serious or critical axe violations; `npm test -- --watchAll=false` passes; `npm run build` ends with "Compiled successfully" and no warnings.

**Regression pass — the whole site, every time.** Walk `/`, `/about`, `/expertise`, `/interior-design`, `/portfolio`, one `/portfolio/<slug>`, `/industries`, `/contact` and a nonsense URL at 390 px and at 1440 px. Open the lead modal from three different CTAs. Submit one real enquiry through the modal and one through `/contact` (`node scripts/qa/lead-flow.js` does this and asserts the payload keys), confirm the success state, then submit the same mobile number again and confirm the duplicate path. Log in at `/admin` with the `REACT_APP_ADMIN_USERNAME` / `REACT_APP_ADMIN_PASSWORD` values from `.env` (read them at run time; never print or copy them) and confirm: the dashboard counts and recent table; the leads table (search, every filter, sorting, pagination, inline status change, bulk select, CSV export and import, delete with its confirm dialog); a lead's detail page (the lead you just sent shows its name, mobile, email, interested-in, message, source and page URL; add a note; change the status); the Guidelines password gate and its four tabs; logout. Then run the admin-frozen check — it must print nothing:

```bash
git diff --stat cc2fc52d90987adcf62a5c286c4eb87d155fc3f3 -- src/admin src/theme src/styles/variables.css src/styles/global.css src/styles/animations.css src/styles/responsive.css src/styles/dulcey.css src/App.css src/hooks/useMediaQuery.js public/api .env .env.example
```

If the baseline commit is missing from a shallow clone, run `git fetch --unshallow origin` first. Fix whatever the pass finds before calling this prompt done, and delete the test leads afterwards (`build/api/data/` and `public/api/data/` are git-ignored; never commit them).

**Close out.** Append an entry to `prompts/BUILD_LOG.md` (date, "Prompt 18", files created / changed / deleted, decisions taken, every deviation from this prompt with its reason, anything left open). Add a short entry under `## [3.0.0] — IN-ARCH redesign (in progress)` at the top of `CHANGELOG.md`. Commit with a message that starts `IN-ARCH 18:`.
