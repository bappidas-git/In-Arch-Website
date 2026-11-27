# 03 — Core UI primitives

**Prompt 3 of 20**

## Depends on

Before writing anything, read in this order: `prompts/00_INDEX.md` (at least "Owner decisions", "Design direction" and "Build architecture"), then `prompts/BUILD_LOG.md` (what earlier sessions really did, including deviations). An owner decision recorded in the index overrides any default written in this prompt; if an answer there disagrees with what the modules in `src/data/` currently hold, bring the data into line first and log it (the admin-bound values named under the guardrails are the exception — only prompt 15 changes those). If the build log shows a dependency below is unfinished, stop and say so instead of improvising it.

- **Prompt 01** — tokens, base layer, `src/motion`, the Design Lab and the QA scripts exist (`src/styles/inarch/base.css`, `src/motion/useMotionScope.js`, `src/lab/LabPage.jsx`, `scripts/qa/public-check.js`).
- **Prompt 02** — brand files, image manifest, icons, illustrations and data modules exist (`public/images/brand/inarch-wordmark-on-light-1383.png`, `src/data/imageManifest.json`, `src/data/images.js`, `src/data/services.js`, `public/images/inarch/icons/`).

## Context

IN-ARCH — *In-Arch Architects & Interior Designer*, Boring Road, Patna, Bihar, led by Principal Architect Ar. Mohammad Hassanuddin — is getting a new public website on an existing React boilerplate that still wears a previous client's brand ("Dulcey Lead Services"). The new brand is warm, quiet, editorial luxury: ivory `#F4EFE7` and espresso `#231B15` (both sampled from the logo), deep charcoal-green `#161E19`, one terracotta accent; Fraunces serif headlines with a single italic terracotta phrase, Manrope for text and UI. Logo files are named for the background they sit ON: `logos/in-arch-logo-light-transparent.png` is the espresso lockup for light backgrounds, `logos/in-arch-logo-dark-transparent.png` the ivory lockup for dark backgrounds, and `logos/in-arch-favicon-light-transparent.png` / `logos/in-arch-favicon-dark-transparent.png` are the "IA" monogram under the same rule. Stack reality: React 18 + Create React App (`react-scripts` 5, plain JavaScript), React Router 7 in `BrowserRouter` mode, CSS Modules, GSAP 3.15 with ScrollTrigger. There is no `db.json`: enquiries are POSTed to `public/api/leads.php` (a JSON-file store) and read by the MUI admin panel at `/admin`.

## Objective

Build the component kit that the shell, the lead form and every page are assembled from, so that separate sessions produce one coherent site: layout and type primitives, the "wipe & swap" CTA family, links, form fields, media, tiles, disclosure, and the overlay utilities. Every primitive is tone-aware, keyboard-complete, touch-first and demonstrated in every state in the Design Lab. No live route changes in this prompt.

## Scope — files/areas to touch

**Create** — `src/components/ui/`, one folder per primitive (`Name/Name.jsx`, `Name/Name.module.css`, tests beside it where listed) and a barrel `src/components/ui/index.js`:

- Layout: `Container`, `Grid` (+ `Col`), `Section`, `Stack`.
- Type: `Eyebrow`, `Heading`, `Text`, `Lede`.
- Actions: `Button`, `TextLink`, `IconButton`, `Icon` (local UI sprite), `LinkProvider` (context that supplies the link component — plain `react-router-dom` `Link` for now; prompt 04 swaps in the transition-aware link in one place).
- Forms: `Field`, `TextInput`, `TextArea`, `SelectInput`, `ChoiceChips`, `Notice`.
- Media and brand: `Logo`, `Picture`, `Frame`, `Figure`, `LottieIcon`, `Illustration`.
- Content: `ProjectTile`, `Accordion` (+ `AccordionItem`), `FactList`, `Rule`, `Chip`, `ScrollMarquee`, `Skeleton`, `VisuallyHidden`.
- Overlay utilities: `src/hooks/useFocusTrap.js`, `src/hooks/useScrollLock.js`, `src/components/ui/Portal/Portal.jsx`.

**Edit** — `src/lab/LabPage.jsx` (add a "Primitives" section). Add the runtime dependency `lottie-web` only if you use it for `LottieIcon`; it must be imported dynamically (`import('lottie-web/build/player/lottie_light')`) so it never enters the main bundle.

**Out of scope** — the shell, the lead form and every page (they are still the old ones and must not import the kit yet); `src/hooks/useMediaQuery.js` (admin-frozen — import it read-only if you need a media-query hook); anything under `src/admin/`; the legacy `.btn` / `.eyebrow` / `.display` classes in `src/styles/dulcey.css`, which keep serving the old pages.

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

### Rules for every primitive

- Reads only the tone variables, so it is correct on `light`, `sand`, `paper` and `dark` without variants.
- Mobile first: the default styles are the 360 px styles; larger layouts are added at 768 / 1024 / 1280 / 1440.
- Interactive targets are at least 44 × 44 CSS px; nothing is revealed only on hover; every hover effect has an equivalent `:focus-visible` state and a press state for touch.
- Motion is transform / opacity only, uses the duration and easing tokens, and collapses to a colour change under reduced motion.
- Accepts `className` and forwards refs and unknown props to its root element; no primitive hard-codes copy or business facts.

### Layout

- `Container` — `.ia-container`. `Grid` — the 4 / 8 / 12 grid; `Col` takes `span`, `start` and per-breakpoint overrides (`md`, `lg`, `xl`) and writes them as CSS custom properties, so asymmetric editorial layouts are declared in markup. `Section` — `<section>` with `tone`, `rhythm` (`default` = `var(--ia-section-y)`, `compact`, `none`), optional `id`, and `minHeight="screen"` (uses `100svh`, never `100vh`). `Stack` — vertical rhythm with a `gap` token.

### Type

- `Eyebrow` — the numbered label: index in `var(--ia-accent)` + a 32 px hairline + the label, set in `.ia-t-label` ("01 — The practice"). Minimum 12 px; never the only heading of a section.
- `Heading` — props `as` (`h1`–`h4`), `size` (`2xl | xl | lg | md | sm`), `lines` (adds `data-m="lines"`). The single accent phrase is passed as `<em>` and rendered italic in `var(--ia-accent-display)`; in development it warns if more than one `<em>` is supplied or if an accent is used below 24 px on a light tone (terracotta-500 only reaches 3.75:1).
- `Text` (`size`: `lg | md | sm | caption`, `muted` → `--ia-fg-2`) and `Lede` (body-lg, max 52ch).

### Actions — the "wipe & swap" family

| | `Button` primary | `Button` secondary | `Button` ghost | `TextLink` | `IconButton` |
|---|---|---|---|---|---|
| Rest | background `--ia-fg`, label `--ia-bg` | transparent, 1 px border `--ia-fg`, label `--ia-fg` | for use over photographs: 1 px ivory border, ivory label | text with a 1 px underline at 35 % opacity, optional trailing arrow | 48 px circle, 1 px border, 20 px arrow |
| Hover / focus-visible | fill layer in `--ia-accent` wipes up (`scaleY` 0 → 1, origin bottom, 400 ms expo); label stays readable (ivory on `#8F4A2B` = 5.77:1 on light tones; forest on `#DDA27F` = 7.74:1 on dark); arrow swap | fill layer in `--ia-fg`; label flips to `--ia-bg`; arrow swap | fill layer ivory; label flips to forest; arrow swap | a full-opacity underline in `--ia-accent` draws from the left (`scaleX`); arrow nudges 3 px up-right | fill layer + arrow swap |
| Press | `scale(0.98)`, 150 ms | same | same | opacity 0.7 | `scale(0.94)` |
| Focus ring | 2 px `--ia-focus`, 3 px offset | same | 2 px ivory ring plus a 4 px forest halo so it shows on any photograph | same ring, 2 px offset | same |

- Sizes: `lg` min-height 52 px, inline padding 28 px; `md` min-height 44 px, inline padding 20 px. Label: Manrope 600, `0.75rem`, uppercase, `0.14em`; 12 px gap to a 16 px arrow. `fullWidth` stretches the button (the default on phones inside forms and the dock).
- The arrow swap: two arrows inside a 16 px `overflow: hidden` box; on hover the first moves to (100 %, −100 %) and the second arrives from (−100 %, 100 %), 400 ms expo.
- `Button` renders a `<button>`, an `<a href>` or the provider's link component (`to`). States: `disabled` (stone background, ink-3 label, `cursor: not-allowed`, still focusable when `aria-disabled` is used instead) and `loading` (width locked, label replaced by the `loadingLabel`, `aria-busy`). Optional `magnetic` on `lg` buttons: the button follows a fine pointer by at most 6 px and springs back in 400 ms; never on touch, never under reduced motion.
- `Icon` — an inline-SVG sprite drawn on a 24 px grid with a 1.5 px stroke in `currentColor`: `arrow-up-right`, `arrow-right`, `arrow-left`, `arrow-down`, `plus`, `minus`, `close`, `menu`, `phone`, `chat`, `mail`, `pin`, `clock`, `check`, `alert`, `external`. For WhatsApp use the generic `chat` glyph beside the word "WhatsApp"; do not redraw or recolour WhatsApp's logo.

### Forms

- `Field` wraps one control: a visible `<label>` above it (Manrope 600, 13 px, sentence case — never placeholder-as-label), an optional hint, and an error slot wired with `aria-describedby` / `aria-invalid`. Required fields show "required" as text for assistive tech and a terracotta asterisk visually; optional fields say "optional".
- `TextInput`, `TextArea`, `SelectInput`: min-height 52 px, padding 14 × 16 px, 16 px text (prevents iOS zoom), background `--ia-paper` on light tones and `--ia-forest-2` on dark, 1 px border `--ia-line-strong` (≥ 3:1 against its surround), 2 px radius. Focus: border `--ia-accent` plus the standard ring. Error: border and message in the error colour with an `alert` icon — never colour alone. `SelectInput` is a native `<select>` with a custom chevron. `TextArea` grows with content up to 12 lines.
- `ChoiceChips` — a radio group rendered as chips (min-height 44 px, 1 px border; selected: `--ia-fg` background, `--ia-bg` text); arrow keys move the selection as native radios do.
- `Notice` — inline message with `variant` `info | success | error`, an icon, optional actions; `role="status"` for info and success, `role="alert"` for errors.

### Media and brand

- `Logo` — props `variant` (`lockup | wordmark | mark`), `height` (px), `tone` (defaults to the nearest `data-tone`). Picks the correct file from `studio.logos` (dark-ink files on light tones, ivory files on dark), sets intrinsic `width` / `height`, `alt` = `studio.fullName`, and in development warns if `lockup` is requested under 44 px.
- `Picture` — props `image` (a manifest key), `sizes` (required), `priority` (eager + `fetchpriority="high"`, otherwise `loading="lazy"` + `decoding="async"`), `alt` override, and `art` — an optional list of `{ media, image }` for art-directed crops (for example a 4:5 key below 768 px and a 16:9 key above), rendered as extra `<source media>` sets. Renders `<picture>` with AVIF and WebP `<source>`s and a JPEG `<img>` carrying `srcset`, `width` and `height`. The manifest placeholder is the wrapper's background; the image fades in over 400 ms once decoded (no fade when it is already cached or under reduced motion). In development it warns when `sizes` is missing or `alt` is undefined.
- `Frame` — an `aspect-ratio` box with `overflow: hidden` that holds a `Picture`; props `ratio` (`4/5`, `3/2`, `16/9`, `21/9`, `1/1`), `reveal` (adds `data-m="shutter"` and the cover child), `parallax` (adds `data-m-parallax`; the inner image is rendered 14 % taller so drift never exposes an edge), `arch` (rounds the top corners fully — reserved for the Interior Design page). `Figure` adds a caption in `.ia-t-caption`.
- `LottieIcon` — loads the player and the JSON only when the icon is about to enter the viewport, plays once at ≥ 50 % visibility, shows the matching static SVG before load, on error and under reduced motion. `Illustration` — renders one of the four SVGs by name with a required `title` or `decorative` flag.

### Content

- `ProjectTile` — one link wrapping a `Frame` (`4/5` or `3/2`), a meta row (index and category in `.ia-t-label`), the title in `.ia-t-display-sm` and an arrow. Everything is visible at rest — no hover-only captions. Hover / focus-visible: the image scales to 1.04 over 700 ms, the arrow swaps, the title gets the `TextLink` underline.
- `Accordion` / `AccordionItem` — header is a real `<button>` with `aria-expanded` and `aria-controls`; the panel is `role="region"` labelled by its header. Supports single-open and multi-open, a controlled `openId` + `onToggle`, and an `id` on each item for deep links. Opening shows the panel immediately and fades / raises its content (opacity and 12 px `y`, 400 ms) — no height animation; the `plus` icon rotates 45°.
- `FactList` — a `<dl>` for label / value pairs that skips any pair whose value is empty. `Rule` — a 1 px line with `data-m="rule"`. `Chip` — a filter toggle (`aria-pressed`, min-height 44 px, optional count). `Skeleton` — a static stone block with no shimmer. `VisuallyHidden`.
- `ScrollMarquee` — a row of words that travels horizontally *only as the page scrolls* (ScrollTrigger scrub, `x` transform); it never moves on a timer, so it needs no pause control; the duplicated copy is `aria-hidden`; static under reduced motion.

### Overlay utilities

- `useFocusTrap(ref, active)` — moves focus in, cycles Tab / Shift+Tab, restores focus to the opener if it is still in the document and visible. `useScrollLock(active)` — the body-fixed technique the current `LeadModal` uses (it preserves and restores the scroll offset, only restores when the route has not changed, and calls `scheduleRefresh()` on both edges); extract that behaviour, do not weaken it. `Portal` — renders into `document.body` inside `<div class="ia" data-tone=…>` so tokens and the base layer apply to overlays.

### Design Lab — "Primitives"

Every primitive in every state (rest, hover, focus-visible, active, disabled, loading, error) on all four tones, at a phone-width frame and a desktop frame side by side; a form built from the field primitives with live validation; an accordion; a row of tiles using real image keys; and a keyboard-test strip (Tab order numbers shown).

## Functional guardrails

- **Contract frozen.** `public/api/leads.php` and `public/api/config.example.php` are not edited. The endpoint and its actions stay as they are: `POST /api/leads.php?action=create` with body `{ "lead": { … } }`, plus `list`, `update`, `delete` and `health`. Every lead still carries exactly these keys with the same meaning: `lead_id, name, mobile, email, organization, service_interest, state, message, source, status, submitted_at, updated_at, page_url, user_agent, utm_source, utm_medium, utm_campaign, utm_term, utm_content, notes, activity`. The status keys `new, contacted, consultation_booked, procedure_scheduled, completed, not_interested` are never renamed. `.env` and `.env.example` are not edited (use the git-ignored `.env.development.local` for local overrides). Anything new a lead needs is added as an extra key; nothing existing is renamed, removed or reshaped.
- **Admin-frozen files** — no diff against baseline commit `cc2fc52d90987adcf62a5c286c4eb87d155fc3f3`: `src/admin/**`, `src/theme/muiTheme.js`, `src/styles/variables.css`, `src/styles/global.css`, `src/styles/animations.css`, `src/styles/responsive.css`, `src/styles/dulcey.css`, `src/App.css`, `src/hooks/useMediaQuery.js`, `public/api/**`, `.env`, `.env.example`.
- **Admin-bound values** keep their current values, because the admin prints or reads them: `siteConfig.brandName`, `siteConfig.legalName`, `siteConfig.logo` and `LOGO_SIZE` in `src/data/siteConfig.js`; `expertiseTitles` in `src/data/expertiseData.js`; `seoConfig.pages.admin` in `src/config/seo.js`; `getConfig()` in `src/utils/webhookSubmit.js`. Prompt 15 is the only place they change.
- **No live surface changes.** No existing page, section, shell component or the current lead form imports anything from `src/components/ui/` in this prompt; the public routes and the admin render exactly as before.
- **No global side effects.** Primitive styles are CSS Modules only. Nothing registers a global event listener at module scope; listeners and observers are created in effects and removed on unmount.
- **Legacy classes are not reused.** No primitive emits `btn`, `eyebrow`, `display`, `lede`, `card`, `container`, `section`, `reveal`, `skeleton` or any other class name defined in the legacy global stylesheets.
- **Bundle discipline.** The kit must tree-shake: importing one primitive does not pull in the others' CSS-in-JS or the Lottie player. The main bundle does not grow in this prompt (only the Lab imports the kit).
- **Truthful content.** Every fact comes from `details of in-arch.pdf` through the modules in `src/data/`. No testimonials, awards, client names, statistics, ratings, years, areas, locations or quotes are invented; where the client supplied nothing the surface stays silent and the gap is listed in `prompts/00_INDEX.md`.
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

- **Unit tests** (React Testing Library): `Button` renders `<button>`, `<a>` and the provider link correctly, exposes `aria-busy` when loading and cannot be activated when disabled; `Field` connects label, hint and error (`aria-describedby`, `aria-invalid`); `Accordion` toggles with Enter and Space, keeps single-open when asked, and reports `aria-expanded`; `Picture` emits AVIF, WebP and JPEG candidates with `width`, `height` and `sizes` from the manifest; `Logo` chooses the dark-ink file on `light` and the ivory file on `dark`; `FactList` omits empty values; `useFocusTrap` cycles focus and restores it.
- **In the Lab, by hand** at 360, 390, 768, 1024, 1280, 1440 and 1920 px: every CTA variant shows its hover, focus-visible and press state; on a touch emulation the hover state never sticks and the press state shows; the arrow swap and the wipe run at 60 fps with 4× CPU throttling; under reduced motion the same controls only change colour.
- **Targets and text.** Measure in the browser: every interactive primitive is ≥ 44 × 44 px; field text is 16 px; no label is below 12 px.
- **Contrast**, measured on all four tones: label on primary button at rest and on its hover fill ≥ 4.5:1; field border ≥ 3:1 against the field's surround; focus ring ≥ 3:1 against both the control and the surround; error text ≥ 4.5:1.
- **Inertness.** `node scripts/qa/parity.js --suite public` and `--suite admin` against the baseline build still report zero differences, and `build/static/js/main.*.js` is within 1 KB (gzip) of its size after prompt 02.
- **Breakpoints.** Check 360, 390, 768, 1024, 1280, 1440 and 1920 px wide, plus one landscape phone (844 × 390): no horizontal scroll, nothing clipped or overlapping, every tap target ≥ 44 × 44 px, no text below 12 px, and the dock never hides a focused control. (For this prompt the matrix applies to the Lab's "Primitives" section.)
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

**Close out.** Append an entry to `prompts/BUILD_LOG.md` (date, "Prompt 03", files created / changed / deleted, decisions taken, every deviation from this prompt with its reason, anything left open). Add a short entry under `## [3.0.0] — IN-ARCH redesign (in progress)` at the top of `CHANGELOG.md`. Commit with a message that starts `IN-ARCH 03:`.
