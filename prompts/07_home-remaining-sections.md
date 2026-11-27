# 07 — Home: remaining sections

**Prompt 7 of 20**

## Depends on

Before writing anything, read in this order: `prompts/00_INDEX.md` (at least "Owner decisions", "Design direction" and "Build architecture"), then `prompts/BUILD_LOG.md` (what earlier sessions really did, including deviations). An owner decision recorded in the index overrides any default written in this prompt; if an answer there disagrees with what the modules in `src/data/` currently hold, bring the data into line first and log it (the admin-bound values named under the guardrails are the exception — only prompt 15 changes those). If the build log shows a dependency below is unfinished, stop and say so instead of improvising it.

- **Prompts 01–05** — design system, assets and data, the kit, the shell and the lead modal.
- **Prompt 06** — `src/pages/Home/HomePage.jsx` already renders the new `HeroSection` and `ManifestoSection` inside its `ia` root, followed by a non-scoped wrapper holding the four old sections (`BeliefSection`, `ExpertiseIndexSection`, `WhoWeServeSection`, `ClosingCtaSection`). This prompt replaces that wrapper.

## Context

IN-ARCH — *In-Arch Architects & Interior Designer*, Boring Road, Patna, Bihar, led by Principal Architect Ar. Mohammad Hassanuddin — is getting a new public website on an existing React boilerplate that still wears a previous client's brand ("Dulcey Lead Services"). The new brand is warm, quiet, editorial luxury: ivory `#F4EFE7` and espresso `#231B15` (both sampled from the logo), deep charcoal-green `#161E19`, one terracotta accent; Fraunces serif headlines with a single italic terracotta phrase, Manrope for text and UI. Logo files are named for the background they sit ON: `logos/in-arch-logo-light-transparent.png` is the espresso lockup for light backgrounds, `logos/in-arch-logo-dark-transparent.png` the ivory lockup for dark backgrounds, and `logos/in-arch-favicon-light-transparent.png` / `logos/in-arch-favicon-dark-transparent.png` are the "IA" monogram under the same rule. Stack reality: React 18 + Create React App (`react-scripts` 5, plain JavaScript), React Router 7 in `BrowserRouter` mode, CSS Modules, GSAP 3.15 with ScrollTrigger. There is no `db.json`: enquiries are POSTed to `public/api/leads.php` (a JSON-file store) and read by the MUI admin panel at `/admin`.

## Objective

Finish the Home page: replace the four remaining old sections with six new ones that each do one job — show the work, state the belief, list the services, explain how a project runs, establish who leads it, and invite the conversation. When this prompt is done the Home page contains no old markup, no old stylesheet and no Dulcey content, and it ends in a way no other page does.

## Scope — files/areas to touch

**Create** (each `.jsx` + `.module.css` in `src/pages/Home/sections/`): `SelectedWorkSection`, `StatementSection`, `ServicesIndexSection`, `HowWeWorkSection`, `PrincipalSection`, `ClosingSection`.

**Edit** — `src/pages/Home/HomePage.jsx`: the six new sections follow the two from prompt 06, all inside the single `ia` root; the non-scoped wrapper and the old `styles.page` reset are removed.

**Delete** — `src/pages/Home/sections/BeliefSection.jsx` + `.module.css`, `ExpertiseIndexSection.jsx` + `.module.css`, `WhoWeServeSection.jsx` + `.module.css`, `ClosingCtaSection.jsx` + `.module.css`.

**Out of scope** — the hero and the opening statement (prompt 06 — do not restyle them); `src/data/expertiseData.js` and `src/data/industriesData.js` themselves (the old Expertise and Who We Serve pages and the admin still read them; they are retired in prompts 09, 11 and 15); the shell; everything under `src/admin/`.

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

The page's rhythm, top to bottom: dark hero → light statement (both from prompt 06) → **sand** work → **dark** belief → **light** services → **sand** process → **light** principal → **dark** invitation. No two neighbours share a tone and no two sections share a layout.

### Section 3 — Selected work (`tone="sand"`)

- Eyebrow "02 — Selected work"; `h2` `.ia-t-display-lg`: "Spaces we have *designed.*"; no body copy.
- Three `ProjectTile`s from `src/data/projects.js`, deliberately not the hero's project: `arched-niche-living-room`, `black-and-veined-stone-kitchen`, `prayer-units` — each linking to `/portfolio/<slug>`, showing index, category and title.
- **Phones:** a horizontal swipe row (native scrolling with `scroll-snap-type: x mandatory`; tiles 78 vw wide, 4:5; the first tile aligned to the 20 px gutter, the next one peeking in), with a "1 / 3" counter and previous / next `IconButton`s underneath, so nothing depends on dragging. **Tablet:** the same row with 44 vw tiles. **Desktop (≥ 1024):** no row — three tiles on the 12-column grid, none aligned: A spans columns 1–5 (4:5); B spans 7–12 (3:2) and starts 128 px lower; C spans 3–8 (3:2) and starts 96 px below A's bottom edge.
- Ends with `TextLink` "View all work" → `/portfolio`, right-aligned on desktop.
- Motion: tiles `data-m="shutter"`; titles `data-m="rise"`.

### Section 4 — The belief (`tone="dark"`)

- One sentence, alone, vertically centred in a section at least `80svh` tall: `h2` `.ia-t-display-xl` — "Every space *tells a story.*" (the PDF's home-page line). Beneath it, after a 48 px hairline, `.ia-t-label` in mist: "Residential · Commercial · Interiors".
- No image, no button, no background graphic. Left-aligned on phones; on desktop the sentence starts at column 2 and spans to column 11.
- Motion: `data-m="lines"`, the hairline `data-m="rule"`.

### Section 5 — What we do (`tone="light"`)

- Eyebrow "03 — What we do"; `h2` `.ia-t-display-lg`: "From concept to *completion.*"; `Lede`: "Seven services, offered on their own or together."
- The seven services from `src/data/services.js` as a ledger: one row each — number (`.ia-t-label`, accent), title (`.ia-t-display-sm`; `.ia-t-display-md` from 1024), tagline (`.ia-t-small`, `--ia-fg-2`), arrow. Each row is one link to `/expertise#e0N`, at least 72 px tall, with hairlines between rows.
- **Desktop enhancement only:** on a fine pointer, hovering or focusing a row shows that service's Icons8 icon at 160 px in a fixed slot in columns 10–12 (cross-fade 240 ms). The row is complete without it; nothing appears on touch.
- After the ledger, a single line that points to the dedicated page: "Interiors have a page of their own." + `TextLink` "Interior Design" → `/interior-design`.
- Motion: rows `data-m="rise"` (batched, 0.06 s stagger); hover moves the title 8 px right and swaps the arrow.

### Section 6 — How we work (`tone="sand"`)

- Eyebrow "04 — How we work"; `h2` `.ia-t-display-lg`: "A collaborative, *detail-oriented* process." (the PDF's own phrase.)
- The four `phases` from `src/data/process.js` — Understand, Imagine, Detail, Deliver — each showing its numeral, its name, and the titles of the PDF steps it groups (for example "Initial Consultation · Site Study & Analysis"), with the Icons8 icon of its first step at 40 px.
- **Phones:** a vertical list with large numerals (`.ia-t-display-md`) on the left. **Desktop:** four columns separated by hairlines, each column's content starting 24 px lower than the previous one.
- Ends with `TextLink` "See the full seven-step process" → `/expertise#process`.

### Section 7 — Who leads the work (`tone="light"`)

The page's trust signal, built only from supplied facts.

- Eyebrow "05 — Who leads the work"; `h2` `.ia-t-display-lg`: "Ar. Mohammad *Hassanuddin.*"; under it `.ia-t-label`: "Principal Architect & Founder".
- A `FactList` with three lines from `studioContent`: "Registered Architect — Council of Architecture, India"; "Registered Architect — Patna Municipal Corporation and Gaya Municipal Corporation"; "B.Arch — Piloo Mody College of Architecture, Cuttack".
- `TextLink` "About the principal" → `/about#principal`.
- No portrait, no quotation, no registration number, no years of experience: none was supplied (owner decision D-11). The layout is typographic — name across columns 1–7, facts in columns 8–12 on desktop; stacked on phones.

### Section 8 — The invitation (`tone="dark"`) — how Home ends

- `h2` `.ia-t-display-xl`: "Have a project *in mind?*"; `Lede`: "Let's discuss your ideas and explore how thoughtful architectural and interior design can transform your space." (both from the PDF.)
- One primary `Button` `lg`, `data-primary-cta`: "Start a conversation" → `openLeadModal('home-closing', { context: { label: 'Home — closing' } })`.
- A secondary row of `TextLink`s: "WhatsApp" (pre-filled greeting) and "Call +91 72928 31128".
- Section at least `70svh`; copy bottom-left on phones, columns 1–8 on desktop. This is the only page that ends with a headline-and-button invitation.

### Across the page

- Section rhythm is the standard `--ia-section-y`; sections 4 and 8 use `minHeight` instead of extra padding.
- No photograph appears twice on this page (the hero uses ph08; the statement uses ph06; the three tiles use ph14, ph02 and ph09).
- Nothing auto-plays; the only scroll-linked effects are parallax on frames and the reveals.

## Functional guardrails

- **Contract frozen.** `public/api/leads.php` and `public/api/config.example.php` are not edited. The endpoint and its actions stay as they are: `POST /api/leads.php?action=create` with body `{ "lead": { … } }`, plus `list`, `update`, `delete` and `health`. Every lead still carries exactly these keys with the same meaning: `lead_id, name, mobile, email, organization, service_interest, state, message, source, status, submitted_at, updated_at, page_url, user_agent, utm_source, utm_medium, utm_campaign, utm_term, utm_content, notes, activity`. The status keys `new, contacted, consultation_booked, procedure_scheduled, completed, not_interested` are never renamed. `.env` and `.env.example` are not edited (use the git-ignored `.env.development.local` for local overrides). Anything new a lead needs is added as an extra key; nothing existing is renamed, removed or reshaped.
- **Admin-frozen files** — no diff against baseline commit `cc2fc52d90987adcf62a5c286c4eb87d155fc3f3`: `src/admin/**`, `src/theme/muiTheme.js`, `src/styles/variables.css`, `src/styles/global.css`, `src/styles/animations.css`, `src/styles/responsive.css`, `src/styles/dulcey.css`, `src/App.css`, `src/hooks/useMediaQuery.js`, `public/api/**`, `.env`, `.env.example`.
- **Admin-bound values** keep their current values, because the admin prints or reads them: `siteConfig.brandName`, `siteConfig.legalName`, `siteConfig.logo` and `LOGO_SIZE` in `src/data/siteConfig.js`; `expertiseTitles` in `src/data/expertiseData.js`; `seoConfig.pages.admin` in `src/config/seo.js`; `getConfig()` in `src/utils/webhookSubmit.js`. Prompt 15 is the only place they change.
- **Flows that existed on the old Home page survive in new form:** a hero CTA into the lead modal (`home-hero`, prompt 06) and a closing CTA into it (`home-closing`, replacing `home-cta`); a click-to-call link; links into each service on `/expertise` by hash (`#e01`–`#e07`, replacing the ten old rows); a link into the studio page; a link into the body of work (now `/portfolio` and its case-study URLs instead of `/industries`).
- **`/industries` is no longer linked from Home but still resolves** (it becomes a redirect in prompt 11).
- **No orphaned imports.** After the deletions, nothing imports `marqueeItems`, `homeTaglineFor` or the deleted section files; `expertiseData.js` and `industriesData.js` remain on disk for their other consumers.
- **Deep links are real.** Every `/portfolio/<slug>` and `/expertise#e0N` link on the page points at a slug or id that exists in the data modules (derive them from the data, never type them by hand).
- **Truthful content.** Every fact comes from `details of in-arch.pdf` through the modules in `src/data/`. No testimonials, awards, client names, statistics, ratings, years, areas, locations or quotes are invented; where the client supplied nothing the surface stays silent and the gap is listed in `prompts/00_INDEX.md`. The principal block shows only the three credentials listed; the work section shows no location, year, area or client.
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

- **Whole page, section by section** at 360, 390, 768, 1024, 1280, 1440 and 1920 px: tones alternate as specified; no section repeats its neighbour's layout; headings match the type table; nothing collides with the dock; the last section's content clears the dock by at least 24 px.
- **Swipe row (phones and tablet).** Swipes natively with snap; the previous / next buttons move exactly one tile and disable at the ends; the counter updates and is announced politely; the row is reachable and operable by keyboard; vertical page scrolling is never trapped inside it.
- **Service ledger.** Seven rows from the data module; each lands on the right item of `/expertise` (still the old page until prompt 09 — the hash must not error); the hover preview appears only with a fine pointer and never shifts layout.
- **Trust block and closing.** `/about#principal` resolves; the closing button sends `source: "home-closing"`; while it is ≥ 60 % visible the dock's button is secondary; WhatsApp and call links are well-formed.
- **Performance.** At 390 px, "Fast 4G", 4× CPU: total JavaScript requested for `/` has not grown by more than 12 KB gzip since prompt 06; every below-the-fold image is lazy and has dimensions; CLS for the full scroll ≤ 0.02; scrolling stays at 60 fps.
- **Cleanliness.** `grep -ri "dulcey\|beyond business\|pharma" src/pages/Home` returns nothing; `src/pages/Home` contains only the eight new sections and the page file.
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

**Close out.** Append an entry to `prompts/BUILD_LOG.md` (date, "Prompt 07", files created / changed / deleted, decisions taken, every deviation from this prompt with its reason, anything left open). Add a short entry under `## [3.0.0] — IN-ARCH redesign (in progress)` at the top of `CHANGELOG.md`. Commit with a message that starts `IN-ARCH 07:`.
