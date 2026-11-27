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
