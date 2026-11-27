# 04 — Global shell: dock navigation, footer, page transitions, favicon and meta

**Prompt 4 of 20**

## Depends on

Before writing anything, read in this order: `prompts/00_INDEX.md` (at least "Owner decisions", "Design direction" and "Build architecture"), then `prompts/BUILD_LOG.md` (what earlier sessions really did, including deviations). An owner decision recorded in the index overrides any default written in this prompt; if an answer there disagrees with what the modules in `src/data/` currently hold, bring the data into line first and log it (the admin-bound values named under the guardrails are the exception — only prompt 15 changes those). If the build log shows a dependency below is unfinished, stop and say so instead of improvising it.

- **Prompt 01** — tokens, base layer, `src/motion`, `src/surfaces/SurfaceManager.jsx`, the `data-surface` attribute and the QA scripts exist.
- **Prompt 02** — `studio` in `src/data/siteConfig.js`, the six files in `public/images/brand/`, `src/data/services.js`, `src/data/credits.js` and the image manifest exist.
- **Prompt 03** — the kit in `src/components/ui/` exists (`Button`, `TextLink`, `IconButton`, `Icon`, `Logo`, `LinkProvider`, `Portal`) with `src/hooks/useFocusTrap.js` and `src/hooks/useScrollLock.js`.

## Context

IN-ARCH — *In-Arch Architects & Interior Designer*, Boring Road, Patna, Bihar, led by Principal Architect Ar. Mohammad Hassanuddin — is getting a new public website on an existing React boilerplate that still wears a previous client's brand ("Dulcey Lead Services"). The new brand is warm, quiet, editorial luxury: ivory `#F4EFE7` and espresso `#231B15` (both sampled from the logo), deep charcoal-green `#161E19`, one terracotta accent; Fraunces serif headlines with a single italic terracotta phrase, Manrope for text and UI. Logo files are named for the background they sit ON: `logos/in-arch-logo-light-transparent.png` is the espresso lockup for light backgrounds, `logos/in-arch-logo-dark-transparent.png` the ivory lockup for dark backgrounds, and `logos/in-arch-favicon-light-transparent.png` / `logos/in-arch-favicon-dark-transparent.png` are the "IA" monogram under the same rule. Stack reality: React 18 + Create React App (`react-scripts` 5, plain JavaScript), React Router 7 in `BrowserRouter` mode, CSS Modules, GSAP 3.15 with ScrollTrigger. There is no `db.json`: enquiries are POSTed to `public/api/leads.php` (a JSON-file store) and read by the MUI admin panel at `/admin`.

## Objective

Replace the boilerplate's shell — a fixed glass header with inline links, a burger overlay and a dark footer — with the IN-ARCH shell, so the site already navigates like a different website while the old pages are still being replaced one by one:

1. A masthead that carries only the logo, the **Index Dock** (the persistent bottom navigation and primary CTA), the full-screen **index overlay**, and a new footer.
2. GSAP **page transitions** with a route announcer and focus management.
3. The final public **route table** and navigation data (six destinations), with honest interim pages for the three routes built later.
4. The **document-level brand** for the public surface: favicon and PWA icons, manifest, splash screen, default title and meta, Open Graph image.

The old page bodies (Home, About, Expertise, Who We Serve, Contact, 404) keep rendering — unchanged — inside the new shell until their own prompts replace them.

## Scope — files/areas to touch

**Create**

- `src/components/shell/Masthead/`, `Dock/`, `IndexOverlay/`, `Footer/`, `Curtain/`, `RouteAnnouncer/` (each `.jsx` + `.module.css`).
- `src/components/shell/transition/TransitionProvider.jsx`, `TLink.jsx`, `usePageReady.js`.
- `src/components/shell/useSurfaceTone.js` (reports the `data-tone` of the section currently under a given viewport position).
- `src/pages/Pending/PendingPage.jsx` + `.module.css` + `index.js`.
- `src/styles/inarch/document.css` (imported last by `src/styles/inarch/index.css`).
- `public/legacy-icons/favicon.ico`, `favicon.png`, `apple-touch-icon.png` — byte copies of today's three files, made **before** they are regenerated.

**Rewrite**

- `src/components/layout/PublicLayout/PublicLayout.jsx` and `.module.css` — the new shell (keep the file path and default export; `App.jsx` imports it).
- `src/data/navigation.js` — keep the export name `NAV_LINKS` and the `{ to, label, num }` shape, add `descriptor`:

  | num | to | label | descriptor |
  |---|---|---|---|
  | 01 | `/` | Home | Overview |
  | 02 | `/about` | Studio | Practice, philosophy and principal architect |
  | 03 | `/expertise` | Expertise | Seven services, one process |
  | 04 | `/interior-design` | Interior Design | Homes, kitchens and made-to-measure detail |
  | 05 | `/portfolio` | Portfolio | Selected work |
  | 06 | `/contact` | Contact | Start a project |

- `scripts/generate-icons.js` and `scripts/generate-og.js` — for the IN-ARCH mark and palette; then regenerate `public/favicon.ico`, `favicon.png`, `apple-touch-icon.png`, `logo192.png`, `logo512.png`, `maskable-192.png`, `maskable-512.png` and `public/og-image.png`.

**Edit**

- `src/App.jsx` — wrap the public routes in `TransitionProvider` and the kit's `LinkProvider` (now supplying `TLink`); add lazy routes `/interior-design`, `/portfolio` and `/portfolio/:slug`, all rendering `PendingPage` for now; give every lazy route a `preload()` handle. Leave the `/industries` route, both `/admin` routes, `ErrorBoundary`, `SectionLoader`, `ScrollManager`, `LeadModalWrapper`, `SEOHead`, the `.app` wrapper and the provider order exactly as they are.
- `src/utils/hashScroll.js` — `HEADER_OFFSET` 90 → 32 (there is no fixed header to clear any more); nothing else.
- `src/context/ThemeContext.jsx` — one guard only: `applyTheme` skips the `theme-color` write when `document.documentElement.dataset.surface === 'public'` (the shell owns that tag on public routes). Nothing else in the file changes.
- `src/config/seo.js` — site-level values (`siteName`, `defaultTitle`, `titleTemplate`, `defaultDescription`, `organization`) now read `studio`; add `pages.interiors`, `pages.portfolio`, `pages.project` and `pages.pending` (`noindex`). Leave `pages.admin` and the entries of the pages that are still old untouched.
- `src/components/common/SEO/SEOHead.jsx` — extend `ROUTE_MAP` / `resolvePage` for the three new routes (prefix match for `/portfolio/…`); pending pages resolve to `pages.pending`.
- `public/index.html` and `public/manifest.json` — as specified below.
- `scripts/qa/public-check.js` — make sure its default route list now includes the three new routes.

**Delete** — `src/components/common/Header/`, `src/components/common/MobileMenu/`, `src/components/common/Footer/` (confirm with a search that only `PublicLayout` imported them).

**Out of scope** — the body of every page (`src/pages/Home|About|Expertise|Industries|Contact|NotFound`), `UnifiedLeadForm` and `LeadModal` (prompt 05 — the dock simply calls the existing `openLeadModal`), `public/sitemap.xml` and `public/robots.txt` (prompt 18), the legacy images and logo files in `public/images/` (still used by old pages and by the admin), everything under `src/admin/`.

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

### 1. Shell anatomy (DOM order)

Skip link → `Masthead` (`<header>`) → `Dock` (`<nav aria-label="Primary">`) → `IndexOverlay` → `<main id="main-content" tabindex="-1">` with the routed page → `Footer` → `Curtain` → `RouteAnnouncer`. The `ia` scope is inherited by every descendant and cannot be switched off further down, so **do not** put it on `PublicLayout`'s wrapper or on `<main>` yet: each shell component (`Masthead`, `Dock`, `IndexOverlay`, `Footer`, `Curtain`) carries `class="ia"` on its own root, and each rebuilt page will carry it on its own root. That way the old page bodies keep inheriting the legacy typography exactly as before until their prompts replace them. (Prompt 14 hoists the class to the layout root once no old page is left.)

### 2. Masthead — the logo and nothing that sticks

- Positioned at the top of the page, over the first section, and scrolls away with it (`position: absolute`). Height 72 px (phones) / 88 px (≥ 768) / 104 px (≥ 1024); inline padding = page gutter.
- Left: `Logo`, linking to `/` — the wordmark at 22 px tall on phones and 26 px from 768; the full lockup at 48 px tall from 1024.
- Right: on phones a `phone` `IconButton` (48 px, `tel:` link, accessible name "Call +91 72928 31128"); from 1024 a quiet meta line in `.ia-t-label`: "Patna, Bihar" · the phone number as a `tel:` link.
- Tone follows the first section of the page (`data-tone`; `light` for legacy pages). Over a photographic hero it uses the ivory logo and sits on the hero's own overlay.

### 3. The Index Dock — the navigation pattern

Phones and tablets (< 1024 px):

- Fixed; `left` / `right` 12 px; `bottom: max(12px, env(safe-area-inset-bottom))`; height 56 px; 2 px radius; 1 px border `--ia-line`; background `color-mix(in srgb, var(--ia-bg) 86%, transparent)` with `backdrop-filter: blur(16px) saturate(140%)` (solid `--ia-bg` where unsupported); shadow `--ia-shadow-overlay`.
- Three zones, left to right: **Menu** (`menu` icon + the word "Menu", hit area ≥ 88 × 56) · **Start a project** (`Button` `md`, primary, flexible width, opens the lead modal with source `dock-cta`) · **WhatsApp** (`IconButton` 48 px, `studioWhatsAppHref('Hello IN-ARCH, I would like to discuss a project.')`, accessible name "Message IN-ARCH on WhatsApp").
- Its tone copies the section beneath it (`useSurfaceTone` at the dock's vertical centre), cross-fading colours over 240 ms, so it always reads as part of the page.
- **The dock yields.** Any in-page button marked `data-primary-cta` that is at least 60 % visible makes the dock's own button switch to the secondary variant (colours only, 240 ms), so a viewport never shows two primary buttons. On `/contact` the dock button reads "Write to us" and scrolls to `#enquiry` instead of opening the modal.
- It slides out (`translateY(140%)`, 400 ms) only when: the index overlay is open, the lead modal is open, a text field has focus on a touch device (the keyboard is up), or the footer's contact block is at least 40 % visible. It never auto-hides on scroll — the primary action stays in reach.

Desktop (≥ 1024 px):

- Centred at the bottom, 24 px from the edge, height 60 px, width to content (max 960 px).
- Left to right: the "IA" `Logo` mark (26 px tall, links home, accessible name "IN-ARCH — home") · a hairline · the five links Studio, Expertise, Interior Design, Portfolio, Contact (label style `0.75rem` / 600 / `0.14em` uppercase, each ≥ 44 px tall with 18 px inline padding) · a hairline · **Start a project** (`Button` `md`).
- Current page: `aria-current="page"` plus a 6 px terracotta dot under the label. Hover / focus-visible: the `TextLink` underline draws from the left.
- Same tone-following and the same slide-out conditions (minus the keyboard rule).

Because the dock is fixed to the bottom, the public document gets `scroll-padding-bottom: var(--ia-dock-clearance)` and the footer gets matching bottom padding, so a focused control or the last line of a page is never hidden behind it (WCAG 2.2 "Focus Not Obscured").

### 4. Index overlay (< 1024 px)

- A full-viewport `nav` (`aria-label="Site index"`), `data-tone="dark"`, rendered through `Portal`. Opens by rising from the bottom (`yPercent` 100 → 0, 500 ms `power3.inOut`); rows then rise 24 px with a 0.06 s stagger; closes in 350 ms. Under reduced motion it appears and disappears instantly.
- Top: the ivory wordmark (24 px tall). Middle: the six `NAV_LINKS` as rows — number in `.ia-t-label` terracotta-300, label in `.ia-t-display-lg`, descriptor in `.ia-t-small` mist; hairline between rows; each row ≥ 64 px tall; current page marked with `aria-current` and the terracotta dot. Above the bottom bar: the address line and the phone number (tel link) in `.ia-t-small`.
- Bottom bar, in the same three positions as the dock so the thumb does not travel: **Close** (where Menu was) · **Start a project** · **WhatsApp**.
- Behaviour carried over from the old `MobileMenu`, unchanged: focus moves to the first link on open; Tab cycles inside; Escape closes; body scroll is locked; choosing a link closes it; any route change closes it; crossing 1024 px closes it; focus returns to the Menu button; while closed it is `inert` and `aria-hidden`.

### 5. Footer

`data-tone="dark"`, compact rhythm, bottom padding `calc(var(--ia-dock-clearance) + env(safe-area-inset-bottom))`.

- Opening line: the ivory lockup (44 px tall on phones, 56 px from 768) and `studio.blurb`, with one quiet action beside it — "Have a project in mind?" + `TextLink` "Start a project" (lead modal, source `footer-cta`). No large CTA band here: pages end in their own way.
- Four groups — stacked on phones, two columns from 768, four across the 12-column grid from 1024: **Explore** (the six `NAV_LINKS`); **Services** (the seven service titles, each linking to `/expertise#e0N`); **Visit** (address from `studio.address`, "From 10:00 AM" from `studio.hours`, `TextLink` "Get directions" → `studioMapsHref`); **Talk** (phone as `tel:`, WhatsApp, and the email only if `studio.email` is set). Any empty value renders nothing.
- Legal row in `.ia-t-caption`: "© {year} In-Arch Architects & Interior Designer. All rights reserved." · the existing developer credit from `siteConfig.developer` (new-tab link with the screen-reader note, as today; owner decision D-15 keeps it) · the "Icons by Icons8" link from `credits.js` when it is required · a "Back to top" `IconButton`.

### 6. Page transitions

- `TLink` is used for every internal link in the shell and, through `LinkProvider`, by every kit component. A plain left-click (no modifier key, same origin, not `target="_blank"`, a different path) is handed to `TransitionProvider.navigate(to)`; anything else behaves as a normal link.
- Sequence: the `Curtain` (fixed, `--ia-z-curtain`, forest, ivory "IA" mark 40 px centred) covers from the bottom (`yPercent` 100 → 0, 400 ms `power3.inOut`) → the router navigates (the existing `ScrollManager` resets the scroll under cover) → the provider waits for the new page's `usePageReady()` signal, capped at 1200 ms → the curtain leaves upward (0 → −100, 550 ms) → hero animations (`data-m-now`) start as it leaves.
- Browser back / forward (`useNavigationType() === 'POP'`): no cover; the new page fades in over 240 ms. Reduced motion: no curtain at all.
- `TLink` calls the target route's `preload()` on `pointerenter`, `focus` and `touchstart`, so the chunk is usually ready before the cover finishes.
- After every navigation `RouteAnnouncer` (visually hidden, `aria-live="polite"`) announces the new document title, and focus moves to `<main>` with `preventScroll` unless the URL has a hash.

### 7. Interim pages

`PendingPage` (routes `/interior-design`, `/portfolio`, `/portfolio/:slug` until their prompts land): `data-tone="light"`, one screen, an `Eyebrow`, the heading "This page is being prepared.", and two `TextLink`s (Home, Contact). `noindex`. It calls `usePageReady()`. The final QA prompt fails if any route still renders it.

### 8. Document-level rules for the public surface — `document.css`

Everything is prefixed `html[data-surface="public"]`, so the admin never matches:

- `html[data-surface="public"] { overflow-x: clip; scroll-behavior: auto; scroll-padding-bottom: var(--ia-dock-clearance); scrollbar-color: var(--ia-border) var(--ia-ivory); }`
- `html[data-surface="public"] body { overflow: visible; }` and `html[data-surface="public"] .app { overflow: visible; touch-action: auto; padding-top: 0; }` — the legacy `overflow-x: hidden` on `body` and `.app` turns them into scroll containers and silently breaks `position: sticky`, which later pages need; the legacy `touch-action: pan-y` interferes with horizontal swipe rows.
- Leave the legacy `background`, `color` and `font-family` on `body` alone for now (old pages still depend on them); prompt 14 switches them.

### 9. Document brand — `public/index.html`, manifest, icons

- **Favicon and PWA icons** — ivory "IA" (from `logos/in-arch-favicon-dark-transparent.png`) on a solid espresso `#231B15` tile, so it reads on light and dark browser chrome: `favicon.ico` (16 / 32 / 48), `favicon.png` (32), `apple-touch-icon.png` (180, opaque), `logo192.png` / `logo512.png` (`purpose: any`), `maskable-192.png` / `maskable-512.png` (opaque, mark inside the central 80 % safe zone). The mark's strokes are hairlines: for the 16 – 48 px sizes thicken the alpha (blur it slightly, then steepen it) until "IA" is legible at 16 px, without changing its proportions. Keep the seven file names — `public/.htaccess` and the manifest depend on them.
- **Manifest** — `name` "In-Arch Architects & Interior Designer", `short_name` "IN-ARCH", `description` = `studio.blurb`, `theme_color` `#161E19`, `background_color` `#F4EFE7`; the icon list unchanged in shape.
- **Open Graph image** — 1200 × 630: the `og-source` photograph under a forest overlay (`rgba(22,30,25,0.62)`) with the ivory lockup centred-left at 520 px wide. No other text (the build machine's fonts are not the brand's).
- **`index.html`, public surface only.** New `<title>` and description for the home page ("In-Arch Architects & Interior Designer | Architects in Patna, Bihar" and the PDF's meta description), matching `og:` / `twitter:` titles and descriptions, `og:site_name`, `apple-mobile-web-app-title` "IN-ARCH", `theme-color` `#161E19`. Remove the five static JSON-LD blocks, the canonical link and the `og:url` / `twitter:url` tags for now — `SEOHead` already creates all of them at run time, and prompt 18 restores a correct static copy once the domain is known. Add font preloads for `manrope-v1-latin.woff2` and `fraunces-v1-latin.woff2`, and remove nothing from the existing Archivo / Instrument Serif / Inter links (old pages and the admin still use them).
- **Surface-aware boot.** The admin must not change before prompt 15, and it shares this HTML document. So: keep today's splash markup and CSS exactly as they are but show them only when `data-surface="admin"`; add a second, IN-ARCH splash for `data-surface="public"` (forest background, the ivory "IA" mark 56 px, a 120 px hairline that fills left to right with `scaleX`; no tagline, no percentage); both use the existing `#initial-loader` hide contract (the `hidden` class added by `App.jsx` and by the inline fallback timers) — give the two blocks a shared class the scripts can target and keep the id on whichever is shown. In the first inline script, when the surface is `admin`, repoint the three icon `<link>`s to `/legacy-icons/…` and skip the two new font preloads. Add the public rules to the critical CSS under `html[data-surface="public"]` instead of editing the existing unscoped rules.

## Functional guardrails

- **Contract frozen.** `public/api/leads.php` and `public/api/config.example.php` are not edited. The endpoint and its actions stay as they are: `POST /api/leads.php?action=create` with body `{ "lead": { … } }`, plus `list`, `update`, `delete` and `health`. Every lead still carries exactly these keys with the same meaning: `lead_id, name, mobile, email, organization, service_interest, state, message, source, status, submitted_at, updated_at, page_url, user_agent, utm_source, utm_medium, utm_campaign, utm_term, utm_content, notes, activity`. The status keys `new, contacted, consultation_booked, procedure_scheduled, completed, not_interested` are never renamed. `.env` and `.env.example` are not edited (use the git-ignored `.env.development.local` for local overrides). Anything new a lead needs is added as an extra key; nothing existing is renamed, removed or reshaped.
- **Admin-frozen files** — no diff against baseline commit `cc2fc52d90987adcf62a5c286c4eb87d155fc3f3`: `src/admin/**`, `src/theme/muiTheme.js`, `src/styles/variables.css`, `src/styles/global.css`, `src/styles/animations.css`, `src/styles/responsive.css`, `src/styles/dulcey.css`, `src/App.css`, `src/hooks/useMediaQuery.js`, `public/api/**`, `.env`, `.env.example`.
- **Admin-bound values** keep their current values, because the admin prints or reads them: `siteConfig.brandName`, `siteConfig.legalName`, `siteConfig.logo` and `LOGO_SIZE` in `src/data/siteConfig.js`; `expertiseTitles` in `src/data/expertiseData.js`; `seoConfig.pages.admin` in `src/config/seo.js`; `getConfig()` in `src/utils/webhookSubmit.js`. Prompt 15 is the only place they change.
- **Old pages keep working inside the new shell.** `/`, `/about`, `/expertise` (accordion, `#e01`–`#e10` deep links, "Discuss this area" pre-filling the form), `/industries` (still reachable by URL although it has left the navigation), `/contact` (inline form) and the 404 render with their old bodies and their old typography; every CTA on them still opens the lead modal with its old `source` key.
- **Shell behaviours preserved.** Skip link first in the tab order; exactly one primary `nav`; the overlay keeps every behaviour listed in part 4; `ModalContext` still closes the modal on navigation; `ScrollManager` still jumps to the top on every navigation (including a click on the current route) and still scrolls to hash targets; `SEOHead` still sets `noindex` and strips schemas on `/admin` and unknown URLs.
- **Lead sources.** `dock-cta` and `footer-cta` are the shell's source keys (the old `header-cta` and `mobile-menu-cta` retire with the components that used them); they are plain strings stored in the lead's `source` field — no contract change.
- **The admin's document chrome is unchanged.** On `/admin/*` the tab icon, the splash screen and the loaded fonts are today's; `seoConfig.pages.admin` still produces "Admin Panel — Dulcey Lead Services". The only shared-file edits are the ones listed under Scope.
- **No dead ends.** Every link in the dock, the overlay and the footer resolves to a rendered route; nothing points at a route that does not exist yet.
- **Truthful content.** Every fact comes from `details of in-arch.pdf` through the modules in `src/data/`. No testimonials, awards, client names, statistics, ratings, years, areas, locations or quotes are invented; where the client supplied nothing the surface stays silent and the gap is listed in `prompts/00_INDEX.md`. The footer shows no email, PIN code, social icon or opening days while those values are empty in `studio`.
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

- **Unit tests.** `getSurface`; `NAV_LINKS` has six unique `to` values that each match a `<Route>`; `TLink` hands plain clicks to the transition provider and leaves modified clicks, external links and hash-only links alone; the footer renders no email row while `studio.email` is empty.
- **Dock.** At 360, 390 and 768 px: three zones, each ≥ 44 px, the CTA label never truncates, safe-area inset respected (emulate an iPhone with a home indicator), tone switches when a dark section passes under it, slides out for the overlay, the modal, a focused field and the footer contact block. At 1024, 1280, 1440 and 1920 px: centred, all five links visible, current page marked on every route, never wider than 960 px.
- **Overlay.** Opens and closes from the Menu button, by Escape and by choosing a link; focus is trapped and returned; the page behind does not scroll; rotating to landscape or resizing past 1024 px closes it.
- **Transitions.** Click through every link in the dock, overlay and footer: cover → navigate → reveal, scroll at the top afterwards, focus on `<main>`, the title announced; back and forward buttons work without a cover; ten rapid clicks on different links never leave the curtain stuck; with CPU throttled 4× the cover and reveal stay smooth; with reduced motion there is no curtain.
- **Old pages in the new shell.** Each old page is fully usable and visually intact below the masthead; the Expertise accordion deep links (`/expertise#e07` typed directly and via the Home index rows) still open and scroll to the right item.
- **Document brand.** Public routes: new favicon in the tab, new splash on a hard reload, title and description correct in view-source, `theme-color` `#161E19`, only the three brand fonts preloaded. `/admin/login` and `/admin/dashboard`: old favicon, old splash, title "Admin Panel — Dulcey Lead Services", Archivo applied. Validate `manifest.json` and that all seven icon files have the stated sizes.
- **Admin parity.** `node scripts/qa/parity.js --suite admin` against the baseline build: zero differences.
- **Breakpoints.** Check 360, 390, 768, 1024, 1280, 1440 and 1920 px wide, plus one landscape phone (844 × 390): no horizontal scroll, nothing clipped or overlapping, every tap target ≥ 44 × 44 px, no text below 12 px, and the dock never hides a focused control.
- **Keyboard.** Tab through the whole surface: logical order, a visible 2 px focus ring on every stop, no trap outside an open overlay, Escape closes overlays and returns focus to the opener, Enter and Space activate.
- **Contrast.** Text ≥ 4.5:1 (≥ 3:1 from 24 px, or 18.66 px bold); control boundaries and focus rings ≥ 3:1. Measure text that sits on a photograph at its worst pixel.
- **Screen reader.** Exactly one `h1`, headings in order, `nav` / `main` / `footer` landmarks, meaningful `alt` on content images and empty `alt` on decorative ones, an accessible name on every control, results announced through live regions. Inspect the accessibility tree, and use VoiceOver or NVDA if the session has one.
- **Reduced motion.** Emulate `prefers-reduced-motion: reduce`: everything is visible and usable with no transforms, parallax, pinning or curtain.
- **Automated.** `node scripts/qa/public-check.js` reports no console errors, no failed requests, no horizontal overflow and zero serious or critical axe violations; `npm test -- --watchAll=false` passes; `npm run build` ends with "Compiled successfully" and no warnings.

**Regression pass — the whole site, every time.** Walk `/`, `/about`, `/expertise`, `/interior-design`, `/portfolio`, one `/portfolio/<slug>`, `/industries`, `/contact` and a nonsense URL at 390 px and at 1440 px. Open the lead modal from three different CTAs. Submit one real enquiry through the modal and one through `/contact` (do it by hand in the browser and read the request body in the network panel), confirm the success state, then submit the same mobile number again and confirm the duplicate path. Log in at `/admin` with the `REACT_APP_ADMIN_USERNAME` / `REACT_APP_ADMIN_PASSWORD` values from `.env` (read them at run time; never print or copy them) and confirm: the dashboard counts and recent table; the leads table (search, every filter, sorting, pagination, inline status change, bulk select, CSV export and import, delete with its confirm dialog); a lead's detail page (the lead you just sent shows its name, mobile, email, interested-in, message, source and page URL; add a note; change the status); the Guidelines password gate and its four tabs; logout. Then run the admin-frozen check — it must print nothing:

```bash
git diff --stat cc2fc52d90987adcf62a5c286c4eb87d155fc3f3 -- src/admin src/theme src/styles/variables.css src/styles/global.css src/styles/animations.css src/styles/responsive.css src/styles/dulcey.css src/App.css src/hooks/useMediaQuery.js public/api .env .env.example
```

If the baseline commit is missing from a shallow clone, run `git fetch --unshallow origin` first. Fix whatever the pass finds before calling this prompt done, and delete the test leads afterwards (`build/api/data/` and `public/api/data/` are git-ignored; never commit them).

**Close out.** Append an entry to `prompts/BUILD_LOG.md` (date, "Prompt 04", files created / changed / deleted, decisions taken, every deviation from this prompt with its reason, anything left open). Add a short entry under `## [3.0.0] — IN-ARCH redesign (in progress)` at the top of `CHANGELOG.md`. Commit with a message that starts `IN-ARCH 04:`.
