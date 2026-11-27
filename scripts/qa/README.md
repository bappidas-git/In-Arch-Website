# QA tools

Three tools and a router for checking the site the way it runs in production: the built React app, the PHP lead API and the admin, all on one origin.

The two scripts use the Playwright already installed in the session (`require('playwright')`). It is deliberately **not** a project dependency. If it cannot be resolved, the scripts say so and stop. Output goes to `qa-artifacts/`, which git ignores.

## Serve a build with the lead API

`scripts/dev-router.php` is a router for PHP's built-in server. It serves real files, hands `/api/*.php` to PHP, and falls back to `index.html` for every other path, mirroring `public/.htaccess`. It lives outside `public/`, so it is never deployed.

```bash
npm run build
```

```bash
php -S 127.0.0.1:8080 -t build scripts/dev-router.php
```

Open `http://127.0.0.1:8080`. The admin is at `/admin`. Leads are written to `build/api/data/leads.json`, which git ignores.

For hot reload instead, run `npm start` (port 3000) next to `php -S 127.0.0.1:8080 -t public`. Then put `REACT_APP_LEADS_API_URL=http://127.0.0.1:8080/api/leads.php` in a git-ignored `.env.development.local`. Never edit `.env`.

## `public-check.js`: the public site

```bash
node scripts/qa/public-check.js
```

| Option | Default |
|---|---|
| `--base` | `http://127.0.0.1:8080` |
| `--routes` | every public path in the `<Route>` table of `src/App.jsx`; the `*` catch-all is tested as `/__qa-not-found` |
| `--widths` | `360,390,768,1024,1280,1440,1920` |

For each route and width, the script loads the page, waits for network idle and fonts, then scrolls to the bottom and back so lazy content mounts. A run fails on any of these:

- any `console.error` or uncaught page error;
- any same-origin request that returns 400 or higher, or fails;
- horizontal overflow (`scrollWidth > innerWidth + 1`);
- any serious or critical axe-core violation (tags `wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa`);
- at widths of 768 px and below, any visible link or button inside `.ia` smaller than 44 × 44 CSS px. The report gives the element and its size.

The 390 and 1440 runs are repeated with `prefers-reduced-motion: reduce`. Full-page screenshots go to `qa-artifacts/public/`. The exit code is non-zero on any failure.

`npm run qa:public` runs the script with its defaults.

## `parity.js`: two builds render the same

```bash
node scripts/qa/parity.js --a http://127.0.0.1:8081 --b http://127.0.0.1:8080 --suite admin
```

| Option | Meaning |
|---|---|
| `--a` | reference server (the baseline) |
| `--b` | candidate server (this branch) |
| `--suite` | `admin` or `public` |
| `--mask "<sel>,…"` | regions left out of the pixel and digest comparison |
| `--widths` | default `390,768,1440` |
| `--routes` | public suite only; default every public route |
| `--tolerance` | per-channel pixel tolerance in levels of 255; default `2`, and `0` makes the comparison exact |
| `--no-default-mask` | drop the calibrated default mask (the public suite masks `.glow`) |
| `--save` | keep every capture, not only the ones that differ |

Both servers get exactly the same treatment:

- **Time is frozen.** The browser clock is installed at `2026-01-15T10:30:00+05:30` and then paused. Every wait advances fake time by the same amount, so GSAP, React timers and MUI transitions land on identical frames. GSAP reads `Date.now`, so a clock that never moved would stop every reveal.
- **Network waits are tracked by the script.** It tracks in-flight requests itself, because `waitForLoadState('networkidle')` returns immediately after the first idle. On admin data pages it also waits until a seeded lead is on screen.
- **Chromium rasterises on the CPU,** with its compositor's timing shortcuts off.
- **Known raster noise is absorbed.** Even with CPU rasterisation, Skia repaints some composited layers differently from one run to the next, even comparing the baseline with itself:
  - The legacy pages' translucent radial-gradient glows (`.glow`, on a parallax layer) dither by up to ±7 levels. The public suite masks `.glow` by default; its layout and computed styles still go through the digest.
  - Tile seams across a fractionally translated photograph vary by ±1–2 levels. A pixel counts as differing only when a channel moves by more than `--tolerance`, which defaults to 2. Smaller changes are still counted and reported.

  The computed-style digest stays exact, so a real colour change of any size is still caught.
- **Third-party fonts and icons are blocked.** Requests to `fonts.googleapis.com`, `fonts.gstatic.com` and `api.iconify.design` are blocked. **Web fonts and admin icons are therefore not covered by the pixel comparison**; the manual pass covers them.
- **The lead store is reset.** It is reset to the same three seeded leads (`qa-parity-0001`…`0003`, fixed timestamps) through `/api/leads.php`, using the admin key from `.env`. This **deletes every lead in the store**, so the script only accepts `127.0.0.1` / `localhost` servers.

What each suite captures:

- **admin** (390, 768, 1440): login, dashboard, leads list, leads list with the "Interested In" menu open, a lead's detail, the delete-confirm dialog (always cancelled), the Guidelines password gate, each of the four Guidelines tabs, and the mobile menu at 390. The admin credentials are read from `.env` at run time, and the Guidelines password from `src/admin/pages/Guideline.jsx`. Neither is ever printed.
- **public**: every public route at the same widths, scrolled to the bottom and back so every reveal has played.

Each capture is compared in two ways:

1. The two full-page PNGs, pixel by pixel, using `sharp`. When they differ, `-a`, `-b` and `-diff` images are written to `qa-artifacts/parity/<suite>/`. Masked regions are left out of this comparison. A masked region is the union of the element's boxes in both captures, padded by 4 px so a transformed layer's anti-aliased edge is covered; it is shown pale blue in the diff image. Masked elements stay in the digest.
2. A digest of every element under `#root` and in body-level portals (MUI menus and dialogs). It records the tag, class list, bounding box and these computed styles: `font-family`, `font-size`, `font-weight`, `line-height`, `color`, `background-color`, `border`, `padding`, `margin`, `display`, `position`. The first twenty differences are printed.

The script also fails if the candidate requests any `/fonts/*.woff2`, because the IN-ARCH faces must stay inert on these pages. The exit code is non-zero if any unmasked pixel or digest entry differs.

### Build the reference

Serve the baseline commit on port 8081 from a separate worktree:

```bash
git worktree add ../inarch-baseline cc2fc52d90987adcf62a5c286c4eb87d155fc3f3
```

```bash
(cd ../inarch-baseline && npm ci && npm run build && php -S 127.0.0.1:8081 -t build ../In-Arch-Website/scripts/dev-router.php)
```

Adjust the relative path to wherever the main checkout lives. The baseline predates `scripts/dev-router.php`, so the router is taken from this checkout. Serve this branch's build on 8080 as shown above, then run both suites:

```bash
node scripts/qa/parity.js --a http://127.0.0.1:8081 --b http://127.0.0.1:8080 --suite admin
```

```bash
node scripts/qa/parity.js --a http://127.0.0.1:8081 --b http://127.0.0.1:8080 --suite public
```

**Calibrate first.** Run the baseline against itself (`--a` and `--b` both on 8081). Any difference there means the harness is not deterministic. Fix the harness before trusting a red result.

When you are done, remove the worktree:

```bash
git worktree remove ../inarch-baseline
```

## Unit tests

```bash
npm test -- --watchAll=false
```

`src/styles/inarch/__tests__/tokens.test.js` checks every design token against the contract. It also checks that no selector in `src/styles/inarch/` can match outside `.ia`.
