# 05 — Unified lead form and modal

**Prompt 5 of 20**

## Depends on

Before writing anything, read in this order: `prompts/00_INDEX.md` (at least "Owner decisions", "Design direction" and "Build architecture"), then `prompts/BUILD_LOG.md` (what earlier sessions really did, including deviations). An owner decision recorded in the index overrides any default written in this prompt. If the build log shows a dependency below is unfinished, stop and say so instead of improvising it.

- **Prompt 01** — tokens, base layer, motion, QA scripts.
- **Prompt 02** — `studio` and its helpers (`studioTelHref`, `studioWhatsAppHref`, `studioMailHref`) in `src/data/siteConfig.js`; `serviceTitles` and `SOMETHING_ELSE` in `src/data/services.js`; the `enquiry-sent` illustration and the "done" Lottie icon.
- **Prompt 03** — `Button`, `TextLink`, `IconButton`, `Field`, `TextInput`, `TextArea`, `SelectInput`, `Notice`, `Portal`, `useFocusTrap`, `useScrollLock`.
- **Prompt 04** — the new shell; the dock's "Start a project" button calls `openLeadModal('dock-cta')`.

## Context

IN-ARCH — *In-Arch Architects & Interior Designer*, Boring Road, Patna, Bihar, led by Principal Architect Ar. Mohammad Hassanuddin — is getting a new public website on an existing React boilerplate that still wears a previous client's brand ("Dulcey Lead Services"). The new brand is warm, quiet, editorial luxury: ivory `#F4EFE7` and espresso `#231B15` (both sampled from the logo), deep charcoal-green `#161E19`, one terracotta accent; Fraunces serif headlines with a single italic terracotta phrase, Manrope for text and UI. Logo files are named for the background they sit ON: `logos/in-arch-logo-light-transparent.png` is the espresso lockup for light backgrounds, `logos/in-arch-logo-dark-transparent.png` the ivory lockup for dark backgrounds, and `logos/in-arch-favicon-light-transparent.png` / `logos/in-arch-favicon-dark-transparent.png` are the "IA" monogram under the same rule. Stack reality: React 18 + Create React App (`react-scripts` 5, plain JavaScript), React Router 7 in `BrowserRouter` mode, CSS Modules, GSAP 3.15 with ScrollTrigger. There is no `db.json`: enquiries are POSTed to `public/api/leads.php` (a JSON-file store) and read by the MUI admin panel at `/admin`.

## Objective

Rebuild the site's one lead form and its modal in the IN-ARCH design, and make them convert better without touching the contract:

- **One component, two places.** `UnifiedLeadForm` renders in full on the Contact page and, compact, inside the modal that every CTA on the site opens. There is never a second form.
- **Context travels with the click.** A CTA can pass the service and the place the visitor came from; the form pre-selects the service and the lead records the source.
- **It captures the lead.** Submission goes through the existing `submitLeadToWebhook` → `POST /api/leads.php?action=create`, so enquiries reach the admin exactly as they do today. WhatsApp, call and email are secondary quick-contact options, never the submit path.
- **Honest, calm states.** Inline validation, a reassuring success state, and graceful duplicate and failure states that never lose what the visitor typed.

## Scope — files/areas to touch

**Rewrite in place** (same paths, same default exports, so existing imports keep working)

- `src/components/common/UnifiedLeadForm/UnifiedLeadForm.jsx` and `UnifiedLeadForm.module.css`.
- `src/components/common/LeadModal/LeadModal.jsx` and `LeadModal.module.css`.

**Create**

- `src/utils/leadPayload.js` — pure functions `buildLeadPayload(values, { source, context })` and `composeMessage(values)`; no DOM, no network.
- `src/utils/__tests__/leadPayload.test.js`, `src/utils/__tests__/validators.test.js`, `src/components/common/UnifiedLeadForm/__tests__/UnifiedLeadForm.test.jsx`.
- `scripts/qa/lead-flow.js` — the end-to-end check described under Test & QA; add `"qa:leads": "node scripts/qa/lead-flow.js"` to `package.json`.

**Edit — minimal**

- `src/context/ModalContext.jsx` — keep `openLeadModal(sourceKey = 'general', extraData = {})`, `closeLeadModal`, `isModalOpen`, `modalConfig` and the close-on-navigation effect exactly; `extraData` may now also carry `context: { label, ref }`.
- `src/App.jsx` — `LeadModalWrapper` passes `context={modalConfig.context}` through. Nothing else.
- `src/utils/validators.js` — keep the three existing exports and their behaviour; add `getRequiredMobileErrorMessage` and `getOptionalEmailErrorMessage`; let names contain letters of any script (`\p{L}\p{M}` with the `u` flag) as well as spaces, `.`, `'` and `-`.
- `src/utils/webhookSubmit.js` — one change only: the fallback phone number in its error messages comes from `studio.phoneDisplay` instead of `siteConfig.phoneDisplay`. The endpoint, the enrichment (id, status, timestamps, page URL, user agent, UTM values, empty `notes`, first `activity` entry), the return shapes, `keepalive` and `getConfig()` are not touched.

**Out of scope** — `public/api/leads.php`; `src/admin/**` (the admin will list the new service titles under "Interested In" through its existing "values present in the data" logic; aligning its fixed option list is prompt 15); `src/utils/swalHelper.js` (the form stops importing it; the file itself is removed in prompt 14); the old Contact page body (prompt 13) — it keeps rendering `<UnifiedLeadForm source="contact-page" formId="contact-page" />`, now with the new form inside its old panel.

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

### 1. Fields and how they map to the frozen lead record

| Field (visible label) | Required | Written to | Rules |
|---|---|---|---|
| Your name | yes | `name` | 2–50 characters; letters of any script, spaces, `.` `'` `-`; `autocomplete="name"` |
| Phone | yes | `mobile` | Indian mobile: exactly 10 digits starting 6–9, stored as 10 digits; a pasted `+91` or leading `0` is stripped as today; a fixed "+91" prefix is shown inside the field; `type="tel"`, `inputmode="numeric"`, `autocomplete="tel-national"` |
| What do you need? | yes | `service_interest` | native select: the seven `serviceTitles` in order, then `Something else`; placeholder option "Select a service"; pre-selected when the CTA passed a matching title (ignore anything that is not in the list, as today) |
| Email | optional | `email` | validated only when filled; `autocomplete="email"` |
| Project location | optional | new key `project_location`, and the composed `message` | free text, placeholder "City, area" |
| Approximate area | optional | new key `project_area`, and the composed `message` | free text, placeholder "e.g. 2,500 sq. ft." |
| Indicative budget | optional | new key `budget_range`, and the composed `message` | select: "Under ₹10 lakh", "₹10 – 25 lakh", "₹25 – 50 lakh", "₹50 lakh – ₹1 crore", "Above ₹1 crore", "Not sure yet" (owner decision D-09 may replace this list or turn it into free text) |
| Tell us about your project | optional | `message` | up to 500 typed characters; a counter appears from 400 |
| — | — | `organization: ''`, `state: ''` | both keys are still sent, empty, so the record shape is unchanged |
| — | — | `source` | the CTA's key, unchanged mechanism |
| — | — | new key `context_label` | the human label of where the visitor came from, when a CTA supplied one |

Phone is required and email optional by default (owner decision D-08) — the reverse of the boilerplate, because the practice works by phone and WhatsApp; the admin already handles a lead without an email.

**Why extra keys and a composed message.** The store is schemaless, so `project_location`, `project_area`, `budget_range` and `context_label` are saved as sent without touching `leads.php` — additive only. But the admin (which must not change) shows only the fields it knows, and it shows `message` as a single paragraph with line breaks collapsed. So `composeMessage` writes one line: the visitor's own words first and unchanged, then — only if any exist — ` — Project details: Location: …; Area: …; Budget: ….` With no typed message it starts at "Project details:"; with nothing at all it is an empty string.

### 2. The form

- Root element carries `class="ia"` and `data-tone="paper"` so it renders correctly wherever it is placed — including inside the old Contact panel until prompt 13.
- `variant="full"` (default; Contact page): all eight fields visible; one column on phones, two columns from 768 px (name / phone, service / email, location / area, budget alone, message full width).
- `variant="compact"` (modal): Your name, Phone, What do you need?, Tell us about your project (three rows); then a disclosure button "Add project details (optional)" that reveals Email, Project location, Approximate area and Indicative budget. Four visible fields is the whole ask.
- Props: `source`, `formId`, `variant`, `prefill` (`{ service_interest }`), `context` (`{ label, ref }`), `onSubmitSuccess`, `className`. `formId` still prefixes every field and error id so two instances can coexist.
- Validation: on blur and on submit; an error clears as soon as the field changes; on a failed submit focus goes to the first invalid field in visual order; messages are plain and specific — "Please enter your name", "Please enter a 10-digit mobile number", "Mobile numbers start with 6, 7, 8 or 9", "Please choose what you need", "Please enter a valid email address", "Please keep your message under 500 characters". Errors are text plus an icon, tied to the field with `aria-describedby`; never colour alone. The submit button is never disabled for validity — only while a request is in flight.
- Submit: `Button` primary, `lg`, full width on phones — "Send enquiry"; while sending it shows "Sending…" with `aria-busy` and ignores further presses.
- Under the button, `.ia-t-caption`: "Your details are used only to respond to this enquiry." Then the secondary row: "Prefer to talk?" followed by `TextLink`s — WhatsApp (pre-filled "Hello IN-ARCH, I would like to discuss a project."), "Call +91 72928 31128", and Email only when `studio.email` is set.
- A draft of the typed values is kept in `sessionStorage` (`inarch:lead-draft`), restored on mount and cleared on success, so an accidental close or reload loses nothing.
- A honeypot text field (`name="company_website"`, visually hidden, `tabindex="-1"`, `autocomplete="off"`, `aria-hidden`): if it has a value, show the success state and send nothing.

### 3. Result states — inline, never a pop-up

- **Success** (replaces the form; `role="status"`; focus moves to its heading): the `enquiry-sent` illustration at 120 px (or the "done" Lottie icon, played once), heading in `.ia-t-display-sm` "Thank you, {first name}.", body "Your enquiry has reached the studio. We will call you on +91 {mobile} to arrange an initial consultation." — no promised response time, because none was supplied. Actions: `Button` secondary "Message us on WhatsApp" and, in the modal, `TextLink` "Close".
- **Duplicate** (the API answers `{ duplicate: true }` when that mobile number is already stored, and does not save the new enquiry): `Notice` `info` above the untouched form — "We already have an enquiry from this number." / "The studio has your earlier details. To add to it, send this brief on WhatsApp or call us." Actions: "Send this brief on WhatsApp" (`studioWhatsAppHref` pre-filled with name, service and the composed message), "Call +91 72928 31128". Nothing the visitor typed is cleared.
- **Failure** (network or server error): `Notice` `error` with the message `submitLeadToWebhook` returns, and the actions "Try again", "Send on WhatsApp instead" (same pre-filled brief) and "Call". Values stay.

### 4. The modal

- Rendered through `Portal`; `role="dialog"`, `aria-modal="true"`, labelled by its heading. Backdrop `rgba(22,30,25,0.55)`, fading in 240 ms.
- **Phones (< 768 px): a bottom sheet** — full width, height `min(92svh, content)`, square corners, rises from the bottom (`yPercent` 100 → 0, 500 ms `power3.inOut`), its own scroll with `overscroll-behavior: contain`, a sticky header (title + 48 px close button). **From 768 px: a right-hand panel** — 520 px wide (560 px from 1280), full height, slides in from the right (`xPercent` 100 → 0). Under reduced motion both simply appear.
- Header: `Eyebrow` "Start a project"; heading `.ia-t-display-sm` "Tell us about your space."; when the CTA passed context, a single quiet line — "Enquiring about: {service}" and / or "From: {context label}".
- Body: `<UnifiedLeadForm variant="compact" source={source} formId={'modal-' + source} prefill context />`.
- Behaviour kept from today's modal: opens from `openLeadModal`; closes by the close button, Escape and a click on the backdrop; focus is trapped inside and returned to the opener; the page behind is scroll-locked at its position and restored on close (only if the route is still the same); `scheduleRefresh()` on both edges; any route change closes it. On open, focus goes to the dialog heading (`tabindex="-1"`), not into a field, so mobile keyboards do not jump up uninvited.

### 5. Context contract for every later prompt

Any CTA may call `openLeadModal(source, { service_interest, context })`:

- `source` — kebab-case, `<page>-<place>`: `dock-cta`, `footer-cta`, `home-hero`, `home-closing`, `studio-closing`, `expertise-e01` … `expertise-e07`, `expertise-closing`, `interiors-hero`, `interiors-closing`, `portfolio-invite`, `project-<slug>`, `contact-page`, `notfound`. Later prompts use these names; anything new follows the same pattern.
- `service_interest` — one of `serviceTitles` or `Something else`.
- `context.label` — what the visitor was looking at, in words ("Portfolio — Graphite Gloss Kitchen").

## Functional guardrails

- **Contract frozen.** `public/api/leads.php` and `public/api/config.example.php` are not edited. The endpoint and its actions stay as they are: `POST /api/leads.php?action=create` with body `{ "lead": { … } }`, plus `list`, `update`, `delete` and `health`. Every lead still carries exactly these keys with the same meaning: `lead_id, name, mobile, email, organization, service_interest, state, message, source, status, submitted_at, updated_at, page_url, user_agent, utm_source, utm_medium, utm_campaign, utm_term, utm_content, notes, activity`. The status keys `new, contacted, consultation_booked, procedure_scheduled, completed, not_interested` are never renamed. `.env` and `.env.example` are not edited (use the git-ignored `.env.development.local` for local overrides). Anything new a lead needs is added as an extra key; nothing existing is renamed, removed or reshaped.
- **Admin-frozen files** — no diff against baseline commit `cc2fc52d90987adcf62a5c286c4eb87d155fc3f3`: `src/admin/**`, `src/theme/muiTheme.js`, `src/styles/variables.css`, `src/styles/global.css`, `src/styles/animations.css`, `src/styles/responsive.css`, `src/styles/dulcey.css`, `src/App.css`, `src/hooks/useMediaQuery.js`, `public/api/**`, `.env`, `.env.example`.
- **Admin-bound values** keep their current values, because the admin prints or reads them: `siteConfig.brandName`, `siteConfig.legalName`, `siteConfig.logo` and `LOGO_SIZE` in `src/data/siteConfig.js`; `expertiseTitles` in `src/data/expertiseData.js`; `seoConfig.pages.admin` in `src/config/seo.js`; `getConfig()` in `src/utils/webhookSubmit.js`. Prompt 15 is the only place they change.
- **The submit path is unchanged.** `submitLeadToWebhook(leadData)` keeps its signature and behaviour; the request is still `POST {REACT_APP_LEADS_API_URL}?action=create` with body `{ "lead": { … } }`; the lead contains all 21 frozen keys with the same meaning, `status: "new"`, empty `notes`, one "Lead created" activity entry; the only additions are the four optional keys named above.
- **`service_interest` stays a visible label.** It is always one of the seven service titles or the exact string `Something else`.
- **Behaviour parity with the old form:** blur and submit validation, first-invalid focus, error clearing on change, double-submit guard, disabled controls while sending, mobile normalisation, inline success with the visitor's first name announced through a live region, a duplicate notice instead of an error, a failure message that includes the studio's phone number. Each still exists; only its appearance and wording changed.
- **Modal API parity.** `useModal()` returns the same four members; `LeadModal` keeps its props `isOpen`, `onClose`, `source`, `serviceInterest` (plus `context`); old pages that call `openLeadModal('home-hero')` or `openLeadModal('expertise-e03', { service_interest: … })` still open it (an old Dulcey service title simply fails the prefill check and is ignored, as designed).
- **No lead is silently lost.** Duplicate and failure both keep the typed values and offer WhatsApp with the brief pre-filled; the honeypot is the only case where nothing is sent.
- **No new third-party request** on open or submit: no captcha, no analytics, no font or script from another origin.
- **Truthful content.** Every fact comes from `details of in-arch.pdf` through the modules in `src/data/`. No testimonials, awards, client names, statistics, ratings, years, areas, locations or quotes are invented; where the client supplied nothing the surface stays silent and the gap is listed in `prompts/00_INDEX.md`. The form and its states promise no response time and quote no fee.
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

- **`scripts/qa/lead-flow.js`** (Playwright, against the PHP-served build, using a fresh random mobile number per run): opens `/`, presses the dock CTA, checks the dialog has focus and a name; submits empty and expects exactly three errors with focus on "Your name"; fills the four compact fields plus the optional ones; intercepts the request and asserts — URL ends `?action=create`, method `POST`, body has a `lead` object whose keys are exactly the 21 frozen keys plus a subset of `project_location, project_area, budget_range, context_label`; `status === 'new'`; `notes` is `[]`; `activity[0].action === 'Lead created'`; `organization === ''` and `state === ''`; `service_interest` is in the allowed list; `source === 'dock-cta'`; `message` starts with the typed text and contains "Project details:". Then it expects the success state with the first name; opens `/contact`, submits the same mobile and expects the duplicate notice with its WhatsApp link and intact values; forces a network failure and expects the error notice, intact values and a working "Try again". Finally it logs into the admin (credentials read from `.env` at run time) and asserts the lead appears in `/admin/lms` with its name, mobile and source, that its detail page shows the interested-in value and the composed message, that the "Interested In" filter offers the new service title, and it deletes the test leads.
- **Unit tests.** `buildLeadPayload` returns exactly the expected keys for minimal and for full input, never drops `organization` / `state`, trims strings, and never mutates its input; `composeMessage` covers message only, details only, both, neither; validators accept `Rahul Kumar`, `राहुल`, `O'Brien`, reject `R`, digits and 51 characters; mobile accepts `9876543210`, normalises `+91 98765 43210` and `09876543210`, rejects `5876543210` and 9 digits; optional email accepts empty. The form test (React Testing Library) covers required errors, prefill, disclosure, loading, success, duplicate, failure and draft restore, with `submitLeadToWebhook` mocked.
- **By hand, both variants** at 360, 390, 768, 1024, 1280, 1440 and 1920 px: the bottom sheet and the side panel open from the dock, from the footer and from an old page's CTA; with the on-screen keyboard emulated the focused field and the submit button stay visible; pinch-zoom is not triggered by focusing a field (16 px text); closing and reopening restores the draft; Escape, backdrop and close button all close and return focus; the background page does not scroll and returns to its position.
- **Context.** Open the modal from an old Expertise accordion item and from the dock: the source values recorded in the admin differ accordingly.
- **Screen reader.** The dialog announces its title; each field announces label, required state, hint and error; success, duplicate and failure are announced without moving focus unexpectedly.
- **Admin parity.** `node scripts/qa/parity.js --suite admin` against the baseline build: zero differences (seeded leads are identical on both sides, so the new service titles do not appear in this comparison).
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

**Close out.** Append an entry to `prompts/BUILD_LOG.md` (date, "Prompt 05", files created / changed / deleted, decisions taken, every deviation from this prompt with its reason, anything left open). Add a short entry under `## [3.0.0] — IN-ARCH redesign (in progress)` at the top of `CHANGELOG.md`. Commit with a message that starts `IN-ARCH 05:`.
