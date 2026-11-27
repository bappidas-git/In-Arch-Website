# 20 — Final QA and parity

**Prompt 20 of 20**

## Depends on

Before writing anything, read in this order: `prompts/00_INDEX.md` (at least "Owner decisions", "Design direction" and "Build architecture"), then `prompts/BUILD_LOG.md` (what earlier sessions really did, including deviations). An owner decision recorded in the index overrides any default written in this prompt; if an answer there disagrees with what the modules in `src/data/` currently hold, bring the data into line first and log it (the admin-bound values named under the guardrails are the exception — only prompt 15 changes those). If the build log shows a dependency below is unfinished, stop and say so instead of improvising it.

- **Prompts 01–19** — all finished. Read the whole of `prompts/BUILD_LOG.md`: every deviation, every "pending third-party asset", every item marked open, the note on whether prompt 14's surface split was kept, and the "admin freeze commit". This prompt closes those items or reports them.

## Context

IN-ARCH — *In-Arch Architects & Interior Designer*, Boring Road, Patna, Bihar, led by Principal Architect Ar. Mohammad Hassanuddin — is getting a new public website on an existing React boilerplate that still wears a previous client's brand ("Dulcey Lead Services"). The new brand is warm, quiet, editorial luxury: ivory `#F4EFE7` and espresso `#231B15` (both sampled from the logo), deep charcoal-green `#161E19`, one terracotta accent; Fraunces serif headlines with a single italic terracotta phrase, Manrope for text and UI. Logo files are named for the background they sit ON: `logos/in-arch-logo-light-transparent.png` is the espresso lockup for light backgrounds, `logos/in-arch-logo-dark-transparent.png` the ivory lockup for dark backgrounds, and `logos/in-arch-favicon-light-transparent.png` / `logos/in-arch-favicon-dark-transparent.png` are the "IA" monogram under the same rule. Stack reality: React 18 + Create React App (`react-scripts` 5, plain JavaScript), React Router 7 in `BrowserRouter` mode, CSS Modules, GSAP 3.15 with ScrollTrigger. There is no `db.json`: enquiries are POSTed to `public/api/leads.php` (a JSON-file store) and read by the MUI admin panel at `/admin`.

## Objective

Check the entire site, end to end, against the baseline recorded in `prompts/00_INDEX.md` — every route, feature, flow, form submission and admin screen, at every breakpoint — fix whatever is found, and leave the repository in a state that ships with no further changes: no leftovers from the previous brand in the public site, no placeholder page, no dead code, documentation that describes what is actually there, and one clear list of the things only the owner can supply before go-live.

## Scope — files/areas to touch

**May edit** — anything in the public site that the checks below show to be wrong (a fix, not a redesign); `README.md`, `CUSTOMIZATION_GUIDE.md`, `SEO_GUIDE.md`, `CHANGELOG.md`; `package.json` metadata (`name`, `description`, `author` unchanged, `keywords`) and scripts; `scripts/qa/` (a `final-check.js` that runs the others in order).

**Create** — `prompts/FINAL_REPORT.md` (the evidence and the go-live list).

**May not** edit `src/admin/**`, `src/theme/`, the five legacy stylesheets, `src/App.css`, `src/hooks/useMediaQuery.js`, `src/surfaces/AdminSurface.jsx`, `public/api/**`, `.env`, `.env.example`; may not rotate or print credentials; may not change the lead contract, add features or restyle sections. If a check reveals a problem that needs a design decision, record it in the report instead of improvising.

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

### 1. Functional parity — the inventory, row by row

Open "Functional inventory" in `prompts/00_INDEX.md` and verify every row on the PHP-served production build, recording pass or fail with one line of evidence in `prompts/FINAL_REPORT.md`:

- **Public routes** — each resolves on a direct load, a refresh and client-side navigation: `/`, `/about`, `/expertise` (and `#e01`–`#e07`, `#services`, `#process`, `#faq`), `/interior-design`, `/portfolio` (and `?category=` for each category, an empty one and nonsense), the seven `/portfolio/<slug>` URLs and an unknown slug, `/contact` (and `#enquiry`, `#find-us`), `/industries` (forwards to `/portfolio`), a nonsense URL (404).
- **Shell** — skip link; masthead; dock on phones and desktop (tone following, yielding to in-page primaries, hiding for overlay / modal / keyboard / footer); index overlay (open, close, Escape, focus trap and return, scroll lock, closes on navigation and at 1024 px); footer links, contact rows, credit, back to top; page transitions (links, back / forward, rapid clicks, reduced motion); route announcements and focus.
- **Lead flow** — modal from every CTA family; validation; success; duplicate; failure; draft restore; honeypot; context carried; the inline form on Contact; WhatsApp, call and directions links. `node scripts/qa/lead-flow.js` passes.
- **API** — with direct requests against the PHP server: `health` answers; `list` without the key is 401; `create` stores a lead with extra keys intact and answers `duplicate` for a repeated mobile; `update` and `delete` work with the key and are refused without it. The request the site sends still matches the frozen shape.
- **States** — 404; unknown project; error boundary; route loading; no-JavaScript message; empty portfolio filter; splash on first load.
- **SEO layer** — per-route title, description, canonical, robots and schemas after both direct load and navigation; static fallback for `/`; sitemap and robots.
- **Admin** — login (wrong and right credentials, remember me), redirect rules, session persistence, logout; dashboard (stats, trend, status breakdown, recent table, refresh, export); leads (search, each filter including the service titles and the source keys the new site produces, sort on every column, pagination sizes, row selection, bulk status, bulk delete, inline status, CSV export then re-import, delete with confirmation, mobile cards); lead detail (all fields, add note, status change, activity timeline, delete, not-found state, mobile footer); Guidelines (gate, wrong and right password, four tabs); cross-tab update (open two tabs, change a status in one); 15-second refresh picks up a lead submitted from the public site.

### 2. Visual pass — every route at every breakpoint

Run `node scripts/qa/public-check.js --matrix full` and review the screenshots for every route and overlay state at 360, 390, 768, 1024, 1280, 1440 and 1920 px: alignment to the grid, the tone rhythm of each page, type sizes against the table in the index, no clipped or overlapping element, no stray legacy colour (pure white `#FFFFFF` page backgrounds, Dulcey red `#D5192E`, ink `#0B0B0C`), consistent CTA states. Compare the four first screens of Home, Studio, Expertise and Interior Design side by side: each opens differently. Compare the last screens of every page: no two pages end the same way.

### 3. Admin parity — the proof

- Build the **admin freeze commit** and this branch; `node scripts/qa/parity.js --suite admin` between them: zero differences.
- Build the **baseline** (`cc2fc52d90987adcf62a5c286c4eb87d155fc3f3`) and this branch; run the suite with the logo and brand-name regions masked (the mask list from prompt 15): the only differences are the ones prompt 15 logged.
- `git diff --stat cc2fc52d90987adcf62a5c286c4eb87d155fc3f3 -- src/admin` is empty (or exactly the single logged line from prompt 15), and the admin-frozen command below prints nothing.

### 4. Residue and truth audit

- **Previous brand.** Search the repository and the build output for `dulcey`, `dulecy`, `DLS`, `Beyond Business Support`, `Archivo`, `Instrument Serif`, `d5192e`, `dulceyleadservices`: allowed only in `src/admin/**` (guideline content, comments), the five legacy stylesheets and `src/theme/` (the admin's styling), `public/api/leads.php` and `public/.htaccess` (comments in frozen files), `.env` / `.env.example`, `CHANGELOG.md` history and `prompts/`. Anywhere else — public source, `public/index.html`, the manifest, data modules, scripts, built public chunks — is a defect to fix.
- **Placeholders.** No `PendingPage`, no "coming soon", no lorem ipsum, no `TODO` / `FIXME` in shipped code, no in-house placeholder icon still standing in for a third-party asset without being listed in the report, no `SITE-URL-NOT-SET.invalid` unless the domain is still unknown (then it is the first go-live blocker).
- **Truth.** Re-read every page against `details of in-arch.pdf`: no testimonial, award, client name, statistic, rating, year, area, location, registration number, email, PIN code, opening days, response time or quotation that the PDF or an owner decision does not supply. Every project is still descriptive and unnamed unless the owner confirmed otherwise. List every content gap that remains.
- **Licences.** `src/data/credits.js` matches the assets actually shipped; the Icons8 credit link is present if required; the two font licence files are in `public/fonts/`.
- **Dead code and weight.** No unused component, hook, data module, image, stylesheet or dependency (search for each export's importers; check `public/images/` against the manifest); no `console.log` in public code; the Design Lab exists only in development; `build/` contains no `__lab`, no source photographs from `in-arch images/` and nothing from `logos/`.

### 5. Documentation

Rewrite for what the repository now is — accurate, no history lesson, no claims about files that do not exist:

- `README.md` — what the site is, the stack, how to run the site, the API and the admin locally (`npm ci`, `npm run build`, `php -S 127.0.0.1:8080 -t build scripts/dev-router.php`; the hot-reload variant with `.env.development.local`), the route table, the project structure, lead storage (unchanged mechanism), environment variables (unchanged names), the QA scripts.
- `CUSTOMIZATION_GUIDE.md` — where things live now: studio facts (`studio` in `src/data/siteConfig.js`); adding a service (and that its title becomes a stored `service_interest` value and an admin filter option); adding a project and its photographs (`scripts/image-specs.js` → `npm run build:images` → `src/data/projects.js`, new file names for changed images); FAQs and process; design tokens (`src/styles/inarch/tokens.css`); the logo files and `npm run build:brand`; setting the domain (`scripts/set-site-url.js`); the admin-bound values and why they must not be changed casually; credentials rotation (unchanged procedure).
- `SEO_GUIDE.md` — the dual-layer system as it now stands, the per-page table, the schema types emitted and the ones deliberately not emitted, the sitemap rule, the post-launch checklist.
- `CHANGELOG.md` — close `## [3.0.0]` with today's date and a short summary above the per-prompt entries.
- `package.json` — `name` "in-arch-website", an accurate `description` and `keywords`; scripts list tidy (no script pointing at a deleted file).

### 6. `prompts/FINAL_REPORT.md`

One document for the owner: the parity table (section 1) with pass / fail; bundle sizes and the performance table from `scripts/qa/perf-check.js`; the accessibility result; the admin-parity result; what changed in the admin (the logo, and the riders if applied) and what deliberately did not (list the old-brand text that remains inside the Guidelines tabs, the Guidelines password constant and the admin username, per owner decision D-20); and **Go-live blockers and owner actions**, each with the file to edit or the command to run — the domain, the email address, the full postal address and PIN code, confirmation of the service list, confirmation of project groupings and names, the Google Maps link, social profiles, a portrait of the principal, vector logos, the Icons8 licence position, analytics IDs if wanted, rotation of the admin password and the leads API key before deployment, and the Apache checks that cannot be done on the PHP dev server (rewrite rules, caching headers, `/api/data/` not web-readable).

## Functional guardrails

- **Contract frozen.** `public/api/leads.php` and `public/api/config.example.php` are not edited. The endpoint and its actions stay as they are: `POST /api/leads.php?action=create` with body `{ "lead": { … } }`, plus `list`, `update`, `delete` and `health`. Every lead still carries exactly these keys with the same meaning: `lead_id, name, mobile, email, organization, service_interest, state, message, source, status, submitted_at, updated_at, page_url, user_agent, utm_source, utm_medium, utm_campaign, utm_term, utm_content, notes, activity`. The status keys `new, contacted, consultation_booked, procedure_scheduled, completed, not_interested` are never renamed. `.env` and `.env.example` are not edited (use the git-ignored `.env.development.local` for local overrides). Anything new a lead needs is added as an extra key; nothing existing is renamed, removed or reshaped.
- **Admin-frozen files** — no diff against the "admin freeze commit" that prompt 15 recorded in `prompts/BUILD_LOG.md` (and none against baseline `cc2fc52d90987adcf62a5c286c4eb87d155fc3f3` except what prompt 15 logged): `src/admin/**`, `src/theme/muiTheme.js`, `src/styles/variables.css`, `src/styles/global.css`, `src/styles/animations.css`, `src/styles/responsive.css`, `src/styles/dulcey.css`, `src/App.css`, `src/hooks/useMediaQuery.js`, `src/surfaces/AdminSurface.jsx`, `public/api/**`, `.env`, `.env.example`.
- **Admin-bound values** are final since prompt 15 and must not move again: `siteConfig.brandName`, `siteConfig.legalName`, `siteConfig.logo`, `LOGO_SIZE`, `expertiseTitles`, `seoConfig.pages.admin`, `getConfig()`.
- **Fix, do not redesign.** Every change in this prompt traces to a failed check and is the smallest change that makes it pass; anything larger goes into the report as an open item.
- **The admin is verified, never edited.** If an admin check fails, the cause is in shared code a previous prompt touched — fix it there.
- **Credentials.** `.env` stays as it is; passwords and keys are read at run time for testing and are never copied into a file, a log, the report or a commit message. Rotation is an owner action listed in the report.
- **Test data never ships.** Every lead created during QA is deleted; `public/api/data/`, `build/` and `qa-artifacts/` are not committed.
- **Documentation tells the truth** about the lead store being a public, unauthenticated create endpoint with a shared admin key compiled into the bundle (as the existing docs already explain) — do not soften it.
- **Truthful content.** Every fact comes from `details of in-arch.pdf` through the modules in `src/data/`. No testimonials, awards, client names, statistics, ratings, years, areas, locations or quotes are invented; where the client supplied nothing the surface stays silent and the gap is listed in `prompts/00_INDEX.md`.
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
node scripts/qa/lead-flow.js
```

```bash
node scripts/qa/perf-check.js
```

```bash
node scripts/qa/public-check.js --matrix full
```

- **Everything in "Brand & design requirements" above is the test plan** — sections 1 to 4 are executed in full and their results written to `prompts/FINAL_REPORT.md`; a row is "pass" only with evidence (a command's output, a screenshot path, a measured value).
- **Clean build from scratch:** delete `node_modules` and `build`, then `npm ci`, `npm test -- --watchAll=false` and `npm run build` — all succeed, "Compiled successfully" with no warnings, no deprecation noise introduced by this project's code.
- **Fresh-clone check:** in a second clone of the branch (or a clean worktree), run the documented quick-start exactly as `README.md` states it and confirm the site, a lead submission and the admin work — proving the docs are right and nothing depends on a file that is not committed.
- **Cross-browser sanity** with the engines available in the session (Chromium always; WebKit and Firefox through Playwright if installed): Home, the lead modal, the portfolio filter and a case study render and work; note any engine that could not be tested as an owner check.
- **Regression loop:** after the last fix, re-run the full matrix once more — public check, lead flow, performance check, admin parity — and only then write the report's summary line.
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

**Close out.** Append the final entry to `prompts/BUILD_LOG.md` (date, "Prompt 20", what was fixed, what remains open and why), finish `CHANGELOG.md`, commit with a message that starts `IN-ARCH 20:`, and end your reply to the owner with the go-live blockers from `prompts/FINAL_REPORT.md`, in order of importance.
