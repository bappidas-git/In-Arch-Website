# 06 — Home: hero and opening

**Prompt 6 of 20**

## Depends on

Before writing anything, read in this order: `prompts/00_INDEX.md` (at least "Owner decisions", "Design direction" and "Build architecture"), then `prompts/BUILD_LOG.md` (what earlier sessions really did, including deviations). An owner decision recorded in the index overrides any default written in this prompt. If the build log shows a dependency below is unfinished, stop and say so instead of improvising it.

- **Prompt 01** — tokens, base layer, `src/motion` (`useMotionScope`), QA scripts.
- **Prompt 02** — image keys `home-hero-wide`, `home-hero-tall`, `home-intro` in `src/data/imageManifest.json`; `studio`, `services` and `studioContent` in `src/data/`.
- **Prompt 03** — the kit (`Section`, `Container`, `Grid`, `Eyebrow`, `Heading`, `Lede`, `Button`, `TextLink`, `Picture` with its `art` prop, `Frame`).
- **Prompt 04** — the shell: masthead, dock (with its "yields to `data-primary-cta`" rule), page transitions and `usePageReady()`; the routes `/portfolio` and `/about` resolve.
- **Prompt 05** — the lead modal and the source-name contract (`home-hero`).

## Context

IN-ARCH — *In-Arch Architects & Interior Designer*, Boring Road, Patna, Bihar, led by Principal Architect Ar. Mohammad Hassanuddin — is getting a new public website on an existing React boilerplate that still wears a previous client's brand ("Dulcey Lead Services"). The new brand is warm, quiet, editorial luxury: ivory `#F4EFE7` and espresso `#231B15` (both sampled from the logo), deep charcoal-green `#161E19`, one terracotta accent; Fraunces serif headlines with a single italic terracotta phrase, Manrope for text and UI. Logo files are named for the background they sit ON: `logos/in-arch-logo-light-transparent.png` is the espresso lockup for light backgrounds, `logos/in-arch-logo-dark-transparent.png` the ivory lockup for dark backgrounds, and `logos/in-arch-favicon-light-transparent.png` / `logos/in-arch-favicon-dark-transparent.png` are the "IA" monogram under the same rule. Stack reality: React 18 + Create React App (`react-scripts` 5, plain JavaScript), React Router 7 in `BrowserRouter` mode, CSS Modules, GSAP 3.15 with ScrollTrigger. There is no `db.json`: enquiries are POSTed to `public/api/leads.php` (a JSON-file store) and read by the MUI admin panel at `/admin`.

## Objective

Build the first two screens of the Home page — the part that decides whether the client approves the site at first sight and whether a visitor stays:

1. **The hero, "Threshold"** — one full-screen photograph of the studio's own work, the brand line, and one action.
2. **The opening statement, "The practice"** — a single idea set large, with a quiet image, that says what kind of studio this is.

The rest of the old Home page (the belief band, the expertise index, the sector cards and the closing CTA) stays in place underneath, untouched, until prompt 07 replaces it; a visible seam between the new opening and the old remainder is expected for this one step.

## Scope — files/areas to touch

**Rewrite / create**

- `src/pages/Home/HomePage.jsx` and `HomePage.module.css` — new composition: a root `<div className="ia">` that holds the two new sections, followed by a sibling wrapper **without** the `ia` class that renders the four remaining old sections exactly as before (`BeliefSection`, `ExpertiseIndexSection`, `WhoWeServeSection`, `ClosingCtaSection`, inside the old `styles.page` font-size / line-height reset they rely on). Keep the file path and default export: `App.jsx` imports this page eagerly.
- `src/pages/Home/sections/HeroSection.jsx` and `HeroSection.module.css` — replaced entirely (the old 700-line stylesheet goes).
- `src/pages/Home/sections/ManifestoSection.jsx` and `ManifestoSection.module.css` — new.

**Edit**

- `public/index.html` — in the inline script that preloads the Home hero on `/` only: replace the `hero-home-v6-2880.webp` preload with two preloads for the new hero (AVIF, with `imagesrcset` / `imagesizes`): the `home-hero-tall` set under `media="(max-width: 767px)"` and the `home-hero-wide` set under `media="(min-width: 768px)"`. Keep the route guard and `fetchpriority="high"`.
- `src/config/seo.js` — `pages.home`: title "In-Arch Architects & Interior Designer | Architects in Patna, Bihar"; description "In-Arch Architects & Interior Designer, led by Ar. Mohammad Hassanuddin, offers architectural design, residential planning, interior design, 3D visualisation and project consultancy in Patna, Bihar."; keywords from the PDF's SEO list. Also switch `services.items` and `organization.knowsAbout` from the old `expertiseData` to `services` in `src/data/services.js` (the Home page declares `services: true`), keeping each item's URL shape `/expertise#e0N`.

**Delete** — `src/pages/Home/sections/MarqueeStrip.jsx`, `MarqueeStrip.module.css`, `WhoWeAreSection.jsx` (their content is superseded by the two new sections).

**Out of scope** — the four old sections named above and their stylesheets (prompt 07); `src/data/expertiseData.js` and `industriesData.js` (still read by those old sections and by the admin); the shell; the legacy hero image files in `public/images/` (removed in prompt 14); everything under `src/admin/`.

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

### Section 1 — Hero, "Threshold" (`tone="dark"`)

**Content, in this order**

- Eyebrow (no number): "Architecture & interior design — Patna"
- `h1`, `.ia-t-display-2xl`, two lines: "Designing spaces." / "*Shaping experiences.*" — the second line is the italic accent in terracotta-300. (This is `studio.tagline`, the PDF's suggested line; if owner decision D-10 changes the tagline, the hero follows it.)
- Lede, `.ia-t-body-lg`, max 44ch: "Architecture and interior design solutions that bring together creativity, functionality and thoughtful detailing." (verbatim from the PDF)
- Actions: from 768 px a primary `Button` `lg` "Start a project" (`data-primary-cta`, `openLeadModal('home-hero', { context: { label: 'Home — hero' } })`) and a ghost `Button` "View selected work" → `/portfolio`. Below 768 px only the ghost button is shown in the hero — the dock's "Start a project" sits directly underneath and is the primary action there.
- Meta: "Led by Ar. Mohammad Hassanuddin, Principal Architect" · "Patna, Bihar" · the three words "Architecture", "Interior Design", "3D Visualisation".

**Phones (360–767)**

- The section is `min-height: 100svh` (never below 620 px, never above 920 px). The photograph (`home-hero-tall`, 4:5) covers it (`object-fit: cover`, `object-position: 50% 45%`).
- Overlay, so ivory text holds 4.5:1 everywhere it sits: `linear-gradient(180deg, rgba(22,30,25,.62) 0%, rgba(22,30,25,.18) 34%, rgba(22,30,25,.34) 58%, rgba(22,30,25,.92) 100%)`. Tune the stops, never the text colour.
- The masthead (ivory wordmark, call button) sits on the top of the image. All copy is anchored to the bottom in one left-aligned column, 20 px gutters, with bottom padding `calc(var(--ia-dock-clearance) + 24px)` so the last line clears the dock. Vertical gaps: eyebrow → 16 → `h1` → 20 → lede → 28 → ghost button → 32 → meta as one caption line ("Led by Ar. Mohammad Hassanuddin · Patna, Bihar").
- The `h1` is 45 px at 360 and must break only at the full stop: two lines, never three.

**Tablet (768–1023)** — `home-hero-wide` (16:9), `object-position: 45% 50%`, section `min-height: min(100svh, 900px)`. Copy bottom-left across columns 1–6 of 8; both buttons side by side; the meta becomes a row under a hairline.

**Desktop (≥ 1024)** — full-bleed `home-hero-wide`, section `height: 100svh` (min 680 px). On the 12-column grid: the `h1` spans columns 1–9 and sits on the bottom third; the lede and the two buttons span columns 1–5 beneath it; the meta is a right-aligned stack in columns 10–12, bottom-aligned with the buttons, each item in `.ia-t-label` separated by hairlines. Nothing is centred. From 1440 the `h1` reaches 123 px and from 1920 it caps at 136 px; the copy block never exceeds the 1680 px content width while the image stays full-bleed.

**Motion** — on load (after the splash or the page curtain): the image eases from `scale(1.08)` to 1 over 1.6 s `power3.out`; the `h1` lines rise through their masks (1.0 s `expo.out`, 0.08 s stagger, 0.15 s delay); eyebrow, lede, buttons and meta rise 24 px with a 0.08 s stagger after the first line lands. On scroll: the image drifts with `data-m-parallax="7"` (4 on phones) while the section leaves. No scroll cue animation, no video, no auto-rotating slides. Reduced motion: everything is simply there.

### Section 2 — Opening statement, "The practice" (`tone="light"`)

**Content**

- Eyebrow: "01 — The practice"
- Statement as an `h2`, `.ia-t-display-md` (26 px at 360 → 44 px): "Architecture is more than the creation of buildings. It is about understanding people, their aspirations and *the way they interact with their surroundings.*" (the PDF's own sentence; the last clause is the accent).
- Supporting paragraph, `.ia-t-body-lg`, `--ia-fg-2`, max 52ch — the first "About In-Arch" paragraph from `studioContent`, verbatim: "In-Arch Architects & Interior Designer is an architectural and interior design practice based in Patna, Bihar, led by Principal Architect Ar. Mohammad Hassanuddin."
- `TextLink` with arrow: "Discover the studio" → `/about`
- Image: `home-intro` (4:5) in a `Frame` with `reveal` and `parallax`.

**Phones** — section rhythm 80 px; eyebrow, statement, paragraph, link in one column; then the frame, inset 20 px on the left and bleeding to the right edge of the screen (asymmetry even at 360 px), 4:5.

**Tablet** — statement across columns 1–6 of 8; the frame in columns 5–8 below it, overlapping the text block's baseline by 48 px.

**Desktop** — statement in columns 1–7; paragraph and link in columns 2–6 under it; the frame in columns 9–12, starting 96 px lower than the eyebrow so the two columns do not align. The section is at least `90svh` tall so it reads as one idea per screen.

**Motion** — the statement's words go from 25 % to 100 % opacity as the block travels from 80 % to 35 % of the viewport height (SplitText words, opacity only, `scrub`); paragraph and link `data-m="rise"`; the frame `data-m="shutter"` with ±7 % drift. Reduced motion: the statement is fully opaque from the start.

### The seam

Give the wrapper of the old sections no new styling at all. Do not restyle, reorder or "bridge" the old sections — prompt 07 removes them.

## Functional guardrails

- **Contract frozen.** `public/api/leads.php` and `public/api/config.example.php` are not edited. The endpoint and its actions stay as they are: `POST /api/leads.php?action=create` with body `{ "lead": { … } }`, plus `list`, `update`, `delete` and `health`. Every lead still carries exactly these keys with the same meaning: `lead_id, name, mobile, email, organization, service_interest, state, message, source, status, submitted_at, updated_at, page_url, user_agent, utm_source, utm_medium, utm_campaign, utm_term, utm_content, notes, activity`. The status keys `new, contacted, consultation_booked, procedure_scheduled, completed, not_interested` are never renamed. `.env` and `.env.example` are not edited (use the git-ignored `.env.development.local` for local overrides). Anything new a lead needs is added as an extra key; nothing existing is renamed, removed or reshaped.
- **Admin-frozen files** — no diff against baseline commit `cc2fc52d90987adcf62a5c286c4eb87d155fc3f3`: `src/admin/**`, `src/theme/muiTheme.js`, `src/styles/variables.css`, `src/styles/global.css`, `src/styles/animations.css`, `src/styles/responsive.css`, `src/styles/dulcey.css`, `src/App.css`, `src/hooks/useMediaQuery.js`, `public/api/**`, `.env`, `.env.example`.
- **Admin-bound values** keep their current values, because the admin prints or reads them: `siteConfig.brandName`, `siteConfig.legalName`, `siteConfig.logo` and `LOGO_SIZE` in `src/data/siteConfig.js`; `expertiseTitles` in `src/data/expertiseData.js`; `seoConfig.pages.admin` in `src/config/seo.js`; `getConfig()` in `src/utils/webhookSubmit.js`. Prompt 15 is the only place they change.
- **The rest of Home still works.** The four old sections render and behave as before below the new opening: the expertise index rows still link to `/expertise#e01` … `#e10`, the sector cards still link to `/industries`, the closing CTA still opens the lead modal (`home-cta`) and dials the old number it reads from the legacy config. Their files show no diff.
- **Home stays the eager route.** `HomePage` is still imported statically by `App.jsx`; the two new sections add no new runtime dependency to the main bundle beyond GSAP's `SplitText`, which `src/motion` already registers.
- **LCP is protected.** The hero image is in the HTML preload for `/` only, is not lazy, has `fetchpriority="high"`, explicit dimensions and both art-directed sources; no other route downloads it.
- **Hero actions.** "Start a project" opens the lead modal with source `home-hero`; "View selected work" navigates to `/portfolio` (the interim page until prompt 11) through the page transition.
- **Truthful content.** Every fact comes from `details of in-arch.pdf` through the modules in `src/data/`. No testimonials, awards, client names, statistics, ratings, years, areas, locations or quotes are invented; where the client supplied nothing the surface stays silent and the gap is listed in `prompts/00_INDEX.md`. The hero and the statement use only the PDF's own wording and the principal's supplied name and title.
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

- **Hero, measured in the browser** at 360, 390, 768, 1024, 1280, 1440 and 1920 px: the `h1` is two lines at every width and matches the type table (45.1 / 47.3 / 74.5 / 92.9 / 111.4 / 122.9 / 136 px); nothing is hidden behind the dock or the masthead; on a 360 × 640 viewport and on a landscape phone (844 × 390) the headline, lede and one action are all reachable without the hero overflowing awkwardly; the image never shows the person, cables or clutter listed in prompt 02.
- **Contrast over the photograph.** Sample the pixels behind the eyebrow, each `h1` line, the lede, the ghost button's label and the meta at every width: ivory text ≥ 4.5:1 at its worst pixel (terracotta-300 accent line ≥ 3:1, it is display size).
- **LCP.** In the PHP-served production build, with "Fast 4G" and 4× CPU throttling at 390 px: the LCP element is the hero image, it is requested from the preload before the main bundle finishes, LCP ≤ 2.5 s, CLS ≤ 0.02 for the whole page. Navigating to `/about` or `/contact` first must not request the hero image.
- **Actions.** Primary button opens the modal and the lead it sends has `source: "home-hero"` (check with `node scripts/qa/lead-flow.js` or the network panel); while that button is ≥ 60 % visible the dock's button is in its secondary style, and returns to primary when the hero has scrolled away; the ghost button navigates with the curtain.
- **Motion.** The intro plays once per visit to the page, including after a page transition; resizing mid-animation does not break the line masks; with reduced motion nothing moves and the statement is fully legible; 60 fps on a 4×-throttled CPU while scrolling through both sections.
- **The seam.** The old sections below are pixel-identical to before this prompt (compare screenshots of that region).
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

**Close out.** Append an entry to `prompts/BUILD_LOG.md` (date, "Prompt 06", files created / changed / deleted, decisions taken, every deviation from this prompt with its reason, anything left open). Add a short entry under `## [3.0.0] — IN-ARCH redesign (in progress)` at the top of `CHANGELOG.md`. Commit with a message that starts `IN-ARCH 06:`.
