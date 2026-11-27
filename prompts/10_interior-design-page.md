# 10 — Interior Design (new dedicated page)

**Prompt 10 of 20**

## Depends on

Before writing anything, read in this order: `prompts/00_INDEX.md` (at least "Owner decisions", "Design direction" and "Build architecture"), then `prompts/BUILD_LOG.md` (what earlier sessions really did, including deviations). An owner decision recorded in the index overrides any default written in this prompt; if an answer there disagrees with what the modules in `src/data/` currently hold, bring the data into line first and log it (the admin-bound values named under the guardrails are the exception — only prompt 15 changes those). If the build log shows a dependency below is unfinished, stop and say so instead of improvising it.

- **Prompts 01–05** — design system; `src/data/interiors.js`, `services.js` (`e02` Interior Design, `e07` Renovation & Interior Upgradation), `process.js`, `faqs.js`, `projects.js`; image keys `interiors-hero-tall`, `interiors-hero-wide`, `interiors-kitchen`, `interiors-detail-a`, `interiors-detail-b`, `interiors-detail-c`, the six `sw-*` swatches and the seven `pr-*-cover-tall` covers; the kit (including `Frame`'s `arch` prop, `ProjectTile`, `Accordion`); the shell, where "Interior Design" is already the fourth navigation item and `/interior-design` currently renders `PendingPage`; the lead modal with its source names `interiors-hero` and `interiors-closing`.
- **Prompt 09** — `generateFaqSchema` and the `faq` page-config key exist in the SEO layer; the Expertise page links here from its Interior Design service.

## Context

IN-ARCH — *In-Arch Architects & Interior Designer*, Boring Road, Patna, Bihar, led by Principal Architect Ar. Mohammad Hassanuddin — is getting a new public website on an existing React boilerplate that still wears a previous client's brand ("Dulcey Lead Services"). The new brand is warm, quiet, editorial luxury: ivory `#F4EFE7` and espresso `#231B15` (both sampled from the logo), deep charcoal-green `#161E19`, one terracotta accent; Fraunces serif headlines with a single italic terracotta phrase, Manrope for text and UI. Logo files are named for the background they sit ON: `logos/in-arch-logo-light-transparent.png` is the espresso lockup for light backgrounds, `logos/in-arch-logo-dark-transparent.png` the ivory lockup for dark backgrounds, and `logos/in-arch-favicon-light-transparent.png` / `logos/in-arch-favicon-dark-transparent.png` are the "IA" monogram under the same rule. Stack reality: React 18 + Create React App (`react-scripts` 5, plain JavaScript), React Router 7 in `BrowserRouter` mode, CSS Modules, GSAP 3.15 with ScrollTrigger. There is no `db.json`: enquiries are POSTed to `public/api/leads.php` (a JSON-file store) and read by the MUI admin panel at `/admin`.

## Objective

Build the page the client asked for by name: a standalone, top-level **Interior Design** page at `/interior-design` that a visitor reads immediately as the interiors destination — not a section of Expertise. It has its own identity inside the brand (a warmer palette balance, an arch motif taken from the studio's own built work, image-led storytelling), its own hero, interior-specific services and process, the materials-and-detail story, the interior projects, its own FAQs and its own calls to action. Every photograph on it is the client's.

## Scope — files/areas to touch

**Create** — `src/pages/Interiors/InteriorsPage.jsx`, `InteriorsPage.module.css`, `index.js`, and in `src/pages/Interiors/sections/` (each `.jsx` + `.module.css`): `InteriorsHero`, `ScopeSection`, `RoomStories`, `MaterialBoard`, `InteriorProcess`, `InteriorProjects`, `InteriorFaq`, `InteriorClosing`.

**Edit**

- `src/App.jsx` — the `/interior-design` route lazy-loads `./pages/Interiors/InteriorsPage` instead of `PendingPage` (keep the `lazyRoute` wrapper and add its `preload()` handle).
- `src/config/seo.js` — `pages.interiors`: path `/interior-design`; title "Interior Designers in Patna, Bihar — IN-ARCH"; description "Residential and commercial interior design in Patna by In-Arch Architects & Interior Designer: living spaces, modular kitchens, lighting, panelling, furniture and detailed interior drawings."; breadcrumb "Interior Design"; `faq` = `['q3', 'q4', 'q6', 'q7', 'q8']`; indexable.
- `src/components/common/SEO/SEOHead.jsx` — `ROUTE_MAP['/interior-design']` now resolves to `pages.interiors` (indexable, no longer the pending config).

**Out of scope** — the Expertise page (it already links here); the Portfolio pages (prompts 11–12 — tiles here link to `/portfolio/<slug>`, which still shows the interim page until then); open-licence photography (none on this page); everything under `src/admin/`.

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

### What makes this page its own

- **Tone balance.** The rest of the site leads with ivory and forest; this page leads with **paper** and **sand**, uses forest only twice, and lets terracotta appear a little more often (numerals, captions, the arch outline) — still under a tenth of any screen.
- **The arch.** Everywhere else imagery is square-cornered. Here — and only here — the hero image and the story images sit in frames with a fully rounded top (`Frame` with `arch`), echoing the arched niches the studio built in the `arched-niche-living-room` project. No other shape is rounded.
- **Image-led.** Where Expertise is lists, this page is pictures with short captions; body copy never exceeds three sentences per block.
- **Its own voice in the CTAs:** "Plan your interior", "Book an interior consultation".

Rhythm: **paper** hero → **sand** scope → **paper** room stories → **dark** material board → **sand** process → **paper** projects → **sand** FAQ → **dark** closing.

### Section 1 — Hero (`tone="paper"`)

- Eyebrow: "Interior Design"; `h1` `.ia-t-display-xl`: "Interiors, *composed.*"; `Lede` — the description of service `e02`, verbatim from the PDF: "We design interior environments that reflect individual requirements, combining spatial planning, materials, lighting and furniture to create comfortable and visually cohesive spaces."
- One primary `Button` `lg`, `data-primary-cta`: "Plan your interior" → `openLeadModal('interiors-hero', { service_interest: 'Interior Design', context: { label: 'Interior Design — hero' } })`; beside it a `TextLink` "See interior projects" → `#projects`.
- Image: `interiors-hero-tall` (4:5) in an arched `Frame`, `Picture` with `priority`.
- **Phones:** copy first (starting 112 px from the top), then the button, then the arched frame at full content width, its top curve cresting just above the fold so the shape is seen at once. **Tablet:** copy in columns 1–5 of 8, frame in columns 5–8, overlapping the copy column by one column. **Desktop:** copy in columns 1–6, vertically centred in an `88svh` section; the arched frame in columns 8–12 at 78 svh tall; a second, smaller arched frame (`interiors-detail-a`, 4:5, columns 6–7, 200 px wide) overlaps the big one's lower-left corner and drifts at `data-m-parallax="10"`.
- Motion: `h1` lines on load; the big arch opens with the shutter; the small one rises 40 px 0.2 s later.

### Section 2 — What we design (`tone="sand"`, `id="scope"`)

- Eyebrow "01 — What we design"; `h2` `.ia-t-display-lg`: "Every room, *considered.*"
- The four clusters from `interiors.js`, items verbatim from the PDF: **Living spaces**, **Kitchens and bathrooms**, **Workplaces and retail**, **Detail and finish**. Each cluster: a numeral, the cluster name in `.ia-t-display-sm`, its items as a plain list.
- **Phones:** four stacked blocks with hairlines. **Desktop:** a 2 × 2 arrangement on the 12-column grid with the right-hand column starting 64 px lower than the left.
- Under a hairline, a fifth block for **Renovation and upgrades** — the list of service `e07`, verbatim — introduced by its PDF sentence "We help transform existing spaces through thoughtful renovation, improved planning and contemporary design interventions."

### Section 3 — Room by room (`tone="paper"`)

Three short stories from `interiors.js`, each a heading, two or three sentences and one or two photographs:

1. **Living spaces** — `interiors-hero-wide`. "Living rooms and bedrooms planned around how they are used: seating, storage, light and wall finishes considered together."
2. **Kitchens** — `interiors-kitchen`, `interiors-detail-c`. "Modular kitchens planned for efficient work: storage, contemporary finishes and lighting, fitted to the room."
3. **Made to measure** — `interiors-detail-a`, `interiors-detail-b`. "Panelling, lattice-cut screens, furniture and storage, drawn in detail before they are built."

- **Phones:** each story is image(s) then text, stacked; a story's two images sit side by side at 3:4 each. **Desktop:** scroll-led with CSS sticky, no pin — the left half (columns 1–6) holds one arched frame that stays in view; the right half (columns 8–12) lists the three stories with about 70 vh each; as each story crosses the middle of the viewport the frame cross-fades to that story's first image (opacity only), and the story's second image appears inline in the text column.
- Reduced motion: the frame switches without fading.

### Section 4 — The material board (`tone="dark"`)

- Eyebrow "02 — Materials and detail"; `h2` `.ia-t-display-lg`: "The detail *is the design.*"; `Text`: the PDF's "Attention to Detail" sentence from `studioContent`, verbatim.
- Six square swatches with one-line captions in `.ia-t-label`: `sw-fluted` "Fluted panelling" · `sw-stone` "Veined stone-look surfaces" · `sw-lattice` "Lattice-cut screens" · `sw-gloss` "High-gloss cabinetry" · `sw-moulding` "Framed wall mouldings" · `sw-tufting` "Buttoned upholstery".
- **Phones:** two columns, the right column offset down by 32 px. **Desktop:** six across the grid (two columns each), alternating 0 / 48 px vertical offsets, each swatch drifting slightly with `data-m-parallax` (values 3 to 8). Swatches are squares — the arch is not used here.
- Captions describe what is seen; they name no species, brand or supplier.

### Section 5 — How an interior project runs (`tone="sand"`, `id="process"`)

- Eyebrow "03 — How it runs"; `h2` `.ia-t-display-md`: "From first conversation to *completed room.*"
- The seven steps from `process.js` (titles verbatim; descriptions verbatim) as a compact horizontal stepper: **phones and tablet** — a swipe row with scroll-snap, one step per 78 vw card, a "3 / 7" counter and previous / next `IconButton`s; **desktop** — seven columns in one row, numerals above a continuous hairline, static Icons8 icons at 32 px.
- Two notes beneath, each one sentence taken from the FAQ answers: "Interior design can be undertaken as an independent service or integrated with architectural design." and "3D visualisation can be included in the design process to help clients understand the proposed spaces."

### Section 6 — Interior projects (`tone="paper"`, `id="projects"`)

- Eyebrow "04 — Interior projects"; `h2` `.ia-t-display-lg`: "Rooms we have *designed.*"
- All seven projects from `projects.js` as `ProjectTile`s with their `-cover-tall` (4:5) images, each linking to `/portfolio/<slug>`: one column on phones; two columns from 768 with the right column offset 96 px; three columns from 1280 with offsets 0 / 96 / 48 px.
- `TextLink` "Open the portfolio" → `/portfolio`.

### Section 7 — Questions (`tone="sand"`, `id="faq"`)

- Eyebrow "05 — Questions"; `h2` `.ia-t-display-md`: "About interior projects."
- FAQs `q3`, `q4`, `q6`, `q7`, `q8` from `faqs.js`, verbatim, in an `Accordion` (multi-open). The same five are emitted as `FAQPage` JSON-LD on this route.

### Section 8 — Closing (`tone="dark"`) — how this page ends

- A small arched frame (`interiors-detail-b`, 4:5, 220 px wide on phones, 320 px on desktop) beside the copy — the page ends on its own motif.
- `h2` `.ia-t-display-lg`: "Planning an *interior?*"; `Text`: "Tell us about the rooms, the area and what you would like to change."
- Primary `Button` `lg`, `data-primary-cta`: "Book an interior consultation" → `openLeadModal('interiors-closing', { service_interest: 'Interior Design', context: { label: 'Interior Design — closing' } })`; `TextLink` "WhatsApp".

## Functional guardrails

- **Contract frozen.** `public/api/leads.php` and `public/api/config.example.php` are not edited. The endpoint and its actions stay as they are: `POST /api/leads.php?action=create` with body `{ "lead": { … } }`, plus `list`, `update`, `delete` and `health`. Every lead still carries exactly these keys with the same meaning: `lead_id, name, mobile, email, organization, service_interest, state, message, source, status, submitted_at, updated_at, page_url, user_agent, utm_source, utm_medium, utm_campaign, utm_term, utm_content, notes, activity`. The status keys `new, contacted, consultation_booked, procedure_scheduled, completed, not_interested` are never renamed. `.env` and `.env.example` are not edited (use the git-ignored `.env.development.local` for local overrides). Anything new a lead needs is added as an extra key; nothing existing is renamed, removed or reshaped.
- **Admin-frozen files** — no diff against baseline commit `cc2fc52d90987adcf62a5c286c4eb87d155fc3f3`: `src/admin/**`, `src/theme/muiTheme.js`, `src/styles/variables.css`, `src/styles/global.css`, `src/styles/animations.css`, `src/styles/responsive.css`, `src/styles/dulcey.css`, `src/App.css`, `src/hooks/useMediaQuery.js`, `public/api/**`, `.env`, `.env.example`.
- **Admin-bound values** keep their current values, because the admin prints or reads them: `siteConfig.brandName`, `siteConfig.legalName`, `siteConfig.logo` and `LOGO_SIZE` in `src/data/siteConfig.js`; `expertiseTitles` in `src/data/expertiseData.js`; `seoConfig.pages.admin` in `src/config/seo.js`; `getConfig()` in `src/utils/webhookSubmit.js`. Prompt 15 is the only place they change.
- **A real, indexable, first-class route.** `/interior-design` is in the navigation (dock, index overlay, footer), lazy-loaded inside `PublicLayout`, resolved by `SEOHead` to its own config (indexable, with breadcrumb and FAQ schema), and no longer renders the interim page.
- **Lead context.** Both CTAs open the modal with "Interior Design" pre-selected; the stored leads carry `source: "interiors-hero"` or `"interiors-closing"` and `service_interest: "Interior Design"`.
- **Only client photographs.** No open-licence or stock image on this page. No photograph is used here in a second editorial placement beyond what prompt 02's plan assigns (the project covers and swatches are project contexts).
- **The arch stays here.** Do not add the `arch` frame to any other page or to shared components' defaults.
- **Swipe rows never trap the page** and have button alternatives; sticky layouts are CSS sticky, not pins.
- **Truthful content.** Every fact comes from `details of in-arch.pdf` through the modules in `src/data/`. No testimonials, awards, client names, statistics, ratings, years, areas, locations or quotes are invented; where the client supplied nothing the surface stays silent and the gap is listed in `prompts/00_INDEX.md`. Service lists, process steps and FAQ answers are verbatim; swatch and story captions describe only what is visible; no price, duration, warranty, brand or supplier is stated.
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

- **First impression test.** Load `/interior-design` cold at 390 px and at 1440 px and take one screenshot of the first screen each: without scrolling, the page name, the arch-framed interior photograph and one clear action are all visible, and the screen cannot be mistaken for Home, Studio or Expertise (compare the four first screens side by side and attach them to the build log).
- **Layout** at 360, 390, 768, 1024, 1280, 1440 and 1920 px: the arch is a true semicircle top at every width (frame radius = half its width), never an ellipse; the small overlapping arch never covers the headline; the sticky story frame sticks and releases cleanly from 1024 and is stacked content below; the material board's offsets never cause overlap or horizontal scroll at 360.
- **Images.** Every image on the page resolves from the manifest, has dimensions and alt text, is lazy except the hero, and shows none of the blemishes listed in prompt 02; the hero is the LCP element and LCP ≤ 2.5 s at 390 px on "Fast 4G" with 4× CPU.
- **Stepper.** Swipe, buttons and keyboard all move one step; the counter is announced; on desktop all seven steps fit one row at 1024 without truncation.
- **Lead context.** Both CTAs: correct pre-selection and context line in the modal; stored `source` and `service_interest` as specified (`node scripts/qa/lead-flow.js` still passes).
- **Structured data.** `schema-faq` on this route contains exactly the five questions shown and disappears on navigation away; the breadcrumb reads Home → Interior Design.
- **Navigation.** "Interior Design" is marked current in the dock and the overlay; the Expertise page's link and the footer's link both arrive here through the curtain; `#projects`, `#process`, `#faq` scroll correctly.
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

**Close out.** Append an entry to `prompts/BUILD_LOG.md` (date, "Prompt 10", files created / changed / deleted, decisions taken, every deviation from this prompt with its reason, anything left open). Add a short entry under `## [3.0.0] — IN-ARCH redesign (in progress)` at the top of `CHANGELOG.md`. Commit with a message that starts `IN-ARCH 10:`.
