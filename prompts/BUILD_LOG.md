# IN-ARCH build log

This file is append-only. Every build session reads it first and writes to it last. Each entry records:

- what the session did: the files it created, changed and deleted;
- the decisions it took;
- every deviation from its prompt, with the reason;
- the measurements and evidence that later prompts rely on;
- what is still open.

Owner decisions live in [`00_INDEX.md` §12](00_INDEX.md#12-owner-decisions). This log never overrides them. Newest entries go at the bottom.

---

## 2026-11-27 — Prompt 01: Design system, tokens and motion foundation

**Branch:** `claude/zealous-cannon-cucmlh`. **Baseline:** `cc2fc52d90987adcf62a5c286c4eb87d155fc3f3`. It is reachable in this clone, and `../inarch-baseline` served it on port 8081 for parity.

**Starting state, confirmed:** `src/styles/inarch/`, `src/motion/`, `scripts/qa/` and this file did not exist. No owner decision in §12 touches prompt 01.

### Files

**Created**

| Area | Files |
|---|---|
| QA tooling | `scripts/dev-router.php` (verbatim from the prompt); `scripts/qa/public-check.js`; `scripts/qa/parity.js`; `scripts/qa/README.md`; `scripts/qa/_shared.js` |
| Fonts | `public/fonts/fraunces-v1-latin.woff2` (67,304 B); `public/fonts/fraunces-v1-latin-italic.woff2` (81,520 B); `public/fonts/manrope-v1-latin.woff2` (24,836 B); `public/fonts/fraunces-OFL.txt`; `public/fonts/manrope-OFL.txt` |
| Design system CSS | `src/styles/inarch/tokens.css`, `fonts.css`, `base.css`, `type.css`, `layout.css`, `index.css`, `__tests__/tokens.test.js` |
| Surfaces | `src/surfaces/surface.js`; `src/surfaces/SurfaceManager.jsx`; `src/surfaces/__tests__/surface.test.js` |
| Motion | `src/motion/tokens.js`, `useMotionScope.js`, `reducedMotion.js`, `index.js` |
| Design Lab | `src/lab/LabPage.jsx`, `LabPage.module.css`, `registry.js`, `labUtils.js`, `sections/ColourSection.jsx`, `TypeSection.jsx`, `FontsSection.jsx`, `SpaceSection.jsx`, `GridSection.jsx`, `MotionSection.jsx` |
| Tests and log | `src/setupTests.js`; `prompts/BUILD_LOG.md` |

**Changed**

- `package.json` / `package-lock.json`: six devDependencies and the scripts `qa:public` and `qa:parity`.
- `.gitignore`: `/qa-artifacts/`.
- `src/index.js`: one import, after `import App`.
- `src/App.jsx`: the `SurfaceManager` import and render, and the development-only `LabPage` route.
- `public/index.html`: one statement in the first inline script, and `<style id="ia-fonts">` before the critical `<style>`.
- `CHANGELOG.md`: the `[3.0.0]` heading and this prompt's entry.

**Deleted:** nothing.

**Admin-frozen check:** `git diff --stat cc2fc52… -- src/admin src/theme src/styles/variables.css src/styles/global.css src/styles/animations.css src/styles/responsive.css src/styles/dulcey.css src/App.css src/hooks/useMediaQuery.js public/api .env .env.example` prints nothing.

### Decisions

1. **The scope root and the tones use `:where(.ia)`, zero specificity.** The prompt writes the root rule as `.ia { … }`, but its own policy says to use `:where(.ia)` unless a legacy or MUI rule of equal weight comes later, and none targets the `.ia` element. Later prompts also put `class="ia"` on components that set their own background from a CSS Module class, such as the form (05) and the dock (04), which is translucent and carries `data-tone`.
   - `src/index.js` emits this CSS after every eager component's CSS. A `.ia` rule at (0,1,0) would therefore beat those module classes and repaint them.
   - With `:where()`, any module class wins. The element resets still beat the legacy element rules: same weight (0,0,1), and they come later in the cascade.
   - Plain `.ia` is used only where the prompt asks for it: `::selection`, `:focus-visible`, `:focus:not(:focus-visible)` and `[id]`.
   - `.ia` and every `[data-tone]` inside it set all nine tone variables, so tones nest. An element that names a tone also paints it.
2. **The fallback faces are split by weight and style.** Fraunces changes width with optical size and weight, so one `size-adjust` cannot match both text (400 at about 16 px) and display (300 at 40 px and above). `"Fraunces Fallback"` therefore has four faces: weights 100–349 and 350–900, roman and italic. The browser's own face matching picks the right one. `"Manrope Fallback"` has a 100–549 face (Arial) and a 550–900 face (Arial Bold) for labels.
3. **Measured fallback overrides.** Ascent and descent are the web font's hhea values divided by `size-adjust` (Fraunces 1956 / 510, Manrope 2132 / 600, UPM 2000, line gap 0).

   | Face | size-adjust | ascent | descent | line gap |
   |---|---|---|---|---|
   | Fraunces Fallback, 100–349 normal (Georgia) | 97.44% | 100.37% | 26.17% | 0% |
   | Fraunces Fallback, 350–900 normal (Georgia) | 104.91% | 93.22% | 24.31% | 0% |
   | Fraunces Fallback, 100–349 italic (Georgia Italic) | 89.2% | 109.64% | 28.59% | 0% |
   | Fraunces Fallback, 350–900 italic (Georgia Italic) | 96.69% | 101.15% | 26.37% | 0% |
   | Manrope Fallback, 100–549 (Arial) | 102.34% | 104.16% | 29.31% | 0% |
   | Manrope Fallback, 550–900 (Arial Bold) | 98.37% | 108.37% | 30.5% | 0% |

   **Method.** This container has no Georgia or Arial, and installing the Microsoft core fonts was declined. I measured in Chromium against metric-compatible stand-ins instead: Gelasio, which was drawn to Georgia's metrics, and Liberation Sans, which has Arial's metrics.
   - `size-adjust` is the ratio of advance widths of a 60-word paragraph at 100 px. Fraunces was measured at `opsz` 16 / `wght` 400 and at `opsz` 48 / `wght` 300.
   - **Validation:** 25 paragraph × width cases at 16 px and 48 px, including italic. Every case had identical line breaks and block heights equal within 0.1 px. The requirement was within 1 px.
   - The Lab's Fonts section repeats the comparison live on any device that has Georgia and Arial. **Re-check it once on a Mac or Windows machine.**
4. **The rupee sign ₹ (U+20B9) is in neither web font.** Fontsource's Latin `unicode-range` excludes it, and neither Latin file contains the glyph.
   - Here, Chromium draws it from the system face fontconfig picks (Inter). `CSS.getPlatformFontsForNode` confirms this.
   - On Windows and macOS it falls through to "Manrope Fallback" / Arial, which has ₹, scaled by the fallback's `size-adjust`. The prompt accepts a system fallback for this one glyph.
5. **The licence files are named `fraunces-OFL.txt` and `manrope-OFL.txt`.** Two files called `OFL.txt` cannot share one folder.
6. **Display weight switches at the exact 40 px crossover.**
   - `display-lg` is 300 from a 600 px viewport (1.3rem + 3.2vw = 40 px) and 400 below.
   - `display-md` is 300 from 1177 px.
   - `2xl` and `xl` are always 300; `sm` is always 400.
7. **Line heights the contract leaves open:** body-lg 1.65, small 1.6, caption 1.5, label 1.4.
8. **`.ia-grid` exposes `--ia-grid-columns` and `--ia-grid-gap`** for prompt 03's `Col` and for the Lab overlay.
9. **`.ia-bleed` uses `width: 100vw; margin-inline: calc(50% - 50vw)`.** With a classic (non-overlay) scrollbar, 100vw is wider than the page. This relies on the document clipping horizontal overflow: legacy `body` does today, and prompt 04 adds `overflow-x: clip`. See Open item 2.
10. **Motion: how hidden states and cleanup work**
    - GSAP sets every hidden starting state. `rise` uses opacity, not `autoAlpha`, so content that has not been revealed yet stays focusable.
    - A shutter cover must rest **off** the image in CSS. The hook moves it over the image first, so no-JS and reduced-motion visitors still see the picture.
    - `ScrollTrigger.batch` callbacks are wrapped with the matchMedia context's `add()`, so tweens they create later are still reverted with the scope.
    - Scopes may nest: the hook marks its root with `data-m-scope`, and each element is wired only by its nearest scope.
11. **Motion: setup details**
    - `gsap.matchMedia()` only runs its function while at least one condition is true, so the setup includes an always-true `all` condition.
    - `useMotionScope(options)` accepts `dependencies`, `start` and `disabled`.
    - Extra exports: `DUR_NAMED` (rule 0.9 s, image settle 1.4 s), `PARALLAX` (caps 4 % and 7 %, scrub 0.6), and `useReducedMotion()`.
    - SplitText is registered once, at the top of `useMotionScope.js`. `gsapSetup.js` is untouched.
12. **`data-m="lines"` belongs on headings.** SplitText's `aria: 'auto'` puts an `aria-label` on the split element, and ARIA does not allow one on a `<p>`; axe flagged it as a serious violation in the Lab. The Lab demo now uses a heading, and the hook documents the rule. Prompt 03's `Heading` component is the intended user.
13. **QA harness determinism** (all found by calibrating baseline against baseline, as the prompt asks):
    - **Clock.** The browser clock is installed at the fixed time as specified, then *paused*, and the script advances fake time explicitly. GSAP reads `Date.now`, so a frozen clock that never advances would stop every reveal.
    - **Network waits.** `page.waitForLoadState('networkidle')` resolves at once after the first idle, so it missed the admin's lead fetch: one calibration run captured an empty leads table. Both scripts now track in-flight requests themselves (`trackNetwork` in `_shared.js`).
    - **Rasterization.** Chromium is launched with CPU-raster and compositor switches. These removed 1–7-level raster noise from the admin's blurred MUI backdrops.
    - **Default mask.** Even with CPU raster, Skia repaints two kinds of composited layer on legacy `/about` differently from run to run, baseline against baseline. The first is the translucent radial-gradient `.glow` on a parallax layer, which dithers by up to ±7 levels. The public suite therefore masks `.glow` by default (`--no-default-mask` turns this off).
      - The mask is the union of the element's boxes in both captures, padded by 4 px. The padding is needed because Playwright's own mask left the dithered edge row uncovered.
      - Masked elements stay in the style digest.
    - **Tolerance.** The second noisy layer is the tile seams across a fractionally translated photograph, which vary by ±1–2 levels. The pixel comparison therefore ignores channel changes of up to 2/255 (`--tolerance`, default 2; `0` makes it exact). Those pixels are still counted in the report.
      - The computed-style digest stays exact, so a real colour change of any size is still caught.
      - Larger raster tiles were tried as an alternative and did not help.
    - **Readiness wait.** The admin's lead loading has a rare race: two pages out of hundreds of captures settled with no data. On the dashboard, leads list and lead detail, the harness therefore advances fake time, up to 20 s, until a seeded lead's name is on screen. This was never needed in the final runs.
14. **Parity scope and safety**
    - The digest covers every element under `#root` **and** body-level portals, because MUI renders menus and dialogs outside `#root`.
    - Masked elements keep their digest entries; a mask removes only their pixels from the comparison.
    - Parity also fails if the candidate requests any `/fonts/*.woff2`, the inertness proof.
    - It resets the lead store only on loopback hosts.
    - Extra options: `--save`, `--routes` and `--widths`.
15. **`public-check` defaults**
    - The default route list includes `/__lab` (the 404 in a production build) and `/__qa-not-found` for the `*` route.
    - Widths of 768 px and below run with `hasTouch` and `isMobile`.
    - Same-origin `ERR_ABORTED` failures (aborted navigations) are not counted.

### Deviations from the prompt

- **Extra files.**
  - `scripts/qa/_shared.js` holds the argument parsing, the Playwright guard, route discovery from `App.jsx`, `.env` reading and network tracking that both scripts share.
  - `src/lab/registry.js`, `labUtils.js` and `sections/*.jsx`: the "simple section registry" asked for. Prompts 02 and 03 add a section with one import and one entry.
  - `src/surfaces/__tests__/surface.test.js`.
  - The leakage assertions live in `tokens.test.js`: every selector in `src/styles/inarch/` must start with `:root`, `.ia`, `:where(.ia)` or an `ia-` class, and `:root` may hold only custom properties.
- **The root and tone selectors use `:where(.ia)`** instead of `.ia`. See Decision 1.
- **"No `__lab` string in `build/static/js`"** holds for every `.js` file and chunk: there are 22 chunks, the same as the baseline, and `useMotionScope` and SplitText are not in the bundle either. `main.*.js.map` still contains the text `/__lab`, because a source map embeds `App.jsx`'s original source. No code or chunk ships.
- **`@testing-library/jest-dom` resolved to 8.0.0**, the current release. It ships a CommonJS build and runs under CRA's Jest 27; all 90 tests pass. npm notes peer ranges for `@testing-library/dom` ≥10 and an optional `vitest`; neither blocks anything.
- **The parity pixel comparison has a ±2/255 tolerance, and the public suite masks the legacy `.glow` by default.** Both are documented, switchable and justified by calibration. See Decision 13.

### Evidence

- **`npm test -- --watchAll=false`:** 2 suites, 90 tests, all passing.
- **`npm run build`:** "Compiled successfully.", no warnings. Main JS is 460,122 B against the baseline's 459,682 B. Main CSS gains the scoped IN-ARCH layer.
- **Calibration, baseline against baseline, final settings:** admin 34/34 identical; public 21/21 identical, twice. One run absorbed 172 pixels at Δ ≤ 2 on `/about` at 390; the last run had none.
- **Parity, baseline against this branch:**
  - Admin: **34/34 identical**, with 0 pixels differing at all and 0 digest differences across all 34 captures at 390, 768 and 1440 (login, dashboard, leads, the "Interested In" menu, lead detail, the delete dialog, the Guidelines gate and its four tabs, and the mobile menu). No `/fonts/` request.
  - Public: **21/21 identical**, with 0 pixels differing at all and 0 digest differences. That covers `/`, `/about`, `/expertise`, `/industries`, `/contact`, `/__lab` (the 404 in production) and a nonsense URL, at 390, 768 and 1440.
- **The harness catches real leaks.** Two copies of this build, each with one injected rule, were compared with the baseline:
  - `body { color: #0c0b0c }` is a 1/255 shift that nobody could see. The pixels stayed within the tolerance, but the digest flagged 98 differences on `/`, 38 on admin login and 199 on the dashboard. Both runs failed, and 0 of 12 admin captures passed.
  - `h1 { letter-spacing: .01em }` changed 8,554 pixels beyond the tolerance, and the digest recorded the box shifts. The run failed.
- **`public-check`** (this build, every route × 7 widths, plus reduced motion; 63 runs): 54 clean.
  - All 9 failures are one axe *serious* `color-contrast` violation on legacy `/contact`: `.cardKey` labels, 11 px in `--grey-4`.
  - The baseline fails identically, so it is pre-existing. Parity proves `/contact` is unchanged.
  - Fixing it here would break the rule that existing pages stay pixel-identical; prompt 13 replaces the page. See Open item 7.
  - Everything else is clean: no console errors, no failed same-origin requests, no horizontal overflow, and no other serious or critical axe violation on any route.
- **Clean install:** `npm ci` from the updated lockfile, then `npm test` (90/90) and `npm run build` ("Compiled successfully.", 22 chunks, no `__lab` in any `.js`).
- **Lab** (dev server; 360, 390, 768, 1024, 1280, 1440 and 1920 px, plus an 844 × 390 landscape phone):
  - Every type step equals its formula and the contract table within 0.05 px. For example, at 390 px: 47.28 / 41.88 / 33.28 / 26.63 / 22.32 / 17.16 / 16.07 px.
  - The grid has 4 columns and a 16 px gap, 8 and 24 px from 768, 12 and 32 px from 1024, and a 40 px gap from 1440.
  - All 36 text and control contrast claims pass on all four tones, for example terracotta-700 at 5.77:1 on ivory and 5.17:1 on sand, and ink-3 at 4.78:1 on sand.
  - No horizontal overflow; one `h1`.
- **Fonts:**
  - The Lab makes exactly three WOFF2 requests from `/fonts/`: 65.7, 79.6 and 24.3 KiB.
  - No `/fonts/` request on `/`, `/about`, `/expertise`, `/industries`, `/contact`, a 404 or any admin capture.
  - `document.fonts.check('16px Archivo')` is true on every legacy page.
- **`public-check` on `/__lab`:** 9/9 clean. That covers all seven widths plus reduced motion at 390 and 1440: no console errors, no failed requests, no overflow, zero serious or critical axe violations, and every tap target at least 44 × 44 at 768 px and below.
- **Motion:**
  - Before a demo enters the viewport: `rise` sits at opacity 0 and 24 px (40 px from 1024), the shutter cover sits over a 1.12× image, the rule is at `scaleX(0)`, and the lines are split into masked lines at 110 %.
  - After entering: everything reaches its final state, and replay works.
  - Under reduced motion: no inline styles, no split and no ScrollTriggers, and the shutter cover rests off the image.
  - Leaving the Lab for Home leaves exactly Home's own 19 ScrollTriggers, so none leak.
- **Keyboard:** all 14 focus stops in the Lab show the 2 px `#8F4A2B` ring at 3 px offset, and Enter and Space both toggle the grid overlay.
- **Accessibility tree:** one `h1`, no skipped heading levels, `main`, `nav` and `footer` present, every control named, and status text in a live region. No screen reader is available in this session (see Open item 4).
- **Regression pass** (this branch's production build on PHP, driven with Playwright; 52/52 checks):
  - The six routes, walked at 390 and 1440, have the right titles and robots, and `/expertise#e03` opens and scrolls.
  - The lead modal from `header-cta`, `home-hero` and `expertise-e01`: focus is trapped, it closes on Escape, the button, the backdrop and Back (the scroll lock is released), and focus returns to the opener.
  - An enquiry through the modal: the payload has exactly the 21 frozen keys, and the success state shows.
  - The same mobile number through `/contact`: the API returns `duplicate: true` and the "Already received" dialog shows. A fresh number through `/contact` succeeds.
  - Admin: redirect to login, dashboard counts, Iconify icons (29), search, all four filters, sorting, pagination, bulk select, CSV export, CSV import (a round trip, all duplicates skipped), inline status change, the delete dialog (cancelled), and the lead detail with every field. Adding a note and changing the status both work. The Guidelines gate opens its four tabs, and logout works.
  - The test leads were deleted afterwards.

### Open items

1. Re-check the fallback-font comparison in the Lab on a machine with real Georgia and Arial (Decision 3).
2. `.ia-bleed` relies on the public document clipping horizontal overflow (Decision 9). Prompt 04 adds `overflow-x: clip`; prompt 17 should confirm it with a classic scrollbar on Windows.
3. Prompt 04: the legacy fixed header still sits over the Lab's first line; the new shell replaces it.
4. No VoiceOver or NVDA was available in this session. Run a real screen-reader pass when the first public page ships (prompt 06 onwards).
5. `npm audit` reports advisories in CRA 5's dependency tree. They were there before this prompt, and none was addressed.
6. When you run parity, follow `scripts/qa/README.md`: calibrate first (baseline against baseline), then compare. The baseline worktree was removed after this session; recreate it with the README's commands.
7. **Prompt 13 (Contact):** the legacy `/contact` card labels fail WCAG contrast (axe serious `color-contrast`). This is pre-existing and left alone here because existing pages must stay identical. Until the page is rebuilt, `public-check` on the legacy `/contact` will report it.
8. Prompt 14 retires the legacy `.glow` elements. Once they are gone, the public suite's default `.glow` mask matches nothing; keep or drop it then.

---

## 2026-11-27 — Prompt 02: Brand assets, content model and image pipeline

**Branch:** `claude/epic-galileo-8w83en`, from `17b1a78` (prompt 01 merged). **Baseline:** `cc2fc52d90987adcf62a5c286c4eb87d155fc3f3`, served from `../inarch-baseline` on port 8081 for parity.

**Starting state, confirmed:**
- Prompt 01's files all exist: `tokens.css`, `useMotionScope.js`, `LabPage.jsx`, `dev-router.php`, `public-check.js`, `parity.js` and this log.
- `src/data/` held only the four legacy modules.
- Owner decisions read from `00_INDEX.md` §12. None conflicts with this prompt's defaults, so no data needed reconciling first:
  - D-03, D-04 and D-05 are still open, so email, PIN code and site URL stay empty.
  - D-06 and D-07: the seven services and the seven projects, unverified.
  - D-10: the tagline.
  - D-12: no social links.
  - D-13: no Icons8 licence.
  - D-14: "From 10:00 AM".
  - D-16: name-based map search.
  - D-21: the dummy's project names are not used.
  - D-23: Zenith has no dates.

### Files

**Created**

| Area | Files |
|---|---|
| Brand | `scripts/build-brand-assets.js`; `public/images/brand/` (8 PNGs) |
| Photographs | `scripts/image-specs.js`, `scripts/build-images.js`; `public/images/inarch/<key>-<width>.{avif,webp,jpg}` (50 keys, 501 files, 27 MB); `src/data/imageManifest.json`; `src/lab/imageReport.json` (per-key hash, crop and byte sizes; Lab only) |
| Icons | `scripts/build-icons.js`; `public/images/inarch/icons/*.svg` (15); `public/images/inarch/lottie/*.json` (8) |
| Illustrations | `scripts/recolour-illustrations.js`; `public/images/inarch/illustrations/{not-found,enquiry-sent,nothing-here,something-broke}.svg` |
| Credits | `public/images/inarch/CREDITS.md`; `src/data/credits.js` |
| Content | `src/data/services.js`, `process.js`, `faqs.js`, `studioContent.js`, `interiors.js`, `projects.js`, `images.js` |
| Tests | `src/data/__tests__/content.test.js` (25 tests) |
| Lab | `src/lab/sections/AssetsSection.jsx`, `AssetsContent.jsx`, `AssetsSection.module.css` |

**Changed**

- `src/data/siteConfig.js`: additions only (115 lines, 0 removed). `studio`, `siteConfig.studio = studio`, and the helpers `studioTelHref`, `studioWhatsAppHref`, `studioMailHref`, `studioMapsHref`, `studioAddressLines`, `studioHoursLabel` and `studioUrl`.
- `src/lab/registry.js`: one import and one entry.
- `package.json` / `package-lock.json`: the scripts `build:brand`, `build:images` and `build:icons`, and the dependency `lottie-web` ^5.13.0.
- `CHANGELOG.md`: the prompt 02 entry.
- `prompts/00_INDEX.md` §13: two photographs that need a retake (see Open items).

**Deleted:** nothing.

### Decisions

1. **Brand files: only the alpha channel is resampled; the colour is the supplied ink.**
   - Measured with sharp, the geometry matches the brief: lockup x 226–4572, y 338–1219; wordmark band y 338–870, x 226–3910; descriptor band y 1090–1219 at alpha 209; monogram x 123–388, y 161–350. Column 4573 holds two pixels at alpha ≤ 6, so the 4347-px extract is correct.
   - Lanczos resampling through premultiplied alpha shifted opaque edge pixels by up to 53 levels (overshoot). For the lockups and wordmarks the script therefore resamples alpha alone and fills RGB with the logo's own ink. Every opaque pixel is now exactly `#231B15` or `#F4EFE7`.
   - Side effect: the source's descriptor line, stored one level off (`#221B15` / `#F4EFE8`), comes out as the exact ink. Nothing is redrawn or recoloured.
   - The monogram is a byte-for-byte extract. Its antialiased fringe (alpha < 255) keeps the source's own values.
2. **Brand verification: "corner alpha 0" cannot hold for a tight crop.**
   - The "I" and the descriptor's first "A" sit in the image corners; the corner alpha is 42–112 on the lockups and 81–95 on the monogram.
   - The script instead checks that every non-ink pixel is fully transparent, that at least 40 % of pixels have alpha 0 (actual 73–85 %), that all four edges carry artwork, and the size.
3. **The source photographs, checked:**
   - The repeats are not byte-identical (different MD5), but the mean grey difference is 0.0–1.6 / 255 against `.jpg2`, `.jpg6` and `.jpg3`, so they are visual repeats. Nothing derives from them (the content test checks this).
   - "No EXIF" is nearly true: each file carries an empty 22-byte EXIF header. The pipeline strips all metadata anyway.
   - `.jpg9` and `.jpg10` are 3840 × 2161.
4. **Exclusions the brief did not list, found at full resolution:**
   - **ph02:** the photographer's silhouette is reflected in the black wall unit at x 75–78.5 %, y 38–49 %. The loose hose reaches x 17 %, not 12 %. Every ph02 crop stays inside x 17.5–74.5 %.
   - **ph05:** the hanging cable is at x 44–45.6 % (from a socket at y 51 %), not x 34 %. There is also a remote on the console at x 37–40 %, y 69 %.
   - **ph06:** a coiled loose cable hangs under a switch plate at x 21.5–23 %, y 52–56 %.
   - **ph09:** a storage box sits on top of the unit (to y 15.9 %), as well as the air-conditioner (to y 14.2 %).
   - **ph10:** packaging sits on the open shelf (x ≤ 10 %, y 78–82 %), and the tap begins at x 66.5 %, not 70 %.
   - **ph04:** the carton carries a readable beverage brand.
5. **Crop changes, with their final numbers.** All are recorded in `scripts/image-specs.js` (`deviation` / `review` per key).
   - `studio-detail` / `g-ph05`: box 34, 0, 41.5, 50.5 (ceiling, fan and the upper media wall; no cable, no doorway).
   - `interiors-inset`: 4:5 inside x 0–66.
   - `interiors-kitchen`, `pr-black-cover-*`: inside x 17.5–74.5. `g-ph02` is a square inside the same window.
   - `interiors-detail-b`, `g-ph09`, `pr-pooja-cover-*`: from y ≥ 16.5. The tall cover is the inner unit (x 31.2–68.8), and the wide cover keeps both doors.
   - `pr-ivory-cover-tall`: focal 76 / 50, so the cover avoids the carton.
   - `pr-panelled-cover-wide` and `g-ph06`: from x ≥ 25.5 (`g-ph06` is 4:3).
   - `g-ph10`: box 10, 20, 56, 66.4.
   - `g-ph12b`: 4:5 below y 26.
   - Swatches:
     - `sw-fluted` comes from ph14 (the green fluted arch). The brief's ph08 box is mostly the veined panel, and no fluted strip in ph08 is wider than about 230 px.
     - `sw-stone`, `sw-lattice` and `sw-tufting` ship at 320 and 480 px instead of 640: the clean texture is only about 500 px square, and the script never upscales.
6. **Accepted residuals, listed so the owner can overrule them:**
   - The ph04 carton stays in the frontal 16:9 and 3:2 cuts (`interiors-detail-c`, `pr-ivory-cover-wide`, `g-ph04`), as the brief allows ("if the crop allows"). It is small; its label is unreadable below 1440 px.
   - The ph14 frames show, through the shelving, the next room's mirror with its power lead: about 25 px at 1440. Removing it would cut the arched partition in half.
   - No photograph was retouched.
7. **Pipeline mechanics:**
   - The cap is per output width. No width exceeds the source's "sharp to" value or the crop's own pixel width, and the script fails if a spec asks for one.
   - Every key is skipped when its hash is unchanged. The hash covers the source bytes, the crop, the widths and the pipeline settings, and lives in `src/lab/imageReport.json`. The manifest therefore stays exactly the schema the brief gives.
   - It refuses to overwrite an existing file with different bytes unless `--recut` is passed (`/images/**` is immutable). It supports `rev` for re-cuts after deployment, and it deletes orphan files.
   - The encoders are deterministic, which I checked by encoding the same image three times.
8. **Icons were drawn in-house.** icons8.com answered with a Cloudflare 403, so its licence was unreadable, and `img.icons8.com` refuses SVG (403; SVG is a paid format). Following the brief's fallback:
   - `scripts/build-icons.js` draws the 14 icons from one geometry source, plus `status-done`, the static fallback of the "sent / done" tick.
   - They are drawn on the 24-px grid in a 48 viewBox, with round caps and joins and `vector-effect: non-scaling-stroke`, so the stroke is 1.5 px at every size (measured 1.5 px at 24, 32 and 48).
   - Strokes are `currentColor`. The accent is `var(--ia-accent-display, currentColor)`, so the file holds no hard-coded colour, and as an `<img>` it degrades to one colour.
   - Measured in Chromium, `var()` in an SVG presentation attribute resolves per tone: terracotta-500 on light, terracotta-300 on dark.
9. **The animated icons are generated from the same geometry.**
   - Each is a draw-on with trim paths: ink first, accent last, about 1.1 s at 60 fps, 1.7–4.1 KB.
   - The JSON colours are espresso and terracotta-500. The layers carry `cl` classes (`ia-l-ink`, `ia-l-accent`), which lottie-web's SVG renderer writes onto the layer `<g>`, so CSS re-tints them per tone. This was measured on forest: ivory and terracotta-300.
   - They play once at half visibility. Under reduced motion the static SVG is shown and the Lottie never loads.
   - `lottie-web` 5.13.0 (MIT) is a dependency. Only the Lab imports it so far, through a dynamic import of `lottie_light`.
10. **unDraw licence, as read.** It allows free commercial use and modification without attribution. Its sentence about "automated and non-automated … download" extends the ban on compiling a competing service or redistributing packs, so it does not forbid fetching four illustrations for one site; it covers non-automated downloads too, so it cannot mean "no downloading". The four were fetched one by one.
11. **unDraw recolouring went beyond the brief's list:**
    - unDraw white becomes paper `#FAF7F2`, a brand colour.
    - Translucent black overlays (20 % and 10 %, no fill) become opaque stone, so only five brand colours remain.
    - The illustrations with no people were chosen, which avoids recolouring skin tones.
12. **The open-licence photographs (`expertise-atmosphere`, `expertise-drawing`) were skipped.** unsplash.com serves a bot challenge and pexels.com a Cloudflare 403, so neither the licence nor a search could be read. Both images were optional (index §10). They are listed under pending assets.
13. **`footerCredits` is empty.** No Icons8 asset ships, so the free licence's link is not owed. `ICONS8_CREDIT` is ready in `credits.js` if Icons8 icons are adopted without a paid licence (D-13).
14. **Data shape:**
    - `studio.logos` has six roles (`lockupOnLight`, `lockupOnDark`, `wordmarkOnLight`, `wordmarkOnDark`, `markOnLight`, `markOnDark`), each `{ src, width, height }`. The lockups also carry `variants` (800 and 1600) for `srcset`.
    - `studioContent.js` also holds, verbatim, the §1 positioning, the §6 lead, and the §9–§10 home, contact and CTA lines. The index (§11) assigns them to the data layer, and later prompts need them.
    - Project `scope` and `focus` keep the PDF's words without the trailing full stop (they are labels).
    - Each project `summary` is two sentences of what is visible.
    - Category ids are kebab-case titles.
15. **The main bundle grows by 1,781 B** (460,122 → 461,903 B). That is `studio` on `siteConfig`, which the main bundle already carries and which the brief requires to be attached. None of the new data modules, the manifest or lottie-web is in any production chunk. There are still 22 chunks, the same as the baseline, and none contains `__lab`.

### Deviations from the prompt

- **Extra files:**
  - `scripts/build-icons.js` (`npm run build:icons`) and `scripts/recolour-illustrations.js` make the icon and illustration work repeatable.
  - `src/lab/imageReport.json` holds the hashes and byte sizes outside the runtime manifest.
  - `src/lab/sections/AssetsContent.jsx` is the content dump.
  - A 15th static icon, `status-done`, exists because the "sent / done" Lottie needs a static fallback.
- **Icons are in-house and the open-licence photographs are skipped,** both because the source hosts were blocked (Decisions 8 and 12). Everything is listed under pending third-party assets below.
- **Crops differ from the brief's table** wherever the brief's numbers would have kept an exclusion in frame (Decisions 4–6). Three swatches ship at 480 px instead of 640.
- **Brand verification** replaces "corner alpha 0" with a stricter background test (Decision 2). The descriptor's one-level ink rounding is normalised (Decision 1).
- **The regression pass was driven with Playwright** rather than by hand, as in prompt 01. The script was kept in the session scratchpad, not committed; prompt 05 owns `scripts/qa/lead-flow.js`. I read the request bodies from the intercepted requests.
  - Test names must be letters only: the legacy name validator rejects digits.
  - The admin's MUI selects have no accessible name. This is pre-existing and frozen, so they were driven by position.

### Pending third-party assets

| Wanted | Why missing | Substitute |
|---|---|---|
| Icons8: 14 static icons, 8 animated | icons8.com: Cloudflare 403; SVG refused (403) | In-house icons (Decision 8) |
| `os-light` → `expertise-atmosphere` | unsplash.com: bot challenge; pexels.com: Cloudflare 403 | None (Expertise page is typographic there) |
| `os-drawing` → `expertise-drawing` | as above | None |

### Evidence

- **`npm test -- --watchAll=false`:** 3 suites, 115 tests, all passing (prompt 01's 90 plus 25 content tests).
- **`npm run build`:** "Compiled successfully.", no warnings.
  - Main JS is 461,903 B, against 460,122 B after prompt 01 (+1,781 B: `studio`).
  - Main CSS is 68,825 B, with nothing new in it.
  - There are 22 chunks, the same as the baseline. No production `.js` contains the new data modules, the manifest, lottie-web or `__lab`.
- **Brand files:** all 8 pass the script's own check: stated pixel size; every opaque pixel exactly the ink; 73–85 % fully transparent; artwork on all four edges. A second run writes nothing. They were looked at on ivory and forest, and in the Lab on all four tones at 24 / 32 / 44 / 96 px.
- **Photographs:**
  - There are 50 keys and 501 files (27 MB).
  - Largest AVIF at ≤ 1080 px: 95.3 KB (`interiors-detail-a-1080`; limit 140 KB). Largest file: `g-ph02-1920.jpg` at 402.1 KB (limit 420 KB).
  - Placeholders are 143–303 B.
  - The manifest's width and height match the largest file for every key.
  - A fresh build takes 10 min 34 s. A second run takes 0.14 s with 0 encodes, 0 writes, and the manifest and report byte-identical. `--check` passes.
  - Nothing derives from `.jpg13`, `.jpg15` or `.jpg16`, or from the PDF.
  - Reviewed by eye three times: 900-px previews of every crop, full-resolution zooms of every suspect region, and contact sheets of the real smallest JPEG derivatives. The Lab was also checked at 390 and 1440.
- **Icons and animations:**
  - The stroke measures 1.5 px at 24, 32 and 48.
  - Ink and accent per tone: light, sand and paper `#231B15` / `#B5653F`; dark `#F4EFE7` / `#DDA27F`. That holds for the inline SVGs (`var()` in a presentation attribute) and for the Lottie layers.
  - Each Lottie plays once and stops. Under emulated reduced motion all 16 Lab instances show the static SVG, no Lottie loads, and Replay is disabled.
  - The illustrations contain only the five brand colours.
- **Lab, "Assets & content":**
  - Checked at 360, 390, 768, 1024, 1280, 1440 and 1920 px, plus an 844 × 390 landscape phone: no horizontal overflow, 102 images all decoded, one `h1`, no console errors, no failed requests.
  - `public-check --base http://localhost:3000 --routes /__lab`: 9/9 clean. That covers the seven widths plus reduced motion at 390 and 1440: zero serious or critical axe violations, every target ≥ 44 × 44.
  - Keyboard: 28 focus stops in the section, each with the 2 px ring at 3 px offset in the tone's focus colour. Enter and Space activate Replay.
- **`public-check` (production build on PHP, every route × 7 widths, plus reduced motion):** 54/63 clean. The 9 failures are the pre-existing legacy `/contact` contrast issue (prompt 01, Open item 7), identical to before.
- **Parity:**
  - Calibration, baseline against baseline: admin 34/34, public 21/21 identical.
  - **Baseline against this branch: admin 34/34, public 21/21 identical**, with 0 pixels differing and 0 digest differences in every capture.
- **Regression pass** (production build on PHP, Playwright; 50/50 checks):
  - The six routes at 390 and 1440 have the right titles and robots (`noindex` on the 404), with no console errors. `/expertise#e03` opens and scrolls.
  - The modal opens from `header-cta`, `home-hero` and `expertise-e01`. Focus is trapped and scroll is locked; it closes on Escape, the button, the backdrop and Back, and focus returns to the opener.
  - An enquiry through the modal sends exactly the 21 frozen keys (`source: home-hero`, `state` empty, `status: new`), and the success state shows the first name.
  - The same mobile number through `/contact` returns `duplicate: true`, and the "Already received!" dialog shows.
  - Admin:
    - `/admin` redirects to login; the dashboard shows the new lead; the Iconify icons render.
    - Leads page: search, all four filters (the "Interested In" list still shows the old titles plus "Something else"), sorting and pagination work.
    - Inline status change, bulk select, CSV export and import (0 imported, 4 duplicates skipped), and the delete dialog (cancelled) all work.
    - The lead detail shows the name, mobile, email, interest, message, source and page URL; adding a note and changing the status both work.
    - The Guidelines gate opens its 4 tabs, and logout works.
  - All test leads, including the parity seeds, were deleted afterwards: both stores are empty.
- **Admin-frozen check:** `git diff --stat cc2fc52… -- src/admin src/theme … .env .env.example` prints nothing.
  - `expertiseData.js`, `industriesData.js`, `navigation.js`, `public/index.html`, every page and component, `App.jsx`, `index.js`, `logos/`, `in-arch images/` and the PDF show no diff.
  - `siteConfig.js` is +115 / −0.

### Open items

1. **Retakes (index §13):**
   - `.jpg2`: the photographer is reflected in the wall units, which costs the kitchen its right quarter.
   - `.jpg4`: a branded carton sits in a glazed unit, still visible in the full-frame 16:9 and 3:2 cuts.
   - An owner-approved retouch would also do. Until then, prompts 10–12 should prefer `pr-ivory-cover-tall` over the full-frame ph04 cuts where they can.
2. **Prompt 03 / 16:**
   - The animated icons scale their stroke with their box: 1.5 px at 48, 2 px at 64. Render them at 48 px, or ask for a re-generation at the chosen size.
   - At 24 px the densest icons (`service-e04-commercial`, `service-e06-site`) are legible but busy. Prefer 32 px or more for those.
3. **Prompt 03 owns the `Picture` primitive.** The manifest gives `sources.{avif,webp,jpg}[{ w, src }]`, `width`, `height`, `ratio` and `placeholder`; `images.js` gives `image(key)` (with `alt`) and `srcSet(entry, format)`.
4. **Prompt 04:**
   - `og-source` (1200 × 630) is ready for the Open Graph composition.
   - `credits.footerCredits` is empty, so no Icons8 link is needed.
   - The brand files and their roles are in `studio.logos`.
5. **The illustrations are coloured for light surfaces** (espresso shapes). Place them on ivory, sand or paper.
6. **If the owner later supplies an Icons8 licence or wants Icons8,** download the family by hand, replace the in-house files under the same names, and add `ICONS8_CREDIT` to `footerCredits` unless the licence is paid.
7. No screen reader was available again; the accessibility-tree check is automated (axe, heading order, names).
8. **The admin's MUI filter and status selects have no accessible name.** This was found while driving them. It is pre-existing; the admin is frozen, so it goes on the final report's list (prompt 20), not into a fix.
9. The baseline worktree `../inarch-baseline` was removed after this session's parity runs. Recreate it with `scripts/qa/README.md`.

---

## 2026-11-27 — Prompt 03: Core UI primitives

**Branch:** `claude/amazing-keller-zolrno`, from `71ead18` (prompt 02 merged). **Baseline:** `cc2fc52d90987adcf62a5c286c4eb87d155fc3f3`, served from `../inarch-baseline` on port 8081 for parity (removed afterwards).

**Starting state, confirmed:**
- Prompt 01's and prompt 02's files exist: `base.css`, `useMotionScope.js`, `LabPage.jsx`, `public-check.js`, the brand files, `imageManifest.json`, `images.js`, `services.js`, the icons.
- `src/components/ui/` did not exist.
- Owner decisions read from `00_INDEX.md` §12. None conflicts with this prompt, so no data needed reconciling. The kit honours them where it touches them:
  - D-22: `Logo` warns below 44 px for the lockup.
  - D-03 and D-04: `FactList` stays silent for the empty email and PIN code.
  - D-09: the budget ranges appear only as Lab demo text; prompt 05 owns them.

### Files

**Created**

| Area | Files |
|---|---|
| Layout | `src/components/ui/Container/`, `Grid/` (`Grid` + `Col`), `Section/`, `Stack/` |
| Type | `Eyebrow/`, `Heading/`, `Text/`, `Lede/`, `VisuallyHidden/` |
| Actions | `Button/`, `TextLink/`, `IconButton/`, `Icon/`, `LinkProvider/` |
| Forms | `Field/`, `TextInput/`, `TextArea/`, `SelectInput/`, `ChoiceChips/`, `Notice/` |
| Media and brand | `Logo/`, `Picture/`, `Frame/`, `Figure/`, `LottieIcon/`, `LineIcon/`, `Illustration/` |
| Content | `ProjectTile/`, `Accordion/` (+ `AccordionItem`), `FactList/`, `Rule/`, `Chip/`, `ScrollMarquee/`, `Skeleton/` |
| Overlays | `Portal/`; `src/hooks/useFocusTrap.js`, `src/hooks/useScrollLock.js` |
| Kit internals | `src/components/ui/_shared/` (`cx.js`, `dev.js`, `refs.js`, `tone.js`, `action.js`, `ArrowSwap.jsx` + `.module.css`, `Control.module.css`); `index.js` (barrel); `package.json` (`sideEffects`) |
| Tests | `Button.test.jsx`, `Field.test.jsx`, `Accordion.test.jsx`, `Picture.test.jsx`, `Logo.test.jsx`, `FactList.test.jsx` beside their primitives; `src/hooks/__tests__/overlayHooks.test.jsx` |
| Lab | `src/lab/sections/PrimitivesSection.jsx` + `.module.css`; `src/lab/sections/primitives/` (`LabBits`, `FramesBlock`, `LayoutTypeBlock`, `ActionsBlock`, `FormsBlock`, `MediaBlock`, `ContentBlock`, `OverlayBlock`, `KeyboardStrip`); `src/lab/forceStates.js` |

**Changed**

- `src/styles/inarch/base.css`: four tone variables in each tone block (Decision 1).
- `src/lab/LabPage.jsx`: the `?frame=<section>` view, used by the phone and desktop iframes. `src/lab/registry.js`: one import and one entry.
- `package.json`: `jest.moduleNameMapper` (Deviation 3). No dependency was added: `lottie-web` was already there from prompt 02.
- `src/setupTests.js`: the `TextEncoder` and `matchMedia` stubs, and the act wrappers (Deviation 3).
- `scripts/qa/public-check.js` and `scripts/qa/README.md`: the target check skips `[data-force-active]` (Deviation 4).
- `CHANGELOG.md`: the prompt 03 entry.

**Deleted:** nothing.

### Decisions

1. **Four new tone variables.** The prompt asks for colours that change with the tone but that the nine contract variables do not carry. Each tone block in `base.css` now also sets:
   - `--ia-field-bg`: paper on light, sand and paper; forest-2 on dark.
   - `--ia-placeholder`: stone on light tones; forest-3 on dark. It is used by disabled fills, `Skeleton` and image placeholders.
   - `--ia-feedback-error` and `--ia-feedback-success`: the light or the dark value.

   Every primitive still reads only tone variables. The token test still passes, and the change is inert because these are custom properties under `:where(.ia)`.
2. **`Icon` is a glyph map, not an injected `<symbol>` sprite.** One module holds every glyph on the 24 px grid, and each `<Icon>` renders its own small inline `<svg>`. Nothing is written into the document, which keeps "no global side effects". The stroke uses `vector-effect: non-scaling-stroke`, so it is 1.5 px at every size. There are 18 glyphs: the 16 asked for, plus `chevron-down` (for `SelectInput`) and `info` (for `Notice`).
3. **The wipe & swap mechanics**
   - Hover styles apply only under `(hover: hover) and (pointer: fine)`; `:focus-visible` always applies. A tap therefore never leaves a wipe stuck.
   - Press uses the individual `scale` property, and the magnet uses `translate` driven by `--ia-mx` / `--ia-my`. The two combine without fighting over `transform`.
   - The magnet is plain pointer events plus a CSS transition (150 ms while moving, 400 ms spring back); there is no tween. It only runs for a mouse on a fine pointer, without reduced motion, and only on `lg`.
   - The 1 px border is a `::after` drawn above the fill, so a wipe never leaves a seam.
   - Loading locks the width by stacking the label and the loading label in one grid cell; nothing is measured.
   - Disabled is `--ia-placeholder` with `--ia-fg-3`: stone with ink-3 on light tones, as specified, and forest-3 with mist-2 on dark. Disabled controls are exempt from the contrast rules.
   - The arrow swap is a shared internal (`_shared/ArrowSwap`) keyed on a `data-ia-swap` host. Each arrow leaves in its own direction: `arrow-up-right` to (100 %, −100 %), `arrow-right` to the right, and so on. Other glyphs do not travel.
   - Under reduced motion the fill fades in place (opacity) and the arrow does not move.
4. **One action helper** (`_shared/action.js`) is used by `Button`, `TextLink`, `IconButton` and `Chip`.
   - `to` renders the provider's link, `href` a plain `<a>`, and anything else a `<button type="button">`. New-tab links get `rel="noopener noreferrer"`.
   - `disabled` is native on a `<button>`. On a link, or when `aria-disabled` is passed, the control stays focusable and every activation is swallowed.
   - `loading` sets `aria-busy` and swallows activations, including a form's implicit submit.
5. **`Col` breakpoints are `md` 768, `lg` 1024 and `xl` 1280.**
   - Every level is written resolved, as `--ia-col`, `--ia-col-md`, `--ia-col-lg` and `--ia-col-xl`, even when it only repeats the level below. Custom properties inherit, so a `Col` nested in another `Col`'s grid must never pick up its parent's values.
   - `span="full"` (the default) means `1 / -1`.
6. **Forms**
   - `Field` passes the id, `aria-describedby`, `aria-invalid` and `aria-required` to its control through context. It uses `aria-required`, not the native attribute, so no browser bubble competes with the form's own validation.
   - The error slot is always in the DOM (`hidden` when empty), so its id always resolves.
   - `group` renders a `<fieldset>` and `<legend>`, with the description on the fieldset, for `ChoiceChips`.
   - The controls forward the ref and the remaining props to the control element itself. `SelectInput`'s `className` goes to the wrapper that holds the chevron.
   - `ChoiceChips` are real radios covering each chip, so the browser supplies the arrow-key behaviour. The chosen chip also shows a tick, so the state does not rely on colour.
   - The words "required" and "optional" can be replaced (`requiredText`, `optionalText`).
7. **`Picture`**
   - The image moves through three states: `idle` (rendered, not yet checked), `pending` (hidden over the placeholder, no transition) and `loaded` (fades in over 400 ms after `decode()`). A file that is already complete never fades.
   - The placeholder is the `<picture>` element's background.
   - `fetchpriority` is written in lowercase, because React 18.2 does not know `fetchPriority`.
   - The fallback `src` is the 1080 px JPEG.
   - Art-direction `<source>`s carry their own `width` and `height`. The placeholder is always the default key's: an inline style cannot carry a media query.
8. **`Frame` parallax is capped at 6 % of the image's height.**
   - The image is rendered 14 % taller, 7 % above and below. The motion hook's `yPercent` is relative to the image itself, so 7 % of 114 % would be 7.98 % of the frame and would show an edge. 6 × 1.14 = 6.84 % ≤ 7 %. Below 1024 px the hook caps it further, at 4 %.
   - GSAP moves the `[data-m-media]` wrapper, while `ProjectTile`'s hover zoom scales the `<img>` inside it, so the two never fight.
   - `arch` uses `border-radius: 9999px 9999px 0 0`, which gives an exact semicircle at any ratio up to 2:1.
9. **`Logo`** finds the nearest `[data-tone]` in a layout effect, before the first paint, and gives the `<img>` no `src` until the tone is known, so the wrong file is never requested. A `MutationObserver` on that one element follows later tone changes, which the dock needs.
10. **`LineIcon` (an extra primitive)** renders a content icon from `public/images/inarch/icons/` inline. A fetch per name is cached for the session, and anything that is not an `<svg>` is rejected. Inline rendering is required for the icon to follow the tone. It is `LottieIcon`'s static fallback, and prompts 09 and 10 need static icons too.
11. **`LottieIcon`**
    - lottie-web's light build is loaded through a dynamic import only when the icon comes within 200 px of the viewport; the JSON is loaded at the same time.
    - The animation plays once at ≥ 50 % visibility. The static SVG is swapped out at that moment, so the icon is never blank at frame 0.
    - It re-tints per tone through the layers' `cl` classes, as the Lab's prompt 02 version did.
12. **`Accordion`**
    - On mount, and on `hashchange`, it opens the item named by the hash. Scrolling stays with ScrollManager.
    - Items that are open on arrival do not animate; items opened later raise their content.
    - ↑ / ↓ / Home / End move focus between headers.
    - The index column is a modifier class rather than `:has()`, which older Firefox and Safari lack.
13. **`ScrollMarquee`** uses `useGSAP` directly. GSAP is still registered only in `gsapSetup.js`, and the scrub token is `PARALLAX.scrub`. `useMotionScope` has no marquee attribute to drive it.
    - Its band is `overflow: hidden`, not `clip`, because axe recognises only `hidden` as clipping. It also has `contain: inline-size`, so its several-viewport-wide `nowrap` row cannot stretch a grid or flex track it sits in.
14. **`Portal` renders its children into the container in the same commit.** The container is created with `class="ia"` and `data-tone` already set, and it is attached in a layout effect, so it is in the document before any passive effect runs.
    - The first version rendered the children only after attaching. A dialog's own `useFocusTrap` therefore ran with an empty ref and never moved focus in. The Lab found this, and a regression test now covers it.
15. **The overlay hooks**
    - `useScrollLock` is the lead modal's technique, unchanged: the body fixed at the offset, restored only if the route is unchanged, and `scheduleRefresh()` on both edges. Two additions:
      - locks are reference-counted across callers;
      - the offset is restored with `behavior: 'instant'`, so the document's `scroll-behavior: smooth` cannot animate the jump.
    - `useFocusTrap(ref, active, { initialFocus, returnFocus, onEscape })`:
      - focus that lands outside the container (`focusin`) is pulled back in;
      - focus returns to the opener with `preventScroll`, and only if the opener is still in the document and visible.
16. **Tree-shaking.** `src/components/ui/package.json` declares `"sideEffects": ["*.css"]`. This was verified with a temporary probe (since reverted): importing only `Rule` from the barrel into the 404 chunk brought `Rule`'s CSS and JS and nothing else from the kit; lottie-web, `imageManifest` and the other primitives stayed out.
17. **The Lab shows hover, focus and press states with `src/lab/forceStates.js`.**
    - At run time, in development only, it copies every stylesheet rule that uses `:hover`, `:focus-visible`, `:focus` or `:active` into an attribute-selector twin (`[data-force-hover]` and so on).
    - Each copy goes into the same stylesheet and `@media` group, after the original rules of that group.
    - Nothing in the kit knows about it: the primitives simply forward `data-force-*` to their root.
    - States that live on an inner element (a chip's hidden radio, an accordion header) are shown live only.

### Deviations from the prompt

1. **`LabPage.jsx` gains only the frame view.** The section itself is added through `registry.js`, as prompt 01 designed.
   - The phone (390 px) and desktop (1280 px, scaled) frames are iframes of `/__lab?frame=primitives`, loaded on demand by a button, so `public-check` and axe do not crawl two extra app instances.
   - Inside the frames the legacy fixed header still shows, as in the Lab itself, until prompt 04.
2. **Extra pieces beyond the listed primitives:**
   - the `LineIcon` primitive (Decision 10);
   - the `chevron-down` and `info` glyphs (Decision 2);
   - the `_shared/` internals and `package.json`, and the `forceStates.js` Lab helper.
3. **Test infrastructure (`package.json` "jest", `setupTests.js`).** The listed tests could not run without these changes:
   - `react-router-dom` 7.12's `main` points at a `dist/main.js` that does not exist, and Jest 27 ignores `exports`. So `^react-router-dom$` and `^react-router/dom$` are mapped to their `dist` files.
   - GSAP's `gsap/ScrollTrigger` and `gsap/SplitText` entry files are ESM, so they are mapped to `gsap/dist/*.js`.
   - jsdom lacks `TextEncoder` (react-router builds one at import) and `matchMedia` (ScrollTrigger calls it at registration).
   - `@testing-library/user-event` resolves the top-level `@testing-library/dom` 10 while RTL patches its nested 9. The top-level copy is configured with RTL's `act`. The whole suite now runs with zero console warnings.
4. **`public-check` skips controls in a forced press state** (`[data-force-active]`). A forced `scale(0.98)` makes a 44 px `md` button measure 43.1 px, but a real press is transient. No live page ever carries that attribute.
5. **Disabled and skeleton fills use `--ia-placeholder`,** which is stone on light tones as specified, rather than a fixed stone: a stone block on forest would break the tone rule. On dark they are forest-3.
6. **The regression pass was driven with Playwright,** as in prompts 01 and 02. The script was kept in the session scratchpad. Request bodies were read from the intercepted requests.

### Evidence

- **`npm test -- --watchAll=false`:** 10 suites, **158 tests, all passing** (115 before + 43 new), with zero console warnings.
- **`npm run build`:** "Compiled successfully.", no warnings.
  - `main.828ab5e9.js` is 461,903 B (156,148 B gzip): the same size prompt 02 logged.
  - A local build of `71ead18` differs only in webpack module ids and chunk hashes, an artifact of its worktree resolving the symlinked `node_modules` through another path. The code is the same after normalising numbers.
  - Main CSS grows by 65 B gzip (15,825 → 15,890 B): the four tone variables.
  - There are 23 JS files, the same as after prompt 02. No production chunk contains the kit, the Lab, `forceStates`, lottie-web or any `data-ia-swap` / `data-accordion` code.
- **Parity:**
  - Calibration, baseline against baseline: admin 34/34, public 21/21 identical.
  - **Baseline against this branch: admin 34/34, public 21/21 identical.** No `/fonts/` request.
- **`public-check`, production build on PHP** (every route × 7 widths, plus reduced motion): **54/63 clean.** The 9 failures are the pre-existing legacy `/contact` contrast issue (prompt 01, Open item 7), identical to prompts 01 and 02.
- **`public-check --base http://localhost:3000 --routes /__lab`:** **9/9 clean.** That covers seven widths plus reduced motion at 390 and 1440: zero serious or critical axe violations, no overflow, no console errors, and every resting target ≥ 44 × 44.
  - Before the fix, axe flagged clipped marquee words at ≥ 1280 px (Decision 13).
- **No overflow that the legacy clipping could hide.** The legacy `html { overflow-x: hidden }` masks overflow from `scrollWidth`, so every element of the section was also checked against the viewport at 360, 390, 768, 1024, 1280, 1440, 1920 and an 844 × 390 landscape phone. Nothing reaches past the edge.
  - This check found the marquee's intrinsic width stretching a grid track (Decision 13).
- **Contrast, measured in Chromium on all four tones: 76 pairs, all passing.**
  - Primary label at rest: 13.27–15.86:1. On the hover fill: 5.77 (ivory), 5.17 (sand), 6.18 (paper), 7.74 (dark).
  - Secondary label on its hover fill: ≥ 13.27:1. Secondary border against the surround: ≥ 13.27:1.
  - Field borders: 3.42 / 3.06 / 3.66 / 5.54:1 against the surround, and ≥ 3.66:1 against the field.
  - Error text: 5.81 / 5.21 / 6.22 / 8.21:1. Placeholder: ≥ 4.94:1.
  - Focus ring against the surround: 5.77 / 5.17 / 6.18 / 7.74:1, and ≥ 6.18:1 against a field.
  - IconButton and Chip borders: ≥ 3.06:1. Hints: ≥ 7.3:1.
  - The ring sits 3 px off the control, so the only colour it touches is the surround. Against the focused primary's own accent fill it is 1:1 by the contract's design (see Open item 3).
- **Sizes:** field text 16 px; the smallest visible text 12 px (labels); no resting target below 44 × 44.
- **Interaction in Chromium** (29 checks, all passing):
  - **Hover and touch:** real hover wipes the fill up and swaps the arrow; it retracts on leave. On iPhone 13 emulation a tap leaves no stuck hover.
  - **Magnet:** follows the pointer by 5.9 px and springs back to 0.
  - **Dialog** (a Portal with the trap and the lock):
    - focus moves in, and Tab and Shift+Tab cycle;
    - Escape, the close button and the backdrop all close it, and focus returns to the opener;
    - the body is fixed at −73,355 px while open and restored to exactly 73,355; the container is removed.
  - **Keyboard strip:** Tab order is 1 to 8, each stop with the ring.
  - **Accordion:** Space opens an item, single-open closes the other, ↓ moves to the next header.
  - **Live form:**
    - an empty submit puts errors on name, mobile and service, focuses name and shows `role="alert"`;
    - an invalid email errors on blur;
    - a valid submit shows `aria-busy`, then a `role="status"` success notice.
  - **Reduced motion:** hover changes colour only (no transform, no arrow travel, no twin arrow); shutter covers rest off the image; the marquee is still; no Lottie plays.
- **Motion:**
  - **ScrollMarquee:** its track x follows the scroll (one band left, one right) and does not move during 3 s without scrolling.
  - **Shutter:** its triggers fire when scrolled into view.
  - **LottieIcon:** no player or JSON request at the top of the page. Near the icons, the `lottie_light` chunk and the JSONs load and all 8 play once.
- **60 fps at 4× CPU throttling** (Chromium CDP), hovering Button primary, Button secondary, IconButton and ProjectTile: the median and p95 frame are 16.7–16.8 ms. There is one long frame (33–50 ms) at the instant the hover starts (the style recalculation); everything after it is on 16.7 ms.
- **Frames:** the iframes report `innerWidth` 390 and 1280, with no overflow in either.
- **Regression pass** (production build on PHP, Playwright; 44 checks plus 14 route checks, all passing):
  - **Routes:** `/`, `/about`, `/expertise`, `/industries`, `/contact` and a nonsense URL at 390 and 1440 have the right titles and robots (`noindex` on the 404). `/expertise#e03` opens and scrolls.
  - **Modal:**
    - it opens from `header-cta`, `home-hero` and `expertise-e01`;
    - focus is trapped and scroll is locked;
    - it closes on Escape, the button, the backdrop and Back, and focus returns to the opener.
  - **Enquiries:**
    - one enquiry through the modal sends exactly the 21 frozen keys (`source: home-hero`, `state` empty, `status: new`), and the success state shows the first name;
    - the same mobile number through `/contact` returns `duplicate: true`, and "Already received!" shows.
  - **Admin:**
    - login and the dashboard (the new lead, 4 stat cards);
    - the leads page: search, all four filters, sorting, pagination, bulk select ("Delete Selected"), CSV export (contains the lead), CSV import ("Imported 0 leads (1 duplicates skipped)"), inline status change (saved: `contacted`), and the delete dialog (cancelled, the lead kept);
    - the detail page shows the name, mobile, email, interest, message, source and page URL; a note is added and the status changed (`consultation_booked`);
    - the Guidelines gate opens 4 distinct tabs, and logout works.
  - No console errors. All test leads were deleted; the store ended empty.
- **Admin-frozen check:** `git diff --stat cc2fc52… -- src/admin src/theme … .env .env.example` prints nothing.
  - `App.jsx`, `index.js`, `public/index.html`, every page, shell component, data module, config, util and context show no diff.
  - Nothing outside `src/components/ui/`, `src/lab/` and the tests imports the kit.

### Open items

1. **Admin dashboard race (pre-existing, frozen; for the final report, prompt 20).**
   - Right after login the dashboard sometimes logs "[Admin] Synced n lead(s) from server" and still renders 0 everywhere. It reproduces on the baseline build.
   - Rate: 5 of 20 logins in one batch, 0 of 10 in another (this branch: 11 of 20 and 0 of 10; the code is the same).
   - A reload shows the data. The regression script retries the dashboard to absorb it.
2. **The admin sends its key in the `list` request's query string** (`admin_key=…`), so it lands in server and proxy logs. Pre-existing; add it to the go-live key-rotation item.
3. **Prompt 18:** decide how to read "focus ring ≥ 3:1 against the control" for the primary button. By the contract, the focus fill and the ring are the same terracotta; they never touch, because 3 px of surround separates them.
4. **Prompt 04:**
   - Wrap the routes in `<LinkProvider component={TLink}>`.
   - `Logo` follows a tone change on its nearest `[data-tone]` element, so the dock should change its own `data-tone` attribute.
   - `Portal` and the two hooks are ready for the index overlay.
5. **Prompt 05:**
   - Rebuild `LeadModal` on `Portal`, `useFocusTrap` and `useScrollLock`.
   - `Button` with `loading` / `loadingLabel` gives "Sending…" with `aria-busy`.
   - `Field` with `group` and `ChoiceChips` gives the budget field. The D-09 ranges belong in the data layer.
6. **Once prompt 04 adds `overflow-x: clip`,** `public-check`'s `scrollWidth` test stops seeing overflow at all. The legacy `html` already masks it today. Prompt 17 should add an element-extent check, like the one run here, to `public-check`.
7. **`LineIcon` fetches its SVG on mount, not lazily** (about 1 KB each, cached). Prompt 16 may defer it if a page shows many.
8. **`react-router-dom`'s missing `dist/main.js`:** if the package is upgraded, check whether the Jest `moduleNameMapper` entries are still needed.
9. **No VoiceOver or NVDA was available.** Accessibility was checked through axe, the heading order, names and live regions.
10. `npm audit` advisories in CRA 5's tree are unchanged.

---

## 2026-11-28 — Prompt 04: Global shell — dock navigation, footer, page transitions, favicon and meta

**Branch:** `claude/zen-meitner-5fu5jx`, from `585706b` (prompt 03 merged). **Baseline:** `cc2fc52d90987adcf62a5c286c4eb87d155fc3f3`, served from `../inarch-baseline` on port 8081 for parity (removed afterwards).

**Starting state, confirmed:**
- Prompts 01–03 are done: tokens, base layer, `src/motion`, `SurfaceManager`, the QA scripts; `studio`, `services.js`, `credits.js`, the image manifest and the brand files (the prompt says "six files": `studio.logos` has six roles; `public/images/brand/` holds eight PNGs, the two lockups also at 800 px); the kit (`Button`, `TextLink`, `IconButton`, `Icon`, `Logo`, `LinkProvider`, `Portal`) and both overlay hooks.
- Owner decisions read from `00_INDEX.md` §12. None conflicts with the data in `src/data/`, so nothing needed reconciling. Applied here: D-15 (developer credit kept), D-22 (wordmark below 44 px: masthead on phones and tablets, overlay), D-03 (no email row), D-13 (no Icons8 credit: none ships), D-04 / D-14 (address and "From 10:00 AM" as they stand), D-05 (static absolute URLs carry the placeholder domain), D-17 (`/industries` leaves the navigation; its URL still works).

### Files

**Created**

| Area | Files |
|---|---|
| Shell | `src/components/shell/Masthead/`, `Dock/`, `IndexOverlay/`, `Footer/`, `Curtain/`, `RouteAnnouncer/` (each `.jsx` + `.module.css`) |
| Transitions | `src/components/shell/transition/TransitionProvider.jsx`, `TLink.jsx`, `usePageReady.js` (also exports `RouteMounted`) |
| Shell helpers | `src/components/shell/useSurfaceTone.js`, `src/components/shell/useMatchMedia.js` |
| Interim page | `src/pages/Pending/PendingPage.jsx`, `PendingPage.module.css`, `index.js` |
| Motion | `src/motion/revealGate.js` |
| Document CSS | `src/styles/inarch/document.css` |
| Icons | `public/legacy-icons/favicon.ico`, `favicon.png`, `apple-touch-icon.png` (byte copies of the baseline's, made before regeneration; `cmp` against `cc2fc52` is identical) |
| Tests | `src/data/__tests__/navigation.test.js`; `src/components/shell/__tests__/TLink.test.jsx`, `Footer.test.jsx`, `seoRoutes.test.js`; `src/motion/__tests__/revealGate.test.js` |

**Rewritten:** `src/components/layout/PublicLayout/PublicLayout.jsx` + `.module.css`; `src/data/navigation.js`; `scripts/generate-icons.js`; `scripts/generate-og.js`. Regenerated: `public/favicon.ico`, `favicon.png`, `apple-touch-icon.png`, `logo192.png`, `logo512.png`, `maskable-192.png`, `maskable-512.png`, `og-image.png`.

**Changed**

- `src/App.jsx`: `lazyWithPreload` (every lazy route, admin included, has a memoised `preload()`); the routes `/interior-design`, `/portfolio`, `/portfolio/:slug` (PendingPage); the public layout route wrapped in `TransitionProvider` + `LinkProvider component={TLink}`; `RouteMounted` inside `lazyRoute` and after the eager Home; the splash hide site also hides `#ia-initial-loader`. `ErrorBoundary`, `SectionLoader`, `ScrollManager`, `LeadModalWrapper`, `SEOHead`, the `.app` wrapper, the provider order, `/industries` and both admin routes are as they were.
- `src/config/seo.js`: site-level values from `studio`; `pages.interiors`, `pages.portfolio`, `pages.project`, `pages.pending`. The old pages' entries and `pages.admin` are untouched.
- `src/components/common/SEO/SEOHead.jsx`: the new routes; pending routes → `pages.pending`.
- `src/utils/hashScroll.js`: `HEADER_OFFSET` 90 → 32 (and its comment).
- `src/context/ThemeContext.jsx`: the one guard.
- `src/motion/useMotionScope.js` (the `data-m-now` gate), `src/motion/tokens.js` (`DUR_NAMED.overlayIn / overlayOut / curtainLift`), `src/motion/index.js` (exports).
- `src/components/ui/Icon/Icon.jsx`: an `arrow-up` glyph (for "Back to top").
- `src/styles/inarch/index.css` (imports `document.css` last) and `__tests__/tokens.test.js` (Deviation 4).
- `public/index.html`, `public/manifest.json`.
- `scripts/qa/_shared.js` (route discovery), `scripts/qa/parity.js` and `scripts/qa/README.md` (Deviation 5).
- `CHANGELOG.md`.

**Deleted:** `src/components/common/Header/`, `MobileMenu/`, `Footer/`. A search found no importer other than `PublicLayout` (App.jsx only named `MobileMenu` in a comment, now rewritten).

**Admin-frozen check:** `git diff --stat cc2fc52… -- src/admin src/theme src/styles/variables.css … public/api .env .env.example` prints nothing. The admin-bound values (`brandName`, `legalName`, `logo`, `LOGO_SIZE`, `expertiseTitles`, `pages.admin`, `getConfig()`) are unchanged.

### Decisions

1. **When is the incoming page "ready"?** Pages that call `usePageReady(ready)` decide; it *claims* the decision in a layout effect and signals in a passive one. Pages that do not (the old bodies) are revealed when their route has committed: `RouteMounted`, rendered *inside* each route's Suspense boundary (and after the eager Home), reports it from a passive effect, by which time any claim in the same commit is known. Every signal carries its pathname and only counts for the path the router was sent to, so a late signal from the outgoing page cannot lift the curtain early. The cap is 1200 ms from the router navigation.
2. **The routed page is keyed by pathname** (`<Outlet key={pathname} />`), so `/portfolio/a` → `/portfolio/b` (one route) mounts a fresh page and the transition waits for it.
3. **The lift starts two animation frames after "ready".** Measured at 4× CPU throttling: with an immediate lift, the legacy Home's first layout and its queued ScrollTrigger refresh landed in the first lift frame (167 ms at curtain −8 %). With the double rAF, every long frame of a transition falls while the curtain fully covers the page (curtain 0 %), plus one 50 ms frame at the click with the curtain still off-screen. A navigation id guards the deferred lift.
4. **Hero motion waits for the curtain** (`src/motion/revealGate.js`). The provider holds the gate before covering and releases it as the lift starts; `useMotionScope` builds its `data-m-now` tweens paused while held (so hidden start states apply) and restarts them with their delays on release. The gate is open on first load, back / forward and under reduced motion.
5. **Robustness rules.** A click while covering retargets; a click once covered navigates again under the same cover; a click while lifting re-covers from where the curtain is; a back / forward gesture (or any navigation that did not come through the provider) aborts a transition in progress; a 4 s watchdog always ends one. The curtain intercepts pointer clicks while it covers, which is intended. Ten rapid keyboard activations (which do reach links under the curtain), three rounds, always land on the last target with the curtain lifted.
6. **Focus and announcement after every navigation** — curtain navigations as the curtain lifts, every other navigation (old pages' plain router links, back / forward) after its commit; not on the first load and not for a fragment-only POP. The skip link moves focus to `<main>` itself instead of changing the URL fragment, which the router would report as a POP.
7. **Dock details.**
   - Tone is sampled at x = 4 px, outside the bar at every width, looking through `[data-shell-float]` layers.
   - While slid out it is `inert`, so focus can never land off-screen; keyboard focus inside it keeps it in place (a mouse click's focus does not).
   - "Write to us" on `/contact` scrolls to `#enquiry`, else (the old page, until prompt 13) to the page's form, focusing its first field; with neither it opens the modal.
   - Menu (dock) and Close (overlay) share one fixed width (98 px), so the CTA and WhatsApp sit in exactly the same place in both bars (measured equal at 320, 360, 390, 768). The compact CTA uses 10 px padding and an 8 px arrow gap so "START A PROJECT" fits from 360 px; below 360 the arrow gives way and the label may wrap to two lines.
   - The overlay's CTA also uses `dock-cta` (the prompt names only `dock-cta` and `footer-cta` for the shell).
8. **Masthead tone** = the deepest `[data-tone]` whose top is the top of `<main>`. Old page bodies have none → light, with a ground (Deviation 1).
9. **Overlay.** Visibility follows `data-open` in CSS (the focus trap runs before the animation effect, and cannot focus inside a `visibility: hidden` panel); GSAP moves it only. Its scroll region ends above the bottom bar, so rows never pass behind it in landscape. When it closes because the viewport crossed 1024 px, focus goes to the desktop dock's first control (the Menu button no longer exists).
10. **Footer.** The Talk group is the "contact block" the dock yields to (`[data-footer-contact]`). The lockup is an image, not a link (Explore already has Home). "Back to top" scrolls and moves focus to the masthead's home link.
11. **`<main>` has `overflow-x: clip`** (with a `hidden` fallback). The legacy Home marquee strip is 30 px wider than the viewport and relied on the old `body` clip, which the public document no longer has; `public-check` caught it at ≥ 1024 px. `clip` creates no scroll container, so sticky still works.
12. **`seoConfig.siteUrl` is now `studioUrl('/')`** — the serving origin until D-05 — instead of the Dulcey domain, so canonicals, `og:image` and schema URLs on every route (old pages included) point at the site actually serving them. The old pages' titles and descriptions are untouched, so at run time `/`, `/about`, `/expertise`, `/industries`, `/contact` and the 404 still read "… — Dulcey Lead Services" until their prompts; only the static `index.html` (and the three pending routes) read IN-ARCH. Title template `%s | IN-ARCH`; the page titles come from PDF §12.
13. **Icons.** Ivory `#F4EFE7` ink with the source monogram's alpha (no colour drift), on an opaque espresso tile; all seven files are RGB without alpha. Mark width: 80 % (16–48), 60 % (apple-touch), 64 % (any), 52 % (maskable: the 1.4 : 1 mark's corners sit inside the 80 % circle, which allows ≤ 65 %). For 16–48 px the alpha is blurred (σ 0.55 px at 4× supersampling) and steepened (× 2.6 − 30); three settings were compared side by side at 1× and 6×.
14. **Open Graph image** is a 256-colour dithered PNG: 193 KB instead of 658 KB, under the ~300 KB some messengers accept for a preview; the overlay leaves few tones to band.
15. **The IN-ARCH splash shows only under `html[data-surface="public"]`** (the prompt asks for "hidden under admin"): without JavaScript no surface is set, and the legacy behaviour is unchanged. Its mark is `loading="lazy"`, so the hidden splash on `/admin` never requests it, and the surface script preloads it on the public surface.
16. **The shell imports `src/motion/tokens`, `reducedMotion` and `revealGate` directly**, not the barrel: the barrel re-exports `useMotionScope`, which registers SplitText as a side effect and pulled it into the main bundle. After the change no production chunk contains SplitText.
17. **`lazyWithPreload`** memoises the import, so a warmed chunk is never fetched twice, and forgets a failed import so the ErrorBoundary's retry can try again.

### Deviations from the prompt

1. **The masthead lays a translucent ivory ground over old page bodies** (`[data-legacy]`: `--ia-bg` at 86 % with a 16 px backdrop blur). The prompt says the masthead has no background and is "light for legacy pages", but the old heroes were drawn for the old glass header, and at 1440 the "Patna, Bihar · phone" line sat on the dark part of the old Home photograph. It disappears by itself on any page whose first section has a `[data-tone]`; prompt 14 can delete the rule.
2. **Static `keywords` and `author` in `index.html` now read IN-ARCH** (the PDF §12 keywords; the studio's name). They are not in the prompt's list, but they were the previous client's brand strings in the public document's default meta.
3. **Static `og:image` / `twitter:image` use `https://SITE-URL-NOT-SET.invalid/og-image.png`** (D-05) instead of the Dulcey domain; SEOHead replaces both with the serving origin at run time.
4. **`tokens.test.js`** now allows `html[data-surface="public"]` as the selector prefix in `document.css` only, and expects six layers in `index.css`.
5. **QA harness.** `_shared.js` tests parameterised routes with a concrete sample (`/portfolio/:slug` → the first slug in `projects.js`), so `public-check` covers all three new routes. `parity.js` skips `#ia-initial-loader` in the digest **only while it is `display: none`** (always, on the admin): without this the four hidden splash elements shifted every index of the body-level digest (0 pixels differed). If the splash ever rendered on the admin it would be digested and fail.
6. **Extra files:** `useMatchMedia.js`, `revealGate.js`, the `arrow-up` glyph, and the tests listed above.
7. **The regression pass was driven with Playwright** (as in prompts 01–03), with request bodies read from the intercepted requests; the scripts stayed in the session scratchpad.

### Evidence

- **`npm test -- --watchAll=false`:** 15 suites, **204 tests, all passing** (158 before), no console warnings.
- **`npm run build`:** "Compiled successfully.", no warnings. Main JS 501,272 B (169,379 B gzip), against 461,903 / 156,148 after prompt 03: the whole shell, the kit pieces it uses, the overlay hooks and the transition. 24 JS files (the baseline has 23; +1 is PendingPage). No `.js` contains `__lab` or SplitText.
- **Admin parity, baseline against this branch: 34/34 identical**, 0 pixels and 0 digest differences, no `/fonts/` request (twice, on the final build). Calibration, baseline against itself: 34/34 (one earlier calibration run showed 2/34, harness noise on the baseline alone — the known dashboard race, prompt 03 Open item 1).
- **`public-check` (production build on PHP, 10 routes × 7 widths + reduced motion): 81/90 clean.** The 9 failures are the pre-existing legacy `/contact` contrast issue (prompt 01 Open item 7), identical to prompts 01–03. Before the `<main>` clip, `/` failed overflow at 1024–1920 (Decision 11).
- **`public-check --base http://localhost:3000 --routes /__lab`** (dev server): 9/9 clean. Dev console on the shell's states (overlay, hidden dock, two transitions, 390 and 1440): no warning, no error.
- **Document brand, measured before React mounts** (main bundle blocked):
  - Public `/` and `/portfolio`: title "In-Arch Architects & Interior Designer | Architects in Patna, Bihar", icons `/favicon.*`, both `theme-color` `#161E19`, the two font preloads with `crossorigin`, the IN-ARCH splash shown and the old one hidden.
  - `/admin/login` and `/admin/dashboard`: icons `/legacy-icons/*`, both `theme-color` `#0B0B0C`, title "Dulcey Lead Services — Beyond Business Support", old splash shown, IN-ARCH splash hidden; **no request** for any `/fonts/` file or the IN-ARCH mark. After mount: "Admin Panel — Dulcey Lead Services", `theme-color` `#FFFFFF` / `#0B0B0C` and Archivo applied — exactly the baseline's values.
  - `manifest.json` parses; name, short name, description (= `studio.blurb`), colours as specified; icon list unchanged.
  - Icon sizes: `favicon.ico` 16 + 32 + 48; `favicon.png` 32; `apple-touch-icon.png` 180; `logo192` / `maskable-192` 192; `logo512` / `maskable-512` 512; all opaque RGB. `og-image.png` 1200 × 630, 193 KB.
- **Interaction suite (Playwright, 27/27):** Menu ≥ 88 × 54 (the bar's inner height); overlay opens with `aria-expanded`, focus on "01 Home", Tab stays inside, scroll locked, dock out; Escape closes, focus back on Menu, scroll restored to the same offset; a row link → curtain → `/contact` at the top, focus on `<main>`, title announced, overlay closed, curtain hidden; "Write to us" scrolls to the form and focuses a field; a focused field on touch slides the dock out; desktop dock centred and ≤ 960 px (892 at 1440); a dock link covers, navigates, focuses and marks `aria-current`; back and forward without a curtain; dock dark over the footer and light again at the top; out at the footer's Talk block; yields to an injected `[data-primary-cta]`; slides out for the modal and comes back with focus on its CTA; reduced motion has no curtain. No page errors.
- **Overlay:** resizing 900 → 1100 px closes it, releases the lock and puts focus on the dock's "IN-ARCH — home"; at 844 × 390 the rows scroll above the bar.
- **Transitions at 4× CPU:** frames median 16.7 ms, p90 16.7–16.8 ms; long frames only under full cover (Decision 3).
- **Keyboard:** Tab from the top at 390 and 1440 on four routes: skip link → masthead → dock → page → footer, every IN-ARCH stop with its 2 px ring, and no focused control ever under the visible dock.
- **Sizes:** no horizontal overflow at 320, 360, 390, 768, 1024, 1280, 1440, 1920 or 844 × 390; the dock CTA label fits from 360 px (wraps at 320). Every target ≥ 44 × 44 at ≤ 768 px (`public-check`).
- **Deep links:** `/expertise#e07` typed, the old Home index row to `#e03`, and the footer's service link to `#e05` (through the curtain) each open their item and land 32 px from the top, at 390 and 1440.
- **Regression pass** (production build on PHP; 29/29):
  - all nine routes at 390 and 1440: one `h1`, one primary `nav`, `main` and `footer`; `index, follow` with a canonical on the old pages; `noindex, nofollow` and no canonical on the three pending routes and the 404; no console errors;
  - the modal from `home-hero`, `dock-cta` and `footer-cta`: focus in and trapped, closes on Escape and the button, scroll lock released, focus back on the opener;
  - an enquiry through the modal sends exactly the 21 frozen keys (`source: dock-cta`, `state` empty, `status: new`, `page_url` set); success shows the first name;
  - the same mobile through `/contact` (`source: contact-page`) returns `duplicate: true` and "Already received!" shows;
  - admin: redirect to login, login, dashboard with the new lead and its unchanged title, search, all four selects operated, sorting, CSV export (contains the lead), CSV import ("Imported 0 leads (1 duplicates skipped)"), bulk select, the delete dialog (cancelled), the detail page with name, mobile, email, interest, message, `dock-cta` and the page URL, a note added and the status changed (both persisted in the store), the Guidelines gate and its 4 tabs, logout; no page errors. Pagination was not exercised: the store held a single lead.
  - Every test lead (and the parity seeds) deleted afterwards: both stores empty.

### Open items

1. **Prompt 05:** the dock, the overlay (`dock-cta`) and the footer (`footer-cta`) call `openLeadModal`; the dock slides out while `isModalOpen`. Rebuild the modal on `Portal`; mark its submit button `data-primary-cta` only if it should make the dock yield (the dock is out while the modal is open anyway).
2. **Pages from prompt 06 on:** put `class="ia"` on the page root and `data-tone` on each section (the first one sets the masthead's tone and removes its legacy ground); call `usePageReady()` (pass `false` until the hero image has decoded if wanted); mark in-page primary buttons `data-primary-cta`; hero motion with `data-m-now` already waits for the curtain.
3. **Prompt 13:** give the enquiry section `id="enquiry"`; until then the dock's "Write to us" targets the old page's form.
4. **Prompt 14:** hoist `ia` to the layout root; remove `.masthead[data-legacy]`; switch body background / colour / font; decide whether `<main>`'s `overflow-x: clip` stays; the old `.initial-loader` and its preload. Public parity against `cc2fc52` is no longer meaningful (the shell changed by design); prompt 14's split proof needs its own baseline.
5. **Prompt 15:** remove the admin branch of the end-of-`<head>` surface script, `public/legacy-icons/` and the static `dls-mark-860.png` preload (its `<img>` in the hidden old splash still downloads on public routes). The manifest is already IN-ARCH for the whole origin (visible on `/admin` only if someone installs the site as an app from an admin page).
6. **Prompt 17:** `env(safe-area-inset-bottom)` cannot be emulated in headless Chromium; check the dock and the overlay bar on a real iPhone with a home indicator. Check 320 px (the dock label wraps to two lines there).
7. **Prompt 18:** restore the static JSON-LD, canonical and `og:url` / `twitter:url` once the domain is known; replace the placeholder image URLs; the old pages' SEO entries still carry Dulcey titles at run time until their prompts.
8. The legacy `/contact` contrast failure (prompt 01 Open item 7) remains until prompt 13.
9. No VoiceOver or NVDA in this session: landmarks, names, heading order and the live region were checked through the accessibility tree and axe.
10. `npm audit` advisories in CRA 5's tree are unchanged.

---

## 2026-11-28 — Prompt 05: Unified lead form and modal

**Branch:** `claude/beautiful-babbage-1qty05`, from `4579023` (prompt 04 merged). **Baseline:** `cc2fc52d90987adcf62a5c286c4eb87d155fc3f3`, served from `../inarch-baseline` on port 8081 for parity (removed afterwards).

**Starting state, confirmed:**
- Prompts 01–04 are done: tokens and motion, `studio` with `studioTelHref` / `studioWhatsAppHref` / `studioMailHref`, `serviceTitles` and `SOMETHING_ELSE`, the `enquiry-sent` illustration and the "done" Lottie, the kit (`Button`, `TextLink`, `IconButton`, `Field`, `TextInput`, `TextArea`, `SelectInput`, `Notice`, `Portal`, `useFocusTrap`, `useScrollLock`), and the shell whose dock, overlay and footer call `openLeadModal('dock-cta' | 'footer-cta')`.
- Owner decisions read from `00_INDEX.md` §12. None conflicts with the data in `src/data/`, so nothing needed reconciling. Applied here: D-08 (phone required, email optional), D-09 (the default budget ranges, optional), D-19 (duplicates stay unstored; the brief goes to WhatsApp), D-03 (no email address: the form's Email link stays hidden), D-06 (the seven services as listed).

### Files

**Created**

| Area | Files |
|---|---|
| Payload | `src/utils/leadPayload.js` |
| Data | `src/data/enquiry.js` (service options, budget ranges) |
| QA | `scripts/qa/lead-flow.js` |
| Tests | `src/utils/__tests__/leadPayload.test.js`, `src/utils/__tests__/validators.test.js`, `src/components/common/UnifiedLeadForm/__tests__/UnifiedLeadForm.test.jsx`, `src/components/common/LeadModal/__tests__/LeadModal.test.jsx` |

**Rewritten in place** (same paths, same default exports): `src/components/common/UnifiedLeadForm/UnifiedLeadForm.jsx` + `.module.css`; `src/components/common/LeadModal/LeadModal.jsx` + `.module.css`.

**Changed**

- `src/utils/validators.js`: the name pattern is `[\p{L}\p{M}\s.'-]` with the `u` flag; adds `getRequiredMobileErrorMessage`, `getOptionalEmailErrorMessage` and `normalizeMobile`. The four original exports keep their behaviour and messages.
- `src/utils/webhookSubmit.js`: `CONTACT_PHONE = studio.phoneDisplay` (the import and that line; nothing else).
- `src/context/ModalContext.jsx`: comments only (the context contract). `src/App.jsx`: `context={modalConfig.context}` on `LeadModal`.
- `package.json`: `"qa:leads"`. `scripts/qa/README.md`: the lead-flow section. `CHANGELOG.md`.

**Deleted:** nothing. `src/utils/swalHelper.js` stays for prompt 14; nothing imports it any more, so no chunk ships sweetalert2.

**Admin-frozen check:** `git diff --stat cc2fc52… -- src/admin src/theme … public/api .env .env.example` prints nothing. The admin-bound values (`brandName`, `legalName`, `logo`, `LOGO_SIZE`, `expertiseTitles`, `pages.admin`, `getConfig()`) are unchanged; `siteConfig.js`, `expertiseData.js` and `seo.js` have no diff.

### Decisions

1. **The draft records what the visitor typed, not what a CTA prefilled.** It is written only after a change event. Without this, opening the sheet from "Discuss Interior Design" and closing it untouched made the next, unrelated CTA open with that service selected (the first form test caught it). A CTA's valid prefill wins over a draft's service.
2. **A blur error is held while a button or link in the form is pressed** (`pointerdown` in the capture phase, released after the click), then shown. Found by reading the accessibility tree: with an invalid phone focused, a mouse press on "Send enquiry" made the phone error appear on mousedown, which pushed the button down 28 px, and the release landed off it — the click was lost. The old form had the same flaw. Keyboard and touch never hit it; nothing else changes.
3. **Sending:** the fields sit in a `<fieldset disabled>` (parity: controls disabled while sending); the submit button is not disabled but `loading` (`aria-busy`, "Sending…", presses swallowed), so it keeps focus. If disabling the fields dropped focus (Enter pressed in a field), it is put back when the result arrives.
4. **Duplicate and failure notices sit above the fields** ("above the untouched form") and are scrolled into view with `block: 'nearest'`; focus stays on the control that was used. Each new result remounts the notice, so a repeated failure is announced again. "Try again" lives in the error notice and keeps the notice (busy) until the next result.
5. **Honeypot** (`company_website`, visually hidden, `tabindex="-1"`, `autocomplete="off"`, inside an `aria-hidden` wrapper, last in the form so the dock's "Write to us" still focuses "Your name"). One addition: a value the browser's own autofill put there (`:autofill`) is not treated as a bot, so a person whose autofill profile has a company is never silently dropped.
6. **"+91"** is a visual prefix inside the field (`aria-hidden`), and the label carries a visually hidden "(+91)": the field reads "Phone (+91), required". Putting the prefix in `aria-describedby` read it after the error.
7. **Budget** uses an enabled empty first option, "Select a range", so the optional choice can be undone; the kit's `placeholder` option is disabled by design (right for the required service select).
8. **The message has no `maxLength`**: a paste longer than 500 characters is not truncated silently; the counter (from 400, `aria-describedby`, "412 of 500 characters used" for assistive technology) turns to the error colour and validation says "Please keep your message under 500 characters". Location and area are capped at 120 characters, the name at 50.
9. **Name messages** come from the form ("Please enter your name", "Please enter at least 2 letters", …) on top of `getNameErrorMessage`, whose own strings are unchanged. `getRequiredMobileErrorMessage` forgives spaces, dashes, "+91" and a trunk "0"; another country code is refused.
10. **`composeMessage`** ends with one full stop: "Area: 2,500 sq. ft." is not doubled.
11. **One greeting:** the form imports `WHATSAPP_GREETING` from `Dock.jsx` rather than repeating the sentence. The WhatsApp brief (duplicate / failure) is the greeting, "Name: …", "Service: …" and the composed message, one per line.
12. **Modal mechanics.**
    - It stays mounted for the 350 ms exit (`present` state, derived during render so the opening render already contains the dialog — the focus trap needs it in that commit); each opening remounts the form (`key`), so a new CTA's source and prefill always apply.
    - The animation runs in a layout effect, so the sheet never flashes in place before rising. Reopening mid-exit resumes from where it is.
    - The header is a fixed band above a scrolling body rather than `position: sticky` inside it: it looks the same, and `scrollIntoView` of a notice or a focused field is then never hidden under it.
    - `visualViewport` sets `--ia-kb` (the keyboard's height, 0 when pinch-zoomed), which lifts the sheet above an on-screen keyboard and shortens it.
    - `data-shell-float` is on the modal root, so the dock's tone sampling looks through the backdrop while the sheet leaves.
    - Focus opens on the heading (`tabindex="-1"`); the trap returns focus to the opener; `useScrollLock` restores the offset only on the same route and calls `scheduleRefresh()` on both edges.
13. **Success** shows the `enquiry-sent` illustration (120 px, decorative), an `h3` "Thank you, {first name}." (the dialog's heading is the `h2`; the old Contact panel's is an `h2` too), the number in the studio's grouping kept on one line, "Message us on WhatsApp" and, in the sheet, "Close" (`onClose`).
14. **Bundle.** Main JS 518,611 B (174,763 B gzip), against 501,272 / 169,379 after prompt 04 (+17.3 KB raw / +5.4 KB gzip): the form, the sheet and the kit's form fields, notice, heading and illustration are in the main bundle because `LeadModal` is rendered at the root, as before. The lazy sweetalert2 chunk is gone (23 JS files, against 24). No chunk contains `__lab`, SplitText or lottie-web in main.

### Deviations from the prompt

1. **Extra files and exports.** `src/data/enquiry.js` holds the service options and the D-09 ranges (prompt 03's log put the ranges in the data layer). `leadPayload.js` also exports `composeWhatsAppBrief`, `formatMobile`, `firstName`, `EMPTY_VALUES` and the key lists; `validators.js` also exports `normalizeMobile` (the old form's private helper, now tested); the form exports `DRAFT_KEY` and `MESSAGE_MAX`. A `LeadModal` test was added.
2. **One extra prop, `onClose`,** on `UnifiedLeadForm`: it shows "Close" in the success state (the sheet passes it; the Contact page does not).
3. **The sheet's header is fixed above the scroll region, not sticky inside it** (Decision 12).
4. **`lead-flow.js` does a little more than specified:** it also checks Escape, focus return and the scroll lock; it uses a second fresh number for the failure, so "Try again" ends in a stored lead rather than a duplicate; it selects "Residential Architecture" so the "Interested In" assertion proves a title the old Dulcey list never had; it deletes the test leads through the API with the admin key from `.env` (also when a step fails) rather than through the admin's delete dialog — the regression pass exercises that dialog.
5. **The regression pass, the modal checks and the accessibility-tree read were driven with Playwright** (as in prompts 01–04); those scripts stayed in the session scratchpad.

### Evidence

- **`npm test -- --watchAll=false`:** 19 suites, **251 tests, all passing** (204 before), no console output.
- **`npm run build`:** "Compiled successfully.", no warnings (sizes in Decision 14).
- **`node scripts/qa/lead-flow.js`:** **37/37** at 390 px (bottom sheet) and **37/37** at 1440 px (side panel), on the final build. The intercepted `?action=create` body had exactly the 21 frozen keys plus `project_location`, `project_area`, `budget_range`; `status: "new"`, `notes: []`, `activity[0].action: "Lead created"`, `organization: ""`, `state: ""`, `source: "dock-cta"`, the message "A three-bedroom flat … monsoon. — Project details: Location: Boring Road, Patna; Area: 1,850 sq. ft.; Budget: ₹25 – 50 lakh". The admin listed it with name, mobile and source, its detail page showed the interested-in value and the composed message, and "Interested In" offered "Residential Architecture". Duplicate on `/contact`: the notice, the WhatsApp brief and every value intact. Forced failure (`internetdisconnected`): the error notice with "+91 72928 31128", values intact, "Try again" stored the lead (`contact-page`).
- **`public-check` (production build on PHP, 10 routes × 7 widths + reduced motion): 81/90 clean.** The 9 failures are the pre-existing legacy `/contact` card-label contrast issue (prompt 01 Open item 7), the same as prompts 01–04; nothing from the new form. Re-run on `/` and `/contact` after the last change: the same.
- **The sheet at 360, 390, 768, 1024, 1280, 1440, 1920 and 844 × 390** (details open): no horizontal overflow, every control ≥ 44 × 44, smallest text 12 px (labels), sheet 92 % tall on phones (718 / 776 px) and a 520 / 560 px full-height panel from 768 / 1280. **Axe (wcag2a/aa, 21aa, 22aa) on the dialog: zero serious or critical** at every size, idle and with errors, and in the duplicate, failure and success states (API mocked, nothing stored) at 390 and 1440.
- **States:** duplicate and failure keep focus on the button and bring the notice into view; success moves focus to its heading.
- **Keyboard** (390, 1440): from the heading, Tab runs Close → name → phone → service → message → "Add project details" → Send enquiry → WhatsApp → Call → back to Close; it never leaves the dialog; every stop shows the 2 px solid ring. Escape, the close button and a backdrop click all close it and return focus to "Start a project".
- **Scroll lock:** opened at 1800 px, the body is fixed at −1800 px and the page does not move under the wheel; closed, it is back at exactly 1800, at 390 and 1440.
- **Reduced motion:** the sheet appears untransformed with the backdrop at full opacity, and Escape removes it at once.
- **Short viewport (390 × 420, a keyboard that resizes the page):** each focused field and the submit button are scrolled into the sheet's visible area.
- **On `/contact` (old page, new form):** tabbing through every field at 390 (touch) and 1440, no focused control is under the visible dock (on touch the dock slides away for a text field).
- **Accessibility tree:** the dialog is named "Tell us about your space."; each field is named with "required" or "optional"; an invalid field is `invalid` and described by its error ("Mobile numbers start with 6, 7, 8 or 9"); the notices are `status` / `alert` regions. Chromium does not surface `aria-required` on a native `<select>` as a property, but its name includes "required" (the kit's visually hidden marker).
- **Context:** an enquiry from the old Expertise accordion was recorded as `expertise-e02` (the old Dulcey title it passes was ignored by the prefill, as designed) and the dock's as `dock-cta`; both were confirmed in the admin.
- **Regression pass** (production build on PHP, Playwright; **54/54**, run again on the final build):
  - nine routes at 390 and 1440: one `h1`, `main` / `nav` / `footer`, `index, follow` on the old pages, `noindex` on the pending routes and the 404, no overflow, no console errors;
  - the modal from `home-hero` (old Home), `footer-cta`, `dock-cta` and `expertise-e03` (old accordion) at both widths: opens, focus inside, Escape closes, focus back on the opener;
  - admin: redirect to login, login, dashboard (the new lead in the recent table, stat cards, the 14-day trend, CSV export), search, all four filters (Status, Interested In, Source, Date Range), sorting, pagination, inline status change (saved), bulk select ("Delete Selected"), CSV export (contains the lead) and import ("Imported … duplicates skipped"), the delete dialog (cancelled, lead kept), the detail page (name, mobile, email, interested-in, message, source, page URL), a note added and the status changed (both saved), the Guidelines gate and its four tabs, logout; no page errors.
- **Admin parity, baseline against this branch: 34/34 identical**, 0 pixels and 0 digest differences; calibration (baseline against itself) 34/34.
- Every test lead and the parity seeds were deleted: both stores ended empty.

### Open items

1. **Prompt 13 (Contact):** place the `full` form in the new page and give its section `id="enquiry"`. Until then the form paints its own paper ground inside the old grey panel.
2. **Prompt 14:** delete `src/utils/swalHelper.js` and the `sweetalert2` package (nothing imports them now).
3. **Prompt 15:** the admin's fixed "Interested In" list (D-02). The new titles already appear there as stored values.
4. **Prompt 17:** check the sheet with a real on-screen keyboard on iOS Safari and Android Chrome (the `visualViewport` lift cannot be emulated headless) and the safe-area padding on a phone with a home indicator.
5. **Prompts 06–14 and 19:** every new CTA calls `openLeadModal('<page>-<place>', { service_interest, context: { label } })` with the names in the prompt's contract; nothing passes a `context` yet. `context.ref` is accepted and not stored (left for the measurement hook, D-18).
6. **Prompt 18:** a real screen-reader pass (none was available; checked through the accessibility tree and axe). Decide whether the kit's controls should also carry the native `required` (harmless under `noValidate`) so `<select>` exposes the required state as a property. Consider lazy-loading the sheet's body if the main-bundle budget needs the 5.4 KB gzip back.
7. The honeypot is the only bot measure; the create endpoint has no rate limiting (index §13).
8. No VoiceOver or NVDA in this session. `npm audit` advisories in CRA 5's tree are unchanged.

---

## 2026-11-28 — Prompt 06: Home — hero and opening

**Branch:** `claude/hopeful-dijkstra-cthvq9`, from `e354cd4` (prompt 05 merged). **Baseline:** `cc2fc52d90987adcf62a5c286c4eb87d155fc3f3`, served from `../inarch-baseline` on port 8081 for parity (removed afterwards). The pre-change build (`e354cd4`) was kept in the session scratchpad and served on port 8090 for the seam comparison.

**Starting state, confirmed:**
- Prompts 01–05 are done: tokens, base layer, `useMotionScope`, the QA scripts; the image keys `home-hero-wide`, `home-hero-tall`, `home-intro`; `studio`, `services`, `studioContent`; the kit; the shell (masthead tone from the first section, the dock's `data-primary-cta` yield, transitions, `usePageReady`); the lead modal and the `home-hero` source.
- Owner decisions read from `00_INDEX.md` §12. None conflicts with the data in `src/data/`, so nothing needed reconciling. Applied here: D-10 (the hero `h1` is `studio.tagline`, derived at run time, so a changed tagline changes the hero), D-04 (city and region as they stand), D-06 (the seven services in the schema). No new content gap was found, so `00_INDEX.md` is unchanged.

### Files

**Created**

| Area | Files |
|---|---|
| Sections | `src/pages/Home/sections/ManifestoSection.jsx` + `.module.css` |
| Tests | `src/pages/Home/__tests__/HomeOpening.test.jsx` (12 tests) |

**Rewritten** (same paths and default exports): `src/pages/Home/HomePage.jsx` (the `ia` opening, then a sibling wrapper without `ia` holding the four old sections in the old `styles.page` reset); `src/pages/Home/HomePage.module.css` (the same one rule, new comment); `src/pages/Home/sections/HeroSection.jsx` + `.module.css` (the old 700-line stylesheet is gone).

**Changed**

- `src/motion/useMotionScope.js`, `tokens.js`, `index.js`: `data-m="settle"`, `data-m="words"`, `data-m-rise`; `DUR_NAMED.heroSettle`, `SETTLE`, `WORDS` (Decision 5).
- `src/data/studioContent.js`: `heroDisciplines` (PDF §10 A) and `homeStatement` (PDF §2, the second About sentence without "The practice believes that"), both also on the default export. `src/data/siteConfig.js`: `studio.principal.title: 'Principal Architect'` (additive; no admin-bound value touched). `src/data/__tests__/content.test.js`: two tests that tie both to the PDF wording.
- `src/config/seo.js`: `pages.home` (title, description, keywords); `services.items` from `services.js` with `/expertise#e0N` URLs and the list renamed "Services"; `organization.knowsAbout` was already `serviceTitles` (prompt 04). Header comment updated.
- `public/index.html`: the `/`-only preload script now preloads the two art-directed AVIF sets and the italic Fraunces face (Deviation 4); the static `keywords` meta matches the new Home entry (Deviation 5).
- `scripts/qa/parity.js` + `scripts/qa/README.md`: the Iconify fallback hosts are blocked too (Deviation 9).
- `CHANGELOG.md`.

**Deleted:** `src/pages/Home/sections/MarqueeStrip.jsx`, `MarqueeStrip.module.css`, `WhoWeAreSection.jsx`. A search found no other importer. `marqueeItems` in `industriesData.js` is now read by nothing public (prompt 11 deletes that file).

**Admin-frozen check:** `git diff --stat cc2fc52… -- src/admin src/theme src/styles/variables.css src/styles/global.css src/styles/animations.css src/styles/responsive.css src/styles/dulcey.css src/App.css src/hooks/useMediaQuery.js public/api .env .env.example` prints nothing. The four old sections and their stylesheets, `expertiseData.js`, `industriesData.js`, the shell, `App.jsx` and every admin-bound value show no diff.

### Decisions

1. **The hero `h1` is set at Fraunces's display optical size, `opsz` 144** (`font-variation-settings` on the `h1` only). With `font-optical-sizing: auto` the two lines cannot hold at the type table's sizes: measured with the shipped WOFF2 at weight 300 and −0.02em, "Shaping experiences." is 8.207 em at the auto optical size (368 px at 45.12 px, against 319.5 px of column at 360) and 6.701 em at `opsz` 144 (302 px). "Designing spaces." is 7.428 / 6.037 em. With 144 the `h1` is two lines from 340 px up, at exactly the table's sizes (Evidence). 144 is the master Fraunces draws for display, and from 1280 px auto would already pick 111–136, so the headline looks the same on every device.
2. **The scrim is anchored to the copy, not to the section's height.** The client's photograph is bright (white ceiling, white stone floor), and the copy's share of the screen varies from about 60 % (390 × 844) to 75 % (1440 × 900), so percentage stops alone cannot hold 4.5:1 everywhere. Two layers, both forest `#161E19`:
   - `.veil` over the photograph: the prompt's gradient with its lower stops relaxed (phones `.62 → .18` at 34 %, then `.18`); from 768 a denser top band for the masthead (`.66 → .50` at 88 px / `.80 → .72` at 104 px from 1024, where the masthead carries text).
   - `.copy::before`, full-bleed behind the copy block: transparent `--hero-fade` (140 / 180 / 200 px) above the eyebrow, then `.74` at the eyebrow, `.84` at 62 %, `.92` at the bottom.
   - The binding constraint is the terracotta-300 accent line: over a white pixel it needs ≥ .70 forest for 3:1. The photograph therefore reads dark at desktop (see Open item 3).
3. **"After the first line lands" = 0.65 s.** The lines start at 0.15 s and run 1.0 s on `expo.out`, which has covered 97 % of its travel 0.5 s in. The eyebrow, lede, actions and meta then rise in that order, 0.08 s apart (0.65, 0.73, 0.81, 0.89 s).
4. **The hero's rise is 24 px at every width** (`data-m-rise="24"`), as the prompt says, instead of the contract's 40 px from 1024.
5. **Three additions to `useMotionScope`**, so the sections stay one hook each, driven by attributes:
   - `data-m="settle"`: scale 1.08 → 1, `DUR_NAMED.heroSettle` 1.6 s, `power3.out` (the index's named "image settle 1.6 s in the Home hero"). Gated like every `data-m-now` effect, so after a curtain it starts as the curtain lifts.
   - `data-m="words"`: SplitText words (`aria: 'auto'`, headings only), opacity 0.25 → 1, staggered, scrubbed from `top 80%` to `top 35%`, **once** (Deviation 2). No `autoSplit`: word boxes do not change with the width.
   - `data-m-rise`: a per-element rise distance.
6. **Hero drift.** `data-m-parallax="7"` moves the `[data-m-media]` layer by `yPercent` of itself, so that layer is 17 % taller than the section (`inset: -8.5% 0`): 7 % of 117 % is 8.19 % of the section, no edge ever shows. The hook caps it at 4 below 1024. The settle scales an inner layer, so the two transforms never share an element.
7. **The statement's photograph uses `Frame` with `parallax` (6).** The kit expresses drift as a share of its 1.14× image: 6 % of the image is 6.84 % of the frame — the ±7 % asked for, the largest the kit allows without showing an edge.
8. **`usePageReady(heroReady)`**: the page is ready once the hero photograph has loaded (a layout-effect check catches a cached or preloaded file before React can hear its load event). The provider's 1200 ms cap still applies. Arriving from `/about` the curtain therefore lifts onto a finished photograph.
9. **The tagline is split and sentence-cased at run time** (`taglineLines`, exported and tested): one sentence per line, Title-cased words after the first lowered, acronyms kept. The last sentence is the one `<em>`. `studio.tagline` → "Designing spaces." / "Shaping experiences.".
10. **Meta, by width.** Phones: one caption line, principal · place (the role and the three words hidden). Tablet: a row of labels under a hairline. Desktop: a right-aligned stack in columns 10–12 with hairlines, bottom-aligned with the buttons. On desktop the three discipline words stack one per line, because a wrapped dot-separated row led its second line with a dot. Hairlines use `--ia-line-strong` (`#8E958D`): the dark tone's `#28342E` vanishes over the scrim.
11. **Statement layout.** Desktop rows are `auto 1fr`: the photograph spans both rows (starting 96 px below the eyebrow) and the second row absorbs its height. Without it both rows grew and the paragraph sat 128 px below the statement. The section is a light `Section` named "The practice" (its eyebrow; the `h2` is a 23-word sentence, too long as a landmark name).
12. **Both sections are named regions:** the hero by its `h1` (`aria-labelledby`), the statement by `aria-label`.
13. **No image is invented and no fact is hard-coded:** names, the role, the place and the three words come from `studio` / `studioContent`; the eyebrow's "Patna" is `studio.address.city`.

### Deviations from the prompt

1. **`opsz` 144 on the hero `h1`** instead of `font-optical-sizing: auto` (Decision 1). Without it the `h1` is three lines at 360 and 390 at the type table's size.
2. **The statement's words fill once.** A scrubbed tween runs backwards, so scrolling up faded the words to 25 % again. That is poor for someone scrolling back to re-read, and axe flagged it as a serious `color-contrast` failure on every width (`public-check` scrolls down and back). `once: true` keeps the scrub on the way down and retires the trigger at full opacity, like every other reveal ("ScrollTrigger … once").
3. **The LCP element is the hero's lede, not the photograph.** Chromium 158 (the session's browser) does not report an `<img>` that covers the whole viewport as an LCP candidate — Chrome documents this ("images that occupy the entire viewport are likely background"). Measured in a static probe: the same AVIF at 100 % of the viewport gives no entry; at 99 % height it is the LCP. A full-screen hero cannot be the reported LCP, and insetting it by a pixel to game the heuristic was rejected. What was verified instead: the photograph is fetched from the preload (initiator `link`) at ~205 ms and finished at ~680 ms, long before `main.js` finishes (~1300 ms), and it is on screen at mount (median 2.0 s at Fast 4G / 4× CPU, 390 px, DPR 3); the reported LCP (the lede, when it rises) has a median of 2.35 s, under 2.5 s. See Evidence and Open item 2.
4. **The italic Fraunces face is preloaded on `/`** in the same route-guarded script. The hero's accent line is italic; without the preload its face arrived after mount and the swap could reflow the headline.
5. **The static `keywords` meta in `index.html`** (the boot-time copy of the Home entry, written by prompt 04) loses "Best architects in Patna" and gains "Modern house elevation design", so it matches `pages.home` exactly.
6. **The service schema's `name` is "Services"** (was the Dulcey "Areas of Experience"), since its items are now the seven services. `/expertise` shares the entry and now lists the seven services too, as the prompt intends.
7. **From 1024 to 1279 px the two hero buttons run past column 5** into the empty columns 6–7 (one row, no shrinking). Columns 1–5 are 373 px wide at 1024 and the two buttons need 471 px; wrapped, the labels broke into three lines. From 1280 they fit in 1–5.
8. **Extra pieces:** the test file, `taglineLines`, `HERO_TITLE_ID`, `heroDisciplines`, `homeStatement`, `studio.principal.title`.
9. **`scripts/qa/parity.js` now also blocks `api.simplesvg.com` and `api.unisvg.com`.** Iconify falls back to them when `api.iconify.design` is refused; both answer from this container, so the first comparison run had the four Guidelines tabs at 768 showing tab icons on the baseline side only (4/34 differing, every difference the icon strip at y 171–201). With the hosts blocked, calibration and comparisons are clean (Evidence). The admin code has no diff.
10. **The regression pass and the measuring probes were driven with Playwright** (as in prompts 01–05); the scripts stayed in the session scratchpad.

### Evidence

- **`npm test -- --watchAll=false`:** 20 suites, **265 tests, all passing** (251 before + 12 Home + 2 content), no console output.
- **`npm run build`:** "Compiled successfully.", no warnings. Main JS 586,469 B (192,521 B gzip), against 518,611 / 175,178 after prompt 05 (+17.3 KB gzip): the image manifest that `Picture` reads (71.6 KB raw, ~8.9 KB gzip), SplitText (~3.7 KB gzip) and the motion hook, kit primitives and two sections (~4.7 KB). No new package. 23 JS files, as before; none contains `__lab`.
- **`h1`, measured** (font size / lines): 360 → 45.12 px / 2; 390 → 47.28 / 2; 768 → 74.50 / 2; 1024 → 92.93 / 2; 1280 → 111.36 / 2; 1440 → 122.88 / 2; 1920 → 136 / 2; 844 × 390 → 79.97 / 2; also 340 → 44 / 2. At 320 it is three lines (Open item 4).
- **Contrast over the photograph, worst pixel** (text hidden, each text run's box sampled, at scroll 0, 20 % and 40 % of the hero, 360 × 640 to 1920 × 1080 and 844 × 390; 110 runs): all pass. Ivory text ≥ 7.41:1 (eyebrow 7.41–10.45, first `h1` line 7.45–8.75, lede 9.02–9.79, ghost label 10.18–12.13); mist meta ≥ 5.83:1; the terracotta-300 accent line 4.21–4.46:1 (needs 3); the masthead line over the hero ≥ 4.94:1 ("Patna, Bihar" at 1920).
- **Performance** (production build on PHP, 390 px, DPR 3, Fast 4G, 4× CPU, cache off; 5 runs): LCP median **2352 ms** (2304–2360; the lede, Deviation 3); the photograph on screen median 2003 ms; CLS **0** in every run over a full wheel scroll; one hero file per load (`home-hero-tall-1080.avif`, 64 KB, initiator `link`, 202–228 → 667–689 ms; `main.js` 193–213 → 1296–1315 ms). `/about` and `/contact` request neither the hero nor the italic face; arriving at `/` from `/about` requests exactly one hero file.
- **Motion:** sampled every frame from mount (1440): the photograph 1.08 → 1 by ~1.4 s of wall time (the first ~150 ms of GSAP time pass during start-up work, under the splash); the lede's rise starts ~0.65 s in. All rises end at opacity 1 / 0 px; lines at 0. Resizing 1440 → 1024 → 390 at 350 ms: lines landed, masks intact, two lines. Reduced motion: no SplitText, no transform, nothing translucent except the buttons' resting hover fills. After a curtain (`/about` → dock "IN-ARCH — home"): the settle starts as the curtain lifts and finishes. The statement: 25 % at 85 % and 80 %, filling in order at 57 %, 100 % by 35 %, still 100 % at 20 % and when scrolled back.
- **60 fps at 4× CPU**, scrolling through both sections 12 px per frame: 390 px 161 frames, max 16.8 ms; 1440 px 154 frames, median 16.7 ms, 3 frames at 33 ms (the statement photograph's lazy decode).
- **The dock:** secondary (`data-yield`) while the hero's "Start a project" is visible at 768–1920; primary again once the hero has scrolled away; always primary below 768 (the hero has no primary there).
- **Hero actions:** at 1440 and 768, Enter and Space on "Start a project" open the sheet with "From: Home — hero"; Escape returns focus to it; the stored lead has `source: "home-hero"`, all 21 frozen keys plus `context_label`. At 390 "View selected work" goes through the curtain to `/portfolio`.
- **The seam:** the four old sections' `outerHTML` is byte-identical before and after at 390 and 1440, except the legacy glow's scroll-derived parallax offset (−2.8348 % vs −2.8308 %: the page above is a different height). Captured with the first old section snapped to a whole-pixel offset in both builds, 7 of 8 captures are identical within ±2 levels; the eighth (`WhoWeServe` at 1440) differs in 23 channel values (≤ 20 levels) on two card-corner edges.
- **`public-check` (production build on PHP, 10 routes × 7 widths + reduced motion): 81/90 clean.** The 9 failures are the pre-existing legacy `/contact` card-label contrast (prompt 01 Open item 7), the same as prompts 01–05. `/` is 9/9: no console errors, no failed requests, no overflow, zero serious or critical axe violations, every target ≥ 44 × 44 at ≤ 768 px.
- **`node scripts/qa/lead-flow.js`:** 37/37 at 390 and 37/37 at 1440.
- **Keyboard** (390 touch, 1440): skip link → masthead → dock → hero ("Start a project" from 768, "View selected work") → "Discover the studio" → old sections → footer; every stop has a 2 px ring (terracotta-300 on dark, ivory on the ghost button as the kit defines, terracotta-700 on light, the old pages' red on the old sections); no focused control is ever under the visible dock.
- **Accessibility tree:** one `h1` ("Designing spaces. Shaping experiences.", kept as one label by SplitText), then `h2`s in order; `header`, `main`, three `nav`s and `footer`; the two new sections are named regions; both photographs have their manifest alt text.
- **Admin parity, baseline against this branch:** calibration 34/34; with the fallback hosts blocked, three comparison runs: 34/34, 33/34, 34/34. The 33/34 run's one difference is `dashboard-768`, where the **baseline** "never showed the seeded leads" — the pre-existing dashboard race (prompt 03 Open item 1).
- **Regression pass** (production build on PHP, Playwright; **55/55**): nine routes at 390 and 1440 with the right titles and robots (Home "In-Arch Architects & Interior Designer | Architects in Patna, Bihar" with the 7-service schema; `index, follow` on the old pages; `noindex` on the pending routes and the 404), one `h1`, landmarks, no overflow, no console errors; `/expertise#e03` opens and lands; the old wrapper is outside `ia`; the expertise rows link to `#e01`…`#e10` and one lands on `#e03`; the sector cards link to `/industries`; the closing CTA dials the legacy number and opens the sheet (`home-cta`, an enquiry stored); the sheet from `home-hero`, `dock-cta`, `footer-cta` and `home-cta` traps focus, closes on Escape, returns focus and unlocks scroll; admin with 12 leads: redirect to login, login, dashboard counts and the new lead (title unchanged), dashboard CSV export, search, all four filters, sorting both ways, pagination (11–12 of 12), inline status (saved), bulk select and its cancelled dialog, CSV export and import ("Imported 0 leads (12 duplicates skipped)"), row delete (Cancel keeps, Delete removes), the detail page with every field, a note and a status change (both saved), the Guidelines gate and its four tabs, logout; no page errors.
- Every test lead and the parity seeds were deleted: all stores ended empty (`public/api/data/` was never created).

### Open items

1. **Prompt 07:** replace the four old sections and delete them with the wrapper and `HomePage.module.css`. The seam is visible until then, as expected. The old closing CTA still dials the Dulcey number from the legacy config.
2. **Prompt 18:** under Chrome's full-viewport heuristic the reported LCP on `/` is text (the hero's lede, when it rises), median 2.35 s at Fast 4G / 4× CPU — about 0.15 s inside the budget, and set mostly by the main bundle's execution (mount ≈ 2.0 s). Prompt 14's MUI split should move mount earlier. If the budget needs more: the image manifest (~8.9 KB gzip) now ships in the main bundle because Home is eager; a per-route manifest would remove it. `perf-check.js` should measure the hero photograph's paint as well (Element Timing needs `elementtiming` on the `<img>`, which `Picture` does not forward today).
3. **Prompt 16:** the hero photograph reads dark on desktop. The copy covers ~70 % of the hero's height and the accent line (terracotta-300 at ≥ 3:1) needs ≥ .70 forest over the white panel. Lighter is only possible with a darker or differently cropped photograph, or less copy over the bright panel.
4. **Prompt 17:** at 320 px the `h1` is three lines ("Shaping / experiences."). The 2xl step's floor is 44 px, where the accent line measures 295 px against 282 px of column. Two lines there would need a lower floor for the step below 360 px (a token change).
5. **Prompt 19:** at 1024–1279 the hero's two buttons extend past column 5 (Deviation 7); check it reads well in the CTA review.
6. No VoiceOver or NVDA in this session: the accessibility tree and axe were checked instead. `npm audit` advisories in CRA 5's tree are unchanged.

---

## 2026-11-28 — Prompt 07: Home — remaining sections

**Branch:** `claude/beautiful-keller-h7no39`, from `596b45c` (prompt 06 merged). **Baseline:** `cc2fc52d90987adcf62a5c286c4eb87d155fc3f3`, served from `../inarch-baseline` on port 8081 for parity (removed afterwards). The prompt-06 build (`596b45c`) was built in a scratchpad worktree and served on port 8090 for the byte, LCP and frame comparisons.

**Starting state, confirmed:**
- Prompts 01–06 are done: `HomePage` rendered the hero and the statement inside `ia`, then the four old sections in a non-scoped wrapper; the kit (`Section`, `ProjectTile`, `FactList`, `IconButton`, `TextLink`, `LineIcon`, `Rule`), `useMotionScope`, the shell (dock yield on `[data-primary-cta]`, `TLink`, `usePageReady`), the lead modal with `context.label`, and the data (`projects`, `services`, `process` with `phases`, `studioContent`, `studio`).
- Owner decisions read from `00_INDEX.md` §12. None conflicts with the data in `src/data/`, so nothing needed reconciling. Applied here: D-11 (the principal block is typographic: no portrait, quotation, registration number or years), D-07 (tiles show no location, year, area or client), D-06 (the seven services as listed), D-03 (no email link in the closing), D-17 (`/industries` is no longer linked from Home and still resolves). No new content gap was found, so `00_INDEX.md` is unchanged.

### Files

**Created**

| Area | Files |
|---|---|
| Sections | `src/pages/Home/sections/SelectedWorkSection`, `StatementSection`, `ServicesIndexSection`, `HowWeWorkSection`, `PrincipalSection`, `ClosingSection` (each `.jsx` + `.module.css`) |
| Tests | `src/pages/Home/__tests__/HomeSections.test.jsx` (15 tests) |

**Rewritten:** `src/pages/Home/HomePage.jsx` (one `ia` root, eight sections).

**Changed**

- `src/data/studioContent.js`: `homeBelief` (PDF §10 B: "every space tells a story", and "Residential · Commercial · Interiors" from the second sentence), `homeCredentials` (PDF §3: the three lines, as label / value), `homeClosing` (PDF §10 E in sentence case); all on the default export. `src/data/__tests__/content.test.js`: three tests tying them to the PDF wording.
- `src/components/ui/Frame/Frame.jsx` + `.module.css`: `ratioLg` (Deviation 1). `src/components/ui/ProjectTile/ProjectTile.jsx`: `ratioLg`, `art`, `rise` (Deviation 1).
- `src/motion/useMotionScope.js` (`linesClass: 'ia-split-line'`, exported `SPLIT_LINE_CLASS`) and `src/styles/inarch/type.css` (`.ia-split-line-mask`) — Deviation 2.
- `src/config/seo.js`: a comment on the Home entry only (Decision 12).
- `CHANGELOG.md`.

**Deleted:** `src/pages/Home/sections/BeliefSection.jsx` + `.module.css`, `ExpertiseIndexSection.jsx` + `.module.css`, `WhoWeServeSection.jsx` + `.module.css`, `ClosingCtaSection.jsx` + `.module.css`; `src/pages/Home/HomePage.module.css`. A search found no other importer of them; nothing imports `marqueeItems` or `homeTaglineFor` any more (`expertiseData.js` and `industriesData.js` stay for the old Expertise and Who We Serve pages and the admin). `src/animations/` and `src/styles/layout.module.css` lose their Home consumers but are still used by the old About and Expertise pages (prompt 14 retires them).

**Admin-frozen check:** `git diff --stat cc2fc52… -- src/admin src/theme src/styles/variables.css src/styles/global.css src/styles/animations.css src/styles/responsive.css src/styles/dulcey.css src/App.css src/hooks/useMediaQuery.js public/api .env .env.example` prints nothing. `siteConfig.js`, `expertiseData.js`, `industriesData.js`, `webhookSubmit.js`, the shell and `App.jsx` show no diff; every admin-bound value is unchanged.

### Decisions

1. **The tiles' index is the project's portfolio number** (02, 05, 07), not 1–3: it is the same number the portfolio listing and the case study will show. The row's counter counts positions ("1 / 3") separately.
2. **The swipe row.**
   - Full-bleed (`margin-inline: -gutter`, the leading gutter as padding, `scroll-padding-inline: gutter`), `scroll-snap-type: x mandatory`, `overflow-y: hidden`, `overscroll-behavior-x: contain` (no back-swipe at the ends; vertical gestures still reach the page), scrollbar hidden.
   - A trailing `::after` spacer (`100% − tile − gap` of the row's content box) lets every tile — the last one too — come to rest on the gutter, so each step is exactly one tile (320 px at 390, 362 px at 768). Without it the 768 px row had only two snap positions for three tiles.
   - The counter is computed from the scroll position (nearest tile start, rAF-throttled, also on resize), so finger, buttons and keyboard focus all update it. It is a polite, atomic live region whose visible text ("1 / 3") is `aria-hidden` and whose announced text is "Project 1 of 3".
   - Previous / next use `aria-disabled`, not `disabled`, at the ends: a native disabled button would drop keyboard focus to `<body>` the moment the last press disables it. Activation is swallowed by the kit.
   - The row has 8 px block padding so the tiles' focus rings (3 px offset) are not clipped by the scroll box.
   - Buttons scroll with `behavior: 'smooth'`, or `'auto'` under reduced motion.
3. **Desktop tiles:** B and C are 4:5 below 1024 (the row) and 3:2 from 1024, with the 3:2 cover (`cover.wide`) art-directed in at the same width, so the frame and the crop change together. C's "96 px below A's bottom edge" is a second grid row with `margin-top: 96px` and `row-gap: 0`: A (5 columns, 4:5) is always taller than B (6 columns, 3:2) plus its 128 px offset — 1.25·w₅ against 0.67·w₆ + 128 at every width from 1024.
4. **The ledger.** Phones: the number beside the title's first line, the tagline under the title, the arrow on the right; tablet the same, wider; desktop titles at display-md (weight 300 from 1177 px, as `type.css` does); from 1280 the tagline moves beside the title (`display: contents` on the text block, columns `4rem 1.7fr 1fr 20px`). The row is a kit link (`useLinkComponent`), so it gets the curtain and chunk preloading.
5. **The ledger preview** is rendered only while `(min-width: 1024px) and (hover: hover) and (pointer: fine)` matches (`useMatchMedia` from the shell), so on touch its seven icons are never requested. The slot (columns 10–12) is always reserved and `position: sticky` at mid-screen, the seven 160 px icons are stacked absolutely and cross-fade on `opacity` (240 ms). A row shows its icon on `pointerenter` and `focus`; leaving the ledger with the mouse, or focus leaving it, clears it. Measured: no row moves by a pixel.
6. **How we work.** The phase numerals are `display-md` in `--ia-accent-display` (terracotta-500 on sand, 3.36:1 — large text, ≥ 26 px at 360). Tablet (unspecified) is two by two with the second column 24 px lower. Each step title is `nowrap`, so "Design Development" never splits; the accent "detail-oriented" is `nowrap`, because without SplitText (reduced motion) the balanced headline broke at its hyphen. "See the full seven-step process" derives "seven" from `processSteps.length`; the services lede keeps the prompt's "Seven" verbatim, and a test ties it to `services.length`.
7. **The principal.** The `h2` is `studio.principal.name` split at its last word ("Ar. Mohammad *Hassanuddin.*"), the label `studio.principal.role`, the facts a `FactList` of `homeCredentials` (two pairs share the term "Registered Architect", so each carries a `key`). On desktop the facts column starts at the top of the name (the eyebrow's line plus its margin), so its first rule lines up with the name's cap line.
8. **The closing clears the dock.** Its bottom padding is `max(--ia-section-y, --ia-dock-clearance + 24 px + safe area)`. With the band's foot at the screen's foot the last link is 53 px above the dock at 390 (it would have been about 16 px with the standard 83 px padding) and 95 px at 1440. The section is otherwise sized by `min-height: 70svh`, with the copy at its foot (bottom-left on phones, columns 1–8 on desktop). WhatsApp uses `WHATSAPP_GREETING` from `Dock.jsx` (one greeting site-wide) and opens in a new tab; the call link reads "Call " + `studio.phoneDisplay`.
9. **The belief's 48 px rule uses `--ia-line-strong`** (mist-2, 5.54:1 on forest): the dark tone's own hairline (forest-3) all but disappears at that length. It draws from the left (`data-m="rule"`), `aria-hidden`.
10. **No business fact is typed into a component.** The project slugs are listed once (`FEATURED_SLUGS`) and every href, title, category and image comes from `projects.js`; `/expertise#e0N` comes from each service's `id`; the Interior Design link label from `NAV_LINKS`; the name, role, phone and WhatsApp from `studio`.
11. **One primary per viewport:** the closing's "Start a conversation" carries `data-primary-cta`; every other control in the six sections is a secondary button, an icon button or a text link. The dock is secondary while the closing button is ≥ 60 % visible and primary again over the ledger (measured at 390 and 1440).
12. **SEO:** `pages.home` (prompt 06: PDF §12 title and description, the seven-service schema) already describes the finished page, so only its comment changes; no route is new, so `ROUTE_MAP` is untouched.

### Deviations from the prompt

1. **Kit extension (not in the prompt's file list).** `Frame` takes `ratioLg`, a second ratio from 1024 px (`--frame-ratio-lg`); `ProjectTile` takes `ratioLg`, `art` (passed to `Picture`) and `rise` (`data-m="rise"` on its meta and title rows, for "titles `data-m="rise"`"). All additive: every existing call passes none of the new props and renders exactly as before (the Lab's demos were not re-checked in a dev server). Without them a tile could not be 4:5 on phones and 3:2 on desktop, nor its title rise.
2. **Headline masks no longer clip descenders** (`useMotionScope.js`, `type.css`). Found by eye: SplitText's line masks are `overflow: clip` at the line box, and at 1.02–1.08 Fraunces descenders reach ~0.10–0.13em below it, so "Every spa**c**e"'s *y* and *p* stayed cut after the reveal had finished (also, less visibly, in the hero and every `lines` heading). The lines now carry `ia-split-line`, so SplitText names each mask `ia-split-line-mask`, and `type.css` gives the mask `padding-bottom: 0.16em; margin-bottom: -0.16em` — no layout change. A line waiting at `yPercent: 110` still starts below the enlarged clip: measured at 390, the line sits 47.0 px down in a 49.4 px clip, i.e. only the empty top 2.4 px of its box (above the ascenders) is inside it.
3. **Extra data and tests:** `homeBelief`, `homeCredentials`, `homeClosing` in `studioContent.js` (the prompt's wording, held in the data layer as prompt 06 did for its lines) and their content tests; the section test file.
4. **Layouts the prompt leaves open:** the process at tablet (two by two, the second column 24 px lower) and the ledger's tagline beside the title from 1280 px.
5. **The closing's bottom padding grows on phones for the dock** (Decision 8). "Sections 4 and 8 use `minHeight` instead of extra padding" is kept for their height; the padding is dock clearance, which the QA list requires (≥ 24 px).
6. **`src/pages/Home` also holds `index.js`** (the route's re-export, unchanged) **and `__tests__/`** besides the page file and the eight sections.
7. **The regression pass and the measuring probes were driven with Playwright** (as in prompts 01–06); the scripts stayed in the session scratchpad.

### Evidence

- **`npm test -- --watchAll=false`:** 21 suites, **283 tests, all passing** (265 before + 15 Home + 3 content), no console output.
- **`npm run build`:** "Compiled successfully.", no warnings. Main JS 601,241 B raw (CRA: 197.45 kB gzip), against 586,469 B after prompt 06. 23 JS files, as before; none contains `__lab`.
- **JavaScript requested for `/`** (390 px, cache off; the files' gzip -9 sizes): **200,126 B against 195,486 B** for the prompt-06 build — **+4.6 KB**, within the 12 KB budget (main + the one route chunk, `/` requests no others).
- **`public-check` (production build on PHP, 10 routes × 7 widths + reduced motion): 81/90 clean.** The 9 failures are the pre-existing legacy `/contact` card-label contrast (prompt 01 Open item 7), the same as prompts 01–06. `/` is **9/9** (re-run on the final build): no console errors, no failed requests, no overflow, zero serious or critical axe violations, every target ≥ 44 × 44 at ≤ 768 px.
- **`node scripts/qa/lead-flow.js`:** 37/37 at 390 and 37/37 at 1440.
- **Admin parity:** calibration (baseline against itself) 34/34; **baseline against this branch 34/34 identical**, 0 pixels and 0 digest differences.
- **Interaction suite (Playwright, 82/82):**
  - *Row, 390 (touch):* tiles 304 px (78vw), the first on the gutter, the next peeking 48 px; next moves exactly one tile (320 px) twice; the counter reads 1 → 2 → 3 of 3; next is `aria-disabled` at the end and a forced press does nothing; the last tile rests on the gutter; Enter on previous goes back and focus stays on the now-disabled button, Space then does nothing; a 70 % programmatic scroll snaps to a tile; a horizontal touch drag snaps one tile without moving the page, the counter follows; a vertical touch drag on the row scrolls the page 235 px and leaves the row still; focusing the third tile by keyboard brings it fully into view and the counter follows.
  - *Row, 768:* the same with 338 px tiles (44vw) and 362 px steps.
  - *Ledger, 1440 (fine pointer):* seven rows, 134–165 px tall, hrefs `#e01`…`#e07`; hover on row 3 shows `service-e03-residential` at 160 px, in view, the other six at opacity 0, the title at `translateX(8px)`, no row moved; leaving hides it; focus on row 5 shows `service-e05-visualisation`; clicking row 3 lands on `/expertise#e03` with the old accordion item 32 px from the top. At 1024 on touch no preview icon exists.
  - *Closing, 390 and 1440:* the dock is secondary while "Start a conversation" is in view and primary again over the ledger; WhatsApp `https://wa.me/917292831128?text=Hello%20IN-ARCH…` with `target="_blank"` and `noopener`; `tel:+917292831128` "Call +91 72928 31128"; the sheet opens with "Home — closing", a submitted lead carries `source: "home-closing"` and `context_label: "Home — closing"` (request intercepted, nothing stored), Escape returns focus to the button. The last link clears the dock by 53 / 95 px (Decision 8).
  - `/about#principal` loads without errors (the old page has no `#principal` yet; Open item 1).
- **Layout, 360 / 390 / 768 / 1024 / 1280 / 1440 / 1920 and 844 × 390:** every section looked at in viewport frames after a real scroll; no console errors; no element of `main` extends past the viewport (the row's own off-screen tiles excepted); no text below 12 px (labels); tones dark → light → sand → dark → light → sand → light → dark; each section a different layout.
- **Keyboard** (390 touch, 1440): logical order hero → statement → work → ledger → process → principal → closing → footer; every stop has a 2 px solid ring (terracotta-700 at 3 px on light and sand, terracotta-300 on dark; 2 px offset on text links); the row's buttons are reachable on phones and absent on desktop; **no focused control under the visible dock**.
- **Accessibility tree:** one `h1`; seven `h2` in order, each naming its region (the statement keeps its `aria-label`); tiles, ledger rows and phases are `h3` inside lists; link names read with spaces ("02 Interior Design Living Room with Arched Niches"); the facts are term / definition pairs; the counter is a polite live region; the row buttons report `[disabled]` via `aria-disabled`.
- **Contrast** (none of the new text sits on a photograph): phase numerals terracotta-500 on sand 3.36:1 (display, ≥ 26 px); accents terracotta-500 on ivory 3.75:1 and on sand 3.36:1 (display); ledger numbers terracotta-700 on ivory 5.77:1; tile indexes on sand 5.17:1; taglines and step titles ink-2 7.30–8.15:1; the belief label mist on forest 8.93:1; the rule mist-2 5.54:1; the closing accent terracotta-300 7.74:1. Axe reports nothing on `/`.
- **Reduced motion** (390, 1440, without scrolling): every `[data-m]` element at opacity 1 with no transform and no inline motion style, shutter covers resting off the images, no SplitText; viewport frames checked.
- **Performance** (390 px, DPR 3, 9 Mbps / 150 ms, 4× CPU, cache off): **CLS 0.0000** in every run over a full scroll; every below-the-fold image `loading="lazy"` with `width` / `height` and a `sizes` (the hero alone eager); **LCP median 2352 ms against 2264 ms** for the prompt-06 build (5 alternating runs each; both have the same 2.7–2.8 s outliers; still the hero's lede, prompt 06 Deviation 3). No photograph appears twice: `home-hero` (ph08), `home-intro` (ph06), `pr-arches` (ph14), `pr-black` (ph02), `pr-pooja` (ph09).
- **60 fps at 4× CPU**, prompt 06's method (12 px per frame, the whole page): 390 px 688 frames, median and p95 16.7 / 16.8 ms, one 33 ms frame (prompt-06 build: 517 frames, one); 1440 px 743 frames, p95 16.8 ms, three long frames, the worst 50 ms as the work tiles open (prompt-06 build: 435 frames, four). A harsher wheel-driven run (120 px wheel steps) shows 20–36 single dropped frames on this build against 11 on the prompt-06 build; under reduced motion it shows 0–2, so they are the reveals starting (Open item 3).
- **Regression pass** (production build on PHP, Playwright; **53/53**): the nine routes at 390 and 1440 with one `h1`, `main` / `nav` / `footer`, no overflow, no console errors and the right robots (`index, follow` on the old pages; `noindex` on the pending routes and the 404; the old pages still carry their Dulcey titles until their prompts); the sheet from `home-hero`, `home-closing`, `dock-cta` and `footer-cta` (focus inside, scroll locked, Escape closes, focus and scroll restored); an enquiry through the sheet from the closing with all 21 frozen keys (+ `context_label`), `source: home-closing`, `status: new`, `state` empty, success shown; the same mobile through `/contact` → `duplicate: true` and the "already received" notice; a fresh mobile through `/contact` stored; admin with 13 leads: redirect to login, login, dashboard with the new lead in Recent Enquiries and the counts, dashboard CSV export, search (exactly one row), all four filters (Source, Interested In with "Residential Architecture", Status, Date Range) and Clear All, sorting by Name both ways, pagination ("11–13 of 13"), inline status (saved `contacted`), bulk select and its cancelled dialog, CSV export (contains the lead) and import ("Imported 0 leads (13 duplicates skipped)"), row delete (Cancel keeps, Delete removes), the detail page (name, mobile, email, interested-in, message, source, page URL), a note and a status change (both saved), the Guidelines gate and its four tabs, logout; no page errors.
- `grep -ri "dulcey\|beyond business\|pharma" src/pages/Home` returns nothing. Every test lead and the parity seeds were deleted: the stores ended empty (`public/api/data/` was never created).

### Open items

1. **Prompts 08 and 09 must supply the anchors Home now links to:** `/about#principal` (the Studio page's principal section) and `/expertise#process` (the seven-step process), plus `#e01`–`#e07` on the new Expertise page. Until then both URLs resolve and stay at the top, without an error.
2. **Prompts 11 and 12:** `ProjectTile` now has `ratioLg`, `art` and `rise`; the three Home tiles link to case-study URLs that still render the interim page.
3. **Prompt 16 (motion and imagery):**
   - Under fast wheel scrolling at 4× CPU the reveals (shutters with their 1.12 → 1 image scale, line splits, batched rises) cost single 33–50 ms frames as they start; prompt 06's 12 px-per-frame method stays at 60 fps.
   - `LineIcon` still fetches on mount (prompt 03 Open item 7): Home's four process icons are requested at ~1.9 s on Fast 4G, after the hero.
   - The swipe row's third photograph is lazy and clipped by the scroller, so Chrome fetches it only as it nears; it fades in over its placeholder when swiped to.
4. **Prompt 17:** check the swipe row's momentum and snapping on real iOS Safari and Android Chrome, and the ledger preview on an iPad with a trackpad (it reports `hover: hover` and `pointer: fine`, so it will show the preview from 1024 px).
5. **Prompt 19:** Home's in-page primaries are the hero's "Start a project" (from 768 px) and the closing's "Start a conversation"; the dock steps down for both.
6. No VoiceOver or NVDA in this session: the accessibility tree and axe were checked instead. `npm audit` advisories in CRA 5's tree are unchanged.

---

## 2026-11-28 — Prompt 08: Studio / About

**Branch:** `claude/peaceful-newton-qi7ig2`, from `117906f` (prompt 07 merged). **Baseline:** `cc2fc52d90987adcf62a5c286c4eb87d155fc3f3`, built in a scratchpad worktree and served on port 8081 for parity (removed afterwards). The prompt-07 build (`117906f`) was built in place for the bundle comparison.

**Starting state, confirmed:**
- Prompts 01–07 are done: the kit (`Section`, `Grid` / `Col`, `Eyebrow`, `Heading`, `Lede`, `Frame`, `Picture`, `FactList`, `Logo`, `Rule`, `Button`, `TextLink`, `VisuallyHidden`), `useMotionScope` with `data-m-now` and the reveal gate, the shell (`usePageReady`, masthead tone from the first section, the dock's `data-primary-cta` yield), the lead modal with `context.label`, `studioContent` (about, vision, mission, philosophy, principal) and the image keys `studio-band-wide`, `studio-band-tall`, `studio-detail` (prompt 02 kept `studio-detail`, with a tighter box). Home's "About the principal" link already pointed at `/about#principal` (prompt 07 Open item 1).
- Owner decisions read from `00_INDEX.md` §12. None conflicts with the data in `src/data/`, so nothing needed reconciling. I compared `studioContent` with `pdftotext -layout` of the PDF: §2 and §3 match word for word. Applied here:
  - D-11: typographic plate, no portrait, no quotation;
  - D-23: Zenith without dates;
  - D-03: no email row;
  - D-04: the address as it stands;
  - D-14: "From 10:00 AM";
  - D-16: name-based directions.
- No new content gap was found, so `00_INDEX.md` is unchanged.

### Files

**Created**

| Area | Files |
|---|---|
| Page | `src/pages/Studio/StudioPage.jsx`, `StudioPage.module.css`, `index.js` |
| Sections | `src/pages/Studio/sections/StudioHero`, `AboutSection`, `PhilosophySection`, `VisionMissionSection`, `PrincipalSection`, `VisitSection` (each `.jsx` + `.module.css`) |
| Tests | `src/pages/Studio/__tests__/StudioPage.test.jsx` (17 tests) |

**Changed**

- `src/App.jsx`: `/about` lazy-loads `./pages/Studio/StudioPage` through the same `lazyWithPreload` / `lazyRoute`, and `ROUTE_PRELOADS` uses its `preload()`. The header comment names the page.
- `src/config/seo.js`: `pages.about` and the header comment. `ROUTE_MAP` in `SEOHead.jsx` is untouched (the route is not new).
- `src/components/ui/Frame/Frame.jsx` + `.module.css`: `ratioMd` and the `4/3` ratio (Deviation 1).
- `CHANGELOG.md`.

**Deleted:** `src/pages/About/` (`AboutPage.jsx`, `AboutPage.module.css`, `index.js`, and the six section pairs `HeroSection`, `IntersectionSection`, `PerspectiveSection`, `DifferenceSection`, `PrinciplesSection`, `CommitmentSection`). Before deleting, a search found no importer other than `App.jsx`.

**Admin-frozen check:** `git diff --stat cc2fc52… -- src/admin src/theme src/styles/variables.css src/styles/global.css src/styles/animations.css src/styles/responsive.css src/styles/dulcey.css src/App.css src/hooks/useMediaQuery.js public/api .env .env.example` prints nothing. `siteConfig.js`, `studioContent.js`, `expertiseData.js` and `webhookSubmit.js` have no diff, so every admin-bound value is unchanged.

### Decisions

1. **The statement is the biography's last paragraph.** The prompt's statement ("He believes in continuously improving design skills…") is `principal.bio[4]` verbatim. It is therefore set apart once, in display-sm, and the prose shows `bio[0–3]`; repeating it would say it twice. It is a `<p>`, not a `<blockquote>` or `<q>`, with no quotation marks.
2. **The hero band opens with the page when it is on the first screen.** A layout effect, declared before the section's `useMotionScope` so it runs first, gives the band `data-m-now` if its top is inside the viewport at mount.
   - This holds on portrait phones, tablets and desktops (band top 431 px at 390 × 844, 534 at 1440 × 900). Its shutter then waits for the page curtain like the hero's lines, with a 0.55 s delay after the lede.
   - Where the band starts below the fold (844 × 390, top 524) it keeps its scroll trigger and opens as it enters.
   - Without this, a scroll-triggered shutter that is in view at load plays *under* the curtain after a transition (see Open item 2).
3. **`usePageReady()` with no argument.** The page is ready as soon as it mounts, as the prompt says. The first screen is type, and the band's shutter opens after the curtain lifts, so the curtain is not held for the photograph.
4. **The hero copy.**
   - The `h1` is "Design with `<br>` *purpose.*", always two lines. On desktop the lede beside it then never meets a long first line.
   - The lede names the place from `studio.address` (`heroLede()`), never typed.
   - From 1024 px the `h1` (columns 1–8) and the lede (8–12) share grid row 1. The `h1` needs an explicit `start: 1`: auto-placed, it could not share column 8 and was pushed into implicit columns, which the first desktop screenshot showed.
   - The lede's last baseline sits on the `h1`'s. A `calc()` margin covers the two faces' descent and half-leading (about 5 px).
5. **One sticky offset for the page.**
   - `StudioPage.module.css` defines `--studio-sticky-top: 120px` and `--studio-sticky-room` (`100svh` minus the offset and `--ia-dock-clearance`).
   - The philosophy panel's 4:5 frame is `min(100%, (room − numeral − 24 px) × 0.8)` wide. The principal's slot is `min(100%, room × 0.8)`.
   - Both therefore always fit between the offset and the dock. Measured: panel 552 / 504 / 684 / 864 px in a room of 552 / 504 / 684 / 864 px at 1024 × 768, 1280 × 720, 1440 × 900 and 1920 × 1080.
   - Each sticky element sits in a column that stretches to its grid area, so it is released where the content ends. It is CSS `position: sticky` only, from 1024 px; nothing is pinned.
6. **The numeral cross-fade.**
   - An `IntersectionObserver` with `rootMargin: '-50% 0px -50% 0px'` (a zero-height line across the middle of the viewport) marks the principle crossing the middle.
   - The four numerals share one grid cell, and only `[data-current]` is opaque, through a CSS opacity transition of 400 ms in-out. Under reduced motion there is no transition, so the numeral simply switches.
   - No tween and no scroll listener are involved. This follows Home's ledger preview (prompt 07), which also cross-fades with CSS on state.
   - The panel's numerals are `aria-hidden`. The list is an `<ol>` whose visible numbers are decorative too.
7. **The philosophy panel exists from 1024 px only** (`display: none` below). Its `studio-detail` image is lazy, so it is never requested on phones. From 1024 the list items' numerals step down to a label: the panel carries the large one.
8. **Vision.**
   - The `h2`'s one italic phrase is the sentence's own last clause, "meaningful built environments.", and the words are unchanged (`visionParts()`, tested).
   - "Max 22 words per measure" is read as a `22em` max-width: about columns 1–9 at 44 px.
   - The section is named "Vision and mission" by `aria-label`, because its `h2` is a 26-word sentence.
9. **Sub-headings are `h3`s set as labels:** "Mission", "Credentials", "Experience", "Education", "Talk", "Visit". The ending has no visible headline, so a visually hidden `h2`, "Visit and talk", names it and keeps the heading order.
10. **Credentials.** `credentialFacts()` splits each PDF line at its first comma ("Registered Architect" / "Council of Architecture, India") and drops the closing full stop, as prompt 02 did for labels. A test re-joins every pair to the PDF line.
11. **The experience table.**
    - It is a `<table>` with explicit `role`s on the table, rows and cells (the redundant `rowgroup` roles were removed after a lint warning). It keeps its semantics when `display` changes: 6 rows and 3 column headers in the accessibility tree at 360, 390, 1024 and 1440.
    - Below 1280 px it reflows to stacked rows: the organisation, then "role · period". The column there is too narrow for three columns (348 px at 390, 453 px at 1024).
    - The empty Zenith period cell is hidden in the stacked layout and stays an empty cell in the table.
    - The "·" separator is CSS content with an empty alternative text where supported.
    - No horizontal scroll at any width (`scrollWidth = clientWidth`).
12. **The principal's layout.**
    - Phones: eyebrow, then the slot, then the name. From 768 the slot spans two explicit grid rows beside the eyebrow and the text: columns 1–3 / 4–8 on tablets, 1–5 / 7–12 on desktop.
    - The plate is `data-tone="dark"` and `aria-hidden`: it is decorative, and the role follows the name in text. Its "IA" mark is the dark-tone `Logo` at 72 px with `alt=""`.
    - A portrait's alt text is the principal's name.
13. **Short phones keep the name above the dock on `/about#principal`.** At 360 × 640 and 375 × 667 the full-width 4:5 slot put the name under the dock (name bottom 667 / 688 against dock top 572 / 599).
    - Below 768 px the slot is now `min(100%, (100svh − section padding − dock clearance − 12rem) × 0.8)` wide. It narrows only on screens under about 790 px tall (218 px wide at 360 × 640) and stays full width at 360 × 800, 390 × 844 and 412 × 915.
14. **The ending.**
    - Talk comes first in the DOM, as on phones. From 768 px Visit is placed on the left (both on grid row 1). The two groups are independent, so the tab order (Talk, then Visit) does not change meaning.
    - "Talk to the studio" is a secondary `Button` without `data-primary-cta`, as the prompt asks, so the dock's "Start a project" stays the primary action on this page.
    - New-tab links carry a visually hidden " (opens in a new tab)"; the kit adds `rel="noopener noreferrer"`.
    - The bottom padding is `max(section rhythm, dock clearance + 24 px + safe area)`, as on Home's closing.
15. **SEO.** The title goes through the site template, giving "About In-Arch Architects, Patna | IN-ARCH" (as prompt 04 did for the other PDF §12 titles). The description is the prompt's, and the keywords are three PDF §12 terms the page supports. The breadcrumb is `navLabel('/about')`, "Studio".
16. **`nameParts` comes from Home's `PrincipalSection`.** Home is eager, so the import costs the Studio chunk nothing.
17. **Bundle.**
    - Main JS grows from 601,241 B (196,795 B gzip, the prompt-07 build in place) to 606,277 B (198,023 B gzip), **+1.2 KB gzip**.
    - The source maps list the same modules in both mains; only `Frame.jsx`, `seo.js` and `App.jsx` differ. No Studio module is in main.
    - The growth is webpack's module wrappers: `Section`, `Rule`, `FactList`, `Lede`, `Container`, `Frame` and the motion hook were scope-hoisted into main while only main used them. Now the Studio chunk imports them too, so each is emitted as a shared module. Every later page that uses the kit shares this cost.
    - The Studio chunk is 4,529 B JS + 2,855 B CSS gzip. There are 23 JS files, as before (the old About chunk is replaced). No chunk contains `__lab`.

### Deviations from the prompt

1. **Kit extension (not in the file list).** `Frame` takes `ratioMd` (another ratio from 768 px) and accepts `4/3`. Without them the band could not be 4:3 on phones and 21:9 from 768 in one frame. Both are additive: no existing call passes `ratioMd`, and the CSS falls back level by level.
2. **The SEO title carries the site template's suffix** ("… | IN-ARCH"), like every other IN-ARCH page title (Decision 15).
3. **The hero band's shutter plays with the page when the band is on the first screen** rather than strictly "as it enters" (Decision 2). Below the fold it does open as it enters.
4. **The statement is not repeated in the biography prose** (Decision 1).
5. **The vision `h2` gets one italic phrase** (Decision 8). The prompt gives no accent for it, but every headline carries one.
6. **The experience table stacks below 1280 px**, not only on phones (Decision 11).
7. **The portrait slot narrows on short phones** so the deep link shows the name (Decision 13). It is still full width on phones of usual height.
8. **Extra pieces:** the test file; the exports `heroLede`, `studioPlace`, `aboutProse`, `visionParts`, `biography`, `credentialFacts`, `educationLines`, `CLOSING_SOURCE` and the title ids.
9. **The QA passes were driven with Playwright** (as in prompts 01–07). The scripts stayed in the session scratchpad.

### Evidence

- **`npm test -- --watchAll=false`:** 22 suites, **300 tests, all passing** (283 before + 17 Studio).
- **`npm run build`:** "Compiled successfully.", no warnings (sizes in Decision 17).
- **Content against the PDF** (`pdftotext -layout`):
  - The tests tie every block to `studioContent`, verbatim: about[1–4], the four principles, the vision, the five mission points, bio[0–4], the five credentials, the experience in the PDF's order and the education.
  - Rendered page: of 68 text blocks, 45 are found in the PDF and 23 are the prompt's own wording or `studio` facts (eyebrows, headings, labels, the address, hours and phone). Nothing else appears.
  - No quotation marks, years of experience, founding year, team, client list, rating or email on the page.
- **`public-check`** (production build on PHP, 10 routes × 7 widths + reduced motion): **81/90 clean**, and `/about` is **9/9**.
  - The 9 failures are the pre-existing legacy `/contact` card-label contrast (prompt 01 Open item 7), the same as prompts 01–07.
  - `/about` was re-run after the last CSS change: 9/9.
- **Layout** at 360 × 800, 390 × 844, 768 × 1024, 1024 × 768, 1280 × 720, 1440 × 900, 1920 × 1080 and 844 × 390:
  - The `h1` is two lines at every width (40.3 → 104 px).
  - No element of `main` reaches past the viewport, and there is no horizontal scroll.
  - The hero copy starts 120 / 152 / 192 px from the top, clear of the masthead.
  - The band is edge to edge, and the crops show none of prompt 02's listed blemishes.
- **Sticky** (Playwright, 72/72 interaction checks):
  - About heading, philosophy panel and principal slot sit at exactly 120 px at three scroll points at 1024, 1280, 1440 and 1920. Each is released with its column's end (bottoms equal ±1 px).
  - They are `static` at 768 and 390.
- **Cross-fade:** scrolling each principle to the middle at 1440 gives 01 → 02 → 03 → 04, one numeral opaque each time. The transition is 0.4 s, and under reduced motion it is effectively 0.
- **Deep link `/about#principal`:**
  - It works typed, from Home's "About the principal" (through the curtain) and set while already on `/about`.
  - The section lands 32 px from the top, with the name above the dock, at 390 × 844, 360 × 800, 1440 × 900 and 844 × 390.
  - After Decision 13 it also holds at 360 × 640, 375 × 667 and 412 × 915.
- **Portrait slot:** a temporary build with `studio.principal.portrait = 'studio-detail'`, served on port 8091, rendered the photograph (alt "Ar. Mohammad Hassanuddin", lazy). The slot box, the name's position and the section height were identical to the plate build at 390, 768 and 1440. The change was reverted (`git diff src/data/` is empty).
- **The ending** at 390 and 1440:
  - `tel:+917292831128`; WhatsApp `https://wa.me/917292831128?text=…` with `target="_blank"` and `noopener`; "Get directions" goes to `studioMapsHref` and opens Google Maps in a new tab. Both new-tab links read "(opens in a new tab)". There is no `mailto:`.
  - The button opens the sheet "From: Studio" and sends `source: "studio-closing"`, `context_label: "Studio"`. Escape returns focus to it.
- **Keyboard** (390 touch, 1440, 844 × 390):
  - `main`'s stops are the phone, WhatsApp, "Talk to the studio" and "Get directions", in that order; the rest of the page is reading.
  - Every stop has a 2 px solid terracotta-300 ring.
  - No focused control is ever under the visible dock.
  - Enter and Space open the sheet, and Escape returns focus.
- **Accessibility tree:**
  - One `h1`, then the `h2`s and `h3`s with no skipped level. Six named regions; `header`, `main`, `nav` and `footer`.
  - The band and the detail photograph have their manifest alt text. The plate's mark is hidden.
  - The experience is a table named "Experience" in both layouts.
- **Contrast** (computed, per colour pair, at 1440): every pair passes. Examples: terracotta-500 accents 3.75:1 on ivory and 3.36:1 on sand (display sizes only); terracotta-700 labels 5.77 / 5.17:1; ink-2 8.15:1; mist 8.93:1; terracotta-300 7.74:1 on forest. The smallest text is 12 px (labels). No text sits on a photograph.
- **Motion:**
  - After a curtain transition from `/` the band's cover stays at 0 until the curtain has lifted, then opens.
  - On first load it opens after the lede.
  - Under reduced motion: no SplitText, no transform or opacity change on any `data-m` element, and every shutter cover rests off its image.
- **`node scripts/qa/lead-flow.js`:** 37/37 at 390 and 37/37 at 1440.
- **Admin parity:** calibration (baseline against itself) 34/34; **baseline against this branch 34/34 identical**, with 0 pixels and 0 digest differences.
- **Regression pass** (production build on PHP, Playwright; **53/53**):
  - **Routes:** the nine routes at 390 and 1440, each with one `h1`, `main` / `nav` / `footer`, no overflow and no console errors, and the right robots. `/about` is "About In-Arch Architects, Patna | IN-ARCH", `index, follow`; the old pages keep their titles until their prompts.
  - **Sheet from four CTAs:** `studio-closing`, `dock-cta`, `home-hero` and `home-closing`. Each time focus is inside, scroll is locked, Escape closes it, and focus and scroll come back.
  - **Enquiries:**
    - a real enquiry from `/about` carries all 21 frozen keys (+ `context_label`), with `source: studio-closing`, `status: new`, `state` empty and `page_url …/about`, and the success state shows;
    - the same mobile through `/contact` gives `duplicate: true` and the notice.
  - **Admin**, with 15 leads (11 seeded for pagination):
    - redirect to login, login, and the dashboard (counts, trend, the new lead in Recent Enquiries, the heading unchanged, CSV export);
    - leads page: search (exactly one row); Status, Interested In ("Residential Architecture"), Source (`studio-closing`) and Date Range, then Clear All; sorting by Name both ways; pagination 1–10 → 11–15;
    - inline status (saved `contacted`); bulk select with its cancelled dialog; CSV export (contains the lead) and import ("Imported 0 leads (15 duplicates skipped)"); row delete (Cancel keeps it, Delete removes it);
    - detail page with every field; a note and a status change, both saved (`consultation_booked`);
    - the Guidelines gate and its four tabs, and logout. No page errors.
- `grep -ri "dulcey\|pharma\|trust. security" src/pages/Studio` prints nothing. `src/pages/About/` no longer exists, and nothing imports it.
- Every test lead and the parity seeds were deleted. `build/api/data/leads.json` is `[]`, and `public/api/data/` was never created.

### Open items

1. **Prompt 09:** Home still links to `/expertise#process` and `#e01`–`#e07` (prompt 07 Open item 1). `/about#principal` is now supplied.
2. **Prompt 16 (motion):**
   - A scroll-triggered reveal that is already in view when a page mounts plays under the page curtain. Studio's band works around it per element (Decision 2). Consider making the reveal gate hold scroll-triggered reveals created while it is held, site-wide.
   - `studio-detail` (a 1.46 : 1 crop) is centre-cropped by its 4:5 frame: the fan's left blade is cut. A dedicated 4:5 cut or an `object-position` would frame it better.
3. **Prompt 17:**
   - Check the sticky columns and the short-phone slot (Decision 13) with real mobile toolbars: `svh` is the small viewport.
   - Check the experience table at 200 % zoom and with text spacing.
4. **Prompt 18:**
   - `/about`'s LCP was not measured. It is probably the `h1` or the band. A route-guarded preload of the band in `public/index.html`, like Home's, is an option; `index.html` belongs to prompts 04 / 06 / 18.
   - A real screen-reader pass of the stacked table and the hidden headings.
5. **Prompt 19:** Studio has no in-page primary button, so the dock's "Start a project" is the primary action throughout and "Talk to the studio" is secondary, as specified. Confirm in the CTA review.
6. No VoiceOver or NVDA in this session: the accessibility tree and axe were checked instead. `npm audit` advisories in CRA 5's tree are unchanged.
