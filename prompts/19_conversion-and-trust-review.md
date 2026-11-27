# 19 — Conversion and trust review

**Prompt 19 of 20**

## Depends on

Before writing anything, read in this order: `prompts/00_INDEX.md` (at least "Owner decisions", "Design direction" and "Build architecture"), then `prompts/BUILD_LOG.md` (what earlier sessions really did, including deviations). An owner decision recorded in the index overrides any default written in this prompt; if an answer there disagrees with what the modules in `src/data/` currently hold, bring the data into line first and log it (the admin-bound values named under the guardrails are the exception — only prompt 15 changes those). If the build log shows a dependency below is unfinished, stop and say so instead of improvising it.

- **Prompts 01–18** — all finished; the site is complete, polished, responsive, accessible, fast and indexed correctly. The build log names the "admin freeze commit".
- Read owner decisions **D-12** (social profiles and the Google Business Profile link) and **D-18** (analytics) in `prompts/00_INDEX.md`; their defaults are restated below.

## Context

IN-ARCH — *In-Arch Architects & Interior Designer*, Boring Road, Patna, Bihar, led by Principal Architect Ar. Mohammad Hassanuddin — is getting a new public website on an existing React boilerplate that still wears a previous client's brand ("Dulcey Lead Services"). The new brand is warm, quiet, editorial luxury: ivory `#F4EFE7` and espresso `#231B15` (both sampled from the logo), deep charcoal-green `#161E19`, one terracotta accent; Fraunces serif headlines with a single italic terracotta phrase, Manrope for text and UI. Logo files are named for the background they sit ON: `logos/in-arch-logo-light-transparent.png` is the espresso lockup for light backgrounds, `logos/in-arch-logo-dark-transparent.png` the ivory lockup for dark backgrounds, and `logos/in-arch-favicon-light-transparent.png` / `logos/in-arch-favicon-dark-transparent.png` are the "IA" monogram under the same rule. Stack reality: React 18 + Create React App (`react-scripts` 5, plain JavaScript), React Router 7 in `BrowserRouter` mode, CSS Modules, GSAP 3.15 with ScrollTrigger. There is no `db.json`: enquiries are POSTed to `public/api/leads.php` (a JSON-file store) and read by the MUI admin panel at `/admin`.

## Objective

Review the finished site as a visitor who has a project and a phone in their hand, and tune it so that the path from interest to enquiry is short, obvious and trustworthy on every page — using only what is true. Three things are audited and fixed: **the calls to action** (one clear primary action per page and per viewport, reachable, consistently worded, carrying context into the lead form), **the form and its fallbacks** (as little friction as honesty allows; no enquiry lost), and **the trust signals** (the principal architect, the process, the real projects, the FAQs — placed where decisions are made, never invented).

## Scope — files/areas to touch

**May edit**

- Labels, microcopy, variants and placement of CTAs in public sections and shell components; the `source`, `service_interest` and `context` each CTA passes to `openLeadModal`.
- `src/components/common/UnifiedLeadForm/` and `LeadModal/` — wording, field order, hints, error text, the pre-filled WhatsApp messages; not the payload mapping.
- Where a trust element appears (moving or repeating an existing, data-driven element such as the principal's credentials line or an FAQ answer); the copy that introduces it.
- **Create** `src/utils/track.js` and call it from the lead flow and the contact links (below).

**May not** invent content, add testimonials, ratings, counters, badges, awards, "as seen in", urgency or scarcity messages, pop-ups, exit-intent overlays, chat widgets, cookie banners or any third-party script; may not change the lead contract, routes, data facts, or anything under `src/admin/` or `public/api/`.

**Out of scope** — visual redesign of sections, new pages, SEO metadata (prompt 18), responsive mechanics (prompt 17).

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

### 1. The CTA inventory

Build a table — commit it to the build log — of every element that can start a conversation: page, section, label, variant, what it does (`openLeadModal` with which `source` / `service_interest` / `context.label`; `tel:`; WhatsApp with which pre-filled text; directions), and whether it is marked `data-primary-cta`. Then make it true that:

- **One primary action per viewport.** At any scroll position on any page at 390 px and at 1440 px, at most one primary-styled button is visible (the dock steps down to secondary while an in-page primary is ≥ 60 % visible). Scroll every page slowly and check.
- **One primary action per page**, in the page's own words, and every other action is visibly secondary: Home — "Start a project" / "Start a conversation"; Studio — "Talk to the studio"; Expertise — "Discuss this service" and the chooser; Interior Design — "Plan your interior" / "Book an interior consultation"; Portfolio — "Start a project" (invitation tile); case study — "Discuss a project like this"; Contact — "Send enquiry". The dock's "Start a project" (or "Write to us" on Contact) is the constant.
- **Verbs are consistent.** "Start a project" always opens the lead form; "Discuss …" always opens it with a service or project pre-selected; "View …" / "See …" / "Open …" always navigate; "Call" always dials; "WhatsApp" always opens WhatsApp. No button says "Submit", "Click here", "Learn more" or "Get started".
- **Context is always carried.** Every form-opening CTA passes a `source` from the agreed list and, where it knows one, the service and a readable `context.label`. Submit one enquiry from each family and confirm the stored `source`, `service_interest` and `context_label` in the admin.
- **Reach on phones.** From any point on any page a visitor can start an enquiry with one thumb movement (the dock) and can call or open WhatsApp within one tap of the dock, the masthead or the open index overlay.
- **No dead ends.** The 404, the error state, the empty portfolio state, the form's duplicate and failure states and the end of every page each offer a next step.

### 2. The form

- **Time to complete.** On a phone, with autofill off, the compact form (name, phone, service, optional message) is completable in under 45 seconds and with autofill in under 20; watch someone — or yourself — do it and remove whatever slows it: unclear labels, a hint that reads like a requirement, a keyboard that covers the button, an error that appears too early (never while typing; on blur or submit only).
- **Reassurance at the moment of commitment,** directly under the button, true and short: "Your details are used only to respond to this enquiry." Nothing about response times — none was supplied.
- **The success state** thanks the visitor by first name, says what happens next in the PDF's terms (a call to arrange an initial consultation), and offers WhatsApp as the faster channel.
- **Duplicate and failure** keep everything typed and hand the brief to WhatsApp pre-filled — name, service, message, project details and, when present, the context label — so the studio receives it even when the store did not accept it. Check the pre-filled text is readable and under 600 characters.
- **WhatsApp messages are contextual**: the dock and footer use the generic greeting; a case study uses "Hello IN-ARCH, I am interested in a project like {title}."; the Interior Design page uses "Hello IN-ARCH, I would like to discuss an interior project."

### 3. Trust — only what is real, placed where it matters

Build a second table: every trust signal on the site, the sentence in `details of in-arch.pdf` it comes from, and where it appears. Then check placement:

- **The principal architect** — name, title, "Registered Architect, Council of Architecture, India", the two municipal registrations, the B.Arch — appears on Home (section 7), in full on Studio, and as a one-line attribution near the form on Contact ("Projects are led by Ar. Mohammad Hassanuddin, Principal Architect, registered with the Council of Architecture, India."). Add that line to the Contact side column and to the lead modal's header area if they lack it.
- **The process** is one tap away from every enquiry CTA (Expertise `#process`, Interior Design `#process`, Contact "What happens next").
- **Real work** — every page except Contact shows or links to at least one real project photograph.
- **Answers to the two questions that block enquiries** — "what does it cost" (FAQ `q8`) and "how do I start" (`q7`) — are reachable from Contact and from the modal: add a `TextLink` "Questions about fees or process?" → `/expertise#faq` under the form's secondary row.
- **Location and reachability** — "Boring Road, Patna" and the phone number are in the footer of every page and in the index overlay.
- **Reviews (owner decision D-12).** If and only if `studio.social.googleBusiness` holds a URL, add one `TextLink` "Read our reviews on Google" in the footer's Talk group and on Contact — with no star count and no number, because ratings change and must not be hard-coded. While it is empty, show nothing.
- **Remove anything unverifiable** the audit finds: a superlative ("best", "leading", "award-winning", "trusted by"), a number without a source, a promise of time or price, a quotation.

### 4. Measurement hook (owner decision D-18 — default: no analytics installed)

`src/utils/track.js` exports `track(event, data)`, which pushes `{ event, ...data }` to `window.dataLayer` when that array exists and otherwise does nothing — no script is loaded, no cookie is set, no network request is made. Call it for: `lead_modal_open` (`source`), `lead_submit_success`, `lead_submit_duplicate`, `lead_submit_error` (`source`, `service_interest`), and `contact_click` (`channel`: `call | whatsapp | email | directions`, `source`). If the index records analytics IDs from the owner, note in the build log that a tag manager can now be attached without code changes; do not add one here.

## Functional guardrails

- **Contract frozen.** `public/api/leads.php` and `public/api/config.example.php` are not edited. The endpoint and its actions stay as they are: `POST /api/leads.php?action=create` with body `{ "lead": { … } }`, plus `list`, `update`, `delete` and `health`. Every lead still carries exactly these keys with the same meaning: `lead_id, name, mobile, email, organization, service_interest, state, message, source, status, submitted_at, updated_at, page_url, user_agent, utm_source, utm_medium, utm_campaign, utm_term, utm_content, notes, activity`. The status keys `new, contacted, consultation_booked, procedure_scheduled, completed, not_interested` are never renamed. `.env` and `.env.example` are not edited (use the git-ignored `.env.development.local` for local overrides). Anything new a lead needs is added as an extra key; nothing existing is renamed, removed or reshaped.
- **Admin-frozen files** — no diff against the "admin freeze commit" that prompt 15 recorded in `prompts/BUILD_LOG.md` (and none against baseline `cc2fc52d90987adcf62a5c286c4eb87d155fc3f3` except what prompt 15 logged): `src/admin/**`, `src/theme/muiTheme.js`, `src/styles/variables.css`, `src/styles/global.css`, `src/styles/animations.css`, `src/styles/responsive.css`, `src/styles/dulcey.css`, `src/App.css`, `src/hooks/useMediaQuery.js`, `src/surfaces/AdminSurface.jsx`, `public/api/**`, `.env`, `.env.example`.
- **Admin-bound values** are final since prompt 15 and must not move again: `siteConfig.brandName`, `siteConfig.legalName`, `siteConfig.logo`, `LOGO_SIZE`, `expertiseTitles`, `seoConfig.pages.admin`, `getConfig()`.
- **The submit path and payload are untouched.** `buildLeadPayload`, `submitLeadToWebhook`, the endpoint and the lead's keys do not change; `scripts/qa/lead-flow.js` passes unmodified (update it only if a label it selects by was reworded — never loosen its payload assertions).
- **No dark patterns.** No pre-ticked consent, no forced fields beyond name, phone and service, no fake urgency, no hidden secondary action, no interrupting overlay, no auto-opening modal.
- **No new third-party request** from any page or interaction (the map still loads only on demand).
- **Wording changes stay inside the tone:** short, calm, concrete; one italic accent per headline; no exclamation marks.
- **Accessibility and performance results from prompt 18 still hold** after the changes (re-run its scripts).
- **Truthful content.** Every fact comes from `details of in-arch.pdf` through the modules in `src/data/`. No testimonials, awards, client names, statistics, ratings, years, areas, locations or quotes are invented; where the client supplied nothing the surface stays silent and the gap is listed in `prompts/00_INDEX.md`. This prompt is where pressure to embellish is highest: every sentence added must be traceable to the PDF or be free of factual claims, and the two tables in the build log are the proof.
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

- **The two tables** (CTA inventory; trust signals with their PDF source) are in the build log and match the built site.
- **Primary-action scroll test.** Record a slow scroll of every page at 390 px and 1440 px: at no frame are two primary-styled buttons visible; the dock's variant changes are smooth and never flicker at the 60 % threshold.
- **Source coverage.** Submit an enquiry from each CTA family — dock, footer, Home hero, Home closing, Studio, an Expertise service, the Expertise chooser, Interior Design hero and closing, the portfolio invitation, a case study, the 404, and the Contact form — with a different mobile number each; in `/admin/lms` the Source filter lists each key and each lead's detail shows the right interested-in value and message. Then delete the test leads.
- **Form timing.** Record the measured completion times (with and without autofill) at 390 px in the build log.
- **Fallbacks.** Trigger duplicate and failure from the modal and from Contact: values are kept; the WhatsApp link opens with the full brief, correctly URL-encoded (test a message containing `&`, `#`, a line break and Devanagari text).
- **Trust placement.** The principal's attribution appears on Home, Studio, Contact and in the modal; `/expertise#faq` is linked from the form; no review link exists while `studio.social.googleBusiness` is empty.
- **Language sweep.** `grep -rniE "best|leading|award|trusted by|years of experience|guarantee|#1|within (a|one|24)|testimonial" src --include=*.jsx --include=*.js` (excluding `src/admin`) returns nothing that is a claim.
- **`track`.** With `window.dataLayer = []` set in the console, each of the five events is pushed once with the documented fields; without it nothing throws and no request is made.
- **Still passing:** `npm test -- --watchAll=false`, `node scripts/qa/public-check.js --matrix full`, `node scripts/qa/lead-flow.js`, `node scripts/qa/perf-check.js`.
- **Admin parity:** `node scripts/qa/parity.js --suite admin` between the admin freeze commit's build and this branch: zero differences.
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

**Close out.** Append an entry to `prompts/BUILD_LOG.md` (date, "Prompt 19", files created / changed / deleted, decisions taken, every deviation from this prompt with its reason, anything left open). Add a short entry under `## [3.0.0] — IN-ARCH redesign (in progress)` at the top of `CHANGELOG.md`. Commit with a message that starts `IN-ARCH 19:`.
