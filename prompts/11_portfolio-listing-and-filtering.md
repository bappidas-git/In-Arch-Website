# 11 — Portfolio listing and filtering

**Prompt 11 of 20**

## Depends on

Before writing anything, read in this order: `prompts/00_INDEX.md` (at least "Owner decisions", "Design direction" and "Build architecture"), then `prompts/BUILD_LOG.md` (what earlier sessions really did, including deviations). An owner decision recorded in the index overrides any default written in this prompt; if an answer there disagrees with what the modules in `src/data/` currently hold, bring the data into line first and log it (the admin-bound values named under the guardrails are the exception — only prompt 15 changes those). If the build log shows a dependency below is unfinished, stop and say so instead of improvising it.

- **Prompts 01–05** — design system; `src/data/projects.js` (`categories`, seven `projects`) and the `pr-*-cover-tall` / `pr-*-cover-wide` image keys; the `nothing-here` illustration; the kit (`ProjectTile`, `Chip`, `Illustration`); the shell, where "Portfolio" is the fifth navigation item and `/portfolio` currently renders `PendingPage`; the lead modal with its source name `portfolio-invite`.
- **Prompts 06–10** — Home, Studio, Expertise and Interior Design are finished and already link to `/portfolio` and `/portfolio/<slug>`.

## Context

IN-ARCH — *In-Arch Architects & Interior Designer*, Boring Road, Patna, Bihar, led by Principal Architect Ar. Mohammad Hassanuddin — is getting a new public website on an existing React boilerplate that still wears a previous client's brand ("Dulcey Lead Services"). The new brand is warm, quiet, editorial luxury: ivory `#F4EFE7` and espresso `#231B15` (both sampled from the logo), deep charcoal-green `#161E19`, one terracotta accent; Fraunces serif headlines with a single italic terracotta phrase, Manrope for text and UI. Logo files are named for the background they sit ON: `logos/in-arch-logo-light-transparent.png` is the espresso lockup for light backgrounds, `logos/in-arch-logo-dark-transparent.png` the ivory lockup for dark backgrounds, and `logos/in-arch-favicon-light-transparent.png` / `logos/in-arch-favicon-dark-transparent.png` are the "IA" monogram under the same rule. Stack reality: React 18 + Create React App (`react-scripts` 5, plain JavaScript), React Router 7 in `BrowserRouter` mode, CSS Modules, GSAP 3.15 with ScrollTrigger. There is no `db.json`: enquiries are POSTed to `public/api/leads.php` (a JSON-file store) and read by the MUI admin panel at `/admin`.

## Objective

Build the **Portfolio** listing at `/portfolio`: the studio's real, photographed work in an editorial grid that can be filtered by category, with tiles that lead into case studies. It replaces the boilerplate's "Who We Serve" sector page as the place that shows *who and what the studio designs for*: `/industries` keeps resolving and now forwards here. The listing is honest about what exists — seven interior projects in two categories today — and is built so that adding a project or a category is a data change, not a redesign.

## Scope — files/areas to touch

**Create** — `src/pages/Portfolio/PortfolioPage.jsx`, `PortfolioPage.module.css`, `index.js`, and in `src/pages/Portfolio/sections/` (each `.jsx` + `.module.css`): `PortfolioHeader`, `FilterBar`, `ProjectGrid`, `InviteTile`, `EmptyState`; plus `src/pages/Portfolio/usePortfolioFilter.js` (reads and writes the `category` search parameter) with a unit test.

**Edit**

- `src/App.jsx` — `/portfolio` lazy-loads `./pages/Portfolio/PortfolioPage` instead of `PendingPage`; `ScrollManager` gains the one `preserveScroll` guard described under Functional guardrails; `/industries` becomes `<Route path="/industries" element={<Navigate to="/portfolio" replace />} />` (import `Navigate` from `react-router-dom`).
- `src/config/seo.js` — `pages.portfolio`: path `/portfolio`; title "Architecture & Interior Design Portfolio — IN-ARCH"; description "Selected interior projects by In-Arch Architects & Interior Designer, Patna: living spaces, modular kitchens and made-to-measure details."; breadcrumb "Portfolio"; indexable. Remove `pages.industries` and the file's import of `industriesData`.
- `src/components/common/SEO/SEOHead.jsx` — `ROUTE_MAP['/portfolio']` → `pages.portfolio`; drop the `/industries` entry (the route redirects before anything renders).

**Delete** — the whole of `src/pages/Industries/` and `src/data/industriesData.js` (confirm by search that nothing imports them any more — the old Home sections that did were removed in prompt 07).

**Out of scope** — the case-study page (prompt 12 — `/portfolio/:slug` keeps rendering `PendingPage` until then); the legacy `public/images/hero-industries-v2*` and `public/images/icons/` files (prompt 14); `public/sitemap.xml` (prompt 18); everything under `src/admin/`.

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

This page opens with words and a control, not with a full-bleed photograph — the grid is the picture. It also has no closing band: the last tile of the grid is the invitation.

### Section 1 — Header (`tone="light"`, compact rhythm)

- Eyebrow: "Portfolio"; `h1` `.ia-t-display-xl`: "Selected *work.*"; `Lede`: "Interiors designed by the studio, shown as photographed."
- A count in `.ia-t-label`, right-aligned from 1024: "07 projects" (derived from the data, zero-padded).
- Starts 112 px from the top on phones, 160 px on desktop; the header is short so the first row of the grid is already visible on a 390 × 844 screen.

### Section 2 — Filter bar

- A row of `Chip`s: "All" followed by **only the categories that contain at least one project**, each with its count — today "All 7", "Interior Design 4", "Modular Kitchens 3". The four empty categories from the PDF stay in the data and appear automatically when they gain a project; no empty chip is ever shown.
- Semantics: the row is a group labelled "Filter projects by category"; each chip is a toggle button with `aria-pressed`; exactly one is pressed. A visually hidden live region announces the result ("Showing 3 projects in Modular Kitchens").
- State lives in the URL: `/portfolio?category=modular-kitchens` (category slug; no parameter = All). Changing the filter replaces the history entry (no pile of back-button steps) and must not trigger the page-transition curtain or a scroll jump; loading the URL directly applies the filter; an unknown slug shows the empty state.
- **Phones:** the chips scroll horizontally inside the gutter (native scroll, no snap), 44 px tall, the pressed chip scrolled into view. **Desktop:** the row sits under a hairline and becomes `position: sticky` at the top of the viewport while the grid scrolls, on a `--ia-bg` background with a hairline beneath.

### Section 3 — The grid

- Each project is a `ProjectTile`: zero-padded index, category, title, linking to `/portfolio/<slug>`. Everything is visible at rest.
- **Phones (one column):** tiles alternate 4:5 (`-cover-tall`) and 3:2 (`-cover-wide`), 48 px apart, the 3:2 tiles inset 20 px further on the right so the column is not a ruler-straight stack.
- **Tablet (two columns):** the right column starts 96 px lower; 4:5 covers throughout.
- **Desktop (12 columns), a four-tile pattern that repeats:** A spans columns 1–7 (3:2) · B spans 9–12 (4:5) and starts 96 px lower · C spans 1–4 (4:5) · D spans 6–12 (3:2) and starts 64 px lower. Vertical gap 128 px. From 1920 the pattern keeps its proportions inside the 1680 px content width.
- **Filtering animation:** GSAP `Flip` (register it in this page's chunk only) — tiles that stay slide to their new positions, tiles that leave fade out and tiles that enter fade in, 600 ms `power3.inOut`, transform and opacity only. Reduced motion: the grid simply re-renders. During the animation the grid's height must not jump (`Flip` with `absolute: true` on leaving tiles).
- The first two tiles' images load eagerly (`priority` on the first only); the rest are lazy.

### Section 4 — The invitation tile (the page's ending)

- The last cell of the grid in every filter state: a forest tile (`data-tone="dark"`, 4:5, no photograph) with `.ia-t-label` "An invitation", `.ia-t-display-md` "Your space, *next.*" and a `TextLink` with arrow "Start a project" → `openLeadModal('portfolio-invite', { context: { label: 'Portfolio' } })`. The whole tile is the button. It takes the next slot in the pattern, so the page ends inside the grid rather than with a band.

### Section 5 — Empty state

- Shown when the current filter yields nothing (an unknown or empty category in the URL): the `nothing-here` illustration at 160 px with a real `title`, `.ia-t-display-sm` "Nothing to show in this category yet.", and a `Chip` "Show all work" that clears the parameter. It is announced by the live region and the invitation tile is not shown beside it.

## Functional guardrails

- **Contract frozen.** `public/api/leads.php` and `public/api/config.example.php` are not edited. The endpoint and its actions stay as they are: `POST /api/leads.php?action=create` with body `{ "lead": { … } }`, plus `list`, `update`, `delete` and `health`. Every lead still carries exactly these keys with the same meaning: `lead_id, name, mobile, email, organization, service_interest, state, message, source, status, submitted_at, updated_at, page_url, user_agent, utm_source, utm_medium, utm_campaign, utm_term, utm_content, notes, activity`. The status keys `new, contacted, consultation_booked, procedure_scheduled, completed, not_interested` are never renamed. `.env` and `.env.example` are not edited (use the git-ignored `.env.development.local` for local overrides). Anything new a lead needs is added as an extra key; nothing existing is renamed, removed or reshaped.
- **Admin-frozen files** — no diff against baseline commit `cc2fc52d90987adcf62a5c286c4eb87d155fc3f3`: `src/admin/**`, `src/theme/muiTheme.js`, `src/styles/variables.css`, `src/styles/global.css`, `src/styles/animations.css`, `src/styles/responsive.css`, `src/styles/dulcey.css`, `src/App.css`, `src/hooks/useMediaQuery.js`, `public/api/**`, `.env`, `.env.example`.
- **Admin-bound values** keep their current values, because the admin prints or reads them: `siteConfig.brandName`, `siteConfig.legalName`, `siteConfig.logo` and `LOGO_SIZE` in `src/data/siteConfig.js`; `expertiseTitles` in `src/data/expertiseData.js`; `seoConfig.pages.admin` in `src/config/seo.js`; `getConfig()` in `src/utils/webhookSubmit.js`. Prompt 15 is the only place they change.
- **`/industries` still resolves.** It forwards to `/portfolio` on the client (`replace`, so the back button does not bounce), for a direct load, an old bookmark and an in-app link alike. This is the recorded mapping of the boilerplate's "Who We Serve" page (owner decision D-17); if the index says the owner wants a standalone sectors page instead, stop and ask before deleting `src/pages/Industries/`.
- **Flows that existed on the old sector page survive in new form:** its CTA into the lead modal is now the invitation tile (`portfolio-invite`, replacing `industries-cta` and `industries-cta-2`); its call link and its onward link to Expertise are in the dock and footer.
- **Data-driven, no hard-coded projects.** Tiles, counts, chips and slugs all come from `src/data/projects.js`; adding a project there must be enough to make it appear, be counted and be filterable.
- **The filter never breaks navigation.** The dock, the overlay, the back button and deep links behave normally with any filter active; `ScrollManager` in `src/App.jsx` is keyed on `location.key`, so a search-parameter change would send the visitor back to the top: have the filter navigate with `{ replace: true, state: { preserveScroll: true } }` and make `ScrollManager`'s layout effect return early when `location.state?.preserveScroll` is true. That is the only change to `ScrollManager`; every other navigation — including a click on the link of the page already open — must still reset to the top exactly as before.
- **No empty promises.** No "coming soon" tile, no placeholder project, no greyed-out category.
- **Truthful content.** Every fact comes from `details of in-arch.pdf` through the modules in `src/data/`. No testimonials, awards, client names, statistics, ratings, years, areas, locations or quotes are invented; where the client supplied nothing the surface stays silent and the gap is listed in `prompts/00_INDEX.md`. Tiles show only index, category and title — no location, year, area or client; titles are the descriptive ones from the data; none of the dummy's project names or photographs appears.
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

- **Filter, every path.** For "All", each visible category, and `?category=landscape-outdoor-spaces` (empty) and `?category=nonsense`: by clicking, by keyboard (Tab to the group, Space / Enter), by loading the URL directly, and by using back / forward — the right tiles show, the count in the live region is right, `aria-pressed` is on exactly one chip (none in the empty state), the URL matches, and neither the curtain nor a scroll jump occurs.
- **Flip.** Switch filters rapidly ten times: no tile is left mis-positioned or invisible, the grid height never collapses, focus stays on the pressed chip; at 4× CPU throttling the animation holds 60 fps; under reduced motion there is no movement.
- **Redirect.** `/industries`, `/industries/` and `/industries?utm_source=test` all end on `/portfolio`; the browser's back button returns to the page before, not to `/industries`.
- **Grid** at 360, 390, 768, 1024, 1280, 1440 and 1920 px: the alternating and offset patterns are as specified; no tile is narrower than 280 px; images are sharp (no upscaling beyond each key's limit) and none shows a blemish from prompt 02's list; the sticky filter bar on desktop never covers a focused tile; the invitation tile always occupies the last slot.
- **Unit test.** `usePortfolioFilter` maps slug ↔ category, falls back to All for a missing parameter and to the empty state for an unknown one.
- **Lead context.** The invitation tile opens the modal; the stored lead has `source: "portfolio-invite"`.
- **Cleanliness.** `src/pages/Industries/` and `src/data/industriesData.js` are gone and nothing references them; `grep -ri "who we serve\|industriesData" src` returns nothing.
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

**Close out.** Append an entry to `prompts/BUILD_LOG.md` (date, "Prompt 11", files created / changed / deleted, decisions taken, every deviation from this prompt with its reason, anything left open). Add a short entry under `## [3.0.0] — IN-ARCH redesign (in progress)` at the top of `CHANGELOG.md`. Commit with a message that starts `IN-ARCH 11:`.
