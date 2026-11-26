# IN-ARCH website redesign — prompt index

This folder is the complete plan for rebuilding the IN-ARCH public website on the existing React boilerplate. It was written after reading the whole repository, the client's document, every photograph and logo, the five screenshots of the dummy site, and after building and running the boilerplate locally (public site, PHP lead API and admin) to confirm how it really behaves. **No application code was changed by the planning run.**

## 1. How to use this folder

1. Answer what you can in [section 12, "Owner decisions"](#12-owner-decisions) — write the answer in the last column. Every prompt reads that table first; an empty answer means the stated default is used.
2. Paste the prompts into fresh sessions **one at a time, in order**. Each is self-contained and repeats the values it needs, but each depends on the files earlier prompts create.
3. Every session ends by appending to `prompts/BUILD_LOG.md` (created by prompt 01): what it did, what it deviated on and why, what is open. The next session reads that log first — it is the series' memory.
4. Prompt 20 writes `prompts/FINAL_REPORT.md` with the evidence and the go-live list.

## 2. The prompts

| # | File | Objective | Depends on |
|---|---|---|---|
| 01 | [`01_design-system-and-tokens.md`](01_design-system-and-tokens.md) | Safety net (local API server, public check, admin parity check), tokens, self-hosted fonts, scoped base layer, GSAP motion foundation, dev-only Design Lab. Nothing visible changes. | — |
| 02 | [`02_brand-assets-content-and-image-pipeline.md`](02_brand-assets-content-and-image-pipeline.md) | Cut the brand files from `logos/`; turn the 13 unique client photographs into graded responsive derivatives and a manifest; source one icon set and four illustrations; build the truthful content model in `src/data/`. | 01 |
| 03 | [`03_core-ui-primitives.md`](03_core-ui-primitives.md) | The component kit: layout and type primitives, the "wipe & swap" CTA family, links, form fields, media, tiles, accordion, overlay utilities — all shown in the Lab. | 01, 02 |
| 04 | [`04_global-shell-dock-navigation-and-transitions.md`](04_global-shell-dock-navigation-and-transitions.md) | New shell: masthead, Index Dock, index overlay, footer, page transitions; final route table and navigation; favicon, PWA icons, manifest, splash, default meta, Open Graph image. Old page bodies keep rendering inside it. | 01–03 |
| 05 | [`05_unified-lead-form-and-modal.md`](05_unified-lead-form-and-modal.md) | Rebuild the single lead form and its modal: context from every CTA, inline validation, success / duplicate / failure states, WhatsApp-call-email as secondary. Submit path and lead contract unchanged. | 01–04 |
| 06 | [`06_home-hero-and-opening.md`](06_home-hero-and-opening.md) | Home, first two screens: the full-screen hero and the opening statement. | 01–05 |
| 07 | [`07_home-remaining-sections.md`](07_home-remaining-sections.md) | Home, the rest: selected work, belief, services ledger, how we work, principal (trust), invitation. Old Home sections deleted. | 01–06 |
| 08 | [`08_studio-about.md`](08_studio-about.md) | Studio page at `/about`: practice, philosophy, vision and mission, principal architect, visit-and-talk ending. | 01–07 |
| 09 | [`09_expertise-services.md`](09_expertise-services.md) | Expertise page at `/expertise`: seven services with preserved `#e0N` deep links, reasons, seven-step process, eight FAQs with schema, service-chooser ending. | 01–08 |
| 10 | [`10_interior-design-page.md`](10_interior-design-page.md) | The new dedicated Interior Design page at `/interior-design`, with its own identity (arch motif, warmer tone balance), services, room stories, material board, process, projects, FAQs and CTAs. | 01–05, 09 |
| 11 | [`11_portfolio-listing-and-filtering.md`](11_portfolio-listing-and-filtering.md) | Portfolio listing at `/portfolio` with URL-synced category filter and editorial grid; `/industries` forwards here; old sector page and data deleted. | 01–10 |
| 12 | [`12_project-case-study.md`](12_project-case-study.md) | Case-study page at `/portfolio/:slug` for all seven projects: cover, facts, gallery with lightbox, enquiry with context, next project. Interim page removed. | 01–05, 11 |
| 13 | [`13_contact.md`](13_contact.md) | Contact page: the full form, quick contact, studio details, what happens next, on-demand real map. | 01–05, 06–12 |
| 14 | [`14_remaining-states-and-legacy-retirement.md`](14_remaining-states-and-legacy-retirement.md) | 404, error and loading states; delete all remaining old public code and assets; split the surfaces so legacy CSS, old fonts and MUI load only for `/admin` — with a pixel-parity proof and a way back. | 01–13 |
| 15 | [`15_admin-logo-swap.md`](15_admin-logo-swap.md) | The one admin change: IN-ARCH logo in the top bar, mobile menu, login, Guidelines gate, splash and tab icon — plus the brand-name value and filter list that the repo ties to it (owner decisions D-01, D-02). | 01–14 |
| 16 | [`16_imagery-illustration-icons-and-motion-polish.md`](16_imagery-illustration-icons-and-motion-polish.md) | Site-wide pass: photograph reuse, crops, sharpness, one grade, alt text, icons, licences; one motion choreography, token-only, smooth on a mid-range phone, silent under reduced motion. | 01–15 |
| 17 | [`17_responsive-and-mobile-refinement.md`](17_responsive-and-mobile-refinement.md) | Device matrix from 320 px to 2560 px: thumb reach, targets, dock and browser bars, on-screen keyboard, landscape, tablets, zoom / reflow / text spacing, print. | 01–16 |
| 18 | [`18_accessibility-performance-and-seo.md`](18_accessibility-performance-and-seo.md) | WCAG 2.2 AA audit; Core Web Vitals budgets with a measuring script; per-page metadata, structured data, static crawler fallback, sitemap, robots, domain handling. | 01–17 |
| 19 | [`19_conversion-and-trust-review.md`](19_conversion-and-trust-review.md) | CTA inventory (one primary action per page and viewport), form friction and fallbacks, trust signals traced to the client's document, optional measurement hook. | 01–18 |
| 20 | [`20_final-qa-and-parity.md`](20_final-qa-and-parity.md) | End-to-end check against the functional inventory at every breakpoint, admin parity proof, residue and truth audit, documentation rewrite, final report with go-live blockers. | 01–19 |

How the suggested 20-step backbone was adapted to this repository:

- **Added "Brand assets, content model and image pipeline" as prompt 02**, ahead of the primitives. The client's photographs need cropping, cleaning and grading before any page can use them, and every fact has to come from one reviewed place; doing that once, early, is what keeps separate sessions consistent and truthful. Icons and illustrations are sourced here too, so pages use final assets from the start.
- **"Remaining surfaces and states" (14) also retires the legacy code and splits the admin from the public bundle.** That split is the single riskiest step for the admin, so it sits alone with a pixel-parity proof and a documented way back, immediately before the admin logo swap.
- **The late "imagery, illustration and icon pass" and "motion polish" are one prompt (16).** With assets built early, the late imagery work is an audit; both are whole-site visual passes done with the same walkthrough.
- Everything else keeps the backbone's order: design system first, final QA last.

## 3. Stack reality

| Area | What the project actually runs on |
|---|---|
| Framework / build | React 18.2 + Create React App (`react-scripts` 5.0.1, webpack 5), plain JavaScript (no TypeScript). `jsconfig.json` declares path aliases, but CRA honours only `baseUrl`; all imports are relative. |
| Routing | `react-router-dom` 7.12 in `BrowserRouter` + `<Routes>` mode (not the data router). Home is eager; every other route is `lazy()` behind an `ErrorBoundary` + `Suspense` pair (`lazyRoute` in `src/App.jsx`). |
| Styling | CSS Modules per component, plus six global stylesheets (`src/styles/variables.css`, `global.css`, `animations.css`, `responsive.css`, `dulcey.css`, `src/App.css`) and an MUI v5 theme + `CssBaseline` wrapped around the whole app in `src/index.js`. The admin is built on MUI; the public site uses MUI only for two loaders. |
| State | React context only: `ModalContext` (lead modal), `ThemeContext` (sets `data-theme`; no consumers), `AdminAuthContext`. No Redux, no data-fetching library. |
| Content / data | Static JavaScript modules in `src/data/` (`siteConfig`, `navigation`, `expertiseData`, `industriesData`). **There is no `db.json`, no JSON server and no CMS.** |
| Leads | A PHP endpoint, `public/api/leads.php`, that stores leads in a JSON file it creates at `public/api/data/leads.json` (git-ignored). The public form posts through `src/utils/webhookSubmit.js`; the admin reads and writes through `src/admin/utils/leadService.js`. |
| Motion | `gsap` 3.15 (ScrollTrigger, plus SplitText, Flip and the other formerly paid plugins, all present in the installed package) and `@gsap/react`. |
| Other | `@iconify/react` (admin only; icons fetched from `api.iconify.design` at run time), `sweetalert2` (lazy; public form dialogs), `web-vitals`; devDependencies `sharp`, `png-to-ico`. No tests are committed. |
| Deployment | Apache; `public/.htaccess` carries the SPA rewrite (with the `/api/` exclusion), caching and compression. |
| Verified locally | Node 22, npm 10, PHP 8.3. `npm ci` and `npm run build` succeed with no warnings; main bundle 155 KB gzip, of which roughly a fifth is MUI + Emotion. |

**Commands**

Install:

```bash
npm ci
```

Site with hot reload (port 3000; the PHP API is not available here unless you start it and point the client at it):

```bash
npm start
```

Lead API for the dev server (then put `REACT_APP_LEADS_API_URL=http://127.0.0.1:8080/api/leads.php` in a git-ignored `.env.development.local` — never edit the committed `.env`):

```bash
php -S 127.0.0.1:8080 -t public
```

Site + API + admin on one origin, as in production (the router script is created by prompt 01; a temporary copy was used for the planning run):

```bash
npm run build
```

```bash
php -S 127.0.0.1:8080 -t build scripts/dev-router.php
```

Admin: open `/admin` (redirects to `/admin/login`). Username and password are `REACT_APP_ADMIN_USERNAME` / `REACT_APP_ADMIN_PASSWORD` in `.env`; the Guidelines tab has a second password, a constant in `src/admin/pages/Guideline.jsx`.

Other scripts: `npm test` (CRA's Jest; no suites yet), `npm run generate:icons`, `npm run generate:og`, `npm run generate:images` (downloads the previous client's stock photographs — retired in prompt 14), `npm run analyze` (needs a tool that is not installed).

## 4. Where the repository differs from the brief

| The brief says | The repository shows | What the prompts do |
|---|---|---|
| "how `db.json` is served and consumed" | No `db.json`. Leads live in a PHP-written JSON file; page content is static modules. | The frozen contract is the PHP endpoint and the lead record (section 5). |
| "the boilerplate" | A finished five-page consulting site for **Dulcey Lead Services** (Home, About, Expertise, Who We Serve, Contact). Its README refers to `mockup/`, `prompts/README.md` and `CLAUDE.md`, none of which exist here. | Treated as the functional base; its look and content are replaced entirely. |
| "`details of in-arch` — the client's own details" | `details of in-arch.pdf`, a 17-page AI-drafted content document (it opens "ChatGPT said:") built from screenshots of the client's listings. It marks many facts as unconfirmed, and its pictures are third-party web images captioned with their source sites. | Used as the source of truth for facts and wording; its unconfirmed items become owner decisions; its pictures are never used. |
| "`in-arch images/` — the client's photographs" | 16 files with dot-prefixed names (`.jpg1.jpg` … `.jpg16.jpg`, hidden from a plain listing and unservable by Apache as named). Three are duplicates: **13 unique photographs**, all 16:9 landscape, phone-shot and upscaled to 4K, all completed residential interiors. No exterior, drawing, render or portrait. | Section 10. The site leads with real interiors; architecture is carried by type, icons and at most two abstract open-licence photographs. |
| "which variant belongs on light backgrounds and which on dark" | The file names describe the **background**, not the ink: `…-logo-dark-transparent.png` is the ivory `#F4EFE7` logo for dark backgrounds; `…-logo-light-transparent.png` is the espresso `#231B15` logo for light backgrounds. Only PNGs exist. | Section 6; prompt 02 cuts trimmed lockup, wordmark-only and monogram files. |
| "If the boilerplate has no such [lead] mechanism…" | It has exactly the mechanism asked for: one `UnifiedLeadForm` used inline on Contact and in a global `LeadModal` opened by `openLeadModal(source, { service_interest })`. | Prompt 05 rebuilds its design and extends the context passing; the submit path is untouched. |
| "Admin panel untouched … the single permitted change is swapping its logo" | The admin is not isolated: it reads its logo **and its brand name** from the shared `siteConfig` (the name is printed as the login title, dashboard heading and footer line, mobile-menu footer, Guidelines subtitle and tab title), takes its "Interested In" filter list from the public `expertiseData`, and is styled by the same global CSS, tokens, fonts and MUI theme as the public site. | Section 7: nothing the admin reads changes until prompt 15; the public redesign is additive and scoped; prompt 14 separates the two with proof. Owner decisions D-01 and D-02 cover the name and the filter list. |
| Dummy shows an email, "R.P. Complex", named projects, a portrait and a quotation | None of these is in the client's document. | Not used unless the owner confirms them (D-03, D-04, D-11, D-21). |
| Dummy pages: Home, Studio, Portfolio, Expertise, Contact | Boilerplate routes: `/`, `/about`, `/expertise`, `/industries`, `/contact`. | Studio → `/about`; Expertise → `/expertise`; Portfolio → new `/portfolio` + `/portfolio/:slug`, with `/industries` forwarding to it (D-17); Interior Design → new `/interior-design`. |
| "the scripts that start the site, the API and the admin" | One script starts everything client-side (`npm start`); the API needs PHP; nothing serves the built site with the API. | Prompt 01 adds `scripts/dev-router.php` and the QA scripts. |
| — | `.env` is committed with a working admin password and API key; the admin username and the Guidelines password carry the previous brand. | Never edited or printed; listed as owner actions (D-20 and the final report). |

## 5. Functional inventory — the baseline every prompt is checked against

**Public routes (today)**

| Route | Page | What it does |
|---|---|---|
| `/` | Home (eager) | Hero with CTA into the lead modal (`home-hero`) and a link to `/expertise`; marquee; intro with link to `/about`; belief band; ten expertise rows linking to `/expertise#e01`–`#e10`; seven sector cards linking to `/industries`; closing CTA (`home-cta`) and click-to-call. |
| `/about` | About | Six text sections; CTA into the modal (`about-cta`); link to `/expertise`. |
| `/expertise` | Expertise | Ten-item single-open accordion; item 01 open by default; `#e01`–`#e10` deep links open and scroll to an item; "Discuss this area" opens the modal with `source: expertise-<id>` and the service pre-selected; closing block with modal (`expertise-cta`), call and email. |
| `/industries` | Who We Serve | Seven sector cards; CTA card into the modal (`industries-cta`); closing block with modal (`industries-cta-2`), call, link to `/expertise`. |
| `/contact` | Contact | Call and email cards; the lead form inline (`source: contact-page`). |
| `*` | Not found | `noindex`; link home; rendered inside the shell. |

**Shell and global behaviour**

- Skip link; fixed header with five links, active state and a CTA (`header-cta`); burger below 920 px opening a full-screen menu (numbered links, CTA `mobile-menu-cta`, call / email; Escape, focus trap, scroll lock, closes on navigation and at the breakpoint); footer with CTA (`footer-cta`), navigation, call / landline / email, copyright and a developer credit link.
- `LeadModal`: portal, focus trap, close on Escape / backdrop / button / route change, focus return, scroll lock that restores position.
- `ScrollManager`: jumps to the top on every navigation (including a click on the current route), holds the top while the page settles, scrolls to `#hash` targets with retries.
- `SEOHead`: per-route title, description, keywords, robots, canonical, Open Graph and Twitter tags and five JSON-LD blocks, replacing the static copies in `public/index.html` by element id; `/admin` and the 404 are `noindex` with no schemas.
- `ErrorBoundary` with retry around each lazy route; skeleton fallback while a route chunk loads; branded splash until React mounts; web-vitals logging; scroll restoration set to manual.

**The lead form (today)**

Fields: full name (required), email (required), phone (optional; Indian 10-digit, pasted `+91` / `0` stripped), organisation (optional), "what do you need support with" (required; ten expertise titles + "Something else"), message (optional, 500 characters). Validation on blur and submit; first invalid field focused; double-submit guard; inline success with the first name; a dialog for "already received" (duplicate) and for errors, both quoting the phone number.

**API — all on `/api/leads.php`**

| Call | Auth | Behaviour |
|---|---|---|
| `POST ?action=create`, body `{ "lead": { … } }` | none | Requires `lead.lead_id`. If the id or a non-empty `mobile` already exists → `{ success: true, duplicate: true }` and **nothing is stored**. Otherwise appends the object exactly as sent (extra keys are kept) → `{ success: true }`. |
| `GET ?action=list` | admin key (`X-Admin-Key` header, or `admin_key` query / body) | `{ success: true, leads: [...] }`; 401 without the key. |
| `POST ?action=update`, body `{ lead_id, patch }` | admin key | Merges `notes` / `activity` arrays, overwrites other keys; 404 if unknown. |
| `POST ?action=delete`, body `{ lead_ids: [...] }` | admin key | `{ success: true, removed: n }`. |
| `GET ?action=health` | none | Diagnostic: key source, fingerprint, whether the caller's key matches, store writable. |

**The lead record — frozen**

`lead_id, name, mobile, email, organization, service_interest, state, message, source, status, submitted_at, updated_at, page_url, user_agent, utm_source, utm_medium, utm_campaign, utm_term, utm_content, notes, activity`. `service_interest` holds the visible label; `state` is always sent empty; `status` is one of `new, contacted, consultation_booked, procedure_scheduled, completed, not_interested`.

**Admin screens (must keep working exactly as today)**

| Screen | What it does |
|---|---|
| `/admin/login` | Logo, brand name, username / password / remember me; credentials compared with the `.env` values; 24-hour session in `localStorage`. |
| `/admin` → `/admin/dashboard` | Guarded. Heading with the brand name, refresh, four stat cards, 14-day trend, status breakdown, "View all leads", CSV export, recent enquiries (table / mobile cards), 15-second polling, cross-tab sync. |
| `/admin/lms` | Stats; search; filters for status, "Interested In" (the fixed list from `expertiseTitles` + "Something else" + any other stored value), source and date range; chips; sortable table; selection, bulk status and bulk delete; inline status; view; delete with confirm; pagination 10 / 25 / 50; mobile cards; CSV import and export; refresh. |
| `/admin/lms/lead/:leadId` | Contact details, interested-in and message (shown as one collapsed paragraph), source, page URL, UTM values, submission details, notes, activity timeline, status select, delete, not-found state. |
| `/admin/guideline` | Second password gate; four documentation tabs. |
| Top bar | Logo, "Admin Panel", three links, user, logout, mobile menu. |

## 6. Design direction — decided once, repeated in every prompt

**Character.** Modern, minimal, editorial, luxurious; calm and confident. One idea per viewport, large type, a restrained palette, imagery given room. What the client liked in the dummy is kept — the warm quiet mood, serif headlines with one italic terracotta phrase, small numbered labels, rectangular buttons with an arrow, the content structure and tone — and everything the dummy got wrong is designed against: every page opens differently, sections do not repeat one rhythm, no two pages end the same way, no photograph is leaned on twice, tiles respond, projects have case studies, the form captures the lead, the map is real, trust comes from real material, and the phone layout is designed first.

**Colour** — ivory and espresso are sampled from the logo files; the charcoal-green and terracotta come from the direction the client approved, with terracotta deepened so it passes contrast.

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `--ia-ivory` | `#F4EFE7` | page canvas (the logo's ivory) | — |
| `--ia-paper` | `#FAF7F2` | raised surfaces, fields | — |
| `--ia-sand` | `#E9E3D8` | alternate band | — |
| `--ia-stone` | `#DAD3C6` | placeholders only | — |
| `--ia-forest` | `#161E19` | dark surface | ivory on it 14.87:1 |
| `--ia-forest-2` / `-3` | `#1E2823` / `#28342E` | raised dark / dark hairline | — |
| `--ia-espresso` | `#231B15` | text on light (the logo's ink) | 14.81:1 on ivory |
| `--ia-ink-2` / `-3` | `#4F453D` / `#6B6058` | secondary / tertiary text on light | 8.15:1 / 5.33:1 on ivory (ink-3 4.78:1 on sand; not on stone) |
| `--ia-mist` / `-2` | `#B9BDB6` / `#8E958D` | secondary / tertiary text on dark | 8.93:1 / 5.54:1 on forest |
| `--ia-terracotta-700` | `#8F4A2B` | small text, links, button fill on light | 5.77:1 on ivory, 5.17:1 on sand |
| `--ia-terracotta-500` | `#B5653F` | display text ≥ 24 px and decoration on light | 3.75:1 on ivory (large text only) |
| `--ia-terracotta-300` | `#DDA27F` | every accent on dark | 7.74:1 on forest |
| lines | `#D8D0C3` / `#8A7F74` (light), `#28342E` / `#8E958D` (dark) | hairline / control border | control borders ≥ 3:1 |
| feedback | `#3F6B4F` / `#8FBF9F`, `#A4372A` / `#F0A090` | success, error (light / dark) | ≥ 5.3:1 |

Terracotta is never a section background and never more than about a tenth of a viewport.

**Type** — display: **Fraunces** (variable; `opsz` 9–144, `wght` 300–600; roman and italic; SIL OFL), weight 300 from 40 px, 400 below, tracking −0.02em. Text and UI: **Manrope** (variable 300–700; SIL OFL). Both self-hosted as three WOFF2 files; no third-party font request on the public site. One italic terracotta phrase per headline.

| Step | Value | 360 | 390 | 768 | 1024 | 1280 | 1440 | 1920 |
|---|---|---|---|---|---|---|---|---|
| display-2xl | `clamp(2.75rem, 1.2rem + 7.2vw, 8.5rem)` | 45.1 | 47.3 | 74.5 | 92.9 | 111.4 | 122.9 | 136 |
| display-xl | `clamp(2.5rem, 1.35rem + 5.2vw, 6.5rem)` | 40.3 | 41.9 | 61.5 | 74.8 | 88.2 | 96.5 | 104 |
| display-lg | `clamp(2rem, 1.3rem + 3.2vw, 4.5rem)` | 32.3 | 33.3 | 45.4 | 53.6 | 61.8 | 66.9 | 72 |
| display-md | `clamp(1.625rem, 1.25rem + 1.7vw, 2.75rem)` | 26.1 | 26.6 | 33.1 | 37.4 | 41.8 | 44 | 44 |
| display-sm | `clamp(1.375rem, 1.2rem + 0.8vw, 1.875rem)` | 22.1 | 22.3 | 25.3 | 27.4 | 29.4 | 30 | 30 |
| body-lg | `clamp(1.0625rem, 0.98rem + 0.38vw, 1.3125rem)` | 17 | 17.2 | 18.6 | 19.6 | 20.5 | 21 | 21 |
| body | `clamp(1rem, 0.97rem + 0.14vw, 1.0625rem)` | 16 | 16.1 | 16.6 | 17 | 17 | 17 | 17 |
| small / caption / label | `0.875rem` / `0.8125rem` / `0.75rem` (label: uppercase, 600, `0.18em`) | 14 / 13 / 12 | | | | | | |

Line-height 1.02 (2xl, xl), 1.08 (lg), 1.15 (md), 1.2 (sm), 1.65 (body); measure ≤ 68ch.

**Space, grid, breakpoints, shape**

- Spacing scale (px): 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160, 192.
- Section rhythm `clamp(5rem, 3rem + 9vw, 12rem)` → 80 px at 360, 117 at 768, 178 at 1440, 192 from 1600; compact `clamp(3.5rem, 2.5rem + 4.5vw, 7.5rem)`.
- Page gutter `clamp(1.25rem, 0.5rem + 3.4vw, 5rem)` → 20 px at 360, 34 at 768, 57 at 1440, 73 at 1920. Content max-width 1680 px.
- Grid: 4 columns / 16 px gap below 768; 8 / 24 px from 768; 12 / 32 px from 1024; 40 px gap from 1440.
- Breakpoints (min-width): 768, 1024, 1280, 1440, 1920. Designed at 360–390 first. QA widths: 360, 390, 768, 1024, 1280, 1440, 1920.
- Square corners on imagery and sections; 2 px radius on buttons, fields and the dock; 1 px hairlines; one shadow, for overlays only.

**Motion** — GSAP + ScrollTrigger, transform and opacity only, cleaned up on unmount, no scroll-smoothing library, no scroll-jacking (sticky sequences use CSS `position: sticky`; nothing pins or snaps the page).

| | Value |
|---|---|
| Durations | 150 ms press · 240 ms colour · 400 ms wipes and UI · 700 ms reveals · 1000 ms headlines and image shutters |
| Easing | CSS `cubic-bezier(0.22,1,0.36,1)`, `cubic-bezier(0.65,0,0.35,1)`, `cubic-bezier(0.16,1,0.3,1)`; GSAP `power3.out`, `expo.out`, `power3.inOut`, `none` (scrub) |
| Reveals | text rises 24 px (40 from 1024) at `top 85%`, once; headlines rise line by line through masks; images open with a "shutter" (cover slides away while the image settles from 1.12 to 1); rules draw from the left |
| Parallax | ≤ 4 % below 1024 px, ≤ 7 % above |
| Page transition | a forest "curtain" covers in 400 ms and lifts in 550 ms; none on back / forward |
| Reduced motion | everything visible at once; no transforms, parallax, curtain or animated icons |
| Exception | Icons8 animated icons (Lottie) are treated as small self-contained media: played once when half visible, static under reduced motion |

**CTA family — "wipe & swap".** Rectangular buttons with a 16 px arrow. Hover / focus: a fill wipes up from the bottom edge and the arrow leaves top-right while its twin arrives from bottom-left; press: scale 0.98; focus ring 2 px terracotta at 3 px offset. Text links draw their underline from the left; tiles scale their image to 1.04 and swap the arrow. Touch gets the press state; nothing depends on hover.

**Navigation — the "Index Dock".** The boilerplate has a fixed glass top bar with inline links and a burger. The new site has **no fixed top bar**:

- a **masthead** that scrolls with the page and carries only the logo (plus a call button on phones, the phone number on desktop);
- the **dock**, a floating bar fixed to the bottom edge on every breakpoint — on phones: Menu · "Start a project" · WhatsApp, in the thumb zone; from 1024 px: the "IA" mark, five links and "Start a project", centred. It follows the tone of the section beneath it, steps down to a secondary style whenever an in-page primary button is in view (so a viewport never shows two primary actions), and hides only for the overlay, the modal, the on-screen keyboard and the footer's contact block;
- a full-screen **index overlay** (below 1024 px) that rises from the bottom, with its close / CTA / WhatsApp controls in the same positions as the dock.

**Logo files and where each goes**

| File | Ink | Use on |
|---|---|---|
| `logos/in-arch-logo-light-transparent.png` | espresso `#231B15` | light backgrounds: ivory, sand, paper, white (and the admin) |
| `logos/in-arch-logo-dark-transparent.png` | ivory `#F4EFE7` | dark backgrounds: forest, photographs under the overlay |
| `logos/in-arch-favicon-light-transparent.png` | espresso | "IA" monogram on light |
| `logos/in-arch-favicon-dark-transparent.png` | ivory | "IA" monogram on dark; the favicon tile (ivory on an espresso square) |

Prompt 02 cuts trimmed copies into `public/images/brand/`: the full lockup (for ≥ 44 px tall), the wordmark without its descriptor line (for anything smaller — the descriptor is illegible below that), and the monogram. The logo is never recoloured, outlined or stretched.

**Imagery, illustration, icons.** Client photographs first, cleaned and graded as one set. At most two abstract open-licence photographs, on the Expertise page only, never presentable as IN-ARCH work. Four unDraw illustrations (404, enquiry sent, empty result, error) and one Icons8 family (14 static icons for services and process, 8 animated), all recoloured to espresso + terracotta, used only where they explain something. Licences and credits are logged; Icons8's free licence requires a visible link (D-13).

## 7. Build architecture — how the admin stays untouched

- **Baseline commit:** `cc2fc52d90987adcf62a5c286c4eb87d155fc3f3` (the repository as it was before the build).
- **Additive and scoped.** The new design system is new files only (`src/styles/inarch/`, `src/motion/`, `src/components/ui/`, `src/components/shell/`). Its tokens are `--ia-*` custom properties; its CSS matches only inside an element with the class `ia` or under `html[data-surface="public"]`, an attribute set from the first inline script in `public/index.html`. The legacy global stylesheets, tokens and MUI theme are **never edited**.
- **Admin-frozen files** (no diff against the baseline, ever): `src/admin/**`, `src/theme/muiTheme.js`, `src/styles/variables.css`, `global.css`, `animations.css`, `responsive.css`, `dulcey.css`, `src/App.css`, `src/hooks/useMediaQuery.js`, `public/api/**`, `.env`, `.env.example`.
- **Admin-bound values** (unchanged until prompt 15): `siteConfig.brandName`, `siteConfig.legalName`, `siteConfig.logo`, `LOGO_SIZE`, `expertiseTitles`, `seoConfig.pages.admin`, `getConfig()`. The public site therefore reads its facts from a new `studio` object and its services from a new `services.js`.
- **Coexistence.** From prompt 04 the new shell wraps the old page bodies; each page prompt replaces one body. The old pages keep the legacy typography because the `ia` scope is applied per component, not at the root, until prompt 14.
- **Surface split (prompt 14).** The legacy stylesheets, the old fonts and the MUI providers stop being imported by the entry point and are imported — unchanged, in the same order — by one lazy wrapper, `src/surfaces/AdminSurface.jsx`, that only `/admin` routes load. The measured stylesheet order on the baseline (`/admin/login`: legacy CSS → login CSS → MUI styles; `/admin/dashboard`: legacy CSS → MUI styles → admin layout and page CSS) is the acceptance criterion. If parity cannot be proven the split is reverted and the public site simply keeps the extra weight.
- **Admin logo swap (prompt 15).** A new image with the old image's exact pixel dimensions (1351 × 200), so no admin box moves; one config value changes; no file under `src/admin/` is edited.
- **Document-level items shared with the admin** (`public/index.html`): the favicon, the splash and the fonts are made surface-aware in prompt 04 so `/admin` keeps its old ones until prompt 15.
- **QA toolkit** (created by the prompts): `scripts/dev-router.php`; `scripts/qa/public-check.js` (routes × widths: console errors, failed requests, overflow, target sizes, axe); `scripts/qa/parity.js` (pixel and computed-style comparison of two builds, with time frozen and identical seeded leads — the admin proof); `scripts/qa/lead-flow.js` (form → API → admin, asserting the payload keys); `scripts/qa/perf-check.js` (throttled Core Web Vitals and byte budgets).

**Page concepts — every page opens, moves and ends differently**

| Page | Opens with | Rhythm | Ends with |
|---|---|---|---|
| Home | a full-screen photograph of the studio's own work, headline at the bottom | dark → light → sand → dark → light → sand → light → dark; image-led | a headline invitation and one button |
| Studio (`/about`) | words on ivory, then one wide photographic band | word-led, sticky reading columns | practical "Visit / Talk" details |
| Expertise | a short typographic hero on sand with in-page links | strict lists: ledger, numbered reasons, timeline, FAQ | a service chooser — eight chips that open the form pre-filled |
| Interior Design | a split hero with an arch-topped photograph (the arch appears only on this page) | paper and sand, picture-led stories, material swatches | its own consultation CTA beside a small arch |
| Portfolio | a compact header and the filter — the grid is the picture | one asymmetric grid | an invitation tile inside the grid; no band |
| Case study | the project's photograph, full-bleed, title at the bottom | cover → facts → gallery → details | the next project, full-bleed |
| Contact | words, then call / WhatsApp, then the form | form-centred | the real map and directions |

## 8. Coverage matrix — every surface, flow and state has exactly one owner

Audit prompts (16–20) own site-wide passes, not surfaces; they fix what they find inside the owner's files.

| Surface / flow / state | Owner | Notes |
|---|---|---|
| **Routes** | | |
| `/` — hero and opening statement | 06 | |
| `/` — remaining sections | 07 | |
| `/about` (Studio) | 08 | URL unchanged |
| `/expertise` | 09 | `#e01`–`#e07` deep links preserved |
| `/interior-design` | 10 | interim page from 04 |
| `/portfolio` | 11 | interim page from 04 |
| `/industries` | 11 | becomes a redirect to `/portfolio`; old page and data deleted |
| `/portfolio/:slug` | 12 | interim page from 04, removed here |
| `/contact` | 13 | |
| `*` (404) and unknown project slug | 14 | 12 routes unknown slugs to the same component |
| `/__lab` (development only) | 01 | extended by 02 and 03 |
| `/admin/*` (login, dashboard, leads, lead detail, guidelines, top bar) | none | verified by every prompt; logo only in 15 |
| **Shell** | | |
| Skip link, masthead, dock, index overlay, footer | 04 | replaces old Header, MobileMenu, Footer |
| Page transitions, route announcer, focus after navigation | 04 | |
| `PublicLayout` | 04 | scope hoisted in 14 |
| Splash screen, favicon, PWA icons, manifest, Open Graph image | 04 | admin branch removed in 15 |
| **Shared components and layers** | | |
| Tokens, fonts, base layer, layout helpers, motion foundation | 01 | |
| UI primitives | 03 | |
| `UnifiedLeadForm`, `LeadModal`, `ModalContext`, validators, payload builder | 05 | |
| `SEOHead` and SEO config — site level | 04 | each page prompt owns its own entry; FAQ schema 09; project schema 12 |
| Static SEO fallback, sitemap, robots, domain handling | 18 | |
| `ErrorBoundary`, route-loading fallback, no-JavaScript message | 14 | |
| `ScrollManager` | preserved | one guard added in 11 for the filter |
| Legacy CSS, old fonts, MUI providers | 14 | relocated to the admin surface, never edited |
| **Flows** | | |
| Enquiry through the modal; duplicate, failure and success handling; draft; honeypot | 05 | |
| Enquiry through the inline form on Contact | 13 | same component as 05 |
| CTA context (`source`, service, label) | 05 | used by 06–14; audited in 19 |
| Service deep links and "Discuss this service" | 09 | |
| Portfolio filter (URL-synced) | 11 | |
| Case-study lightbox; next-project chain | 12 | |
| Map on demand; directions | 13 | |
| Call, WhatsApp, email links | 02 (helpers) | placed by 04, 05, 13; audited in 19 |
| UTM capture, page URL, user agent on each lead | preserved | `webhookSubmit.js` untouched except one string source (05) |
| **States** | | |
| Form: idle, invalid, sending, success, duplicate, failure | 05 | |
| Empty portfolio filter | 11 | |
| Loading (route chunk), error, 404 | 14 | |
| Reduced motion | 01 | audited in 16 |
| Print | 17 | |
| **Data and assets** | | |
| `studio` facts, services, process, FAQs, studio content, interiors content, projects, credits | 02 | |
| Brand files, photograph derivatives and manifest, icons, illustrations | 02 | audited in 16 |
| `navigation.js` | 04 | |
| Legacy `siteConfig` keys | 14 | admin-bound keys in 15 |
| `expertiseData.js` | 15 | becomes an adapter (D-02) |
| `industriesData.js` | 11 | deleted |
| **Infrastructure and docs** | | |
| `public/index.html` | 04 | 01 adds the surface attribute; 06 the hero preload; 14 admin-only fonts; 15 removes the admin branch; 18 the static SEO |
| `public/.htaccess` | 18 | one added line (font caching) |
| `public/api/leads.php`, `.env` | none | never edited |
| QA scripts | 01 | 05 adds lead-flow; 18 adds perf-check |
| README, guides, changelog close-out, final report | 20 | each prompt adds its changelog entry |
| **Site-wide passes** | | |
| Imagery, illustration, icons, motion | 16 | |
| Responsive and mobile | 17 | |
| Accessibility, performance, SEO | 18 | |
| Conversion and trust | 19 | |
| Final parity | 20 | |

## 9. Routes and navigation after the build

| Route | Page | In navigation | Indexable |
|---|---|---|---|
| `/` | Home | 01 Home | yes |
| `/about` | Studio | 02 Studio | yes |
| `/expertise` | Expertise | 03 Expertise | yes |
| `/interior-design` | Interior Design | 04 Interior Design | yes |
| `/portfolio` | Portfolio | 05 Portfolio | yes |
| `/portfolio/:slug` (seven) | Case study | — | yes |
| `/contact` | Contact | 06 Contact | yes |
| `/industries` | → `/portfolio` | — | no (redirect) |
| `*` | Not found | — | no |
| `/admin/*` | Admin | — | no |

## 10. Image plan

**What was supplied.** 13 unique photographs (ids follow the file numbers; `.jpg13`, `.jpg15`, `.jpg16` repeat `.jpg2`, `.jpg6`, `.jpg3`). All landscape 16:9; quality is "good phone photograph, upscaled" — most are sharp to about 1920 px, three to about 1440, one (ph10) only to about 960.

| Id | Shows | One editorial placement | Also in project |
|---|---|---|---|
| ph08 | living hall, fluted timber-tone wall with backlit veined panel, close view | **Home hero** | Living Hall with a Backlit Feature Wall (cover) |
| ph06 | room corner with framed wall mouldings and lit tray ceiling | **Home opening statement** | Panelled Living Hall (cover) |
| ph07 | the same living hall, wide low angle | **Studio hero band** | Living Hall with a Backlit Feature Wall |
| ph05 | living hall, backlit textured media wall (needs a tight crop: clutter, cable, AC) | **Studio philosophy** (dropped if no clean crop) | Panelled Living Hall |
| ph03 | graphite gloss U-shaped kitchen, frontal | **Expertise — Interior Design service** | Graphite Gloss Kitchen (cover) |
| ph01 | living room with two green arched niches and teal sofa (crop out a person) | **Interior Design hero** | Living Room with Arched Niches |
| ph02 | black gloss kitchen with blue-veined splashback | **Interior Design — kitchens story** | Black Kitchen with a Veined Splashback (cover) |
| ph04 | ivory gloss kitchen with dark worktop | **Interior Design — kitchens story** | Ivory Kitchen with a Dark Worktop (cover) |
| ph09 | prayer unit with lattice-cut doors, backlit | **Interior Design — details story / closing** | Made-to-Measure Prayer Units (cover) |
| ph12a | prayer unit on a mint wall (left half of a collage) | **Interior Design — hero inset / details** | Made-to-Measure Prayer Units |
| ph11 | seating nook with buttoned bench (crop out a mirror reflection) | **Contact** | Living Room with Arched Niches |
| ph14 | detail of the arched-niche living room | none (portfolio only) | Living Room with Arched Niches (cover); featured on Home |
| ph12b | the ph09 prayer unit, second angle | none | Made-to-Measure Prayer Units |
| ph10 | graphite kitchen from the side (soft) | none | Graphite Gloss Kitchen, small only |

Rule: one editorial placement per photograph across the whole site, plus its own project's cover, gallery and square detail swatches. Six swatches (fluted panelling, veined stone-look surface, lattice screen, gloss cabinetry, wall moulding, buttoned upholstery) are cut for the Interior Design material board and the case studies.

**Where open-source imagery is needed.** Only on the Expertise page: one abstract light-and-shadow photograph for the hero and one drawings-on-a-desk photograph, both optional (the page works with an in-house line drawing instead). The architecture, 3D-visualisation and project-management services have **no client image at all** — they are carried by type, icons and the process, not by borrowed buildings.

**What is deliberately not used.** The pictures inside the client's PDF (third-party web images), the dummy's photographs (stock exteriors and interiors, and a portrait that is not the principal's), any stock picture of a person.

## 11. Content — what comes from where

| Content | Source in `details of in-arch.pdf` | Used on |
|---|---|---|
| Name, principal, location, phone / WhatsApp | §1, §9 | everywhere via `studio` |
| Tagline "Designing Spaces. Shaping Experiences." | §1 (a suggestion) | Home hero, metadata (D-10) |
| About paragraphs, vision, mission, four philosophy principles | §2 | Studio; one sentence on Home |
| Principal: biography, five credentials, experience, education | §3 | Studio; three lines on Home; one line on Contact |
| Seven services with descriptions and scope lists | §4 (marked "proposed — office to confirm") | Expertise, Home ledger, footer, the form's options (D-06) |
| Interior scope and renovation list | §4 B, G | Interior Design |
| Portfolio categories; scope and focus wording | §5 | Portfolio, case studies |
| Seven differentiators | §6 | Expertise |
| Seven-step process | §7 | Expertise, Interior Design, grouped on Home, "next steps" on Contact |
| Eight FAQs | §8 | Expertise (all), Interior Design (five), schema |
| Contact line, CTA wording, footer line | §9, §10 | Contact, Home closing, footer |
| SEO titles, description, keywords | §12 | metadata |

## 12. Owner decisions

Write your answer in the last column; an empty cell means the default applies. Prompts read this table before doing anything.

| Id | Decision | Default the prompts use | Your answer |
|---|---|---|---|
| D-01 | When the admin logo is swapped, also change the brand name the admin prints beside it (login title, dashboard heading and footer line, mobile-menu footer, Guidelines subtitle, tab title)? It is the same shared value as the logo's alt text. | **Yes** — "IN-ARCH" / "In-Arch Architects & Interior Designer", in prompt 15, with no admin file edited. "No" leaves "Dulcey Lead Services" beside the new logo. | |
| D-02 | Should the admin's "Interested In" filter list become the site's seven services? | **Yes**, in prompt 15 (via the shared export). "No" leaves the ten old consulting titles in the list; new values still appear after them once leads exist. | |
| D-03 | Email address to publish. | **None** — every email row and link stays hidden. The dummy shows `inarcharchitect@gmail.com`; confirm it or give the right one. | |
| D-04 | Postal address. | "Boring Road, Patna, Bihar, India" (the PDF). The dummy shows "R.P. Complex, Boring Road"; building, floor and PIN code are unknown. | |
| D-05 | The site's domain. | **Not set.** Run-time tags use the current origin; static files carry `https://SITE-URL-NOT-SET.invalid` until `scripts/set-site-url.js` is run. Go-live blocker. | |
| D-06 | Is the seven-service list correct, and are all seven actively offered? | The PDF's seven (A–G), exactly. | |
| D-07 | Projects: the 13 photographs are grouped into seven projects by what they show, with descriptive titles and no location, area, year or client. Correct the grouping, and supply real names and facts if you want them shown. | Seven descriptive entries, marked unverified internally. | |
| D-08 | Form: phone required and email optional (the boilerplate had it the other way round). | **Phone required, email optional.** | |
| D-09 | Budget options in the form. | Under ₹10 lakh · ₹10–25 lakh · ₹25–50 lakh · ₹50 lakh–₹1 crore · Above ₹1 crore · Not sure yet. | |
| D-10 | Tagline. | "Designing Spaces. Shaping Experiences." (PDF suggestion). The dummy used "Spaces for a better tomorrow." | |
| D-11 | Principal's portrait and a quotation in his own words. | **Neither**: a typographic plate in the portrait slot; no quotation (the dummy's was invented). | |
| D-12 | Social profiles and the Google Business Profile link. | **Hidden** until supplied. Ratings are never hard-coded; with a profile link a plain "Read our reviews on Google" link appears. | |
| D-13 | Do you hold a paid Icons8 licence? | **No** — a visible "Icons by Icons8" link is shown in the footer, as the free licence requires. | |
| D-14 | Opening hours. | "From 10:00 AM" only (days and closing time are unknown). | |
| D-15 | Keep the developer credit in the footer ("Designed & Developed by Assam Digital")? | **Keep** — it exists today. | |
| D-16 | Exact map location (a Google Maps share link, plus code or coordinates). | The map and directions search for the studio's name on Boring Road; prompt 13 must verify the result or flag it. | |
| D-17 | `/industries` ("Who We Serve"). | **Forwards to `/portfolio`.** Say so if you want a standalone sectors page instead. | |
| D-18 | Analytics / tag manager IDs. | **None installed**; a `dataLayer` hook is prepared so one can be attached later. | |
| D-19 | The lead store treats a second enquiry from the same mobile number as a duplicate and does not save it. With phone required, a returning client's new enquiry is not stored. | **Leave as is** (the API is frozen); the form then hands the full brief to WhatsApp so it still reaches the studio. Changing the rule means editing `leads.php`. | |
| D-20 | The admin's Guidelines tab documents the previous client's site (its domain, colours, fonts, file names); the Guidelines password and the admin username carry the old name. | **Untouched** — outside "logo only". Listed in the final report. | |
| D-21 | The dummy's project names (The Courtyard House, Urban Calm, The Avenue, The Workspace, Green Land Hospital, The Dining Room). | **Not used** — they are invented names over stock photographs. | |
| D-22 | Use the wordmark without its descriptor line wherever the logo is under 44 px tall (the dock, phone masthead and all admin placements)? | **Yes** — the descriptor is illegible at those sizes. | |
| D-23 | The "Zenith — Project Architect" entry, whose dates the PDF marks "to be confirmed". | Listed without dates. | |

## 13. Open questions, assumptions and content gaps

**Questions that change what gets built** — D-01, D-02, D-05, D-06, D-07 above. Please answer these before prompts 05, 11 and 15 respectively.

**Assumptions made**

- The sessions that run these prompts can execute Node, PHP and a headless browser (the planning run could: Node 22, PHP 8.3, Playwright 1.63). The QA scripts use that browser without adding it to `package.json`.
- `npm` can install the few new development packages (`axe-core`, the two Fontsource font packages, Testing Library) and, if used, `lottie-web`.
- Icons8, unDraw and one photo library are reachable from the build session; if not, prompt 02 substitutes in-house line icons, skips the optional photographs and lists what is pending.
- The site stays a client-rendered single-page app on Apache; no server-side rendering is introduced.
- English only.

**Content the client has not supplied** (each surface stays silent about it; none is invented)

- Company: legal name confirmation, year established, full address with PIN code, email, domain, working days and closing time.
- Principal: a portrait, his Council of Architecture registration number, the Zenith dates, any further qualifications, a quotation.
- Services: confirmation of the list, areas served, whether construction / execution and site supervision are undertaken.
- Projects: real names, locations, areas, years, clients and permissions; any architecture work at all (exteriors, drawings, 3D renders); higher-quality originals of the 13 photographs.
- Brand: vector logos; social links; the Google Business Profile link.
- Ratings: the PDF mentions Google and Justdial ratings and itself advises against hard-coding them — they are not shown.

**Things to know before go-live** (also collected by prompt 20)

- `.env` is committed with the admin password and the leads API key; rotate both before deployment (the existing guide explains how).
- The create endpoint is public and unauthenticated by design; the form adds a honeypot but there is no rate limiting.
- Caching and rewrite rules live in `.htaccess` and can only be verified on the real Apache host.
