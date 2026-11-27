# 17 — Responsive and mobile refinement

**Prompt 17 of 20**

## Depends on

Before writing anything, read in this order: `prompts/00_INDEX.md` (at least "Owner decisions", "Design direction" and "Build architecture"), then `prompts/BUILD_LOG.md` (what earlier sessions really did, including deviations). An owner decision recorded in the index overrides any default written in this prompt; if an answer there disagrees with what the modules in `src/data/` currently hold, bring the data into line first and log it (the admin-bound values named under the guardrails are the exception — only prompt 15 changes those). If the build log shows a dependency below is unfinished, stop and say so instead of improvising it.

- **Prompts 01–16** — all finished; the site is complete and visually polished at the reference widths. The build log names the "admin freeze commit".

## Context

IN-ARCH — *In-Arch Architects & Interior Designer*, Boring Road, Patna, Bihar, led by Principal Architect Ar. Mohammad Hassanuddin — is getting a new public website on an existing React boilerplate that still wears a previous client's brand ("Dulcey Lead Services"). The new brand is warm, quiet, editorial luxury: ivory `#F4EFE7` and espresso `#231B15` (both sampled from the logo), deep charcoal-green `#161E19`, one terracotta accent; Fraunces serif headlines with a single italic terracotta phrase, Manrope for text and UI. Logo files are named for the background they sit ON: `logos/in-arch-logo-light-transparent.png` is the espresso lockup for light backgrounds, `logos/in-arch-logo-dark-transparent.png` the ivory lockup for dark backgrounds, and `logos/in-arch-favicon-light-transparent.png` / `logos/in-arch-favicon-dark-transparent.png` are the "IA" monogram under the same rule. Stack reality: React 18 + Create React App (`react-scripts` 5, plain JavaScript), React Router 7 in `BrowserRouter` mode, CSS Modules, GSAP 3.15 with ScrollTrigger. There is no `db.json`: enquiries are POSTed to `public/api/leads.php` (a JSON-file store) and read by the MUI admin panel at `/admin`.

## Objective

Prove — and where it fails, make — the site excellent on a phone and correct on everything else. The dummy the client saw existed only as desktop screenshots; this site was designed at 360–390 px first, and this prompt is the systematic check that every surface really works in the hand: thumb reach, tap targets, the dock and the browser's own bars, the on-screen keyboard, small and tall screens, landscape, tablets, zoom and reflow, and very wide monitors. Fixes are CSS and small structural adjustments only.

## Scope — files/areas to touch

**May edit** — the CSS Modules of any public section, shell component or kit primitive; `src/styles/inarch/*.css`; small JSX changes that are purely structural (an extra wrapper, a reordered element for phones, a `sizes` value, an `art` source). `scripts/qa/public-check.js` may gain the extra viewports listed below.

**May not** add features, sections, copy, routes or dependencies; may not change the lead form's logic or the data layer; may not touch `src/admin/`.

**Out of scope** — imagery and motion quality as such (prompt 16), accessibility conformance and performance budgets as such (prompt 18), CTA wording (prompt 19). Where a responsive fix would need a redesign of a section, describe it in the build log and leave the section as it is.

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

### The device matrix

Every public route — `/`, `/about`, `/expertise`, `/interior-design`, `/portfolio` (with and without a filter), three case studies (one, two and three photographs), `/contact`, the 404 — and every overlay state — index overlay, lead modal (empty, with errors, success, duplicate, failure), lightbox — is checked at:

| Class | Viewports (CSS px) |
|---|---|
| Small phones | 320 × 568 (reflow floor), 360 × 640, 360 × 800 |
| Phones | 390 × 844, 412 × 915, 430 × 932 |
| Phones, landscape | 640 × 360, 844 × 390 |
| Tablets | 768 × 1024, 820 × 1180, 1024 × 768 |
| Laptops and desktops | 1280 × 720, 1280 × 800, 1440 × 900, 1920 × 1080 |
| Very wide | 2560 × 1440 |

### What "excellent on a phone" means here

1. **Thumb reach.** On every page the primary action is in the lower half of the screen without scrolling more than one screen: the dock provides it everywhere; in-page primaries sit at the end of their block, not above the fold's top edge. The masthead holds nothing a visitor must reach except the optional call button.
2. **Targets.** Every link, button, chip, accordion header, stepper control and form control is at least 44 × 44 CSS px with at least 8 px between neighbouring targets. Text links inside paragraphs are exempt from the size but keep a comfortable line height.
3. **The dock and the browser's bars.** The dock respects `env(safe-area-inset-bottom)` (home indicator), never sits under the browser's bottom toolbar, never overlaps the last line of a page or a focused control (`scroll-padding-bottom` and the footer's padding do their job), follows the tone under it, and hides for the keyboard, the overlay, the modal and the footer's contact block. Full-height sections use `svh` (never `vh`) so nothing jumps when the address bar collapses; nothing is sized with `dvh` in a way that makes content resize while scrolling.
4. **The on-screen keyboard.** In the lead modal and on `/contact`: the focused field and its error message are visible above the keyboard (use `visualViewport` only if CSS cannot do it), the sheet's own scroll works, the submit button is reachable by scrolling, no field triggers page zoom (16 px text), and the correct keyboard appears for each field (`tel`, `email`, text).
5. **No hover dependence.** With a coarse pointer emulated, every piece of information and every action is available without hovering; no hover style sticks after a tap.
6. **Horizontal overflow.** `document.documentElement.scrollWidth === innerWidth` on every route at every viewport, including with the longest service titles and during every animation. Swipe rows scroll inside themselves only, show that more content exists (the next tile peeks in), and have button alternatives.
7. **Type on small screens.** No headline breaks a word or leaves a single short word on its last line where `text-wrap: balance` can prevent it; the hero's two-line headline stays two lines from 320 px; body text is never below 16 px; labels never below 12 px; line length between 35 and 68 characters for body text at every width.
8. **Small heights and landscape.** At 640 × 360 and 844 × 390 the hero still shows the headline and one action; full-height sections relax to content height instead of clipping; the index overlay and the lead sheet scroll internally and their close buttons stay reachable; the dock stays out of the way of content.

### Tablets

- At 768 the 8-column layouts are deliberate compositions, not stretched phone layouts or squeezed desktop ones: check each two-up arrangement, the right-hand lead panel (520 px), the portfolio's two-column offset, the footer's two columns.
- At 1024 × 768 (landscape tablet, coarse pointer) the desktop dock appears with all five links and remains comfortably tappable; hover-only enhancements (the service preview on Home) do not appear.

### Desktops and very wide screens

- From 1440 the grid gap is 40 px and type reaches its upper clamps; at 1920 and 2560 the content stays within 1680 px while full-bleed images and coloured bands continue to the edges; no image is stretched beyond its sharp limit — where a full-bleed photograph would be, it is capped by its frame or backed by the section's tone; line lengths do not exceed 68 characters.
- The dock stays centred and no wider than 960 px; the lead panel stays 560 px.

### Zoom, reflow and text settings

- **Reflow (WCAG 1.4.10):** at 320 CSS px wide (equivalent to 1280 px at 400 % zoom) every page is usable with vertical scrolling only.
- **Text resize (1.4.4):** at 200 % browser zoom on a 1280 × 800 window nothing overlaps or is cut off; the dock and overlays still work.
- **Text spacing (1.4.12):** with line height 1.5, paragraph spacing 2 em, letter spacing 0.12 em and word spacing 0.16 em forced by a user stylesheet, no text is clipped in buttons, chips, tiles, the dock or the accordion headers.
- **Orientation (1.3.4):** nothing is locked to portrait or landscape; rotating with an overlay open keeps it usable.

### Print

A minimal print stylesheet for the public surface: hide the dock, overlays, the curtain and decorative frames' covers; print text in black on white with the URL of the page; images at content width. One page of `/contact` must print with the address and phone number legible.

## Functional guardrails

- **Contract frozen.** `public/api/leads.php` and `public/api/config.example.php` are not edited. The endpoint and its actions stay as they are: `POST /api/leads.php?action=create` with body `{ "lead": { … } }`, plus `list`, `update`, `delete` and `health`. Every lead still carries exactly these keys with the same meaning: `lead_id, name, mobile, email, organization, service_interest, state, message, source, status, submitted_at, updated_at, page_url, user_agent, utm_source, utm_medium, utm_campaign, utm_term, utm_content, notes, activity`. The status keys `new, contacted, consultation_booked, procedure_scheduled, completed, not_interested` are never renamed. `.env` and `.env.example` are not edited (use the git-ignored `.env.development.local` for local overrides). Anything new a lead needs is added as an extra key; nothing existing is renamed, removed or reshaped.
- **Admin-frozen files** — no diff against the "admin freeze commit" that prompt 15 recorded in `prompts/BUILD_LOG.md` (and none against baseline `cc2fc52d90987adcf62a5c286c4eb87d155fc3f3` except what prompt 15 logged): `src/admin/**`, `src/theme/muiTheme.js`, `src/styles/variables.css`, `src/styles/global.css`, `src/styles/animations.css`, `src/styles/responsive.css`, `src/styles/dulcey.css`, `src/App.css`, `src/hooks/useMediaQuery.js`, `src/surfaces/AdminSurface.jsx`, `public/api/**`, `.env`, `.env.example`.
- **Admin-bound values** are final since prompt 15 and must not move again: `siteConfig.brandName`, `siteConfig.legalName`, `siteConfig.logo`, `LOGO_SIZE`, `expertiseTitles`, `seoConfig.pages.admin`, `getConfig()`.
- **CSS-first, no behaviour change.** Routes, data, copy, the lead flow, deep links, the portfolio filter, the redirect and the page transitions behave exactly as before this prompt.
- **Desktop does not regress while phones improve** — and the reverse: re-check 1440 after every phone fix and 390 after every desktop fix.
- **No user-agent sniffing**, no viewport `maximum-scale` below 5, no `user-scalable=no`, no disabling of pinch-zoom, no fixed heights on text containers.
- **The `ia` scope and the public-surface selectors stay the only way public CSS reaches the page**; nothing new can match an element on `/admin`.
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

- **Matrix evidence.** Extend `scripts/qa/public-check.js` with the viewports in the table (keep the seven reference widths as the default; add a `--matrix full` option) and run it: zero overflow, zero console errors, zero undersized targets, zero serious or critical axe violations on every route at every viewport. Save a screenshot per route × viewport to `qa-artifacts/responsive/` and review them all by eye; list every defect found and its fix in the build log.
- **Overlay states by hand** at 320 × 568, 360 × 640, 390 × 844, 844 × 390, 768 × 1024 and 1440 × 900: index overlay; lead modal in each of its five states; lightbox with one and with three images; with a mobile device profile and the keyboard shown where the tool supports it.
- **Touch emulation** (coarse pointer, no hover) on every page: no hidden information, no sticky hover, swipe rows and the lightbox swipe work, buttons provide the non-drag alternative.
- **Zoom, reflow, text spacing, orientation:** each check above performed on Home, Expertise, a case study and Contact, with a note per page in the build log.
- **Reference widths re-verified:** 360, 390, 768, 1024, 1280, 1440 and 1920 for every route after the last fix.
- **Print preview** of `/contact` and one case study.
- **Admin parity:** `node scripts/qa/parity.js --suite admin` between the admin freeze commit's build and this branch: zero differences.
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

**Close out.** Append an entry to `prompts/BUILD_LOG.md` (date, "Prompt 17", files created / changed / deleted, decisions taken, every deviation from this prompt with its reason, anything left open). Add a short entry under `## [3.0.0] — IN-ARCH redesign (in progress)` at the top of `CHANGELOG.md`. Commit with a message that starts `IN-ARCH 17:`.
