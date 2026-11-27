# 14 — Remaining surfaces and states, then legacy retirement

**Prompt 14 of 20**

## Depends on

Before writing anything, read in this order: `prompts/00_INDEX.md` (at least "Owner decisions", "Design direction" and "Build architecture"), then `prompts/BUILD_LOG.md` (what earlier sessions really did, including deviations). An owner decision recorded in the index overrides any default written in this prompt; if an answer there disagrees with what the modules in `src/data/` currently hold, bring the data into line first and log it (the admin-bound values named under the guardrails are the exception — only prompt 15 changes those). If the build log shows a dependency below is unfinished, stop and say so instead of improvising it.

- **Prompts 01–13** — all finished. Verify before starting: every public route (`/`, `/about`, `/expertise`, `/interior-design`, `/portfolio`, `/portfolio/:slug`, `/contact`) renders a rebuilt page whose root carries `class="ia"`; `/industries` redirects; no file under `src/pages/` or `src/components/` (outside `src/admin/`) imports from `src/animations/`, `src/styles/layout.module.css`, `src/utils/swalHelper.js`, `src/data/industriesData.js`, or reads a legacy `siteConfig` key other than `siteConfig.developer`. If any of that is not true, stop and report which prompt left it open.
- `scripts/qa/parity.js` and its baseline procedure (`scripts/qa/README.md`) from prompt 01 are needed for the proof at the end.

## Context

IN-ARCH — *In-Arch Architects & Interior Designer*, Boring Road, Patna, Bihar, led by Principal Architect Ar. Mohammad Hassanuddin — is getting a new public website on an existing React boilerplate that still wears a previous client's brand ("Dulcey Lead Services"). The new brand is warm, quiet, editorial luxury: ivory `#F4EFE7` and espresso `#231B15` (both sampled from the logo), deep charcoal-green `#161E19`, one terracotta accent; Fraunces serif headlines with a single italic terracotta phrase, Manrope for text and UI. Logo files are named for the background they sit ON: `logos/in-arch-logo-light-transparent.png` is the espresso lockup for light backgrounds, `logos/in-arch-logo-dark-transparent.png` the ivory lockup for dark backgrounds, and `logos/in-arch-favicon-light-transparent.png` / `logos/in-arch-favicon-dark-transparent.png` are the "IA" monogram under the same rule. Stack reality: React 18 + Create React App (`react-scripts` 5, plain JavaScript), React Router 7 in `BrowserRouter` mode, CSS Modules, GSAP 3.15 with ScrollTrigger. There is no `db.json`: enquiries are POSTed to `public/api/leads.php` (a JSON-file store) and read by the MUI admin panel at `/admin`.

## Objective

Finish the public rebuild and then remove what is left of the old site from the public surface, in four parts:

- **A. The last surfaces and states** — the 404 page, the error state and the route-loading state get the IN-ARCH design.
- **B. Legacy retirement** — delete every old public file, asset, helper and dependency that nothing uses any more.
- **C. The surface split** — the legacy global stylesheets, the Dulcey fonts and MUI / Emotion stop shipping to public visitors; they load only when someone opens `/admin`. The admin's files are not edited: they are imported from one new wrapper instead of from the app's entry point, and the admin must render pixel-identically. This is the riskiest step in the series for the admin, so it carries a proof and a way back.
- **D. Scope hoist** — with no old page left, the `ia` scope moves to the layout root and the public document gets its own background and base.

## Scope — files/areas to touch

**A — create / rewrite**

- `src/pages/NotFound/NotFoundPage.jsx` and `.module.css` — rewritten.
- `src/components/shell/ErrorBoundary.jsx` + `.module.css` and `src/components/shell/RouteFallback.jsx` + `.module.css` — the class component and the Suspense fallback move out of `src/App.jsx`, without MUI.
- `public/index.html` — the `<noscript>` block restyled in forest / ivory with the same message.

**B — delete** (confirm each by search first)

- `src/animations/useReveal.js`, `useStaggerReveal.js`, `useParallax.js`, `useHeroIntro.js`, `useLineReveal.js`, `index.js`; **move** `src/animations/gsapSetup.js` to `src/motion/gsapSetup.js` unchanged in behaviour (plugin registration, `ScrollTrigger.clearScrollMemory('manual')`, `scheduleRefresh`, `prefersReducedMotion`, the dev-only `window.gsap` handle), drop the Dulcey presets nothing uses, and update the imports in `src/motion/` and the lead modal.
- `src/styles/layout.module.css`; `src/utils/swalHelper.js`; the `sweetalert2` dependency (run `npm uninstall sweetalert2`).
- `scripts/generate-images.js` and its `generate:images` npm script (superseded by `build:images`).
- Legacy public images: `public/images/about-band*`, `hero-expertise*`, `hero-home-v6*`, `hero-industries-v2*`, everything in `public/images/icons/`, and `public/images/logo/dulcey-wordmark-white-1351.png`. **Keep** `public/images/logo/dulcey-wordmark-1351.png` and `dls-mark-860.png` — the admin and its splash use them until prompt 15.
- In `src/data/siteConfig.js`: remove the legacy public keys and helpers that nothing reads any more (`tagline`, `taglineSecondary`, `phone`, `phoneDisplay`, `landline`, `landlineDisplay`, `email`, `siteUrl`, `logoWhite`, `logoIcon`, `logoMark`, `social`, `telHref`, `telLandlineHref`, `mailHref`, `MARK_SIZE`, `absoluteUrl`, `logoAt`, `CLOUDINARY_BASE`). **Keep, with unchanged values:** `siteConfig.legalName`, `siteConfig.brandName`, `siteConfig.logo`, `LOGO_SIZE` (admin-bound), `siteConfig.developer` (footer credit), `studio` and its helpers, and the default export.

**Do not delete:** `src/data/expertiseData.js`, `src/hooks/useMediaQuery.js`, `src/context/ThemeContext.jsx`, `src/theme/muiTheme.js`, the five stylesheets in `src/styles/` and `src/App.css` — the admin needs all of them.

**C — create / edit**

- `src/surfaces/AdminSurface.jsx` (new, default export) and `src/surfaces/AdminBootFallback.jsx` (new).
- `src/index.js` — remove the five legacy stylesheet imports, the MUI `ThemeProvider` / `CssBaseline` / theme imports and wrapper, and the `preloadResources()` font-preload helper; keep everything else (root creation, `StrictMode`, the new CSS import, global error handlers, web-vitals reporting, the HMR block updated to match).
- `src/App.jsx` — remove the `@mui/material` import and the `import './App.css'`; move the public-only providers and the lead modal under the public layout route; wrap both admin routes in the lazy `AdminSurface`; keep `ScrollManager`, `SEOHead`, `SurfaceManager` and the route table's paths exactly as they are.
- `src/surfaces/SurfaceManager.jsx` — add the hard-navigation rule below.
- `public/index.html` — the Archivo / Instrument Serif / Inter font links become admin-only (see below).

**D — edit** — `src/components/layout/PublicLayout/PublicLayout.jsx` (root gets `class="ia"`), `src/styles/inarch/document.css`, the critical CSS in `public/index.html`.

**Out of scope** — any file under `src/admin/`; the content of the five legacy stylesheets, `src/App.css`, `src/theme/muiTheme.js`, `src/context/ThemeContext.jsx` and `src/data/expertiseData.js` (imported from a new place, never edited); the admin's logo and brand strings (prompt 15); sitemap and robots (prompt 18); the project's Markdown docs (prompt 20).

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

### A. The last surfaces and states

- **404** (`tone="light"`, one screen, `noindex` as today): the `not-found` illustration at 200 px (140 px on phones) with a real `title`; Eyebrow "404"; `h1` `.ia-t-display-xl` "Page not *found.*"; `Text` "The page you were looking for does not exist or has moved."; one primary `Button` "Back to home" → `/` (`data-primary-cta`); and a row of `TextLink`s — "Portfolio", "Contact", and "Start a project" → `openLeadModal('notfound')`. Left-aligned on phones; on desktop the copy sits in columns 2–7 and the illustration in columns 9–11. The same component renders inside `/portfolio/:slug` for an unknown slug.
- **Error state** (`ErrorBoundary`): same behaviour as today — catches render errors below it, logs them with `console.error`, offers a retry that clears the error — in the new design: `tone="light"`, the `something-broke` illustration at 160 px, `h2` `.ia-t-display-md` "Something went wrong loading this page.", a `Button` secondary "Try again" and a `TextLink` "Back to home". `role="alert"`.
- **Route loading** (`RouteFallback`, the Suspense fallback of every lazy public route): `tone="light"`, `min-height: 100svh`, `aria-busy="true"` with a visually hidden "Loading page"; a static skeleton that echoes a page opening — a short label bar, two heading bars at display height, one 4:5 block — built from the `Skeleton` primitive in `--ia-stone` at 60 % opacity. No spinner, no shimmer. It is rarely seen (the page curtain covers most navigations) but must never flash white.
- **No JavaScript**: the `<noscript>` message keeps its wording; forest background, ivory text, the studio's phone number as a `tel:` link beneath it.

### C. The surface split — exact shape

`src/surfaces/AdminSurface.jsx` imports, **in this order**, `../styles/variables.css`, `../styles/global.css`, `../styles/animations.css`, `../styles/responsive.css`, `../styles/dulcey.css`, `../App.css` — the order the entry point and `App.jsx` load them in today — then renders:

```jsx
<ThemeProvider theme={theme}>          {/* @mui/material/styles + src/theme/muiTheme */}
  <CssBaseline />
  <CustomThemeProvider>                 {/* src/context/ThemeContext */}
    <div className="app" id="app-root">{children}</div>
  </CustomThemeProvider>
</ThemeProvider>
```

It also exports the existing MUI spinner fallback (`SectionLoader`'s `default` variant, moved here verbatim from `App.jsx`) for use *inside* the surface.

In `src/App.jsx` the admin routes become, keeping their paths:

```jsx
const AdminSurface = lazy(() => import('./surfaces/AdminSurface'));
// /admin/login
<Suspense fallback={<AdminBootFallback />}>
  <AdminSurface>
    <Suspense fallback={<AdminSpinner />}><AdminLoginRoute /></Suspense>
  </AdminSurface>
</Suspense>
// /admin/*
<Suspense fallback={<AdminBootFallback />}>
  <AdminSurface>
    <Suspense fallback={<AdminSpinner />}>
      <AdminProtectedShell><AdminLayout /></AdminProtectedShell>
    </Suspense>
  </AdminSurface>
</Suspense>
```

- The DOM the admin sees must be what it is today: `#root > div.app#app-root > …admin…`. So on admin routes `App` must not render its own `div.app#app-root` around the routes — the surface provides it. On public routes the public layout provides the wrapper (`id="app-root"`, no `app` class).
- `AdminBootFallback` is what shows for the instant before the admin surface chunk arrives, when neither MUI nor the legacy CSS is loaded. Make it a visual replica of today's fallback using inline styles and an inline SVG only: a 400 px-min-height box with `linear-gradient(180deg, #F5F5F6 0%, #FFFFFF 100%)`, and a centred 40 px spinner in `#0B0B0C` with MUI's indeterminate geometry and timing (viewBox `22 22 44 44`, circle `r="20.5"`, stroke-width 3, rotation 1.4 s linear infinite, dash animation 1.4 s ease-in-out infinite from `1px, 200px` / offset 0 to `100px, 200px` / offset −15 px to `100px, 200px` / offset −125 px).
- **Fonts for the admin.** `src/styles/global.css` still `@import`s Archivo, Instrument Serif and the Inter subset, and it now loads only with the admin. In `public/index.html`, remove the static `<link rel="preload">` / `<noscript>` pairs for those fonts and re-create the same two preload-then-stylesheet links from the first inline script **only when the surface is `admin`**, so the admin's fonts still start loading from the HTML as they do today. Public routes must make no request to `fonts.googleapis.com` or `fonts.gstatic.com`.
- **One surface per document.** There are no links between the public site and the admin, but the two sets of global CSS must never meet in one document: in `SurfaceManager`, if a client-side navigation would change the surface (public ↔ admin), perform a full page load of the target URL (`window.location.assign`) instead of letting the router render it.
- **MUI leaves the public bundle.** After this prompt nothing reachable from a public route imports `@mui/*` or `@emotion/*`.

### D. Scope hoist and the public document

- `PublicLayout`'s root element gets `class="ia"` and `data-tone="light"`; the shell components and pages may keep their own `ia` classes (harmless).
- `document.css`, all under `html[data-surface="public"]`: `body { margin: 0; background: var(--ia-ivory); color: var(--ia-espresso); font-family: var(--ia-font-sans); }`; keep the rules from prompt 04; remove nothing that the admin could match (it matches none of them).
- Critical CSS in `public/index.html`: add `html[data-surface="public"] body { background: #F4EFE7; color: #231B15; font-family: "Manrope", "Manrope Fallback", system-ui, sans-serif; }` so the first paint is ivory, and leave the existing unscoped rules as they are — they are the admin's first paint.
- The legacy-cancelling rules in `src/styles/inarch/base.css` can stay; do not "simplify" the base in this prompt.

### If the admin cannot be made identical

Part C is an optimisation. If, after honest effort, the parity proof below still shows a difference you cannot explain and remove, revert part C completely (the entry point imports the legacy CSS and wraps the app in the MUI providers again, exactly as at the start of this prompt), keep parts A, B and D, record what you saw in `prompts/BUILD_LOG.md`, and say so plainly in your summary. A slower public bundle is acceptable; a changed admin is not.

## Functional guardrails

- **Contract frozen.** `public/api/leads.php` and `public/api/config.example.php` are not edited. The endpoint and its actions stay as they are: `POST /api/leads.php?action=create` with body `{ "lead": { … } }`, plus `list`, `update`, `delete` and `health`. Every lead still carries exactly these keys with the same meaning: `lead_id, name, mobile, email, organization, service_interest, state, message, source, status, submitted_at, updated_at, page_url, user_agent, utm_source, utm_medium, utm_campaign, utm_term, utm_content, notes, activity`. The status keys `new, contacted, consultation_booked, procedure_scheduled, completed, not_interested` are never renamed. `.env` and `.env.example` are not edited (use the git-ignored `.env.development.local` for local overrides). Anything new a lead needs is added as an extra key; nothing existing is renamed, removed or reshaped.
- **Admin-frozen files** — no diff against baseline commit `cc2fc52d90987adcf62a5c286c4eb87d155fc3f3`: `src/admin/**`, `src/theme/muiTheme.js`, `src/styles/variables.css`, `src/styles/global.css`, `src/styles/animations.css`, `src/styles/responsive.css`, `src/styles/dulcey.css`, `src/App.css`, `src/hooks/useMediaQuery.js`, `public/api/**`, `.env`, `.env.example`.
- **Admin-bound values** keep their current values, because the admin prints or reads them: `siteConfig.brandName`, `siteConfig.legalName`, `siteConfig.logo` and `LOGO_SIZE` in `src/data/siteConfig.js`; `expertiseTitles` in `src/data/expertiseData.js`; `seoConfig.pages.admin` in `src/config/seo.js`; `getConfig()` in `src/utils/webhookSubmit.js`. Prompt 15 is the only place they change.
- **The admin's inputs are byte-identical.** `src/admin/**`, the five legacy stylesheets, `src/App.css`, `src/theme/muiTheme.js`, `src/hooks/useMediaQuery.js`, `src/context/ThemeContext.jsx` (apart from prompt 04's one guard) and `src/data/expertiseData.js` show no diff in this prompt. Only *where they are imported from* changes.
- **Cascade order for the admin is preserved.** Measured on the baseline build, the stylesheets in `<head>` appear in this order — direct load of `/admin/login`: font links → the inline critical `<style>` → `main.css` (which today contains the legacy global CSS: variables → global → animations → responsive → dulcey → App) → the login chunk's CSS → MUI / Emotion's injected `<style>` tags; direct load of `/admin/dashboard`: font links → inline `<style>` → `main.css` → Emotion's tags → the admin layout chunk's CSS → the dashboard chunk's CSS. After the split the legacy CSS lives in the admin-surface chunk instead of `main.css`, and that chunk's CSS must sit exactly where the legacy rules sat: before the login chunk's CSS and before Emotion on `/admin/login`; before Emotion and before the layout and page chunks on `/admin/dashboard`. List the order on both builds and compare.
- **Admin behaviour is unchanged:** `/admin` → `/admin/dashboard`; unauthenticated → `/admin/login`; 24-hour session in `localStorage`; 15-second polling; BroadcastChannel sync; CSV export / import; the Guidelines gate; `SEOHead` still titles it "Admin Panel — Dulcey Lead Services" and strips public schemas; `data-theme="light"` is still set on `<html>` by `ThemeContext` on admin routes.
- **Public behaviour is unchanged by parts B–D.** No public page may look different after the legacy CSS, MUI and the old fonts are gone — if one does, the new base layer was leaning on a legacy rule: fix the base, not the page.
- **Error and loading states still protect every lazy public route** (`ErrorBoundary` outside, `Suspense` inside, as `lazyRoute` composes them today).
- **Nothing still in use is deleted.** Each deletion is preceded by a search that proves no importer or reference remains (including `public/index.html`, `public/manifest.json`, `public/.htaccess`, `scripts/` and the Markdown docs — note doc references in the build log for prompt 20 rather than editing the docs here).
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

### Proof for part C — the admin has not moved

1. Build and serve the baseline (`cc2fc52d90987adcf62a5c286c4eb87d155fc3f3`) on port 8081 and this branch on port 8080, as `scripts/qa/README.md` describes.
2. `node scripts/qa/parity.js --a http://127.0.0.1:8081 --b http://127.0.0.1:8080 --suite admin` → **zero** pixel differences and **zero** digest differences on every screen at 390, 768 and 1440 px (login, dashboard, leads list, the open "Interested In" menu, lead detail, delete dialog, Guidelines gate, the four Guidelines tabs, mobile menu).
3. With nothing blocked, open both builds side by side and compare by eye at 1440 and 390: fonts are Archivo on both (`document.fonts.check('16px Archivo')`), every Iconify icon renders, the boot splash and tab icon are the old ones, the first-instant spinner is indistinguishable.
4. On both builds, on `/admin/login` (direct load) and `/admin/dashboard` (direct load, already signed in), list the `<link rel="stylesheet">` and `<style>` nodes of `<head>` in document order: the relative order described in the guardrails matches.
5. Exercise the admin fully (the regression pass below) on the candidate.

### Proof for parts B and D — the public site has not moved

- Build the commit *before this prompt* and serve it on port 8082; run `node scripts/qa/parity.js --a http://127.0.0.1:8082 --b http://127.0.0.1:8080 --suite public`. Expected differences: the 404 route only. Every other route: zero. Then compare by eye with fonts loaded.
- On every public route the network panel shows no request to `fonts.googleapis.com`, `fonts.gstatic.com` or `api.iconify.design`, and no CSS rule from the legacy files is present (`getComputedStyle(document.body).fontFamily` starts with Manrope; searching the loaded CSS for `--admin-accent` finds nothing).
- Bundle: `build/static/js/main.*.js` contains no `@mui` or `@emotion` module (check the source map's `sources`), and its gzip size has dropped compared with the previous prompt; record both numbers in the build log. `sweetalert2` no longer appears in `package.json` or in any chunk.
- Typing `/admin` into the address bar from a public page, and typing `/` from the admin, both produce full page loads; the browser's back button between them works.

### Part A

- **404**: a nonsense URL and `/portfolio/does-not-exist` both show it; title "Page Not Found…", `noindex`, no canonical; all four links work; the lead opened from it stores `source: "notfound"`.
- **Error state**: temporarily throw inside one lazy page — the error state shows inside the shell, "Try again" recovers after the throw is removed (hot reload) and the admin is unaffected; remove the test throw.
- **Loading state**: throttle the network to "Slow 3G" and load `/expertise` directly — the skeleton shows on ivory with no white flash and no layout jump when the page arrives.
- **No JavaScript**: disable JavaScript and load `/` — the message is legible and the phone link works.
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

**Close out.** Append an entry to `prompts/BUILD_LOG.md` (date, "Prompt 14", files created / changed / deleted, decisions taken, every deviation from this prompt with its reason, anything left open). Add a short entry under `## [3.0.0] — IN-ARCH redesign (in progress)` at the top of `CHANGELOG.md`. Commit with a message that starts `IN-ARCH 14:`. Record in the log: whether part C was kept or reverted; the main-bundle gzip size before and after; and the list of deleted files.
