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
