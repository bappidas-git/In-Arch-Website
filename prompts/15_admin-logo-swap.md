# 15 — Admin logo swap (the only admin change)

**Prompt 15 of 20**

## Depends on

Before writing anything, read in this order: `prompts/00_INDEX.md` (at least "Owner decisions", "Design direction" and "Build architecture"), then `prompts/BUILD_LOG.md` (what earlier sessions really did, including deviations). An owner decision recorded in the index overrides any default written in this prompt; if an answer there disagrees with what the modules in `src/data/` currently hold, bring the data into line first and log it (the admin-bound values named under the guardrails are the exception — only prompt 15 changes those). If the build log shows a dependency below is unfinished, stop and say so instead of improvising it.

- **Prompts 01–14** — all finished; in particular prompt 02 (the brand files in `public/images/brand/`, `src/data/services.js` with `serviceTitles`), prompt 04 (the surface-aware boot in `public/index.html`: the admin still gets the old splash and, from `public/legacy-icons/`, the old tab icon) and prompt 14 (the public site no longer reads any legacy `siteConfig` key; the admin loads through `src/surfaces/AdminSurface.jsx`; the build log says whether the surface split was kept or reverted — either state is fine for this prompt).
- Read the answers to owner decisions **D-01**, **D-02** and **D-22** in `prompts/00_INDEX.md` before touching anything; the defaults are restated below.

## Context

IN-ARCH — *In-Arch Architects & Interior Designer*, Boring Road, Patna, Bihar, led by Principal Architect Ar. Mohammad Hassanuddin — is getting a new public website on an existing React boilerplate that still wears a previous client's brand ("Dulcey Lead Services"). The new brand is warm, quiet, editorial luxury: ivory `#F4EFE7` and espresso `#231B15` (both sampled from the logo), deep charcoal-green `#161E19`, one terracotta accent; Fraunces serif headlines with a single italic terracotta phrase, Manrope for text and UI. Logo files are named for the background they sit ON: `logos/in-arch-logo-light-transparent.png` is the espresso lockup for light backgrounds, `logos/in-arch-logo-dark-transparent.png` the ivory lockup for dark backgrounds, and `logos/in-arch-favicon-light-transparent.png` / `logos/in-arch-favicon-dark-transparent.png` are the "IA" monogram under the same rule. Stack reality: React 18 + Create React App (`react-scripts` 5, plain JavaScript), React Router 7 in `BrowserRouter` mode, CSS Modules, GSAP 3.15 with ScrollTrigger. There is no `db.json`: enquiries are POSTed to `public/api/leads.php` (a JSON-file store) and read by the MUI admin panel at `/admin`.

## Objective

Make the one change the admin panel is allowed to receive in this project: **replace the previous client's logo with the IN-ARCH logo** wherever the admin shows it — the top bar, the mobile menu, the login card, the Guidelines password gate, the boot splash and the browser tab.

The repository forces two riders, each governed by an owner decision and each achieved without editing a single file under `src/admin/`:

- **D-01 (default: yes).** The admin prints the brand *name* from the same shared config value that supplies the logo's alt text — as the login title, in the dashboard heading and footer line, in the mobile menu footer, in the Guidelines subtitle and in the browser-tab title. Leaving "Dulcey Lead Services" beside an IN-ARCH logo would be a defect, so the name value changes with the logo.
- **D-02 (default: yes).** The admin's "Interested In" filter takes its fixed option list from `expertiseTitles`; it follows the seven services the new enquiry form actually sends.

If the index records "no" for either, skip that rider and leave its values exactly as they are. Nothing else in the admin changes — no layout, colour, type, copy, behaviour, credential or guideline text.

## Scope — files/areas to touch

**Create**

- `public/images/brand/inarch-admin-logo-1351.png` — built by a small addition to `scripts/build-brand-assets.js`: the dark-ink wordmark (`inarch-wordmark-on-light-1383.png`, or its source crop) scaled to 1351 px wide (≈ 195 px tall) and centred on a fully transparent **1351 × 200** canvas. Those are exactly the pixel dimensions of the file it replaces, so `LOGO_SIZE` does not change and no admin box moves by a pixel.

**Edit**

- `src/data/siteConfig.js` — `logo: '/images/brand/inarch-admin-logo-1351.png'`. `LOGO_SIZE` stays `{ width: 1351, height: 200 }`. With D-01: `brandName: 'IN-ARCH'` and `legalName: 'In-Arch Architects & Interior Designer'`. Update the comments beside these keys to say what reads them.
- With D-02: `src/data/expertiseData.js` becomes a three-line adapter over `src/data/services.js` that still exports `expertiseTitles` (now the seven service titles, in order), plus `expertiseAreas` and the default export pointing at `services` so the module's shape is unchanged. Without D-02 the file is left untouched.
- `public/index.html` — remove the admin-only branch added in prompt 04: the old splash block and its CSS go, the IN-ARCH splash is shown on both surfaces, and the inline script no longer repoints the icon links to `/legacy-icons/`. The admin-only font links stay.

**Delete** — `public/legacy-icons/` and `public/images/logo/` (`dulcey-wordmark-1351.png`, `dls-mark-860.png`), after a search proves nothing references them (`src/`, `public/index.html`, `public/manifest.json`, `scripts/`).

**Must not be edited** — any file under `src/admin/` (components, pages, CSS Modules, context, utils, guideline content); `src/theme/muiTheme.js`; the legacy stylesheets; `src/surfaces/AdminSurface.jsx`; `public/api/`; `.env`. In particular the admin's logo CSS (`.logo` and `.mobileMenuLogo` in `AdminTopbar.module.css`, `.loginLogo img` in `AdminLogin.module.css`, `.modalLogo` in `Guideline.module.css`) should need no change because the new file has the old file's exact dimensions. Only if the wordmark is genuinely illegible at one of those sizes may you adjust the `height` in that one rule — nothing else in the rule, nothing else in the file — and you must log it.

**Out of scope** — the Guidelines tab's written content, which still documents the previous client's site (its domain, colours, fonts and file names), the Guidelines password constant, the default admin username in `.env`, and code comments that mention the old brand: owner decision D-20 keeps all of these untouched; list what you see in the build log so the owner can decide.

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

### What "the logo" is in the admin, and what it becomes

| Where | Today | After this prompt |
|---|---|---|
| Top bar (`AdminTopbar`), 32 px tall, 24 px tall on narrow screens | Dulcey wordmark via `siteConfig.logo` | IN-ARCH wordmark, dark ink (`#231B15`) on the white bar, same box |
| Mobile menu header, 28 px tall | same | same swap |
| Login card (`AdminLogin`), 40 px tall | same | same swap |
| Guidelines password gate, 40 px tall | same | same swap |
| Boot splash before the app mounts | "DLS" mark, tagline and red progress bar | the IN-ARCH splash already used by the public site |
| Browser tab icon | old favicon from `/legacy-icons/` | the IN-ARCH icon set |
| `alt` text of the four images | "Dulcey Lead Services" | "IN-ARCH" (it is `siteConfig.brandName`) — with D-01 |

- Use the **wordmark-only** artwork, not the full lockup: at 24–40 px the descriptor line "ARCHITECTS & INTERIOR DESIGNER" would be under 5 px tall and illegible (owner decision D-22).
- Use the **dark-ink** file (cut from `logos/in-arch-logo-light-transparent.png`): every admin surface behind the logo is white.
- Do not recolour, outline or thicken the wordmark. Its strokes are fine (about 7 % of the cap height); check it at the 24 px placement on a 1× screen before accepting it.

### Brand-name text (D-01)

With the default, these strings change because they are rendered from the shared value — none of them is typed in an admin file: login title "IN-ARCH"; dashboard heading "IN-ARCH — Lead Management"; dashboard footer line "In-Arch Architects & Interior Designer · Admin Panel"; mobile menu footer "IN-ARCH · Admin Panel"; Guidelines subtitle "How the IN-ARCH site stores leads, …"; one sentence in the SEO Setup guide; browser-tab title "Admin Panel — IN-ARCH". The short form is deliberate: it is shorter than the name it replaces, so no heading can wrap where it did not before.

### "Interested In" options (D-02)

With the default, the fixed part of the filter's list becomes the seven service titles followed by "Something else" (the admin appends that itself); any other value found in stored leads is still appended automatically, exactly as before.

## Functional guardrails

- **Contract frozen.** `public/api/leads.php` and `public/api/config.example.php` are not edited. The endpoint and its actions stay as they are: `POST /api/leads.php?action=create` with body `{ "lead": { … } }`, plus `list`, `update`, `delete` and `health`. Every lead still carries exactly these keys with the same meaning: `lead_id, name, mobile, email, organization, service_interest, state, message, source, status, submitted_at, updated_at, page_url, user_agent, utm_source, utm_medium, utm_campaign, utm_term, utm_content, notes, activity`. The status keys `new, contacted, consultation_booked, procedure_scheduled, completed, not_interested` are never renamed. `.env` and `.env.example` are not edited (use the git-ignored `.env.development.local` for local overrides). Anything new a lead needs is added as an extra key; nothing existing is renamed, removed or reshaped.
- **`git diff --stat` for `src/admin/` is empty** at the end of this prompt (or contains only the single logged `height` change described under Scope). The admin-frozen files — `src/theme/muiTheme.js`, the five legacy stylesheets, `src/App.css`, `src/hooks/useMediaQuery.js`, `src/surfaces/AdminSurface.jsx`, `public/api/**`, `.env`, `.env.example` — show no diff.
- **Layout does not move.** Because the replacement image has the old image's intrinsic size and `LOGO_SIZE` is unchanged, every element on every admin screen keeps its position and size; the only pixels that differ are inside the four logo boxes and the brand-name text listed above (where a shorter string may end a line earlier).
- **Behaviour does not move.** Login, session, routing guard, polling, cross-tab sync, search, filters, sorting, pagination, status changes, bulk actions, notes, activity timeline, CSV export and import, delete with confirmation, the Guidelines gate and its four tabs all work exactly as before. The lead store and its contract are untouched.
- **Credentials and secrets are not touched or printed:** `.env`, the admin username and password, the leads API key, the Guidelines password.
- **The public site is unaffected:** no public component reads `siteConfig.logo`, `siteConfig.brandName`, `siteConfig.legalName`, `LOGO_SIZE` or `expertiseData` (prompt 14 removed the last such reads) — confirm by search before changing them.
- **This is the only prompt that may change an admin-bound value.** After it, record the commit as the "admin freeze commit" in the build log; later prompts compare against it.
- Admin untouched — apart from the logo swap, and the two shared values that travel with it, that this prompt exists to make.

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

### Proof

1. Build and serve the **previous commit** (the state before this prompt) on port 8081 and this branch on port 8080.
2. Run the parity suite with the expected regions masked:

```bash
node scripts/qa/parity.js --a http://127.0.0.1:8081 --b http://127.0.0.1:8080 --suite admin --mask "img[alt],[class*='loginTitle'],[class*='pageTitle'],[class*='footerBadge'],[class*='mobileMenuFooter'],[class*='pageSubtitle']"
```

   Expected result: **zero** unmasked pixel differences on the leads list, the open "Interested In" menu (unless D-02 applies — then only that menu's option labels differ), the lead detail page, the delete dialog and the top bar outside the logo box, at 390, 768 and 1440 px. On the login, dashboard and Guidelines screens the only differences are inside the masked boxes and — where a shorter brand string ends a line earlier — the reflow directly caused by it; inspect each diff image and describe it in the build log. Any other difference is a defect: fix it or revert.
3. With nothing blocked, look at every logo placement at 1× and 2×, at 1440, 768 and 390 px: the wordmark is sharp, vertically centred where the old one was, legible at 24 px, and never clipped; the "Admin Panel" label beside it has not moved.
4. Hard-reload `/admin/login`: the splash is the IN-ARCH one, the tab icon is the IN-ARCH one, the tab title reads "Admin Panel — IN-ARCH" (with D-01), and the fonts and icons inside the admin are unchanged (Archivo, Iconify glyphs).
5. With D-02: open the "Interested In" filter — it lists the seven service titles in order, then "Something else", then any other stored value; filtering by a service returns the leads sent from the new form with that service.
6. Search the built output for the old logo: `grep -rl "dulcey-wordmark\|dls-mark\|legacy-icons" build/` returns nothing. Search the admin screens (not the Guidelines content) for "Dulcey": none remains with D-01; list what remains inside the Guidelines tabs for the owner.

### Regression

**Regression pass — the whole site, every time.** Walk `/`, `/about`, `/expertise`, `/interior-design`, `/portfolio`, one `/portfolio/<slug>`, `/industries`, `/contact` and a nonsense URL at 390 px and at 1440 px. Open the lead modal from three different CTAs. Submit one real enquiry through the modal and one through `/contact` (`node scripts/qa/lead-flow.js` does this and asserts the payload keys), confirm the success state, then submit the same mobile number again and confirm the duplicate path. Log in at `/admin` with the `REACT_APP_ADMIN_USERNAME` / `REACT_APP_ADMIN_PASSWORD` values from `.env` (read them at run time; never print or copy them) and confirm: the dashboard counts and recent table; the leads table (search, every filter, sorting, pagination, inline status change, bulk select, CSV export and import, delete with its confirm dialog); a lead's detail page (the lead you just sent shows its name, mobile, email, interested-in, message, source and page URL; add a note; change the status); the Guidelines password gate and its four tabs; logout. Then run the admin-frozen check — it must print nothing:

```bash
git diff --stat cc2fc52d90987adcf62a5c286c4eb87d155fc3f3 -- src/admin src/theme src/styles/variables.css src/styles/global.css src/styles/animations.css src/styles/responsive.css src/styles/dulcey.css src/App.css src/hooks/useMediaQuery.js public/api .env .env.example
```

If the baseline commit is missing from a shallow clone, run `git fetch --unshallow origin` first. Fix whatever the pass finds before calling this prompt done, and delete the test leads afterwards (`build/api/data/` and `public/api/data/` are git-ignored; never commit them).

For this prompt the admin-frozen check is run against the previous commit as well as the baseline, and must be empty for `src/admin` in both.

- **Breakpoints.** Check 360, 390, 768, 1024, 1280, 1440 and 1920 px wide, plus one landscape phone (844 × 390): no horizontal scroll, nothing clipped or overlapping, every tap target ≥ 44 × 44 px, no text below 12 px, and the dock never hides a focused control. (For this prompt the matrix applies to the admin's logo placements and to a full public smoke pass — nothing public should have changed.)
- **Keyboard.** Tab through the whole surface: logical order, a visible 2 px focus ring on every stop, no trap outside an open overlay, Escape closes overlays and returns focus to the opener, Enter and Space activate.
- **Contrast.** Text ≥ 4.5:1 (≥ 3:1 from 24 px, or 18.66 px bold); control boundaries and focus rings ≥ 3:1. Measure text that sits on a photograph at its worst pixel.
- **Screen reader.** Exactly one `h1`, headings in order, `nav` / `main` / `footer` landmarks, meaningful `alt` on content images and empty `alt` on decorative ones, an accessible name on every control, results announced through live regions. Inspect the accessibility tree, and use VoiceOver or NVDA if the session has one.
- **Reduced motion.** Emulate `prefers-reduced-motion: reduce`: everything is visible and usable with no transforms, parallax, pinning or curtain.
- **Automated.** `node scripts/qa/public-check.js` reports no console errors, no failed requests, no horizontal overflow and zero serious or critical axe violations; `npm test -- --watchAll=false` passes; `npm run build` ends with "Compiled successfully" and no warnings.

**Close out.** Append an entry to `prompts/BUILD_LOG.md` (date, "Prompt 15", files created / changed / deleted, decisions taken, every deviation from this prompt with its reason, anything left open). Add a short entry under `## [3.0.0] — IN-ARCH redesign (in progress)` at the top of `CHANGELOG.md`. Commit with a message that starts `IN-ARCH 15:`. Then add one more line to the log — "Admin freeze commit: <the SHA of the commit you just made>" — and commit that line on its own (`IN-ARCH 15: record admin freeze commit`). Every later prompt compares the admin against that SHA.
