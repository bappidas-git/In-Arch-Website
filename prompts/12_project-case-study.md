# 12 — Project detail / case study

**Prompt 12 of 20**

## Depends on

Before writing anything, read in this order: `prompts/00_INDEX.md` (at least "Owner decisions", "Design direction" and "Build architecture"), then `prompts/BUILD_LOG.md` (what earlier sessions really did, including deviations). An owner decision recorded in the index overrides any default written in this prompt. If the build log shows a dependency below is unfinished, stop and say so instead of improvising it.

- **Prompts 01–05** — design system; `src/data/projects.js` (each project: `slug`, `title`, `category`, `projectType`, `scope`, `focus`, `summary`, `images`, optional `location` / `area` / `year` / `client`, `verified`); the `pr-*-cover-*`, `g-*` and `sw-*` image keys; the kit (`Frame`, `Figure`, `FactList`, `Portal`, `useFocusTrap`, `useScrollLock`, `IconButton`); the shell; the lead modal with the source pattern `project-<slug>`.
- **Prompt 11** — the Portfolio listing exists and its tiles link to `/portfolio/<slug>`; that route still renders `PendingPage`, which this prompt replaces and then removes.

## Context

IN-ARCH — *In-Arch Architects & Interior Designer*, Boring Road, Patna, Bihar, led by Principal Architect Ar. Mohammad Hassanuddin — is getting a new public website on an existing React boilerplate that still wears a previous client's brand ("Dulcey Lead Services"). The new brand is warm, quiet, editorial luxury: ivory `#F4EFE7` and espresso `#231B15` (both sampled from the logo), deep charcoal-green `#161E19`, one terracotta accent; Fraunces serif headlines with a single italic terracotta phrase, Manrope for text and UI. Logo files are named for the background they sit ON: `logos/in-arch-logo-light-transparent.png` is the espresso lockup for light backgrounds, `logos/in-arch-logo-dark-transparent.png` the ivory lockup for dark backgrounds, and `logos/in-arch-favicon-light-transparent.png` / `logos/in-arch-favicon-dark-transparent.png` are the "IA" monogram under the same rule. Stack reality: React 18 + Create React App (`react-scripts` 5, plain JavaScript), React Router 7 in `BrowserRouter` mode, CSS Modules, GSAP 3.15 with ScrollTrigger. There is no `db.json`: enquiries are POSTed to `public/api/leads.php` (a JSON-file store) and read by the MUI admin panel at `/admin`.

## Objective

Give every portfolio project its own page at `/portfolio/:slug` — the case-study depth the dummy lacked — using only what the data actually supports: the photographs, the category, the project type, the scope and the design focus. One template renders all seven projects; it reads as a photo essay with a facts rail, lets a visitor enquire about "something like this" with the context attached, and ends by leading into the next project. Fields the client has not supplied yet (location, area, year, client) are not shown at all, and appear by themselves the day the data gains them.

## Scope — files/areas to touch

**Create** — `src/pages/Project/ProjectPage.jsx`, `ProjectPage.module.css`, `index.js`, and in `src/pages/Project/sections/` (each `.jsx` + `.module.css`): `ProjectCover`, `ProjectFacts`, `ProjectGallery`, `Lightbox`, `ProjectDetails` (swatches), `ProjectEnquiry`, `NextProject`; plus `src/pages/Project/useProject.js` (slug → project, index, next project) with a unit test.

**Edit**

- `src/App.jsx` — `/portfolio/:slug` lazy-loads `./pages/Project/ProjectPage`; remove the `PendingPage` import.
- `src/components/common/SEO/SEOHead.jsx` and `src/config/seo.js` — `resolvePage` returns a per-project config for a known slug (title "{title} — Interior project by IN-ARCH, Patna"; description = the project's `summary` trimmed to ≤ 155 characters at a word boundary; path `/portfolio/<slug>`; breadcrumb Home → Portfolio → {title}; `image` = the absolute URL of the project's 1080-px JPEG cover) and `pages.notFound` for an unknown slug. `breadcrumbItemsFor` in `src/utils/seo.js` gains support for a three-level trail.
- `src/utils/seo.js` — add `generateProjectSchema(project)` (`CreativeWork`: `name`, `description`, `image`, `creator` = the organisation) injected as `schema-project` on project pages and removed elsewhere; add the id to `PUBLIC_SCHEMA_IDS`.
- `src/data/projects.js` — only if needed: an optional `swatches` array per project (keys from the six `sw-*` images) and nothing else.

**Delete** — `src/pages/Pending/` (no route uses it after this prompt; confirm by search) and the `pages.pending` SEO entry.

**Out of scope** — the listing page (prompt 11); inventing or researching project facts; `public/sitemap.xml` (prompt 18 adds the seven URLs); everything under `src/admin/`.

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

### Rules for every page prompt

- The page's root element carries `class="ia"`; every band is a `Section` primitive with an explicit `tone`. The first section's tone drives the masthead and the dock follows whatever is under it.
- Exactly one `h1`; section titles are `h2`; tiles and list items `h3`. Every section has an accessible name.
- The page calls `usePageReady()` once its first screen has mounted, so the page-transition curtain can lift.
- One `useMotionScope` per section; first-screen elements use `data-m-now`; nothing animates a layout property.
- The first-screen image is a `Picture` with `priority` and a correct `sizes`; every other image is lazy. All images come from the manifest.
- Enquiry CTAs call `openLeadModal(source, { service_interest, context })` with the source names fixed in prompt 05; internal links use the kit's link component so they get the page transition and chunk preloading.
- One primary action per viewport: the section's single most important button carries `data-primary-cta` (the dock then steps down to its secondary style); everything else is a secondary button or a text link.
- Copy: where this prompt gives wording, use it verbatim; where it says "verbatim from the PDF", take it from the data module; anything else you write must be short, calm and free of factual claims, superlatives and promises.
- Update this page's entry in `src/config/seo.js` (and `ROUTE_MAP` in `SEOHead.jsx` if the route is new) and delete the old files this prompt replaces.
- Design the 360–390 px layout first, completely, then 768, then 1024 and up — the phone layout is never the desktop layout collapsed.

Rhythm: **dark** photographic cover → **light** facts and summary → **sand** gallery → **light** detail swatches (only where they exist) → a quiet **light** enquiry line → a full-bleed "next project" that is the page's ending. The template adapts to one, two or three photographs without ever looking half-empty.

### Section 1 — Cover (`tone="dark"`)

- Full-bleed image: the project's `-cover-wide` (3:2) from 768 px and `-cover-tall` (4:5) below, as a `Picture` with `art` and `priority`. Section height `88svh` on desktop (min 560 px), `76svh` on phones.
- Overlay only where the text sits: `linear-gradient(180deg, rgba(22,30,25,.5) 0%, rgba(22,30,25,0) 30%, rgba(22,30,25,0) 55%, rgba(22,30,25,.88) 100%)`.
- Bottom-left, above the dock on phones: a `TextLink` with a left arrow "Portfolio" → `/portfolio`; Eyebrow "{index} — {category}" (index zero-padded from the project's position in the data); `h1` `.ia-t-display-xl` = the project title.
- Motion: image `scale(1.08)` → 1 on load; title lines rise; drift `data-m-parallax="6"` on scroll.

### Section 2 — Facts and summary (`tone="light"`)

- **Facts rail** — a `FactList` that renders only the pairs with a value, in this order: Category · Project type · Scope · Design focus · Location · Area · Year · Client. Today the last four are empty for every project and therefore absent; do not print "—", "N/A" or "On request".
- **Summary** — the project's two-sentence `summary` in `.ia-t-body-lg`, max 56ch.
- **Phones:** summary first, then the facts as stacked label / value rows with hairlines. **Desktop:** facts in columns 1–4, sticky at 120 px; summary in columns 6–11.

### Section 3 — Gallery (`tone="sand"`)

The project's `images` (cover first — the cover is repeated here only when the project has a single photograph), as `Figure`s whose captions are the images' alt texts.

- **One image:** a single full-content-width figure at its native ratio.
- **Two images:** the first across columns 1–8, the second across columns 6–12 starting 96 px below the first's bottom edge.
- **Three images:** the first full width; then a pair — columns 1–6 and columns 8–12 — with the right one 96 px lower.
- **Phones:** every image full content width, 32 px apart, in order.
- Each image is a button that opens the **lightbox**: a dialog through `Portal` (forest at 96 % opacity) showing the image at up to the viewport size with its caption, a counter ("2 / 3"), previous / next `IconButton`s (so no dragging is needed), and a close button; arrow keys move, Escape closes, focus is trapped and returned to the image that opened it, the page behind is scroll-locked; on touch, native horizontal swipe with scroll-snap also moves between images. The lightbox requests the 1440 / 1920-px source only when opened. Reduced motion: no zoom transition, a plain fade under 150 ms.
- Motion on the page: figures `data-m="shutter"`.

### Section 4 — Details (`tone="light"`) — only when the project has `swatches`

- `.ia-t-label` "Details", then the project's one to three square swatches at 240 px (phones: 44 vw) with their one-line captions (the same captions as on the Interior Design page). Suggested assignment: `walnut-and-marble-living-hall` → `sw-fluted`, `sw-stone`; `arched-niche-living-room` → `sw-tufting`; `panelled-living-hall` → `sw-moulding`; `ivory-kitchen` → `sw-gloss`; `prayer-units` → `sw-lattice`. Projects without swatches skip the section entirely.

### Section 5 — Enquire about something similar (`tone="light"`, compact)

- One line, left-aligned under a hairline: `.ia-t-display-sm` "Planning something similar?" and a `Button` secondary "Discuss a project like this" → `openLeadModal('project-' + slug, { service_interest: 'Interior Design', context: { label: 'Portfolio — ' + title } })`. Not marked `data-primary-cta`: the dock keeps the primary button on this page.

### Section 6 — Next project (the page's ending)

- A full-bleed link, `60svh` tall: the next project's `-cover-wide` image under the forest overlay, with `.ia-t-label` "Next project", its title in `.ia-t-display-lg` and an arrow. The last project links to the first. The whole band is one link (`aria-label` "Next project: {title}"); hover / focus scales the image to 1.04 and swaps the arrow; it preloads the route chunk and the next cover's first-screen source on pointer-enter.

### Unknown slug

Render the site's not-found content inside this route (the same component the `*` route uses) and let `SEOHead` resolve to `pages.notFound` (`noindex`, no canonical, no schemas). Never redirect to the listing silently.

## Functional guardrails

- **Contract frozen.** `public/api/leads.php` and `public/api/config.example.php` are not edited. The endpoint and its actions stay as they are: `POST /api/leads.php?action=create` with body `{ "lead": { … } }`, plus `list`, `update`, `delete` and `health`. Every lead still carries exactly these keys with the same meaning: `lead_id, name, mobile, email, organization, service_interest, state, message, source, status, submitted_at, updated_at, page_url, user_agent, utm_source, utm_medium, utm_campaign, utm_term, utm_content, notes, activity`. The status keys `new, contacted, consultation_booked, procedure_scheduled, completed, not_interested` are never renamed. `.env` and `.env.example` are not edited (use the git-ignored `.env.development.local` for local overrides). Anything new a lead needs is added as an extra key; nothing existing is renamed, removed or reshaped.
- **Admin-frozen files** — no diff against baseline commit `cc2fc52d90987adcf62a5c286c4eb87d155fc3f3`: `src/admin/**`, `src/theme/muiTheme.js`, `src/styles/variables.css`, `src/styles/global.css`, `src/styles/animations.css`, `src/styles/responsive.css`, `src/styles/dulcey.css`, `src/App.css`, `src/hooks/useMediaQuery.js`, `public/api/**`, `.env`, `.env.example`.
- **Admin-bound values** keep their current values, because the admin prints or reads them: `siteConfig.brandName`, `siteConfig.legalName`, `siteConfig.logo` and `LOGO_SIZE` in `src/data/siteConfig.js`; `expertiseTitles` in `src/data/expertiseData.js`; `seoConfig.pages.admin` in `src/config/seo.js`; `getConfig()` in `src/utils/webhookSubmit.js`. Prompt 15 is the only place they change.
- **Seven real URLs.** Each slug in `src/data/projects.js` resolves on a direct load, on a refresh, and through the page transition from the listing, the Home page and the Interior Design page; the next-project chain visits all seven and returns to the first.
- **Per-project SEO.** Title, description, canonical path, Open Graph image, breadcrumb and `schema-project` are set for the project on arrival and replaced or removed on navigation away; an unknown slug is `noindex` with no schemas.
- **Lead context.** The enquiry button stores `source: "project-<slug>"`, `service_interest: "Interior Design"` and a `context_label` naming the project.
- **Nothing shown that is not known.** No empty fact rows, no placeholder text, no invented location / area / year / client / budget, no "verified" badge. `verified: false` stays internal.
- **The interim page is gone.** After this prompt no route renders `PendingPage` and its files and SEO entry no longer exist.
- **Lightbox is a proper dialog:** focus trap, focus return, Escape, scroll lock restored on close and on route change (use the shared hooks — do not write a second scroll-lock).
- **Truthful content.** Every fact comes from `details of in-arch.pdf` through the modules in `src/data/`. No testimonials, awards, client names, statistics, ratings, years, areas, locations or quotes are invented; where the client supplied nothing the surface stays silent and the gap is listed in `prompts/00_INDEX.md`. Captions and summaries describe only what is visible in the photograph; titles are the descriptive ones from the data.
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

- **All seven projects**, at 390 px and 1440 px: cover, facts, summary, gallery (1, 2 and 3-image variants each look deliberate — check `black-and-veined-stone-kitchen` and `ivory-kitchen` for the one-image layout, `graphite-gloss-kitchen` for two, `arched-niche-living-room` and `prayer-units` for three), details where assigned, enquiry line, next project. No blemished image, no upscaled image (the `g-ph10` frame never renders wider than 480 CSS px on a 2× screen).
- **Facts rail.** Today exactly four pairs show. Temporarily set `location` and `year` on one project: the two rows appear in the right order with no layout break; revert.
- **Lightbox.** Open from each image by mouse, keyboard (Enter) and touch; arrows, buttons and swipe move; the counter is right; Escape and the close button close and return focus to the opener; the page behind does not scroll; rotating the device keeps the image fitted; only when opened are the large sources requested.
- **Routing and SEO.** `/portfolio/prayer-units` loaded directly: correct title, description, `og:image` (absolute), breadcrumb with three items, `schema-project` valid JSON. Navigate to another project, then to `/portfolio`, then to `/`: tags and schemas update each time and `schema-project` disappears outside project pages. `/portfolio/does-not-exist`: not-found content, `noindex`, no canonical.
- **Next-project chain.** Follow it seven times: every project once, then back to the first; each step uses the curtain and lands at the top.
- **Lead context.** From two different projects the modal shows "From: Portfolio — {title}"; stored `source` values differ accordingly; `node scripts/qa/lead-flow.js` still passes.
- **Performance.** On `/portfolio/walnut-and-marble-living-hall` at 390 px, "Fast 4G", 4× CPU: LCP element is the cover, LCP ≤ 2.5 s, CLS ≤ 0.02; the project chunk is under 25 KB gzip.
- **Unit test.** `useProject` returns the project, its index and its successor, wraps from last to first, and returns `null` for an unknown slug.
- **Admin parity.** `node scripts/qa/parity.js --suite admin` against the baseline build: zero differences.
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

**Close out.** Append an entry to `prompts/BUILD_LOG.md` (date, "Prompt 12", files created / changed / deleted, decisions taken, every deviation from this prompt with its reason, anything left open). Add a short entry under `## [3.0.0] — IN-ARCH redesign (in progress)` at the top of `CHANGELOG.md`. Commit with a message that starts `IN-ARCH 12:`.
