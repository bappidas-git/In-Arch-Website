# 09 — Expertise / Services

**Prompt 9 of 20**

## Depends on

Before writing anything, read in this order: `prompts/00_INDEX.md` (at least "Owner decisions", "Design direction" and "Build architecture"), then `prompts/BUILD_LOG.md` (what earlier sessions really did, including deviations). An owner decision recorded in the index overrides any default written in this prompt. If the build log shows a dependency below is unfinished, stop and say so instead of improvising it.

- **Prompts 01–05** — design system; `src/data/services.js` (ids `e01`–`e07`), `process.js`, `faqs.js`, `studioContent.js` (the seven differentiators); the Icons8 icons and Lottie files; image keys `expertise-interiors`, and `expertise-atmosphere` / `expertise-drawing` if prompt 02's build log says the open-licence photographs were obtained; the kit (`Accordion`, `LottieIcon`, `Chip`); the shell; the lead modal with its source names `expertise-e01` … `expertise-e07` and `expertise-closing`.
- **Prompts 06–08** — Home and Studio are finished; Home's service ledger links to `/expertise#e01` … `#e07` and its process link to `/expertise#process`, which this prompt must honour.

## Context

IN-ARCH — *In-Arch Architects & Interior Designer*, Boring Road, Patna, Bihar, led by Principal Architect Ar. Mohammad Hassanuddin — is getting a new public website on an existing React boilerplate that still wears a previous client's brand ("Dulcey Lead Services"). The new brand is warm, quiet, editorial luxury: ivory `#F4EFE7` and espresso `#231B15` (both sampled from the logo), deep charcoal-green `#161E19`, one terracotta accent; Fraunces serif headlines with a single italic terracotta phrase, Manrope for text and UI. Logo files are named for the background they sit ON: `logos/in-arch-logo-light-transparent.png` is the espresso lockup for light backgrounds, `logos/in-arch-logo-dark-transparent.png` the ivory lockup for dark backgrounds, and `logos/in-arch-favicon-light-transparent.png` / `logos/in-arch-favicon-dark-transparent.png` are the "IA" monogram under the same rule. Stack reality: React 18 + Create React App (`react-scripts` 5, plain JavaScript), React Router 7 in `BrowserRouter` mode, CSS Modules, GSAP 3.15 with ScrollTrigger. There is no `db.json`: enquiries are POSTed to `public/api/leads.php` (a JSON-file store) and read by the MUI admin panel at `/admin`.

## Objective

Replace the boilerplate's ten-item consulting accordion with the IN-ARCH **Expertise** page at the same URL, `/expertise`: the seven services, why a client would choose the studio, the seven-step process and the eight FAQs. The page keeps the one behaviour visitors and inbound links rely on — every service is deep-linkable as `/expertise#e0N`, opens on arrival and can be discussed in one tap with the service pre-selected in the lead form — and presents it as a ledger rather than a template, with its own typographic opening and a service-chooser ending.

## Scope — files/areas to touch

**Rewrite** — `src/pages/Expertise/ExpertisePage.jsx`, `ExpertisePage.module.css` (same path and default export; `App.jsx` already lazy-loads it).

**Create** in `src/pages/Expertise/sections/` (each `.jsx` + `.module.css`): `ExpertiseHero`, `ServiceLedger`, `WhySection`, `ProcessSection`, `FaqSection`, `ChooserSection`.

**Edit**

- `src/utils/seo.js` — add a pure `generateFaqSchema(items)` (`FAQPage` with `Question` / `acceptedAnswer`), add `'schema-faq'` to `PUBLIC_SCHEMA_IDS`, and have `injectPageSchemas(page)` inject it when the page config carries `faq` (an array of ids) and remove it otherwise — exactly the pattern `schema-services` already follows.
- `src/config/seo.js` — `pages.expertise`: title "Architectural Design Services in Patna — IN-ARCH"; description "Architectural design, residential and commercial planning, interior design, 3D visualisation, renovation and project consultancy from In-Arch Architects & Interior Designer, Patna."; `services: true`; `faq` = all eight FAQ ids; breadcrumb "Expertise". Derive this page's keywords from the service titles, then remove the file's import of `expertiseData` once nothing in it uses it; leave the `industriesData` import alone — `pages.industries` still uses it until prompt 11. The data files themselves stay on disk.
- `src/App.jsx` — only if the route needs its `preload()` handle updated.

**Delete** — `src/pages/Expertise/sections/HeroSection.jsx` + `.module.css`, `ExpertiseAccordion.jsx` + `.module.css`, `CtaSection.jsx` + `.module.css`.

**Out of scope** — `src/data/expertiseData.js` (the admin's filter still imports `expertiseTitles` from it until prompt 15 — do not edit or delete it); the Interior Design page (prompt 10; this page only links to it); the legacy `public/images/hero-expertise*` files (prompt 14); everything under `src/admin/`.

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

Rhythm: **sand** typographic hero → **light** service ledger → **dark** reasons → **sand** process → **light** FAQ → **dark** chooser. This is the site's reference page: dense with information, so its layouts are strict lists, not image compositions.

### Section 1 — Hero (`tone="sand"`)

- Eyebrow: "Expertise"; `h1` `.ia-t-display-xl`: "Seven services. *One considered process.*"; `Lede`: "Architecture, interiors, visualisation and site consultancy — taken on separately or together, as the project requires."
- A row of in-page links in `.ia-t-label` under a hairline: "Services" → `#services`, "Process" → `#process`, "Questions" → `#faq`.
- Visual, right-hand side from 1024 px (columns 8–12), below the copy on phones: if `expertise-atmosphere` exists, a 3:2 `Frame` with `reveal`; otherwise an in-house line drawing — an abstract plan made of 1 px lines in `--ia-line-strong` with one terracotta line — whose lines appear by `scaleX` / `scaleY` from their ends (never `stroke-dashoffset`). Either way it is decorative (`alt=""` / `aria-hidden`).
- The hero is short: about 70 svh on desktop, content-height on phones.

### Section 2 — The service ledger (`tone="light"`, `id="services"`)

The seven services from `src/data/services.js`, in order, as an `Accordion` whose items carry the ids `e01` … `e07`.

- **Header (always visible):** number (`.ia-t-label`, accent) · title (`.ia-t-display-sm`; `.ia-t-display-md` from 1024) · tagline (`.ia-t-small`, `--ia-fg-2`; under the title on phones, beside it from 1024) · the `plus` icon. At least 72 px tall; the whole header is the button.
- **Panel:** the service's Icons8 icon at 48 px; `description` (verbatim from the PDF) in `.ia-t-body-lg`; `.ia-t-label` "Scope includes" and the `scope` list — one column on phones, two from 768; one `Button` secondary "Discuss this service" → `openLeadModal('expertise-' + id, { service_interest: title, context: { label: 'Expertise — ' + title } })`. For `e02` only: `expertise-interiors` in a 4:5 `Frame` beside the text (from 1024) and a `TextLink` "See the Interior Design page" → `/interior-design`.
- **Behaviour — carried over from the old accordion, unchanged in meaning:** single-open; item `e01` is open on arrival unless the URL hash names another service, in which case that item opens and is scrolled into view (`scrollToHash`, with `location.key` in the dependency list so clicking the same link twice works); pressing the open item closes it, so "all closed" is a legal state; every toggle calls `scheduleRefresh()`. A hash that names no service (for example the retired `#e08`–`#e10`) is ignored without error and the page stays at the top of the ledger.
- **Desktop (≥ 1024):** a sticky index in columns 1–3 lists `01`–`07` with short titles; the current item is marked with the terracotta dot and `aria-current="true"`; pressing an entry opens and scrolls to its item. The ledger occupies columns 4–12. Below 1024 the index is not rendered.

### Section 3 — Why IN-ARCH (`tone="dark"`)

- Eyebrow "02 — Why IN-ARCH"; `h2` `.ia-t-display-lg`: "Spaces designed *around you.*" (the PDF's heading); the `Lede` is the paragraph under that heading in PDF §6, verbatim ("At In-Arch, we believe every project deserves an individual approach. …") — add it to `studioContent` as `whyIntro` if prompt 02 did not capture it.
- The seven differentiators from `studioContent`, title and sentence verbatim, as a numbered list: one column on phones; from 1024 two columns (4 + 3) with the second column starting 96 px lower. Numbers in terracotta-300, titles in `.ia-t-display-sm`.

### Section 4 — The process (`tone="sand"`, `id="process"`)

- Eyebrow "03 — The process"; `h2` `.ia-t-display-lg`: "Seven steps, *in order.*"
- The seven steps from `process.js`, titles and descriptions verbatim.
- **Phones:** a vertical timeline — a 1 px line down the left, each step with its numeral, its `LottieIcon` (32 px, played once on entering), title (`.ia-t-display-sm`) and description. **Desktop:** scroll-led with CSS sticky, no pin: the left column (1–5) stays in view and shows the active step's numeral at `.ia-t-display-2xl`, "03 / 07", and its icon at 96 px; the right column (7–12) is the list of steps, each about 45 vh tall; the active step changes as each crosses the middle of the viewport (opacity cross-fade).
- Reduced motion: static SVG icons, the numeral switches without fading.

### Section 5 — Questions (`tone="light"`, `id="faq"`)

- Eyebrow "04 — Questions"; `h2` `.ia-t-display-lg`: "Before we *begin.*"
- All eight FAQs from `faqs.js` in an `Accordion` (multi-open, all closed on arrival); questions in `.ia-t-display-sm`, answers in `.ia-t-body`, max 62ch. On desktop the heading sits in columns 1–4 and the list in columns 6–12.
- The same eight questions and answers are emitted as `FAQPage` JSON-LD on this route — the schema mirrors visible content, which is why it is allowed here.

### Section 6 — The chooser (`tone="dark"`) — how Expertise ends

- `h2` `.ia-t-display-md`: "Not sure which service you need?"; `Text`: "Choose the closest one — we will work out the rest together."
- Eight `Chip`s: the seven service titles and "Something else". Pressing one opens the lead modal with that value pre-selected: `openLeadModal('expertise-closing', { service_interest: value, context: { label: 'Expertise — chooser' } })`. No separate button: the chips are the action (none is marked `data-primary-cta`, so the dock keeps the primary button).
- Chips wrap; each is at least 44 px tall; on phones they stack two per row at most.

## Functional guardrails

- **Contract frozen.** `public/api/leads.php` and `public/api/config.example.php` are not edited. The endpoint and its actions stay as they are: `POST /api/leads.php?action=create` with body `{ "lead": { … } }`, plus `list`, `update`, `delete` and `health`. Every lead still carries exactly these keys with the same meaning: `lead_id, name, mobile, email, organization, service_interest, state, message, source, status, submitted_at, updated_at, page_url, user_agent, utm_source, utm_medium, utm_campaign, utm_term, utm_content, notes, activity`. The status keys `new, contacted, consultation_booked, procedure_scheduled, completed, not_interested` are never renamed. `.env` and `.env.example` are not edited (use the git-ignored `.env.development.local` for local overrides). Anything new a lead needs is added as an extra key; nothing existing is renamed, removed or reshaped.
- **Admin-frozen files** — no diff against baseline commit `cc2fc52d90987adcf62a5c286c4eb87d155fc3f3`: `src/admin/**`, `src/theme/muiTheme.js`, `src/styles/variables.css`, `src/styles/global.css`, `src/styles/animations.css`, `src/styles/responsive.css`, `src/styles/dulcey.css`, `src/App.css`, `src/hooks/useMediaQuery.js`, `public/api/**`, `.env`, `.env.example`.
- **Admin-bound values** keep their current values, because the admin prints or reads them: `siteConfig.brandName`, `siteConfig.legalName`, `siteConfig.logo` and `LOGO_SIZE` in `src/data/siteConfig.js`; `expertiseTitles` in `src/data/expertiseData.js`; `seoConfig.pages.admin` in `src/config/seo.js`; `getConfig()` in `src/utils/webhookSubmit.js`. Prompt 15 is the only place they change.
- **Deep links keep working.** `/expertise#e01` … `/expertise#e07` typed directly, followed from the Home ledger, followed from the footer's Services column, and followed while already on the page, each open the right service and bring its header into view above the dock. `#services`, `#process` and `#faq` scroll to their sections. Unknown hashes do nothing harmful.
- **"Discuss this service" still pre-selects the service.** The modal opens with the matching title selected, and the stored lead has `source: "expertise-e0N"` and `service_interest` equal to that title.
- **Flows that existed on the old page survive in new form:** the closing CTA into the modal (`expertise-closing`, replacing `expertise-cta`), a direct call link and an email link (dock, footer and modal now carry them).
- **Schema hygiene.** `schema-services` (now the seven services) and `schema-faq` are injected on this route and removed when navigating to a route that does not declare them; `/admin` and the 404 still carry none.
- **`src/data/expertiseData.js` shows no diff** and still exports `expertiseTitles` with its baseline values — the admin imports it.
- **Truthful content.** Every fact comes from `details of in-arch.pdf` through the modules in `src/data/`. No testimonials, awards, client names, statistics, ratings, years, areas, locations or quotes are invented; where the client supplied nothing the surface stays silent and the gap is listed in `prompts/00_INDEX.md`. Service descriptions, scope lists, differentiators, process steps and FAQs are verbatim from the PDF; the page states no fee, timeline, team size or guarantee. Any open-licence photograph here is decorative and never captioned as a project.
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

- **Deep-link matrix.** For each of `#e01`, `#e04`, `#e07`, `#services`, `#process`, `#faq`, `#e09` and `#nonsense`: (a) load the URL directly, (b) navigate to it from another page through the curtain, (c) change the hash while on the page. Record the open item and the scroll position for each; all match the rules above, on a 390 px and a 1440 px viewport.
- **Ledger behaviour.** Single-open holds; closing the open item leaves all closed; Enter and Space toggle; `aria-expanded` and `aria-controls` are correct; the sticky index tracks the open item and is absent below 1024 px; after toggling, reveal animations further down still trigger at the right place (ScrollTrigger was refreshed).
- **Lead context.** Press "Discuss this service" on `e02` and on `e06`, and a chip in the chooser: the modal shows the right pre-selection and context line each time; `node scripts/qa/lead-flow.js` still passes; the stored `source` values are `expertise-e02`, `expertise-e06`, `expertise-closing`.
- **Content check.** Every service description, scope item, differentiator, step and FAQ matches the PDF text word for word; counts are 7 / 7 / 7 / 8.
- **Structured data.** On `/expertise` the document contains one `schema-services` (seven `Service` items with `/expertise#e0N` URLs) and one `schema-faq` (eight questions) and both validate as JSON; after navigating to `/about` both are gone; on `/` `schema-services` is present and `schema-faq` is not.
- **Animated icons.** The Lottie player and files are requested only when the process section approaches the viewport, never on first load; each icon plays once; with reduced motion no Lottie request is made at all.
- **Layout** at 360, 390, 768, 1024, 1280, 1440 and 1920 px: long service titles ("Commercial & Institutional Architecture", "3D Visualisation & Architectural Presentation") wrap cleanly in the ledger, the index and the chips; scope lists never overflow; the sticky process column releases before the FAQ.
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

**Close out.** Append an entry to `prompts/BUILD_LOG.md` (date, "Prompt 09", files created / changed / deleted, decisions taken, every deviation from this prompt with its reason, anything left open). Add a short entry under `## [3.0.0] — IN-ARCH redesign (in progress)` at the top of `CHANGELOG.md`. Commit with a message that starts `IN-ARCH 09:`.
