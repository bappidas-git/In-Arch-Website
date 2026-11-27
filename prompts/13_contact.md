# 13 — Contact

**Prompt 13 of 20**

## Depends on

Before writing anything, read in this order: `prompts/00_INDEX.md` (at least "Owner decisions", "Design direction" and "Build architecture"), then `prompts/BUILD_LOG.md` (what earlier sessions really did, including deviations). An owner decision recorded in the index overrides any default written in this prompt; if an answer there disagrees with what the modules in `src/data/` currently hold, bring the data into line first and log it (the admin-bound values named under the guardrails are the exception — only prompt 15 changes those). If the build log shows a dependency below is unfinished, stop and say so instead of improvising it.

- **Prompts 01–04** — design system; `studio` and its helpers (`studioTelHref`, `studioWhatsAppHref`, `studioMailHref`, `studioMapsHref`) and the image key `contact-nook`; the kit; the shell — including the dock rule that on `/contact` its button reads "Write to us" and scrolls to `#enquiry`.
- **Prompt 05** — `UnifiedLeadForm` with `variant="full"`, its inline success / duplicate / failure states and `scripts/qa/lead-flow.js`. The old Contact page already renders this new form inside its old panel; this prompt replaces everything around it.
- **Prompts 06–12** — every other public page is finished.

## Context

IN-ARCH — *In-Arch Architects & Interior Designer*, Boring Road, Patna, Bihar, led by Principal Architect Ar. Mohammad Hassanuddin — is getting a new public website on an existing React boilerplate that still wears a previous client's brand ("Dulcey Lead Services"). The new brand is warm, quiet, editorial luxury: ivory `#F4EFE7` and espresso `#231B15` (both sampled from the logo), deep charcoal-green `#161E19`, one terracotta accent; Fraunces serif headlines with a single italic terracotta phrase, Manrope for text and UI. Logo files are named for the background they sit ON: `logos/in-arch-logo-light-transparent.png` is the espresso lockup for light backgrounds, `logos/in-arch-logo-dark-transparent.png` the ivory lockup for dark backgrounds, and `logos/in-arch-favicon-light-transparent.png` / `logos/in-arch-favicon-dark-transparent.png` are the "IA" monogram under the same rule. Stack reality: React 18 + Create React App (`react-scripts` 5, plain JavaScript), React Router 7 in `BrowserRouter` mode, CSS Modules, GSAP 3.15 with ScrollTrigger. There is no `db.json`: enquiries are POSTed to `public/api/leads.php` (a JSON-file store) and read by the MUI admin panel at `/admin`.

## Objective

Rebuild the **Contact** page at `/contact` around its one job: turning a visitor into an enquiry the studio receives. The full lead form is the centre of the page; calling and WhatsApp are one tap away for people who would rather talk; the studio's details are complete and truthful; "what happens next" removes the last hesitation; and the map — a placeholder in the dummy — becomes a real one that costs nothing until the visitor asks for it.

## Scope — files/areas to touch

**Rewrite** — `src/pages/Contact/ContactPage.jsx`, `ContactPage.module.css` (same path and default export).

**Create** in `src/pages/Contact/sections/` (each `.jsx` + `.module.css`): `ContactHeader`, `EnquirySection`, `QuickContact`, `NextSteps`, `FindUs` (with the map facade).

**Edit** — `src/config/seo.js`, `pages.contact`: title "Contact In-Arch Architects, Patna"; description "Contact In-Arch Architects & Interior Designer, Boring Road, Patna. Call or WhatsApp +91 72928 31128, or send a project enquiry to arrange an initial consultation." (build the string from `studio.phoneDisplay` and `studio.address`, as the current entry does with `siteConfig` — do not type the number in); breadcrumb "Contact".

**Out of scope** — the form component itself (prompt 05 — do not fork or restyle it here; if it needs a change, change the one component); `public/api/`; the legacy icon PNGs in `public/images/icons/` that the old page used (removed in prompt 14); everything under `src/admin/`.

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

Rhythm: **light** header → **light** enquiry (form on paper) → **sand** next steps → **dark** find us. No photograph competes with the form: the page uses one small image, and its first screen on a phone already offers a way to act.

### Section 1 — Header (`tone="light"`)

- Eyebrow: "Contact"; `h1` `.ia-t-display-xl`: "Let's create something *meaningful.*" (the PDF's contact line); `Lede` — the PDF's sentence, verbatim: "Whether you are planning a new home, developing a commercial property or transforming an existing interior, In-Arch Architects & Interior Designer is ready to discuss your project."
- Starts 112 px from the top on phones, 160 px on desktop. Short: on a 390 × 844 screen the quick-contact row below is visible without scrolling.

### Section 2 — Enquiry (`tone="light"`, `id="enquiry"`)

**Quick contact** (`QuickContact`)

- Two actions for people who would rather talk: "Call +91 72928 31128" (`tel:`) and "WhatsApp" (`studioWhatsAppHref('Hello IN-ARCH, I would like to discuss a project.')`), each a `Button` secondary `md` with its icon; a third, "Email", only when `studio.email` is set.
- **Phones:** directly under the header, two equal buttons side by side (44 px tall, full width together), then the form. **Desktop:** in the right-hand column (see below).

**The form**

- `<UnifiedLeadForm variant="full" source="contact-page" formId="contact-page" context={{ label: 'Contact page' }} />` on a `paper` panel with 1 px hairline border, padding 24 px on phones and 48 px from 1024. Above it: `h2` `.ia-t-display-sm` "Tell us about your project" and `.ia-t-small` "Four details are enough to start; the rest helps us prepare."
- The form's submit button is this page's `data-primary-cta`.

**Layout**

- **Phones:** header → quick contact → form → studio details → image.
- **Desktop (≥ 1024):** the form panel in columns 1–7; a sticky side column in columns 9–12 (top 120 px) holding, in order: quick contact (stacked), then a `FactList` — Studio: `studio.fullName` · Principal architect: Ar. Mohammad Hassanuddin · Address: from `studio.address` · Hours: "From 10:00 AM" · Phone and WhatsApp: the number — and under it `contact-nook` in a 4:5 `Frame` at 240 px wide. Empty values (email, PIN code, opening days) render nothing.

### Section 3 — What happens next (`tone="sand"`)

- Eyebrow "After you write"; `h2` `.ia-t-display-md`: "What happens *next.*"
- Three numbered steps, each one sentence, built from the PDF's process and FAQ wording and promising no timeframe:
  1. "We call you to arrange an initial consultation."
  2. "We understand your requirements, objectives, budget, site conditions and expectations."
  3. "We study the site and its context, and outline how the project can proceed."
- One column on phones; three columns divided by hairlines from 768.

### Section 4 — Find us (`tone="dark"`, `id="find-us"`) — how Contact ends

- Left: `.ia-t-label` "Find us"; the address in `.ia-t-display-md` ("Boring Road, Patna, Bihar, India" — from `studio.address`; nothing more until the owner supplies the building and PIN code, decision D-04); "From 10:00 AM"; a `Button` secondary "Get directions" → `studioMapsHref`, new tab, `rel="noopener"`, with "opens in a new tab" for screen readers.
- Right: **the map facade** — a 4:3 panel on phones, 16:9 from 768, on `forest-2` with a 1 px `forest-3` border. At rest it contains no map and makes no third-party request: just `.ia-t-label` "Map" and a `Button` secondary "Show map". Pressing it replaces the panel's content with a Google Maps `<iframe>` (`title="Map showing IN-ARCH on Boring Road, Patna"`, `loading="lazy"`, `referrerpolicy="no-referrer-when-downgrade"`, `allowfullscreen`), whose `src` is `studio.map.embedUrl` when set and otherwise `https://www.google.com/maps?q=<encoded studio.map.query>&z=16&output=embed`; focus moves to the iframe; a `TextLink` "Open in Google Maps" stays below it. The facade is not a fake street plan — do not draw roads.
- The section's bottom padding clears the dock; nothing follows it but the footer.

## Functional guardrails

- **Contract frozen.** `public/api/leads.php` and `public/api/config.example.php` are not edited. The endpoint and its actions stay as they are: `POST /api/leads.php?action=create` with body `{ "lead": { … } }`, plus `list`, `update`, `delete` and `health`. Every lead still carries exactly these keys with the same meaning: `lead_id, name, mobile, email, organization, service_interest, state, message, source, status, submitted_at, updated_at, page_url, user_agent, utm_source, utm_medium, utm_campaign, utm_term, utm_content, notes, activity`. The status keys `new, contacted, consultation_booked, procedure_scheduled, completed, not_interested` are never renamed. `.env` and `.env.example` are not edited (use the git-ignored `.env.development.local` for local overrides). Anything new a lead needs is added as an extra key; nothing existing is renamed, removed or reshaped.
- **Admin-frozen files** — no diff against baseline commit `cc2fc52d90987adcf62a5c286c4eb87d155fc3f3`: `src/admin/**`, `src/theme/muiTheme.js`, `src/styles/variables.css`, `src/styles/global.css`, `src/styles/animations.css`, `src/styles/responsive.css`, `src/styles/dulcey.css`, `src/App.css`, `src/hooks/useMediaQuery.js`, `public/api/**`, `.env`, `.env.example`.
- **Admin-bound values** keep their current values, because the admin prints or reads them: `siteConfig.brandName`, `siteConfig.legalName`, `siteConfig.logo` and `LOGO_SIZE` in `src/data/siteConfig.js`; `expertiseTitles` in `src/data/expertiseData.js`; `seoConfig.pages.admin` in `src/config/seo.js`; `getConfig()` in `src/utils/webhookSubmit.js`. Prompt 15 is the only place they change.
- **The inline form is the same component as the modal's.** `/contact` still hosts `UnifiedLeadForm` inline with `source="contact-page"` and `formId="contact-page"`; submitting it goes through `submitLeadToWebhook` unchanged and shows the inline success state — the page never navigates away and there is no `/thank-you` route.
- **Flows that existed on the old page survive:** click-to-call and (when an address exists) click-to-email beside the form; the "we received it" confirmation with the visitor's first name; duplicate and failure handling.
- **The dock does not open a second copy of the form here.** On `/contact` its button scrolls to `#enquiry` and focuses the form's first field; the lead modal is still available from the footer link and still works.
- **No third-party request before consent by action.** Nothing from Google loads until "Show map" is pressed; "Get directions" is a plain link.
- **Hash links.** `/contact#enquiry` and `/contact#find-us` scroll correctly on direct load and from other pages.
- **Truthful content.** Every fact comes from `details of in-arch.pdf` through the modules in `src/data/`. No testimonials, awards, client names, statistics, ratings, years, areas, locations or quotes are invented; where the client supplied nothing the surface stays silent and the gap is listed in `prompts/00_INDEX.md`. On this page: no email address, PIN code, opening days or closing time unless `studio` holds them; no response-time promise; no rating or review count; the map query uses the studio's name and address exactly as given, and its result must be checked (see Test & QA).
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

```bash
node scripts/qa/lead-flow.js
```

- **The form, on this page** (the script covers the modal; do this by hand as well): submit empty → three errors and focus on "Your name"; fill only the four required-or-core fields → success state with the first name, no navigation; submit the same number again → duplicate notice with a working pre-filled WhatsApp link and intact values; block the request → error notice, intact values, "Try again" works; reload mid-typing → the draft is restored. Confirm in `/admin/lms` and on the lead's detail page that the enquiry arrived with `source: "contact-page"`, the service, and the composed message.
- **Phone-first check** at 360 × 640, 390 × 844 and 844 × 390: without scrolling, a visitor can call, open WhatsApp or see the start of the form; with the on-screen keyboard emulated the focused field and its error stay visible and the dock is out of the way; the two quick-contact buttons are each ≥ 44 px tall and never wrap their labels.
- **Desktop** at 1024, 1280, 1440 and 1920: the side column sticks beside the form and releases before the next section; the form's two-column field layout holds; the panel never exceeds 760 px in width.
- **Dock on this page.** Its button reads "Write to us", scrolls to `#enquiry`, focuses the first field, and steps down to secondary while the form's submit button is ≥ 60 % visible.
- **Map.** Before pressing "Show map" the network panel shows no request to any Google host. After pressing, the iframe loads, has a title, is keyboard-reachable, and the layout does not shift. **Verify the result:** the embedded map and the "Get directions" link must resolve to the IN-ARCH listing on Boring Road, Patna. If this session cannot reach Google Maps, or the query resolves to anything else, leave the facade and the directions link in place, record "map target unverified — needs the owner's Google Maps link (D-16)" in the build log, and say so in your summary; do not guess coordinates.
- **Links.** `tel:+917292831128`, the `wa.me/917292831128` link with its encoded greeting, and the directions URL are all well-formed; no `mailto:` exists while `studio.email` is empty.
- **Cleanliness.** `grep -ri "dulcey\|within a day\|one business day" src/pages/Contact` returns nothing.
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

**Close out.** Append an entry to `prompts/BUILD_LOG.md` (date, "Prompt 13", files created / changed / deleted, decisions taken, every deviation from this prompt with its reason, anything left open). Add a short entry under `## [3.0.0] — IN-ARCH redesign (in progress)` at the top of `CHANGELOG.md`. Commit with a message that starts `IN-ARCH 13:`.
