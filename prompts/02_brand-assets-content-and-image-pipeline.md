# 02 — Brand assets, content model and image pipeline

**Prompt 2 of 20**

## Depends on

Before writing anything, read in this order: `prompts/00_INDEX.md` (at least "Owner decisions", "Design direction" and "Build architecture"), then `prompts/BUILD_LOG.md` (what earlier sessions really did, including deviations). An owner decision recorded in the index overrides any default written in this prompt; if an answer there disagrees with what the modules in `src/data/` currently hold, bring the data into line first and log it (the admin-bound values named under the guardrails are the exception — only prompt 15 changes those). If the build log shows a dependency below is unfinished, stop and say so instead of improvising it.

- **Prompt 01** — must be finished. Check that these exist: `src/styles/inarch/tokens.css`, `src/motion/useMotionScope.js`, `src/lab/LabPage.jsx`, `scripts/dev-router.php`, `scripts/qa/public-check.js`, `scripts/qa/parity.js`, `prompts/BUILD_LOG.md`.

## Context

IN-ARCH — *In-Arch Architects & Interior Designer*, Boring Road, Patna, Bihar, led by Principal Architect Ar. Mohammad Hassanuddin — is getting a new public website on an existing React boilerplate that still wears a previous client's brand ("Dulcey Lead Services"). The new brand is warm, quiet, editorial luxury: ivory `#F4EFE7` and espresso `#231B15` (both sampled from the logo), deep charcoal-green `#161E19`, one terracotta accent; Fraunces serif headlines with a single italic terracotta phrase, Manrope for text and UI. Logo files are named for the background they sit ON: `logos/in-arch-logo-light-transparent.png` is the espresso lockup for light backgrounds, `logos/in-arch-logo-dark-transparent.png` the ivory lockup for dark backgrounds, and `logos/in-arch-favicon-light-transparent.png` / `logos/in-arch-favicon-dark-transparent.png` are the "IA" monogram under the same rule. Stack reality: React 18 + Create React App (`react-scripts` 5, plain JavaScript), React Router 7 in `BrowserRouter` mode, CSS Modules, GSAP 3.15 with ScrollTrigger. There is no `db.json`: enquiries are POSTed to `public/api/leads.php` (a JSON-file store) and read by the MUI admin panel at `/admin`.

## Objective

Turn the client's raw material into production assets and one truthful data layer, so that every later prompt consumes the same logos, photographs, icons, illustrations, facts and copy:

1. Brand files cut from `logos/` into `public/images/brand/`.
2. An image pipeline that turns the 13 unique client photographs in `in-arch images/` into graded, cropped, responsive derivatives plus a manifest.
3. One consistent icon set and a small illustration set, recoloured to the brand, with their licences logged.
4. The content model in `src/data/`: studio facts, services, process, FAQs, studio story, interior-design content, projects.

No live route changes in this prompt; the Design Lab gains an "Assets & content" section that shows everything produced here.

## Scope — files/areas to touch

**Create**

- `scripts/build-brand-assets.js` (uses the existing `sharp` devDependency) → writes `public/images/brand/`.
- `scripts/image-specs.js` (the crop table below, as data) and `scripts/build-images.js` → writes `public/images/inarch/` and `src/data/imageManifest.json`.
- `package.json` scripts: `"build:brand": "node scripts/build-brand-assets.js"`, `"build:images": "node scripts/build-images.js"`. Outputs are committed; the scripts are re-run only when a source changes. Because `/images/**` is served `immutable` for a year (`public/.htaccess`), every output filename carries its width and a re-cut must use a new name.
- `public/images/inarch/icons/*.svg`, `public/images/inarch/lottie/*.json`, `public/images/inarch/illustrations/*.svg`, `public/images/inarch/CREDITS.md`.
- `src/data/services.js`, `process.js`, `faqs.js`, `studioContent.js`, `interiors.js`, `projects.js`, `credits.js`, `images.js` (helper: `image(key)` returns the manifest entry merged with its alt text; throws in development if the key is unknown).
- `src/data/__tests__/content.test.js`.

**Edit**

- `src/data/siteConfig.js` — **add** a named export `studio` (below) and its helpers; attach it as `siteConfig.studio` as well. Do not change, reorder or remove any existing key or export in this file: the old pages still read the legacy keys, and the admin reads `siteConfig.brandName`, `siteConfig.legalName`, `siteConfig.logo` and `LOGO_SIZE`.
- `src/lab/LabPage.jsx` — add the "Assets & content" section.

**Out of scope** — `src/data/expertiseData.js`, `src/data/industriesData.js`, `src/data/navigation.js` (still feeding the old pages and the admin filter), every page and component, `public/index.html`, favicons and the Open Graph image (prompt 04), anything under `src/admin/`. Do not delete `logos/`, `in-arch images/` or `details of in-arch.pdf`: they stay as the source material.

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

### 1. Brand files — `public/images/brand/`

Measured facts about the supplied logos (verify with `sharp` before cutting):

- `logos/in-arch-logo-light-transparent.png` and `logos/in-arch-logo-dark-transparent.png` are 4800 × 1560 RGBA with identical geometry. Ink is solid `#231B15` in the "light" file (for light backgrounds) and solid `#F4EFE7` in the "dark" file (for dark backgrounds). The artwork occupies x 226–4572, y 338–1219: the wordmark "IN-ARCH" is the band y 338–870 (x 226–3910, cap height 533 px, stroke 38 px) and the descriptor "ARCHITECTS & INTERIOR DESIGNER" is the band y 1090–1219, drawn at about 82 % opacity.
- `logos/in-arch-favicon-light-transparent.png` and `…-dark-transparent.png` are 512 × 512 RGBA; the "IA" monogram occupies x 123–388, y 161–350.

Cut these, with no recolouring, no redrawing and the alpha channel preserved:

| Output | From | Extract (left, top, width, height) | Resize to | Use |
|---|---|---|---|---|
| `inarch-lockup-on-light-1600.png`, `…-800.png` | light logo | 226, 338, 4347, 882 | 1600 × 325, 800 × 162 | full lockup on ivory / sand / paper, ≥ 44 px tall only |
| `inarch-lockup-on-dark-1600.png`, `…-800.png` | dark logo | same | same | full lockup on forest and over photographs |
| `inarch-wordmark-on-light-1383.png` | light logo | 226, 338, 3685, 533 | 1383 × 200 | wordmark only, for anything drawn under 44 px tall |
| `inarch-wordmark-on-dark-1383.png` | dark logo | same | same | same, on dark |
| `inarch-mark-on-light-266.png` | light favicon | 123, 161, 266, 190 | native | "IA" monogram on light |
| `inarch-mark-on-dark-266.png` | dark favicon | same | native | "IA" monogram on dark |

Rule for every later prompt: under 44 px tall the descriptor line is illegible, so use the wordmark-only file; from 44 px up use the full lockup; keep clear space equal to the cap height of the "I" on all sides; never tint, outline, stretch or place the logo on a busy part of a photograph without the forest overlay behind it. (Only PNGs were supplied — a vector logo is an open request in the index; if the build log shows SVGs have arrived, use those instead and keep the same file roles.)

### 2. Photographs — what was supplied and what to cut

`in-arch images/` holds 16 files whose names begin with a dot (`.jpg1.jpg` … `.jpg16.jpg`): they are hidden from a plain `ls` and from `*` globs, and Apache refuses to serve dot-paths, so they must never be referenced directly. Three are repeats: `.jpg13.jpg` = `.jpg2.jpg`, `.jpg15.jpg` = `.jpg6.jpg`, `.jpg16.jpg` = `.jpg3.jpg`. All are landscape 16:9, 3840 × 2160 (except `.jpg11.jpg`, 1920 × 1080), phone-shot and upscaled, with no EXIF; all show completed residential interiors. There are no exteriors, drawings, renders or portraits.

| Id | File | What it shows | Sharp to | Must be cropped out |
|---|---|---|---|---|
| ph01 | `.jpg1.jpg` | living room: teal buttoned L-sofa and ottoman, two arched niches lined in green fluted panels with wall lamps, an arched open-shelf partition, cove-lit ceiling | 1440 | a person at the left edge (left 9 %) |
| ph02 | `.jpg2.jpg` | L-shaped kitchen: black high-gloss wall units, white worktop, blue-veined splashback | 1920 | tap with a loose hose (left 12 %, lower half) |
| ph03 | `.jpg3.jpg` | U-shaped kitchen, frontal and symmetrical: graphite high-gloss units, warm under-cabinet light, lit ceiling frame | 1440 | — |
| ph04 | `.jpg4.jpg` | kitchen, frontal: ivory high-gloss units, dark stone worktop, grey veined splashback, wicker baskets | 1920 | a carton inside the glazed unit if the crop allows |
| ph05 | `.jpg5.jpg` | living hall: backlit wave-textured media wall between fluted panels, floating console, tray ceiling with linear light | 1920 | air-conditioner (left 23 %), orange cloth bundles on the floor (x 26–39 %, y 73–80 %), hanging cable at about x 34 %, bouquet (bottom right) |
| ph06 | `.jpg6.jpg` | room corner with framed wall mouldings, tray ceiling outlined in light, timber ceiling fan | 1920 | bouquet on the cabinet at far left if the crop allows |
| ph07 | `.jpg7.jpg` | large living hall from a low angle: fluted timber-tone wall with a backlit veined panel, open shelving, two tray ceilings, glossy veined floor | 1920 | — (strong wide-angle distortion: avoid tight crops of the edges) |
| ph08 | `.jpg8.jpg` | the same hall, closer: feature wall, floating console, shelving unit | 1920 | — |
| ph09 | `.jpg9.jpg` | prayer (pooja) unit: timber-tone cabinet, lattice-cut doors open onto a backlit lattice panel, stone ledge | 1440 | air-conditioner (top left) |
| ph10 | `.jpg10.jpg` | the graphite kitchen from the side | 960 only | tap in the foreground (right 30 %) |
| ph11 | `.jpg11.jpg` | seating nook: dark buttoned L-bench and chairs, patterned blind | 1080 | mirror reflecting the photographer (left 24 %), door frame (right 8 %) |
| ph12a / ph12b | `.jpg12.jpg` | a two-picture collage — split at x = 1857: left (1857 × 2160) is a prayer unit on a mint wall; right (1983 × 2160) is the ph09 unit from another angle | 1080 each | — |
| ph14 | `.jpg14.jpg` | detail of the ph01 room: arched shelving partition, green fluted arch with lamp, arm of the sofa | 1920 | — |

Derivatives (`key` → source, crop, widths). A focal point is the crop centre as a percentage of the source width / height; "box" is left, top, width, height in percent.

| Key | Source and crop | Widths |
|---|---|---|
| `home-hero-wide` | ph08, full 16:9 | 768, 1080, 1440, 1920 |
| `home-hero-tall` | ph08, 4:5, focal 45 / 52 | 480, 768, 1080 |
| `home-intro` | ph06, 4:5, focal 62 / 50 | 480, 768, 1080 |
| `studio-band-wide` | ph07, 21:9, focal 50 / 52 | 768, 1080, 1440, 1920 |
| `studio-band-tall` | ph07, 4:3, focal 62 / 55 | 480, 768, 1080 |
| `studio-detail` | ph05, box 36, 0, 42, 62 (ceiling and media wall; check the cable and the doorway are gone) | 480, 768, 1080 |
| `expertise-interiors` | ph03, 4:5, centred | 480, 768, 960 |
| `interiors-hero-tall` | ph01, 4:5, focal 60 / 55, from x ≥ 9 % | 480, 768, 1080 |
| `interiors-hero-wide` | ph01, 3:2, from x ≥ 9 % | 768, 1080, 1440 |
| `interiors-kitchen` | ph02, 3:2, focal 58 / 45, from x ≥ 12 % | 480, 768, 1080, 1440 |
| `interiors-detail-a` | ph12a, 4:5, centred | 480, 768, 1080 |
| `interiors-detail-b` | ph09, full 16:9 | 480, 768, 1080, 1440 |
| `interiors-detail-c` | ph04, full 16:9 | 480, 768, 1080, 1440 |
| `contact-nook` | ph11, 4:5, focal 58 / 60, between x 24 % and 92 % | 480, 768 |
| `pr-walnut-cover-tall` / `-wide` | ph08, 4:5 focal 45 / 52 · 3:2 focal 50 / 52 | 480, 768, 1080 (+1440 wide) |
| `pr-arches-cover-tall` / `-wide` | ph14, 4:5 focal 45 / 50 · 3:2 centred | same |
| `pr-panelled-cover-tall` / `-wide` | ph06, 4:5 focal 62 / 50 · 3:2 focal 58 / 50 | same |
| `pr-graphite-cover-tall` / `-wide` | ph03, 4:5 centred · 3:2 centred | 480, 768, 960 |
| `pr-black-cover-tall` / `-wide` | ph02, 4:5 focal 62 / 48 · 3:2 focal 58 / 45 from x ≥ 12 % | 480, 768, 1080 (+1440 wide) |
| `pr-ivory-cover-tall` / `-wide` | ph04, 4:5 focal 55 / 50 · 3:2 centred | same |
| `pr-pooja-cover-tall` / `-wide` | ph09, box 27.5, 0, 45, 100 (4:5) · 3:2 centred from y ≥ 14 % | 480, 768, 1080 |
| `g-ph08`, `g-ph07`, `g-ph14`, `g-ph06`, `g-ph02`, `g-ph04` | full frame (ph02 from x ≥ 12 %) | 480, 768, 1080, 1440, 1920 |
| `g-ph01`, `g-ph03`, `g-ph09`, `g-ph05` | ph01 from x ≥ 9 %; ph03 and ph09 full; ph05 = the `studio-detail` box | 480, 768, 1080, 1440 |
| `g-ph11`, `g-ph12a`, `g-ph12b` | ph11 4:3 between x 24 % and 92 %; the two collage halves at 4:5 | 480, 768, 1080 |
| `g-ph10` | ph10, 3:2, from x ≤ 70 % | 480, 768, 960 |
| `sw-fluted`, `sw-stone`, `sw-lattice`, `sw-gloss`, `sw-moulding`, `sw-tufting` | 1:1 texture swatches: ph08 box 20, 30, 20, 30 · ph08 box 30, 36, 22, 20 · ph09 box 43, 26, 14, 32 · ph04 box 56, 22, 18, 28 · ph06 box 62, 36, 20, 38 · ph14 box 52, 72, 24, 24 (square them by eye) | 320, 640 |
| `og-source` | ph08, 1200 × 630, focal 50 / 50 | 1200 |

Processing, identical for every derivative so the set reads as one body of work: extract → resize (Lanczos, never above the "sharp to" width) → `modulate({ saturation: 0.94 })` → `sharpen({ sigma: 0.5 })` → strip metadata, sRGB. Encode AVIF (quality 50, effort 5), WebP (quality 74) and JPEG (quality 78, mozjpeg, progressive). File names `public/images/inarch/<key>-<width>.<ext>`. For each key the manifest stores `{ key, width, height, ratio, sources: { avif: [{ w, src }], webp: […], jpg: […] }, placeholder }` where `placeholder` is a 24-px-wide blurred WebP as a base64 data URI (keep it under 700 bytes) and `src/data/images.js` adds the alt text.

Look at every derivative in the Lab before it is used anywhere: no person, no reflection of the photographer, no construction debris, no loose cable, no carton, horizon and verticals acceptable. Adjust a focal point or box until it is clean and record the final numbers in `scripts/image-specs.js`; if a frame cannot be made clean, drop that key, say so in the build log, and the page prompt that wanted it falls back to a typographic layout.

Alt text is observational and specific ("Living room with two arched niches lined in green fluted panels above a teal buttoned sofa"), never promotional, never naming a place, client, brand or material species.

### 3. Icons, animated icons and illustrations

One style, used only where it explains something.

- **Icons8 — 14 static icons** as SVG, from a single Icons8 family drawn in thin, even outlines that offers every glyph below (the outlined two-tone families fit; avoid the glossy 3D, cartoon "Color" and emoji-like families). Recolour by hand to the brand duotone: strokes `currentColor` (so they follow the tone), the accent shape `var(--ia-accent-display)`; normalise to a 48 × 48 viewBox and a 1.5 px visual stroke; remove inline `fill`/`style` noise. Names: `process-01-consultation`, `process-02-site-study`, `process-03-concept`, `process-04-development`, `process-05-drawings`, `process-06-coordination`, `process-07-completion`, `service-e01-architecture`, `service-e02-interiors`, `service-e03-residential`, `service-e04-commercial`, `service-e05-visualisation`, `service-e06-site`, `service-e07-renovation`.
- **Icons8 animated icons — 8 Lottie files** from the same family where it exists (the seven process steps and one "sent / done" tick), recoloured the same way, each under 40 KB. They are treated as small self-contained media: played once when at least half visible, never looped, replaced by the matching static SVG under reduced motion.
- **unDraw — 4 illustrations** as SVG: `not-found`, `enquiry-sent`, `nothing-here` (empty result) and `something-broke`. Recolour: the primary colour to `#B5653F`, darks to `#231B15`, light fills to `#E9E3D8` / `#DAD3C6`; remove gradients and drop shadows; keep each under 30 KB.
- **Open-licence photographs — at most two**, for the Expertise page only: `os-light` (abstract light and shadow on a plain plaster or concrete surface, warm neutral, no recognisable building, no people) and `os-drawing` (architectural drawings, tracing paper or a scale ruler on a desk; no faces, no visible brand names). Take them from Unsplash or Pexels, run them through the same pipeline (keys `expertise-atmosphere` 3:2 and `expertise-drawing` 4:5, saturation 0.85 so they sit behind the client's work), and never use them in the portfolio, a case study, the Interior Design page or anywhere they could be read as IN-ARCH's own project.
- **Licences.** Read each source's current licence at download time and follow it. `src/data/credits.js` and `public/images/inarch/CREDITS.md` record, per asset: name, source URL, author where given, licence, date fetched, what was changed. Icons8's free licence requires a visible link to Icons8 — unless owner decision D-13 in the index says a paid licence exists, `credits.js` must expose that link for the footer (prompt 04 renders it). unDraw and the photo sites need no attribution but are credited anyway. Fonts (Fraunces, Manrope — SIL OFL) are listed too.
- **If a source host is blocked in this session**, do not substitute a different library silently and do not stop: draw the missing icons in-house in the same duotone line style (24-px grid, 1.5-px stroke), skip the missing illustration or photograph, list every substitute under "pending third-party assets" in the build log and say so in your summary.

### 4. Content model — facts come from `details of in-arch.pdf`

Extract the text with `pdftotext -layout "details of in-arch.pdf" -` and copy wording verbatim where this prompt says "verbatim". The PDF is an AI-drafted content document that itself marks several items as unconfirmed; its embedded pictures are third-party web images (captioned regencygroup.co.in, housing.com, arqina.com, livspace.com, ongrid.design, simpolo.com, surfacesreporter.com, interiorcompany.com, neomen.in) and must never be extracted or used.

**`studio`** (in `src/data/siteConfig.js`):

```js
export const studio = {
  name: 'IN-ARCH',
  fullName: 'In-Arch Architects & Interior Designer',
  descriptor: 'Architects & Interior Designer',
  tagline: 'Designing Spaces. Shaping Experiences.',            // PDF "suggested tagline" — owner decision D-10
  blurb: 'Thoughtful architectural and interior design solutions from Patna, Bihar.',
  principal: { name: 'Ar. Mohammad Hassanuddin', role: 'Principal Architect & Founder', portrait: null },
  phone: '+917292831128',
  phoneDisplay: '+91 72928 31128',
  whatsapp: '917292831128',
  email: '',                                                     // not supplied — D-03; render nothing while empty
  address: { line1: 'Boring Road', city: 'Patna', region: 'Bihar', country: 'India', postalCode: '' },   // D-04
  hours: { opensAt: '10:00 AM', note: '' },                      // days and closing time not supplied — D-14
  siteUrl: '',                                                   // not supplied — D-05
  social: { instagram: '', facebook: '', linkedin: '', googleBusiness: '' },   // D-12
  map: { query: 'In-Arch Architects & Interior Designer, Boring Road, Patna, Bihar', embedUrl: '', lat: null, lng: null },   // D-16
  logos: { /* the six files from part 1, each with its intrinsic width and height */ },
};
```

plus helpers `studioTelHref`, `studioWhatsAppHref(text)` (`https://wa.me/917292831128?text=…`, URL-encoded), `studioMailHref` (`null` while `email` is empty), `studioMapsHref` (`https://www.google.com/maps/search/?api=1&query=…`) and `studioUrl(path)` (uses `siteUrl`, or `window.location.origin` while it is empty). Every component must render nothing for an empty value — no blank rows, no dead links.

**`services.js`** — the seven services of PDF §4, ids `e01`–`e07` so `/expertise#e0N` deep links keep their shape. Fields: `id, num, slug, title, tagline, description, scope, group, icon, image`. `description` and `scope` are verbatim from the PDF; `tagline` as given here:

| Id | Title (also the value stored in a lead's `service_interest`) | Tagline | Group |
|---|---|---|---|
| e01 | Architectural Design & Consultancy | Concept, planning and technical design, considered together. | architecture |
| e02 | Interior Design | Space, material, light and furniture, composed as one. | interiors |
| e03 | Residential Architecture | Homes planned around the way a family lives. | architecture |
| e04 | Commercial & Institutional Architecture | Places of work and gathering, planned to run well. | architecture |
| e05 | 3D Visualisation & Architectural Presentation | See the design before it is built. | visualisation |
| e06 | Project Management & Site Consultancy | Keeping the design intent intact on site. | delivery |
| e07 | Renovation & Interior Upgradation | Existing spaces, thoughtfully reworked. | interiors |

Also export `serviceTitles` (the seven titles in order) and `SOMETHING_ELSE = 'Something else'` — that exact string, because the admin's filter list hard-codes it. The PDF calls this list "proposed … the office should confirm"; that is owner decision D-06.

**`process.js`** — the seven steps of PDF §7, titles and descriptions verbatim: Initial Consultation, Site Study & Analysis, Conceptual Design, Design Development, Detailed Drawings, Project Coordination, Project Completion; each with its icon and Lottie key. Also export four `phases` for the Home page that group them without changing their meaning: Understand (steps 1–2), Imagine (3–4), Detail (5), Deliver (6–7).

**`faqs.js`** — the eight questions and answers of PDF §8, verbatim, with ids `q1`–`q8` and a `topics` array (`general`, `interiors`, `process`, `fees`) so pages can pick subsets.

**`studioContent.js`** — verbatim from PDF §§1–3 and 6: the five "About In-Arch" paragraphs; the vision; the five mission points; the four design-philosophy principles (Design with Purpose, Aesthetics with Functionality, Attention to Detail, Client-Centric Approach) with their sentences; the seven "key differentiators"; and the principal: biography paragraphs, the five credentials, education (B.Arch, Piloo Mody College of Architecture, Cuttack, Odisha), internship (Novarch Consultants, New Delhi, May 2020 – November 2020) and experience rows in the PDF's order (Council of Architecture, India — Registered Architect — December 2020 – Present; Zenith — Project Architect — no dates: the PDF says "Dates to be confirmed", so store `period: ''` and show none, owner decision D-23; Patna Municipal Corporation — Registered Architect — December 2020 – Present; Gaya Municipal Corporation — Registered Architect — December 2020 – Present; Novarch Consultants, New Delhi — Architectural Intern — May 2020 – November 2020). No registration number, no year of establishment, no quote: none was supplied.

**`interiors.js`** — from PDF §4 B and G, verbatim items regrouped under four headings: *Living spaces* (Residential interior design; Living room and bedroom design), *Kitchens and bathrooms* (Modular kitchen design; Bathroom design), *Workplaces and retail* (Office and corporate interiors; Commercial and retail interiors; Institutional interiors), *Detail and finish* (False ceiling and lighting design; Wall panelling and decorative finishes; Furniture and storage planning; Material and colour consultations; Detailed interior drawings); the renovation list of service G; the interior FAQ ids (`q3`, `q4`, `q6`, `q7`, `q8`); and three "room stories" that pair copy with image keys (living: `interiors-hero-wide`; kitchens: `interiors-kitchen`, `interiors-detail-c`; made-to-measure details: `interiors-detail-a`, `interiors-detail-b`).

**`projects.js`** — `categories`: the six of PDF §5 with their one-line descriptions (Residential Architecture, Commercial Architecture, Interior Design, Modular Kitchens, Institutional Projects, Landscape & Outdoor Spaces). `projects`: seven entries built only from the supplied photographs. Titles are plain descriptions of what is visible — never invented names; `location`, `area`, `year` and `client` exist as empty strings and are rendered only when filled; every entry carries `verified: false` until the office confirms it (owner decision D-07).

| Slug | Title | Category | Images (cover first) | Scope · focus |
|---|---|---|---|---|
| `walnut-and-marble-living-hall` | Living Hall with a Backlit Feature Wall | Interior Design | `g-ph08`, `g-ph07` | Interior detailing and design · Wall panelling, lighting, furniture integration and decorative finishes |
| `arched-niche-living-room` | Living Room with Arched Niches | Interior Design | `g-ph14`, `g-ph01`, `g-ph11` | same |
| `panelled-living-hall` | Panelled Living Hall | Interior Design | `g-ph06`, `g-ph05` | same |
| `graphite-gloss-kitchen` | Graphite Gloss Kitchen | Modular Kitchens | `g-ph03`, `g-ph10` | Kitchen and interior design · Modular storage, contemporary finishes, lighting and efficient kitchen planning |
| `black-and-veined-stone-kitchen` | Black Kitchen with a Veined Splashback | Modular Kitchens | `g-ph02` | same |
| `ivory-kitchen` | Ivory Kitchen with a Dark Worktop | Modular Kitchens | `g-ph04` | same |
| `prayer-units` | Made-to-Measure Prayer Units | Interior Design | `g-ph09`, `g-ph12a`, `g-ph12b` | Interior detailing and design · Lattice-cut doors, concealed lighting and integrated storage |

The scope and focus lines for the first six are the wording of PDF §5 "Project 04" and "Project 08", which the PDF wrote from these same photographs; the grouping of photographs into projects is inferred from what the pictures show and is flagged for confirmation. Each project also gets a two-sentence `summary` that only describes what can be seen (layout, elements, light) using cautious material words — "timber-tone", "veined stone-look", "high-gloss" — and never a species, brand, size, cost, date, place or person. The dummy's project names (The Courtyard House, Urban Calm, The Avenue, The Workspace, Green Land Hospital, The Dining Room) are AI inventions shown over stock photographs: they do not appear anywhere (owner decision D-21).

### 5. Design Lab — "Assets & content"

Show, on light and dark tones: each of the six brand files at 24, 32, 44 and 96 px tall with its clear space; every image key rendered through a plain `<picture>` at its real aspect ratio with its alt text and byte sizes; the six swatches; the 14 icons at 24, 32 and 48 px on every tone; the Lottie icons with a replay button; the four illustrations; and a plain dump of the services, process, FAQs and projects so the copy can be proof-read in one place.

## Functional guardrails

- **Contract frozen.** `public/api/leads.php` and `public/api/config.example.php` are not edited. The endpoint and its actions stay as they are: `POST /api/leads.php?action=create` with body `{ "lead": { … } }`, plus `list`, `update`, `delete` and `health`. Every lead still carries exactly these keys with the same meaning: `lead_id, name, mobile, email, organization, service_interest, state, message, source, status, submitted_at, updated_at, page_url, user_agent, utm_source, utm_medium, utm_campaign, utm_term, utm_content, notes, activity`. The status keys `new, contacted, consultation_booked, procedure_scheduled, completed, not_interested` are never renamed. `.env` and `.env.example` are not edited (use the git-ignored `.env.development.local` for local overrides). Anything new a lead needs is added as an extra key; nothing existing is renamed, removed or reshaped.
- **Admin-frozen files** — no diff against baseline commit `cc2fc52d90987adcf62a5c286c4eb87d155fc3f3`: `src/admin/**`, `src/theme/muiTheme.js`, `src/styles/variables.css`, `src/styles/global.css`, `src/styles/animations.css`, `src/styles/responsive.css`, `src/styles/dulcey.css`, `src/App.css`, `src/hooks/useMediaQuery.js`, `public/api/**`, `.env`, `.env.example`.
- **Admin-bound values** keep their current values, because the admin prints or reads them: `siteConfig.brandName`, `siteConfig.legalName`, `siteConfig.logo` and `LOGO_SIZE` in `src/data/siteConfig.js`; `expertiseTitles` in `src/data/expertiseData.js`; `seoConfig.pages.admin` in `src/config/seo.js`; `getConfig()` in `src/utils/webhookSubmit.js`. Prompt 15 is the only place they change.
- **`src/data/siteConfig.js` is extended, not rewritten.** After this prompt `git diff` on that file shows additions only. `src/data/expertiseData.js`, `industriesData.js` and `navigation.js` show no diff.
- **No live surface changes.** Nothing produced here is imported by an existing page or by the shell yet; the public routes and the admin render exactly as after prompt 01.
- **Source material is read-only.** `logos/`, `in-arch images/` and `details of in-arch.pdf` are never edited, renamed or deleted, and never referenced from `src/` or `public/` at run time.
- **Truthful content.** Every fact comes from `details of in-arch.pdf` through the modules in `src/data/`. No testimonials, awards, client names, statistics, ratings, years, areas, locations or quotes are invented; where the client supplied nothing the surface stays silent and the gap is listed in `prompts/00_INDEX.md`. Specifically: no rating or review count (the PDF itself says not to hard-code them), no email address, no PIN code, no establishment year, no registration number, no project name, location, area, year or client, no quotation attributed to the principal.
- **Licences honoured.** No asset is committed without its line in `credits.js` and `CREDITS.md`; nothing from the PDF's embedded web images or from the dummy screenshots is used.
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

- **Brand files.** Each output has the stated pixel size, a fully transparent background (corner alpha 0), ink of exactly `#231B15` or `#F4EFE7`, and no leftover padding (the artwork touches all four edges). In the Lab the dark-ink files are legible on ivory, sand and paper and the ivory files on forest; nothing is used on the wrong tone.
- **Photographs.** `node scripts/build-images.js` is idempotent (a second run changes no file). For every key: three formats per width exist, no width exceeds the "sharp to" limit, every AVIF at ≤ 1080 px is under 140 KB and no file exceeds 420 KB; the manifest's `width`/`height` match the files. Review all derivatives in the Lab at 390 and 1440 px for the exclusions listed in the table. Confirm that `public/images/inarch/` contains nothing derived from `.jpg13.jpg`, `.jpg15.jpg` or `.jpg16.jpg` and nothing from the PDF.
- **Icons and illustrations.** All 14 icons share one stroke weight and optical size, follow `currentColor` on all four tones, and contain no hard-coded colour other than the accent variable. Lottie files play once and stop; with reduced motion emulated the static SVG is shown instead. Illustrations use only brand colours.
- **Content tests** (`src/data/__tests__/content.test.js`) pass and assert at least: seven services with ids `e01`–`e07` and unique slugs; `serviceTitles` has seven entries and `SOMETHING_ELSE === 'Something else'`; seven process steps; eight FAQs; seven projects with unique slugs, each with at least one image key that exists in `imageManifest.json`, each category id valid, each `verified === false`; every image key referenced anywhere in `src/data/` exists in the manifest and has non-empty alt text; `studio.phone === '+917292831128'`; `studio.email`, `studio.siteUrl` and `studio.address.postalCode` are empty strings unless the index records a decision that fills them; none of the new data files contains "Dulcey", "lorem", a `mailto:` literal, a star rating or the words "award" or "testimonial"; `siteConfig.brandName`, `siteConfig.logo` and `LOGO_SIZE` still have their baseline values.
- **Proof-read** the content dump in the Lab against the PDF text, line by line, for the services, process and FAQs.
- **Inertness.** Re-run `node scripts/qa/parity.js --suite admin` and `--suite public` against the baseline build (see `scripts/qa/README.md`): zero differences. The production build's main JS and CSS may grow only by the size of the new data modules that the Lab alone imports — confirm none of them is in the main bundle.
- **Breakpoints.** Check 360, 390, 768, 1024, 1280, 1440 and 1920 px wide, plus one landscape phone (844 × 390): no horizontal scroll, nothing clipped or overlapping, every tap target ≥ 44 × 44 px, no text below 12 px, and the dock never hides a focused control. (For this prompt the matrix applies to the Lab's new section.)
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

**Close out.** Append an entry to `prompts/BUILD_LOG.md` (date, "Prompt 02", files created / changed / deleted, decisions taken, every deviation from this prompt with its reason, anything left open). Add a short entry under `## [3.0.0] — IN-ARCH redesign (in progress)` at the top of `CHANGELOG.md`. Commit with a message that starts `IN-ARCH 02:`.
