# 16 — Imagery, illustration, icon and motion polish

**Prompt 16 of 20**

## Depends on

Before writing anything, read in this order: `prompts/00_INDEX.md` (at least "Owner decisions", "Design direction" and "Build architecture"), then `prompts/BUILD_LOG.md` (what earlier sessions really did, including deviations). An owner decision recorded in the index overrides any default written in this prompt; if an answer there disagrees with what the modules in `src/data/` currently hold, bring the data into line first and log it (the admin-bound values named under the guardrails are the exception — only prompt 15 changes those). If the build log shows a dependency below is unfinished, stop and say so instead of improvising it.

- **Prompts 01–15** — all finished: every public page is rebuilt, the legacy site is retired, the admin carries its new logo and the build log names the "admin freeze commit".
- This prompt changes no structure and adds no feature. If a page is missing or broken, stop and report it instead of polishing around it.

## Context

IN-ARCH — *In-Arch Architects & Interior Designer*, Boring Road, Patna, Bihar, led by Principal Architect Ar. Mohammad Hassanuddin — is getting a new public website on an existing React boilerplate that still wears a previous client's brand ("Dulcey Lead Services"). The new brand is warm, quiet, editorial luxury: ivory `#F4EFE7` and espresso `#231B15` (both sampled from the logo), deep charcoal-green `#161E19`, one terracotta accent; Fraunces serif headlines with a single italic terracotta phrase, Manrope for text and UI. Logo files are named for the background they sit ON: `logos/in-arch-logo-light-transparent.png` is the espresso lockup for light backgrounds, `logos/in-arch-logo-dark-transparent.png` the ivory lockup for dark backgrounds, and `logos/in-arch-favicon-light-transparent.png` / `logos/in-arch-favicon-dark-transparent.png` are the "IA" monogram under the same rule. Stack reality: React 18 + Create React App (`react-scripts` 5, plain JavaScript), React Router 7 in `BrowserRouter` mode, CSS Modules, GSAP 3.15 with ScrollTrigger. There is no `db.json`: enquiries are POSTed to `public/api/leads.php` (a JSON-file store) and read by the MUI admin panel at `/admin`.

## Objective

Walk the finished site once with two lenses and make it read as the work of one hand:

- **Imagery, illustration and icons** — the right photograph in the right place at the right crop and sharpness, no photograph leaned on twice, one colour grade, one icon style, licences complete.
- **Motion** — one choreography across all pages, built only from the shared tokens, smooth on a mid-range phone, silent under reduced motion, and never in the way.

This is where the site moves from "built to spec" to "approved at first sight" — and where the dummy's faults (the same few photographs on every page, static cards) are checked off as fixed.

## Scope — files/areas to touch

**May edit**

- `scripts/image-specs.js` (focal points, boxes, widths) and the shared processing parameters in `scripts/build-images.js`; then re-run `npm run build:images` and commit the regenerated `public/images/inarch/` files and `src/data/imageManifest.json`. A changed crop gets a **new file name** (bump a `-v2` suffix in the key) because `/images/**` is cached as immutable.
- `src/data/images.js` (alt text), `src/data/credits.js`, `public/images/inarch/CREDITS.md`, the SVG icons / illustrations / Lottie files in `public/images/inarch/`.
- `src/motion/` (tokens and `useMotionScope`), and the `data-m` attributes, `sizes`, `object-position`, frame ratios and motion-related CSS of any public section or shell component.
- `scripts/generate-og.js` / `scripts/generate-icons.js` and their outputs, if the Open Graph image or the favicon fails the checks below.

**May not** add or remove sections, change copy or data, change routes, touch the lead form's logic, or edit anything under `src/admin/`.

**Out of scope** — layout changes per breakpoint (prompt 17), accessibility and performance budgets as such (prompt 18), CTA wording and placement (prompt 19).

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

### Part 1 — Imagery

1. **Reuse audit.** Produce a table (commit it to the build log) of every image key and every route / section that renders it. Enforce the rule from the image plan: each *source photograph* (ph01 … ph14) appears in **at most one editorial placement** across the whole site — hero, feature, story or band — plus its own project's cover, gallery and swatches. Different crops of one photograph count as the same photograph. Expected editorial placements: ph08 Home hero · ph06 Home statement · ph07 Studio band · ph05 Studio philosophy · ph03 Expertise interiors service · ph01, ph02, ph04, ph09, ph12a Interior Design page · ph11 Contact. Where the audit finds a second editorial use, replace it with type, a swatch or nothing.
2. **Crop and focus** at 360, 390, 768, 1024, 1440 and 1920 px for every placement: the subject is inside the frame, verticals are acceptable, and none of the blemishes listed in prompt 02 (a person, the photographer's reflection, floor clutter, loose cables, cartons, air-conditioners where avoidable) is visible. Fix with `object-position` first, a new crop second.
3. **Sharpness.** For every rendered image compare `currentSrc`'s pixel width with its rendered CSS width × device pixel ratio: it must be between 1.0× and 1.6× at DPR 1 and 2 — never upscaled, never wastefully large — and never above the photograph's "sharp to" limit (ph10 never wider than 480 CSS px at 2×). Correct `sizes` where the browser picks the wrong candidate.
4. **One grade.** Lay all derivatives out as a contact sheet in the Lab. They were shot on phones under mixed light: if they do not sit together, adjust the *shared* pipeline values (saturation between 0.90 and 0.96; a mild, uniform contrast curve) and regenerate everything — never grade one photograph differently from the rest, never apply filters, duotones or heavy vignettes. Hero overlays use the forest colour only.
5. **Loading.** Every image has intrinsic dimensions, a placeholder that matches its final tone, a 400 ms fade-in, and causes no layout shift; only first-screen images are eager.
6. **Alt text.** Read every alt text aloud in page order: specific, observational, under 140 characters, no "image of", no brand, place, client or material species; decorative images have empty alt.
7. **Illustrations and icons.** Exactly four unDraw illustrations, each used once (404, enquiry sent, empty result, error). One Icons8 family for all 14 static icons and the 8 animated ones; one stroke weight; only `currentColor` plus the accent variable; sizes on a 24 / 32 / 48 / 96 px ladder. Animated icons play once at ≥ 50 % visibility and are never the only carrier of meaning. If any icon is an in-house placeholder (see "pending third-party assets" in the build log), try the source again now and replace it; otherwise keep the placeholder and keep it listed.
8. **Licences.** `credits.js` and `CREDITS.md` list every third-party asset actually shipped, and nothing that is not shipped. The "Icons by Icons8" link is visible in the footer on every page unless owner decision D-13 records a paid licence. At most two open-licence photographs exist, both on the Expertise page, neither presentable as an IN-ARCH project.
9. **Open Graph image and favicon.** The 1200 × 630 image is under 300 KB, the lockup is legible at thumbnail size, and nothing is cropped at 1.91:1 or at a centre square. The 16 px favicon reads "IA" on both a light and a dark tab strip.

### Part 2 — Motion

1. **Inventory.** List every animation on the site (commit the table to the build log): element, trigger, properties, duration, easing. Each row must animate only `transform` and `opacity` (the Lottie icons are the documented exception), and must use a duration and easing from `src/motion/tokens.js` or the CSS tokens — replace every stray literal.
2. **One choreography.** Heroes: image settles (1.6 s) → headline lines (1.0 s, 0.08 s stagger) → supporting text and actions (0.7 s, 0.08 s stagger); nothing else moves while the headline is arriving. Sections below: reveal in reading order; a group's total stagger never exceeds 0.6 s; nothing is still animating 1.2 s after it entered the viewport. Images use the shutter; rules draw; text rises — no fourth idea.
3. **Page transitions.** Cover 400 ms, reveal 550 ms, hero intro starts as the curtain leaves — never before, never twice; back / forward has no cover; ten rapid navigations never strand the curtain; the curtain never appears for hash links or the portfolio filter.
4. **The CTA family, everywhere.** Audit every button, text link, icon button, tile, chip and accordion header: each has the specified hover, focus-visible and press states from the "wipe & swap" family, at the specified durations, and none has a one-off effect.
5. **Scroll-linked effects.** Parallax ≤ 4 % below 1024 px and ≤ 7 % above (the Interior Design page's small arch and swatches up to 10 %); the three sticky sequences (Studio philosophy, Expertise process, Interior Design room stories) hold and release without a jump; the scroll marquee, if used, moves only with the scroll. Nothing pins, snaps or delays the scroll.
6. **Performance of motion.** Record a performance trace at 390 px with 4× CPU throttling while scrolling each page top to bottom: no long task over 50 ms caused by animation, no forced-reflow warnings from our code, frame rate ≥ 55 fps. `will-change` is present only while an element animates. After navigating between pages five times, `ScrollTrigger.getAll().length` equals the current page's own count (no leaks). `scheduleRefresh()` runs after fonts load and after late images size themselves.
7. **Reduced motion.** With `prefers-reduced-motion: reduce`: no transform animation anywhere, no parallax, no curtain, no cross-fading sticky panels (they switch), no Lottie playback, overlays and modals appear instantly — and every piece of content is visible and every control works.

## Functional guardrails

- **Contract frozen.** `public/api/leads.php` and `public/api/config.example.php` are not edited. The endpoint and its actions stay as they are: `POST /api/leads.php?action=create` with body `{ "lead": { … } }`, plus `list`, `update`, `delete` and `health`. Every lead still carries exactly these keys with the same meaning: `lead_id, name, mobile, email, organization, service_interest, state, message, source, status, submitted_at, updated_at, page_url, user_agent, utm_source, utm_medium, utm_campaign, utm_term, utm_content, notes, activity`. The status keys `new, contacted, consultation_booked, procedure_scheduled, completed, not_interested` are never renamed. `.env` and `.env.example` are not edited (use the git-ignored `.env.development.local` for local overrides). Anything new a lead needs is added as an extra key; nothing existing is renamed, removed or reshaped.
- **Admin-frozen files** — no diff against the "admin freeze commit" that prompt 15 recorded in `prompts/BUILD_LOG.md` (and none against baseline `cc2fc52d90987adcf62a5c286c4eb87d155fc3f3` except what prompt 15 logged): `src/admin/**`, `src/theme/muiTheme.js`, `src/styles/variables.css`, `src/styles/global.css`, `src/styles/animations.css`, `src/styles/responsive.css`, `src/styles/dulcey.css`, `src/App.css`, `src/hooks/useMediaQuery.js`, `src/surfaces/AdminSurface.jsx`, `public/api/**`, `.env`, `.env.example`.
- **Admin-bound values** are final since prompt 15 and must not move again: `siteConfig.brandName`, `siteConfig.legalName`, `siteConfig.logo`, `LOGO_SIZE`, `expertiseTitles`, `seoConfig.pages.admin`, `getConfig()`.
- **Polish only.** No section, sentence, route, data field or form behaviour changes. If the audit shows a section needs redesigning, log it for the owner instead of doing it here.
- **Cache-safe images.** Any regenerated crop ships under a new file name; the manifest is regenerated by the script, never edited by hand; no orphaned image files remain in `public/images/inarch/`.
- **No new dependency**, no smooth-scroll library, no cursor follower, no auto-playing video or audio, no looping animation longer than five seconds.
- **Source material untouched:** `logos/`, `in-arch images/`, `details of in-arch.pdf`.
- **Truthful content.** Every fact comes from `details of in-arch.pdf` through the modules in `src/data/`. No testimonials, awards, client names, statistics, ratings, years, areas, locations or quotes are invented; where the client supplied nothing the surface stays silent and the gap is listed in `prompts/00_INDEX.md`. Captions and alt text remain observational; no image from the PDF, the dummy or a stock library is presented as IN-ARCH work.
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

- **Evidence in the build log:** the image-reuse table (with the single allowed editorial placement per photograph), the motion inventory table, and the before / after file sizes of anything regenerated.
- **Contact sheets.** One screenshot of the Lab's image sheet after the final grade, on light and on dark; one of all icons at 24 / 32 / 48 px on all four tones.
- **Per page, at 390 and 1440 px, normal and reduced motion:** a full scroll recording or trace showing the choreography rules hold; a check that no image is upscaled or mis-sized (script it: iterate `document.images`, compare `naturalWidth` with `getBoundingClientRect().width × devicePixelRatio`).
- **Transitions:** twenty navigations across all routes in random order, including back / forward and rapid clicks — the curtain always completes and the scroll position is always the top.
- **Tests and tools still pass:** `npm test -- --watchAll=false`, `node scripts/qa/public-check.js`, `node scripts/qa/lead-flow.js`.
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

**Close out.** Append an entry to `prompts/BUILD_LOG.md` (date, "Prompt 16", files created / changed / deleted, decisions taken, every deviation from this prompt with its reason, anything left open). Add a short entry under `## [3.0.0] — IN-ARCH redesign (in progress)` at the top of `CHANGELOG.md`. Commit with a message that starts `IN-ARCH 16:`.
