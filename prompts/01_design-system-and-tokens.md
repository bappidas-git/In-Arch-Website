# 01 — Design system, tokens and motion foundation

**Prompt 1 of 20**

## Depends on

Nothing — this is the first prompt of the series.

Before writing anything, read `prompts/00_INDEX.md` in full (it is the plan every later prompt relies on) and confirm the starting state: `src/styles/inarch/`, `src/motion/`, `scripts/qa/` and `prompts/BUILD_LOG.md` do not exist yet, and baseline commit `cc2fc52d90987adcf62a5c286c4eb87d155fc3f3` is reachable (`git cat-file -t cc2fc52d90987adcf62a5c286c4eb87d155fc3f3`; if the clone is shallow, `git fetch --unshallow origin`). An owner decision recorded in the index overrides any default written in this prompt.

## Context

IN-ARCH — *In-Arch Architects & Interior Designer*, Boring Road, Patna, Bihar, led by Principal Architect Ar. Mohammad Hassanuddin — is getting a new public website on an existing React boilerplate that still wears a previous client's brand ("Dulcey Lead Services"). The new brand is warm, quiet, editorial luxury: ivory `#F4EFE7` and espresso `#231B15` (both sampled from the logo), deep charcoal-green `#161E19`, one terracotta accent; Fraunces serif headlines with a single italic terracotta phrase, Manrope for text and UI. Logo files are named for the background they sit ON: `logos/in-arch-logo-light-transparent.png` is the espresso lockup for light backgrounds, `logos/in-arch-logo-dark-transparent.png` the ivory lockup for dark backgrounds, and `logos/in-arch-favicon-light-transparent.png` / `logos/in-arch-favicon-dark-transparent.png` are the "IA" monogram under the same rule. Stack reality: React 18 + Create React App (`react-scripts` 5, plain JavaScript), React Router 7 in `BrowserRouter` mode, CSS Modules, GSAP 3.15 with ScrollTrigger. There is no `db.json`: enquiries are POSTed to `public/api/leads.php` (a JSON-file store) and read by the MUI admin panel at `/admin`.

## Objective

Lay the foundation every later prompt builds on, **without changing how any existing page or admin screen looks or behaves**:

1. **A safety net** — a way to serve the production build with the PHP lead API locally, an automated public-site check, and a pixel-and-style parity check that proves the admin has not moved.
2. **The IN-ARCH design system** — colour, type, spacing, grid and motion tokens; self-hosted fonts; a scoped base layer that new components opt into and that is hardened against the legacy global CSS still on the page.
3. **The GSAP motion foundation** — one attribute-driven hook that all later sections use.
4. **A dev-only "Design Lab" route** (`/__lab`) where the system can be seen and tested.

When this prompt is done the live routes are pixel-identical to before; only the Lab shows the new brand.

## Scope — files/areas to touch

**Create**

- `scripts/dev-router.php` — router for PHP's built-in server (serves real files, hands `/api/*.php` to PHP, falls back to `index.html`, mirroring `public/.htaccess`). Exactly:

  ```php
  <?php
  // Dev-only router for PHP's built-in server. Never deployed (it lives outside public/).
  // Usage: php -S 127.0.0.1:8080 -t build scripts/dev-router.php
  $root = $_SERVER['DOCUMENT_ROOT'];
  $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
  if ($path !== '/' && is_file($root . $path)) {
      return false; // real file: static asset or /api/leads.php
  }
  header('Content-Type: text/html; charset=utf-8');
  readfile($root . '/index.html'); // SPA fallback, as public/.htaccess does on Apache
  ```

- `scripts/qa/public-check.js`, `scripts/qa/parity.js`, `scripts/qa/README.md` (specified under Test & QA).
- `public/fonts/` — `fraunces-v1-latin.woff2`, `fraunces-v1-latin-italic.woff2`, `manrope-v1-latin.woff2`, plus the two `OFL.txt` licence files.
- `src/styles/inarch/tokens.css`, `fonts.css` (the two fallback faces only — see part 2), `base.css`, `type.css`, `layout.css`, `index.css` (imports the other five in that order).
- `src/surfaces/surface.js` (`getSurface(pathname)` → `'admin'` when the path is `/admin` or starts with `/admin/`, otherwise `'public'`) and `src/surfaces/SurfaceManager.jsx` (keeps `document.documentElement.dataset.surface` in sync with the router in a layout effect; renders nothing).
- `src/motion/tokens.js`, `src/motion/useMotionScope.js`, `src/motion/reducedMotion.js`, `src/motion/index.js`.
- `src/lab/LabPage.jsx` + `src/lab/LabPage.module.css` — the Design Lab.
- `src/setupTests.js` (imports `@testing-library/jest-dom`) and `src/styles/inarch/__tests__/tokens.test.js` (reads `tokens.css` as text and asserts every token named in this prompt exists with the stated value).
- `prompts/BUILD_LOG.md` — starts with a one-paragraph explanation ("append-only log; every build session reads it first and writes to it last") and the first entry.

**Edit — minimal, additive**

- `package.json` / `package-lock.json`: add devDependencies `axe-core`, `@fontsource-variable/fraunces`, `@fontsource-variable/manrope`, `@testing-library/react@^14`, `@testing-library/jest-dom`, `@testing-library/user-event@^14`; add scripts `"qa:public": "node scripts/qa/public-check.js"` and `"qa:parity": "node scripts/qa/parity.js"`. No runtime dependency is added or removed. Do not add Playwright to `package.json`: the scripts use the Playwright already installed in the session (`require('playwright')`); if it cannot be resolved, say so and stop rather than vendoring a browser.
- `.gitignore`: add `/qa-artifacts/`.
- `src/index.js`: one new line, `import './styles/inarch/index.css';`, placed **after** `import App from './App';` so the new CSS is emitted after every legacy stylesheet. Change nothing else in the file.
- `src/App.jsx`: render `<SurfaceManager />` next to `<ScrollManager />`, and register the Lab route inside the `PublicLayout` route, above the `*` catch-all, only in development:

  ```jsx
  const LabPage = process.env.NODE_ENV === 'development' ? lazy(() => import('./lab/LabPage')) : null;
  // …
  {LabPage && <Route path="/__lab" element={lazyRoute(<LabPage />)} />}
  ```

  The production build must contain no Lab chunk (webpack drops the dead branch); verify by searching `build/static/js` for `__lab`.
- `public/index.html`: add one statement to the first inline script in `<head>` (the one that sets `history.scrollRestoration`):

  ```js
  document.documentElement.setAttribute("data-surface", /^\/admin(\/|$)/.test(location.pathname) ? "admin" : "public");
  ```

  and add one new `<style id="ia-fonts">` block, directly before the existing critical `<style>`, holding the three `@font-face` rules of part 2. Nothing else in `index.html` changes in this prompt (font preloads arrive with the shell in prompt 04).
- `CHANGELOG.md`: add the heading `## [3.0.0] — IN-ARCH redesign (in progress)` above `## [2.31.0]` with this prompt's entry.

**Out of scope** — every existing page, section, shared component, context and utility; everything under `src/admin/`; `src/theme/`; the five legacy stylesheets in `src/styles/` and `src/App.css`; `src/animations/` (it keeps serving the old pages untouched — the new hooks import `gsap`, `ScrollTrigger`, `useGSAP`, `scheduleRefresh` and `prefersReducedMotion` from `src/animations/gsapSetup.js`, which stays the single place plugins are registered and scroll restoration is pinned to `manual`); `public/api/`; `.env`.

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

### 1. Tokens — `src/styles/inarch/tokens.css`

All on `:root`, all prefixed `--ia-`, so they are inert until something uses them.

| Group | Tokens and values |
|---|---|
| Light surfaces | `--ia-ivory: #F4EFE7` · `--ia-paper: #FAF7F2` · `--ia-sand: #E9E3D8` · `--ia-stone: #DAD3C6` |
| Dark surfaces | `--ia-forest: #161E19` · `--ia-forest-2: #1E2823` · `--ia-forest-3: #28342E` |
| Ink | `--ia-espresso: #231B15` · `--ia-ink-2: #4F453D` · `--ia-ink-3: #6B6058` · `--ia-mist: #B9BDB6` · `--ia-mist-2: #8E958D` |
| Accent | `--ia-terracotta-700: #8F4A2B` · `--ia-terracotta-500: #B5653F` · `--ia-terracotta-300: #DDA27F` |
| Lines | `--ia-hairline: #D8D0C3` · `--ia-border: #8A7F74` · `--ia-hairline-dark: #28342E` · `--ia-border-dark: #8E958D` |
| Feedback | `--ia-success: #3F6B4F` · `--ia-success-dark: #8FBF9F` · `--ia-error: #A4372A` · `--ia-error-dark: #F0A090` |
| Fonts | `--ia-font-serif: "Fraunces", "Fraunces Fallback", "Iowan Old Style", "Palatino Linotype", Georgia, serif` · `--ia-font-sans: "Manrope", "Manrope Fallback", "Avenir Next", "Segoe UI", system-ui, -apple-system, sans-serif` |
| Type scale | `--ia-fs-display-2xl`, `-xl`, `-lg`, `-md`, `-sm`, `--ia-fs-body-lg`, `--ia-fs-body`, `--ia-fs-small`, `--ia-fs-caption`, `--ia-fs-label` with the clamp values from the design contract |
| Space | `--ia-space-1: 0.25rem` · `-2: 0.5rem` · `-3: 0.75rem` · `-4: 1rem` · `-5: 1.25rem` · `-6: 1.5rem` · `-8: 2rem` · `-10: 2.5rem` · `-12: 3rem` · `-16: 4rem` · `-20: 5rem` · `-24: 6rem` · `-32: 8rem` · `-40: 10rem` · `-48: 12rem` |
| Layout | `--ia-section-y: clamp(5rem, 3rem + 9vw, 12rem)` · `--ia-section-y-sm: clamp(3.5rem, 2.5rem + 4.5vw, 7.5rem)` · `--ia-gutter: clamp(1.25rem, 0.5rem + 3.4vw, 5rem)` · `--ia-max: 105rem` · `--ia-measure: 68ch` · `--ia-radius: 2px` · `--ia-dock-clearance: 6rem` |
| Motion | `--ia-dur-1: 150ms` · `--ia-dur-2: 240ms` · `--ia-dur-3: 400ms` · `--ia-dur-4: 700ms` · `--ia-dur-5: 1000ms` · `--ia-ease-out: cubic-bezier(0.22, 1, 0.36, 1)` · `--ia-ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)` · `--ia-ease-expo: cubic-bezier(0.16, 1, 0.3, 1)` |
| Elevation / layers | `--ia-shadow-overlay: 0 24px 60px rgba(22, 30, 25, 0.18)` · `--ia-z-dock: 80` · `--ia-z-overlay: 120` · `--ia-z-modal: 200` · `--ia-z-curtain: 300` |

Expected sizes at the QA widths (use them to verify the clamps):

| Token | 360 | 390 | 768 | 1024 | 1280 | 1440 | 1920 |
|---|---|---|---|---|---|---|---|
| display-2xl | 45.1 | 47.3 | 74.5 | 92.9 | 111.4 | 122.9 | 136 |
| display-xl | 40.3 | 41.9 | 61.5 | 74.8 | 88.2 | 96.5 | 104 |
| display-lg | 32.3 | 33.3 | 45.4 | 53.6 | 61.8 | 66.9 | 72 |
| display-md | 26.1 | 26.6 | 33.1 | 37.4 | 41.8 | 44 | 44 |
| display-sm | 22.1 | 22.3 | 25.3 | 27.4 | 29.4 | 30 | 30 |
| body-lg | 17 | 17.2 | 18.6 | 19.6 | 20.5 | 21 | 21 |
| body | 16 | 16.1 | 16.6 | 17 | 17 | 17 | 17 |
| section-y | 80.4 | 83.1 | 117.1 | 140.2 | 163.2 | 177.6 | 192 |
| gutter | 20.2 | 21.3 | 34.1 | 42.8 | 51.5 | 57 | 73.3 |

### 2. Fonts — `public/fonts/` and `fonts.css`

- Fraunces and Manrope are both SIL Open Font License. Take the variable WOFF2 files from the two `@fontsource-variable/*` packages you just installed (look in `node_modules/@fontsource-variable/fraunces/files/` for the Latin file that carries the `opsz` and `wght` axes, roman and italic, and in the Manrope package for the Latin `wght` file — when this plan was written those were `fraunces-latin-opsz-normal.woff2` (about 67 KB), `fraunces-latin-opsz-italic.woff2` (about 82 KB) and `manrope-latin-wght-normal.woff2` (about 25 KB), but inspect the folder — names can change between releases), copy them to `public/fonts/` under the three names above and copy each package's licence text beside them. Three font files, nothing else; no Google Fonts request for the public site.
- **Where the `@font-face` rules go.** Not in a stylesheet under `src/`: Create React App 5 resolves a root-relative `url("/fonts/…")` at build time and stops with "Module not found: Can't resolve '/fonts/…'" (verified on this repository), and moving the files into `src/` would give them hashed names that `index.html` cannot preload. Write the three rules in the new `<style id="ia-fonts">` block in `public/index.html` instead — `font-family: "Fraunces"`, `font-style: normal` and `italic`, `font-weight: 300 600`; `font-family: "Manrope"`, `font-weight: 300 700` — each with `font-display: swap`, `src: url("%PUBLIC_URL%/fonts/…") format("woff2")` and the Latin `unicode-range` copied from the Fontsource CSS. They are inert on `/admin`: nothing there names these families, so nothing is downloaded and nothing changes.
- `fonts.css` holds two metric-matched fallbacks to stop layout shift while the fonts load (their `local()` sources need no URL, so they compile): `@font-face { font-family: "Fraunces Fallback"; src: local("Georgia"); size-adjust / ascent-override / descent-override / line-gap-override … }` and `"Manrope Fallback"` on `local("Arial")`. Measure the overrides (render the same paragraph in both faces in the Lab and adjust until the line breaks and block heights match within 1 px at 16 px and at 48 px) and record the final numbers in the build log.
- The rupee sign `₹` (U+20B9) is used later in form labels; confirm which face renders it and note it in the log. A system-font fallback for that one glyph is acceptable.

### 3. Base layer — `base.css` (scoped, and hardened against the legacy CSS)

The legacy global stylesheets and MUI's `CssBaseline` remain on every page until prompt 14, so the new base has two jobs: set the IN-ARCH defaults inside `.ia`, and cancel each legacy rule that would otherwise leak into it. Use `:where(.ia)` (zero specificity — any CSS-Module class can override it) for element defaults, and plain `.ia` only where a legacy or MUI rule of equal specificity is injected later in the cascade.

- **Scope root.** `.ia { font-family: var(--ia-font-sans); font-size: var(--ia-fs-body); font-weight: 400; line-height: 1.65; color: var(--ia-fg); background: var(--ia-bg); -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; font-synthesis: none; }`
- **Tones.** `.ia` and any descendant `[data-tone]` set the nine tone variables. `light` (the default): bg ivory, fg espresso, fg-2 ink-2, fg-3 ink-3, accent terracotta-700, accent-display terracotta-500, line hairline, line-strong border, focus terracotta-700. `sand`: bg sand, rest as light. `paper`: bg paper, rest as light. `dark`: bg forest, fg ivory, fg-2 mist, fg-3 mist-2, accent and accent-display terracotta-300, line hairline-dark, line-strong border-dark, focus terracotta-300. An element with `data-tone` also paints `background: var(--ia-bg); color: var(--ia-fg)`.
- **Reset inside the scope** (`:where(.ia) …`): `box-sizing: border-box` on everything; zero margin and padding on headings, paragraphs, lists, figures, blockquotes; headings `font: inherit; color: inherit; letter-spacing: inherit` (cancels the legacy `h1`–`h6` family, weight 700, colour and the per-breakpoint sizes in `responsive.css`); `p { line-height: inherit }` (legacy forces 1.625); links `color: inherit; text-decoration: none; transition: none` including `:hover` (legacy paints links red with a 150 ms transition); `list-style: none`; `img, picture, video, canvas { display: block; max-width: 100%; height: auto }`; `svg { display: inline-block; flex-shrink: 0 }` (legacy makes every inline SVG a block); `img { user-select: auto; -webkit-user-drag: auto; image-rendering: auto }` (legacy disables drag/selection and sets `-webkit-optimize-contrast` on retina, which coarsens photographs); form controls `font: inherit; color: inherit; margin: 0`; `button { background: none; border: 0; padding: 0; border-radius: 0; cursor: pointer }` and `button:disabled { opacity: 1; cursor: not-allowed }` (legacy dims to 0.6); `a, button { min-width: 0; min-height: 0 }` (legacy forces 44 × 44 on every link and button on touch devices — the new components size their own targets); `* { scrollbar-color: var(--ia-line-strong) transparent }`.
- **Rules that need the `.ia` prefix** because a legacy or MUI rule of equal weight comes later: `.ia ::selection { background: var(--ia-terracotta-700); color: var(--ia-ivory) }` (legacy and MUI both set Dulcey red); `.ia :focus-visible { outline: var(--ia-focus-width, 2px) solid var(--ia-focus); outline-offset: var(--ia-focus-offset, 3px); border-radius: var(--ia-focus-radius, 2px) }` and `.ia :focus:not(:focus-visible) { outline: none }` (legacy sets an ink ring globally and a red one on links — components tune the ring through the three custom properties, never by out-specifying this rule); `.ia [id] { scroll-margin-top: var(--ia-scroll-margin, 2rem) }` (legacy reserves 100 px for a fixed header that will no longer exist).
- **Leave alone on purpose:** the legacy rule that forces 16 px on inputs at ≤ 768 px (it prevents iOS zoom) and the legacy reduced-motion kill-switch (it only helps).
- **Document-level rules** (`html`, `body`, `.app`, scrollbars) are *not* touched here; prompt 04 adds them under `html[data-surface="public"]` when the shell changes.

### 4. Type and layout helpers — `type.css`, `layout.css`

- `type.css`: one class per step — `.ia-t-display-2xl`, `-xl`, `-lg`, `-md`, `-sm` (Fraunces, the weights, tracking and line-heights from the contract, `text-wrap: balance`), `.ia-t-body-lg`, `.ia-t-body`, `.ia-t-small`, `.ia-t-caption`, `.ia-t-label` (uppercase, 600, `0.18em`), and `.ia-accent` for the one italic phrase (`font-style: italic; color: var(--ia-accent-display)`; add `font-variation-settings` only if the italic needs it).
- `layout.css`: `.ia-container` (`max-width: var(--ia-max)`, `padding-inline: var(--ia-gutter)`, centred); `.ia-grid` (CSS grid; 4 columns / 16 px gap, 8 / 24 px from 768, 12 / 32 px from 1024, 40 px gap from 1440); `.ia-section` (`padding-block: var(--ia-section-y)`), `.ia-section--compact`; `.ia-bleed` (escapes the container to the viewport edges); `.ia-measure` (`max-width: var(--ia-measure)`); `.ia-visually-hidden`.

### 5. Motion foundation — `src/motion/`

- `tokens.js`: `DUR = { press: 0.15, hover: 0.24, ui: 0.4, reveal: 0.7, hero: 1.0 }`, `EASE = { out: 'power3.out', lines: 'expo.out', mask: 'power3.inOut', scrub: 'none' }`, `RISE = { sm: 24, lg: 40 }`, `STAGGER = { lines: 0.08, items: 0.08 }`, `START = 'top 85%'`, `MQ = { desktop: '(min-width: 1024px)', reduce: '(prefers-reduced-motion: reduce)', fine: '(hover: hover) and (pointer: fine)' }`.
- `useMotionScope(options)` returns a ref for a section root and wires every descendant that carries a `data-m` attribute, inside one `useGSAP` scope built on `gsap.matchMedia()`:

  | Attribute | Effect |
  |---|---|
  | `data-m="rise"` | opacity 0 → 1 and `y` 24 / 40 px → 0, 0.7 s `power3.out`; elements entering together are batched with `ScrollTrigger.batch` and staggered 0.08 s |
  | `data-m="lines"` | headline split into lines with GSAP `SplitText` (`type: 'lines'`, `mask: 'lines'`, `autoSplit: true`, `aria: 'auto'`), each line `yPercent` 110 → 0, 1.0 s `expo.out`, stagger 0.08 s; re-splits when fonts finish loading or the width changes |
  | `data-m="shutter"` | on an image frame: a cover child (`data-m-cover`, same colour as the section) moves `yPercent` 0 → −101 over 1.0 s `power3.inOut` while the image scales 1.12 → 1 over 1.4 s `power3.out` |
  | `data-m="rule"` | `scaleX` 0 → 1 from the left, 0.9 s `power3.inOut` |
  | `data-m="fade"` | opacity only, 0.7 s |
  | `data-m-parallax="7"` | the frame's inner image drifts ±7 % (`yPercent`, scrub 0.6) while its frame crosses the viewport; capped at ±4 % below 1024 px |
  | `data-m-delay="0.1"` | extra delay in seconds |
  | `data-m-now` | play on mount instead of on scroll (heroes) |

  Initial hidden states are set by GSAP inside the scope, never by CSS, so the content stays visible if JavaScript fails. Under `prefers-reduced-motion: reduce` the hook does nothing. It calls `scheduleRefresh()` once after setup. No tween or ScrollTrigger is ever created outside a `useGSAP` scope. Confirm `node_modules/gsap/SplitText.js` exists (it ships in the public `gsap` 3.15 package) and register it once at the top of `src/motion/useMotionScope.js` (`gsap.registerPlugin(SplitText)`, guarded by `typeof window !== 'undefined'`); `src/animations/gsapSetup.js` itself is not edited.

### 6. Design Lab — `/__lab` (development only)

A single page, wrapped in `<div className="ia">`, that renders on `light`, `sand`, `paper` and `dark` tones: every colour token as a swatch with its hex and its measured contrast against that tone's foreground; every type step with its live computed pixel size; the spacing scale; a toggleable 4 / 8 / 12-column grid overlay; and one live example of each `data-m` effect with a "replay" button. Later prompts add their primitives and assets to this page; give it a simple section registry so they can.

## Functional guardrails

- **Contract frozen.** `public/api/leads.php` and `public/api/config.example.php` are not edited. The endpoint and its actions stay as they are: `POST /api/leads.php?action=create` with body `{ "lead": { … } }`, plus `list`, `update`, `delete` and `health`. Every lead still carries exactly these keys with the same meaning: `lead_id, name, mobile, email, organization, service_interest, state, message, source, status, submitted_at, updated_at, page_url, user_agent, utm_source, utm_medium, utm_campaign, utm_term, utm_content, notes, activity`. The status keys `new, contacted, consultation_booked, procedure_scheduled, completed, not_interested` are never renamed. `.env` and `.env.example` are not edited (use the git-ignored `.env.development.local` for local overrides). Anything new a lead needs is added as an extra key; nothing existing is renamed, removed or reshaped.
- **Admin-frozen files** — no diff against baseline commit `cc2fc52d90987adcf62a5c286c4eb87d155fc3f3`: `src/admin/**`, `src/theme/muiTheme.js`, `src/styles/variables.css`, `src/styles/global.css`, `src/styles/animations.css`, `src/styles/responsive.css`, `src/styles/dulcey.css`, `src/App.css`, `src/hooks/useMediaQuery.js`, `public/api/**`, `.env`, `.env.example`.
- **Admin-bound values** keep their current values, because the admin prints or reads them: `siteConfig.brandName`, `siteConfig.legalName`, `siteConfig.logo` and `LOGO_SIZE` in `src/data/siteConfig.js`; `expertiseTitles` in `src/data/expertiseData.js`; `seoConfig.pages.admin` in `src/config/seo.js`; `getConfig()` in `src/utils/webhookSubmit.js`. Prompt 15 is the only place they change.
- **Strictly additive.** After this prompt every existing route renders pixel-identically at every width. The only edits to existing files are the ones listed under Scope; `src/index.js` gains one import after `import App`, `src/App.jsx` gains `SurfaceManager` and the dev-only route, `public/index.html` gains one statement.
- **No leakage.** Nothing in `src/styles/inarch/` may match an element outside `.ia`: every selector starts with `:root` (custom properties only), `@font-face`, `.ia`, `:where(.ia)` or an `ia-` class. No `html`, `body`, `*`, `h1`, `a` … at the top level.
- **Fonts stay as they are for existing pages.** The Archivo / Instrument Serif / Inter links in `public/index.html` and the `@import` in `src/styles/global.css` are untouched; the old pages and the admin keep their typography.
- **Nothing lost.** These keep resolving and behaving: `/`, `/about`, `/expertise` (with its `#e01`… deep links), `/industries`, `/contact`, the 404 catch-all, `/admin`, `/admin/login`, `/admin/dashboard`, `/admin/lms`, `/admin/lms/lead/:leadId`, `/admin/guideline`, and the static files `/api/leads.php`, `/sitemap.xml`, `/robots.txt`, `/manifest.json`. The lead modal still opens from every CTA through `openLeadModal(source, extras)`, still traps focus, closes on Escape / backdrop / close button / route change, restores focus and scroll position, and still submits through `submitLeadToWebhook`. `ScrollManager` (top on navigation, hash scrolling) and `SEOHead` (per-route title, meta, canonical, JSON-LD; `noindex` on `/admin` and 404) keep working.
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

### Build the QA tools first, then use them

**`scripts/qa/public-check.js`** — Playwright script. Arguments: `--base` (default `http://127.0.0.1:8080`), `--routes` (comma list; default every public route found in the `<Route>` table of `src/App.jsx`), `--widths` (default `360,390,768,1024,1280,1440,1920`). For each route × width it loads the page, waits for network idle and fonts, scrolls to the bottom and back so lazy content mounts, and fails on: any `console.error` or uncaught page error; any same-origin request that returns ≥ 400; `document.documentElement.scrollWidth > window.innerWidth + 1`; any serious or critical axe violation (inject `node_modules/axe-core/axe.min.js`, tags `wcag2a, wcag2aa, wcag21aa, wcag22aa`); and, at widths ≤ 768, any visible link or button smaller than 44 × 44 CSS px inside `.ia` (report selector and size). It repeats the 390 and 1440 runs with `reducedMotion: 'reduce'`. Screenshots go to `qa-artifacts/public/` (git-ignored). Exit code is non-zero on any failure, with a readable summary.

**`scripts/qa/parity.js`** — proves two builds render the same. Arguments: `--a <url>` (reference), `--b <url>` (candidate), `--suite admin|public`, `--mask "<css selector>,…"` (regions excluded from the pixel comparison). For both servers, identically: freeze time with `page.clock.install({ time: new Date('2026-01-15T10:30:00+05:30') })` before navigation; block `fonts.googleapis.com`, `fonts.gstatic.com` and `api.iconify.design` so rendering is deterministic (this means web fonts and admin icons are *not* covered by the pixel comparison — the manual pass below covers them); seed the same three leads through `POST /api/leads.php?action=create` with fixed `lead_id`s and timestamps. The `admin` suite logs in with the credentials read from `.env` at run time (never printed), then captures at 390, 768 and 1440 px: login, dashboard, leads list, leads list with the "Interested In" menu open, a lead's detail, the delete-confirm dialog, the Guidelines password gate, each of the four Guidelines tabs (read the gate password from `src/admin/pages/Guideline.jsx` at run time), and the mobile menu at 390. The `public` suite captures every public route at the same widths. For each capture it compares (1) the two PNGs pixel-by-pixel with `sharp`, writing a diff image to `qa-artifacts/parity/`, and (2) a digest of every element under `#root` — tag, class list, bounding box and the computed `font-family, font-size, font-weight, line-height, color, background-color, border, padding, margin, display, position` — printing the first twenty differences. Exit code is non-zero if any unmasked pixel or digest entry differs.

**`scripts/qa/README.md`** — the commands, what each script proves, and how to build the reference:

```bash
git worktree add ../inarch-baseline cc2fc52d90987adcf62a5c286c4eb87d155fc3f3
```

```bash
(cd ../inarch-baseline && npm ci && npm run build && php -S 127.0.0.1:8081 -t build ../In-Arch-Website/scripts/dev-router.php)
```

(adjust the relative path to wherever the main checkout lives; remove the worktree with `git worktree remove ../inarch-baseline` when done).

### Then verify this prompt

- **Calibration and proof of inertness.** Serve the baseline build on port 8081 and this branch's build on port 8080, then run `node scripts/qa/parity.js --a http://127.0.0.1:8081 --b http://127.0.0.1:8080 --suite admin` and again with `--suite public`. Both must report **zero** differences. If they do not, either the harness is not deterministic (fix it — run baseline against baseline to find out) or this prompt leaked into an existing page (fix that).
- **Manual pass, nothing blocked.** Open `/`, `/about`, `/expertise`, `/industries`, `/contact`, a nonsense URL, `/admin/login` and the admin dashboard in the real build: they look exactly as before, Archivo is applied (`document.fonts.check('16px Archivo')` is true once loaded), admin icons render, and no request for `/fonts/*.woff2` is made on any of these pages.
- **The Lab** (`npm start`, then `/__lab`): at every QA width each type step measures within 0.5 px of the table above; every colour pair shown as text passes the contrast it claims; the grid overlay shows 4, 8 and 12 columns at the right widths; each motion demo plays once, replays, and is skipped under reduced motion; `/__lab` returns the 404 page in the production build and `build/static/js` contains no `__lab` string.
- **Fonts.** In the Lab, the network panel shows exactly three WOFF2 requests (about 67, 82 and 25 KB, served from `/fonts/`) and none on `/admin/login`; with the font requests blocked, the fallback text occupies the same lines (no reflow when they are unblocked).
- **Breakpoints.** Check 360, 390, 768, 1024, 1280, 1440 and 1920 px wide, plus one landscape phone (844 × 390): no horizontal scroll, nothing clipped or overlapping, every tap target ≥ 44 × 44 px, no text below 12 px, and the dock never hides a focused control. (For this prompt the matrix applies to the Lab page, and only confirms *no change* on the existing pages.)
- **Keyboard.** Tab through the whole surface: logical order, a visible 2 px focus ring on every stop, no trap outside an open overlay, Escape closes overlays and returns focus to the opener, Enter and Space activate.
- **Contrast.** Text ≥ 4.5:1 (≥ 3:1 from 24 px, or 18.66 px bold); control boundaries and focus rings ≥ 3:1. Measure text that sits on a photograph at its worst pixel.
- **Screen reader.** Exactly one `h1`, headings in order, `nav` / `main` / `footer` landmarks, meaningful `alt` on content images and empty `alt` on decorative ones, an accessible name on every control, results announced through live regions. Inspect the accessibility tree, and use VoiceOver or NVDA if the session has one.
- **Reduced motion.** Emulate `prefers-reduced-motion: reduce`: everything is visible and usable with no transforms, parallax, pinning or curtain.
- **Automated.** `node scripts/qa/public-check.js` reports no console errors, no failed requests, no horizontal overflow and zero serious or critical axe violations; `npm test -- --watchAll=false` passes; `npm run build` ends with "Compiled successfully" and no warnings.

**Regression pass — the whole site, every time.** Walk `/`, `/about`, `/expertise`, `/industries`, `/contact` and a nonsense URL at 390 px and at 1440 px. Open the lead modal from three different CTAs. Submit one real enquiry through the modal and one through `/contact` (do it by hand in the browser and read the request body in the network panel), confirm the success state, then submit the same mobile number again and confirm the duplicate path. Log in at `/admin` with the `REACT_APP_ADMIN_USERNAME` / `REACT_APP_ADMIN_PASSWORD` values from `.env` (read them at run time; never print or copy them) and confirm: the dashboard counts and recent table; the leads table (search, every filter, sorting, pagination, inline status change, bulk select, CSV export and import, delete with its confirm dialog); a lead's detail page (the lead you just sent shows its name, mobile, email, interested-in, message, source and page URL; add a note; change the status); the Guidelines password gate and its four tabs; logout. Then run the admin-frozen check — it must print nothing:

```bash
git diff --stat cc2fc52d90987adcf62a5c286c4eb87d155fc3f3 -- src/admin src/theme src/styles/variables.css src/styles/global.css src/styles/animations.css src/styles/responsive.css src/styles/dulcey.css src/App.css src/hooks/useMediaQuery.js public/api .env .env.example
```

If the baseline commit is missing from a shallow clone, run `git fetch --unshallow origin` first. Fix whatever the pass finds before calling this prompt done, and delete the test leads afterwards (`build/api/data/` and `public/api/data/` are git-ignored; never commit them).

**Close out.** Append an entry to `prompts/BUILD_LOG.md` (date, "Prompt 01", files created / changed / deleted, decisions taken, every deviation from this prompt with its reason, anything left open). Add a short entry under `## [3.0.0] — IN-ARCH redesign (in progress)` at the top of `CHANGELOG.md`. Commit with a message that starts `IN-ARCH 01:`.
