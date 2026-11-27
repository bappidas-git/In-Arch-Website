# 08 — Studio / About

**Prompt 8 of 20**

## Depends on

Before writing anything, read in this order: `prompts/00_INDEX.md` (at least "Owner decisions", "Design direction" and "Build architecture"), then `prompts/BUILD_LOG.md` (what earlier sessions really did, including deviations). An owner decision recorded in the index overrides any default written in this prompt; if an answer there disagrees with what the modules in `src/data/` currently hold, bring the data into line first and log it (the admin-bound values named under the guardrails are the exception — only prompt 15 changes those). If the build log shows a dependency below is unfinished, stop and say so instead of improvising it.

- **Prompts 01–05** — design system, assets and data (`src/data/studioContent.js`, image keys `studio-band-wide`, `studio-band-tall`, `studio-detail`), the kit, the shell and the lead modal.
- **Prompts 06–07** — the Home page is finished; its principal block links to `/about#principal`, which this prompt must provide.

## Context

IN-ARCH — *In-Arch Architects & Interior Designer*, Boring Road, Patna, Bihar, led by Principal Architect Ar. Mohammad Hassanuddin — is getting a new public website on an existing React boilerplate that still wears a previous client's brand ("Dulcey Lead Services"). The new brand is warm, quiet, editorial luxury: ivory `#F4EFE7` and espresso `#231B15` (both sampled from the logo), deep charcoal-green `#161E19`, one terracotta accent; Fraunces serif headlines with a single italic terracotta phrase, Manrope for text and UI. Logo files are named for the background they sit ON: `logos/in-arch-logo-light-transparent.png` is the espresso lockup for light backgrounds, `logos/in-arch-logo-dark-transparent.png` the ivory lockup for dark backgrounds, and `logos/in-arch-favicon-light-transparent.png` / `logos/in-arch-favicon-dark-transparent.png` are the "IA" monogram under the same rule. Stack reality: React 18 + Create React App (`react-scripts` 5, plain JavaScript), React Router 7 in `BrowserRouter` mode, CSS Modules, GSAP 3.15 with ScrollTrigger. There is no `db.json`: enquiries are POSTed to `public/api/leads.php` (a JSON-file store) and read by the MUI admin panel at `/admin`.

## Objective

Replace the boilerplate's About page with the **Studio** page at the same URL, `/about`: who IN-ARCH is, how it thinks, and who leads it. It is the site's main trust page, so it is built from the client's own words and the principal architect's real credentials — and it opens, moves and ends differently from Home: a typographic opening instead of a photographic one, an editorial reading rhythm, and a quiet, practical ending.

## Scope — files/areas to touch

**Create** — `src/pages/Studio/StudioPage.jsx`, `StudioPage.module.css`, `index.js`, and in `src/pages/Studio/sections/` (each `.jsx` + `.module.css`): `StudioHero`, `AboutSection`, `PhilosophySection`, `VisionMissionSection`, `PrincipalSection`, `VisitSection`.

**Edit**

- `src/App.jsx` — the `/about` route now lazy-loads `./pages/Studio/StudioPage` (same path, same `lazyRoute` wrapper, with its `preload()` handle).
- `src/config/seo.js` — `pages.about`: title "About In-Arch Architects, Patna"; description "In-Arch Architects & Interior Designer is an architecture and interior design practice in Patna, Bihar, led by Principal Architect Ar. Mohammad Hassanuddin, a registered architect with the Council of Architecture, India."; breadcrumb "Studio".

**Delete** — the whole of `src/pages/About/` (page, index and the six section pairs: `HeroSection`, `IntersectionSection`, `PerspectiveSection`, `DifferenceSection`, `PrinciplesSection`, `CommitmentSection`).

**Out of scope** — the route path (it stays `/about`); the navigation data (already "Studio" since prompt 04); the legacy image `public/images/about-band*` (removed in prompt 14); the seven "key differentiators" in `studioContent` (they belong to the Expertise page, prompt 09); everything under `src/admin/`.

## Brand & design requirements

### Design contract — identical in every prompt of this series

- **Colour.** Light surfaces: ivory `#F4EFE7` (page canvas, the logo's ivory), paper `#FAF7F2` (raised surfaces, fields), sand `#E9E3D8` (alternate band), stone `#DAD3C6` (placeholders only). Dark surfaces: forest `#161E19`, forest-2 `#1E2823`, forest-3 `#28342E`. Text on light: espresso `#231B15` (the logo's ink), ink-2 `#4F453D`, ink-3 `#6B6058` (never on stone). Text on dark: ivory `#F4EFE7`, mist `#B9BDB6`, mist-2 `#8E958D` (never on forest-3). Accent: terracotta-700 `#8F4A2B` (small text, links and button fill on light — 5.77:1 on ivory, 5.17:1 on sand), terracotta-500 `#B5653F` (display text ≥ 24 px and decoration on light — 3.75:1), terracotta-300 `#DDA27F` (every accent on dark — 7.74:1 on forest). Lines: `#D8D0C3` hairline and `#8A7F74` control border on light; `#28342E` and `#8E958D` on dark. Feedback: success `#3F6B4F` (`#8FBF9F` on dark), error `#A4372A` (`#F0A090` on dark). Terracotta is never a section background and never covers more than about a tenth of a viewport.
- **Type.** Display: Fraunces variable (axes `opsz` 9–144 and `wght` 300–600, roman + italic), weight 300 at ≥ 40 px and 400 below, tracking −0.02em, `font-optical-sizing: auto`. Text and UI: Manrope variable (300–700), body 400, labels 600. Scale: display-2xl `clamp(2.75rem, 1.2rem + 7.2vw, 8.5rem)` (45 px at 360 → 136 px), display-xl `clamp(2.5rem, 1.35rem + 5.2vw, 6.5rem)` (40 → 104), display-lg `clamp(2rem, 1.3rem + 3.2vw, 4.5rem)` (32 → 72), display-md `clamp(1.625rem, 1.25rem + 1.7vw, 2.75rem)` (26 → 44), display-sm `clamp(1.375rem, 1.2rem + 0.8vw, 1.875rem)` (22 → 30), body-lg `clamp(1.0625rem, 0.98rem + 0.38vw, 1.3125rem)` (17 → 21), body `clamp(1rem, 0.97rem + 0.14vw, 1.0625rem)` (16 → 17), small `0.875rem`, caption `0.8125rem`, label `0.75rem` uppercase with `0.18em` tracking. Line-height 1.02 (2xl, xl), 1.08 (lg), 1.15 (md), 1.2 (sm), 1.65 (body). One italic terracotta phrase per headline, never more. Headings `text-wrap: balance`, body `text-wrap: pretty`, measure ≤ 68ch.
- **Space.** 4 px base: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160, 192. Section rhythm `clamp(5rem, 3rem + 9vw, 12rem)` (80 px at 360 → 192 px); compact rhythm `clamp(3.5rem, 2.5rem + 4.5vw, 7.5rem)`; page gutter `clamp(1.25rem, 0.5rem + 3.4vw, 5rem)` (20 px at 360, 57 px at 1440); content max-width 1680 px.
- **Grid and breakpoints.** 4 columns / 16 px gap below 768 px; 8 columns / 24 px from 768; 12 columns / 32 px from 1024; 40 px gap from 1440. Breakpoints are min-width 768, 1024, 1280, 1440, 1920. Every surface is designed at 360–390 px first and then scaled up.
- **Shape.** Square corners on imagery and sections; 2 px radius on buttons, fields and the dock; 1 px hairlines; no drop shadows except `0 24px 60px rgba(22,30,25,.18)` on overlays.
- **Motion.** Transform and opacity only. Durations 150 / 240 / 400 / 700 / 1000 ms (plus the few named values a prompt gives for one specific movement). CSS eases `cubic-bezier(0.22,1,0.36,1)` (out), `cubic-bezier(0.65,0,0.35,1)` (in-out), `cubic-bezier(0.16,1,0.3,1)` (expo). GSAP: `power3.out` for reveals, `expo.out` for headline lines, `power3.inOut` for masks and the page curtain, `none` for scrub. Rise 24 px on mobile / 40 px from 1024; stagger 0.08 s; ScrollTrigger start `top 85%`, once. Under `prefers-reduced-motion: reduce` everything is visible at once with no transforms, parallax, pinning, curtain or marquee. No scroll-smoothing library and no scroll-jacking: the page always moves 1:1 with the finger or wheel.
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

Rhythm: **light** type-led hero with one photographic band → **light** reading section → **dark** philosophy → **sand** vision and mission → **light** principal → **dark** practical ending. Where Home is image-first, this page is word-first.

### Section 1 — Hero (`tone="light"`)

- Eyebrow (no number): "The studio"
- `h1`, `.ia-t-display-xl`: "Design with *purpose.*" (the first principle of the PDF's design philosophy.)
- `Lede`, max 52ch: "An architecture and interior design practice in Patna, Bihar, focused on spaces that are functional, visually appealing and thoughtfully planned."
- Then a full-bleed photographic band: `studio-band-wide` (21:9) from 768 px, `studio-band-tall` (4:3) on phones, in a `Frame` with `reveal` and `parallax`, as a `Picture` with `priority`.
- **Phones:** the copy starts 120 px below the top (clear of the masthead), left-aligned; the band follows after 48 px and bleeds edge to edge. **Desktop:** the `h1` spans columns 1–8; the lede sits in columns 8–12, bottom-aligned with the last line of the `h1`; the band follows after 96 px. The masthead uses the dark-ink logo here (light tone).
- Motion: `h1` `data-m="lines"` `data-m-now`; lede rises; the band's shutter opens as it enters.

### Section 2 — About In-Arch (`tone="light"`)

- Eyebrow "01 — About In-Arch"; `h2` `.ia-t-display-md`: "Understanding people, *then designing for them.*"
- Body: the "About In-Arch" paragraphs two to five from `studioContent`, verbatim, set as prose in `.ia-t-body-lg` for the first paragraph and `.ia-t-body` for the rest, max 62ch.
- **Phones:** eyebrow, heading, prose in one column. **Desktop:** an editorial split — eyebrow and heading in columns 1–5, `position: sticky` at 120 px from the top while the prose (columns 7–12) scrolls past; the sticky ends with the section. No image in this section: it is for reading.

### Section 3 — Design philosophy (`tone="dark"`)

- Eyebrow "02 — Design philosophy"; `h2` `.ia-t-display-lg`: "Four principles, *one approach.*"
- The four principles from `studioContent`, titles and sentences verbatim: Design with Purpose · Aesthetics with Functionality · Attention to Detail · Client-Centric Approach.
- **Phones:** four blocks stacked, each with a large numeral (`.ia-t-display-md`, terracotta-300), the title in `.ia-t-display-sm` and its sentence; hairlines between. **Desktop:** scroll-led without pinning — the left half (columns 1–5) is a sticky panel showing the current principle's numeral at `.ia-t-display-2xl` and, beneath it, `studio-detail` in a 4:5 `Frame`; the right half (columns 7–12) lists the four principles with 40 vh of space each, and as each one crosses the middle of the viewport the numeral cross-fades (opacity only). If prompt 02's build log says `studio-detail` was dropped, the panel shows the numeral alone.
- Reduced motion: the numeral simply switches.

### Section 4 — Vision and mission (`tone="sand"`)

- Eyebrow "03 — Vision"; the vision sentence from `studioContent`, verbatim, as an `h2` in `.ia-t-display-md`, max 22 words per measure, spanning columns 1–9 on desktop.
- After a hairline: `.ia-t-label` "Mission", then the five mission points verbatim as an ordered list — numbered `01`–`05`, one column on phones, two columns (3 + 2) from 1024.

### Section 5 — Principal architect (`tone="light"`, `id="principal"`)

- Eyebrow "04 — Principal architect"; `h2` `.ia-t-display-lg`: "Ar. Mohammad *Hassanuddin.*"; `.ia-t-label`: "Principal Architect & Founder".
- The biography paragraphs from `studioContent`, verbatim.
- A statement set apart in `.ia-t-display-sm` — in the third person and **without quotation marks**, because it is the document's description of him, not his words: "He believes in continuously improving design skills, exploring new ideas and delivering projects with a strong focus on functionality and aesthetics."
- `FactList` "Credentials" — the five from the PDF. A compact table "Experience" — organisation, role, period — in the PDF's order; the Zenith row shows no period (owner decision D-23). "Education" — B.Arch, Piloo Mody College of Architecture (PMCA), Cuttack, Odisha.
- **The portrait slot** (owner decision D-11). No photograph of the principal was supplied, so the slot (4:5, columns 1–5 on desktop, full width on phones, above the name) renders a typographic plate: a forest panel with the ivory "IA" mark at 72 px, centred, and `.ia-t-label` "Principal Architect" at the bottom. When `studio.principal.portrait` holds an image key, the same slot renders that `Picture` instead — no layout change. Never substitute a stock photograph of a person.
- **Desktop:** plate in columns 1–5, sticky; name, biography, statement and lists in columns 7–12.

### Section 6 — Visit and talk (`tone="dark"`) — how Studio ends

A practical ending, not a headline band.

- Left: `.ia-t-label` "Visit"; the address from `studio.address` in `.ia-t-display-sm`; "From 10:00 AM"; `TextLink` "Get directions" → `studioMapsHref` (new tab, `rel="noopener"`, with a screen-reader "opens in a new tab").
- Right: `.ia-t-label` "Talk"; the phone number as a `tel:` link in `.ia-t-display-sm`; `TextLink` "WhatsApp"; and one `Button` secondary "Talk to the studio" → `openLeadModal('studio-closing', { context: { label: 'Studio' } })`.
- Stacked on phones (Talk first — it is the action), two columns from 768.

## Functional guardrails

- **Contract frozen.** `public/api/leads.php` and `public/api/config.example.php` are not edited. The endpoint and its actions stay as they are: `POST /api/leads.php?action=create` with body `{ "lead": { … } }`, plus `list`, `update`, `delete` and `health`. Every lead still carries exactly these keys with the same meaning: `lead_id, name, mobile, email, organization, service_interest, state, message, source, status, submitted_at, updated_at, page_url, user_agent, utm_source, utm_medium, utm_campaign, utm_term, utm_content, notes, activity`. The status keys `new, contacted, consultation_booked, procedure_scheduled, completed, not_interested` are never renamed. `.env` and `.env.example` are not edited (use the git-ignored `.env.development.local` for local overrides). Anything new a lead needs is added as an extra key; nothing existing is renamed, removed or reshaped.
- **Admin-frozen files** — no diff against baseline commit `cc2fc52d90987adcf62a5c286c4eb87d155fc3f3`: `src/admin/**`, `src/theme/muiTheme.js`, `src/styles/variables.css`, `src/styles/global.css`, `src/styles/animations.css`, `src/styles/responsive.css`, `src/styles/dulcey.css`, `src/App.css`, `src/hooks/useMediaQuery.js`, `public/api/**`, `.env`, `.env.example`.
- **Admin-bound values** keep their current values, because the admin prints or reads them: `siteConfig.brandName`, `siteConfig.legalName`, `siteConfig.logo` and `LOGO_SIZE` in `src/data/siteConfig.js`; `expertiseTitles` in `src/data/expertiseData.js`; `seoConfig.pages.admin` in `src/config/seo.js`; `getConfig()` in `src/utils/webhookSubmit.js`. Prompt 15 is the only place they change.
- **The URL is unchanged.** `/about` still resolves, is still lazy-loaded inside `PublicLayout`, still has its `SEOHead` entry and its place in the navigation; `/about#principal` scrolls to the principal section through the existing `ScrollManager`.
- **Flows that existed on the old About page survive in new form:** a CTA into the lead modal (`studio-closing`, replacing `about-cta`) and an onward link into the services (the dock and the footer both link to `/expertise`).
- **The lazy boundary holds.** The Studio page is its own chunk; it adds nothing to the main bundle.
- **Sticky, not pinned.** The two sticky layouts use CSS `position: sticky` inside the public document (prompt 04 made that possible) and degrade to normal flow below 1024 px; no ScrollTrigger pin, no scroll-jacking.
- **Truthful content.** Every fact comes from `details of in-arch.pdf` through the modules in `src/data/`. No testimonials, awards, client names, statistics, ratings, years, areas, locations or quotes are invented; where the client supplied nothing the surface stays silent and the gap is listed in `prompts/00_INDEX.md`. On this page in particular: no portrait that is not the principal's own photograph; no sentence in quotation marks attributed to him; no registration number, no founding year, no "years of experience", no team size, no client list; the Zenith entry carries no dates.
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

- **Content check against the source.** Compare every paragraph, list item and credential on the page with `details of in-arch.pdf` (extract with `pdftotext -layout`): the verbatim blocks match word for word; nothing appears that is not in the PDF or in this prompt.
- **Layout** at 360, 390, 768, 1024, 1280, 1440 and 1920 px: the hero copy clears the masthead; the photographic band is edge to edge and shows no blemish listed in prompt 02; the two sticky columns stick and release cleanly at 1024 and above and are plain stacked content below; the experience table never scrolls horizontally on a 360 px screen (it reflows to stacked rows).
- **Deep link.** `/about#principal` typed directly, reached from the Home page's "About the principal" link, and reached while already on `/about`, lands on the section each time with its heading visible above the dock.
- **Portrait slot.** With `studio.principal.portrait` empty the plate renders; temporarily point it at any manifest key and confirm the image replaces the plate with no layout shift, then revert.
- **Ending.** The button sends `source: "studio-closing"`; directions open Google Maps in a new tab; the phone and WhatsApp links are well-formed; no email row appears.
- **Cleanliness.** `src/pages/About/` no longer exists and nothing imports from it; `grep -ri "dulcey\|pharma\|trust. security" src/pages/Studio` returns nothing.
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

**Close out.** Append an entry to `prompts/BUILD_LOG.md` (date, "Prompt 08", files created / changed / deleted, decisions taken, every deviation from this prompt with its reason, anything left open). Add a short entry under `## [3.0.0] — IN-ARCH redesign (in progress)` at the top of `CHANGELOG.md`. Commit with a message that starts `IN-ARCH 08:`.
