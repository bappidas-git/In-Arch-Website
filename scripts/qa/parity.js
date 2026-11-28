#!/usr/bin/env node
/* ============================================
   Build parity — scripts/qa/parity.js
   --------------------------------------------
   node scripts/qa/parity.js --a <reference url> --b <candidate url>
                             --suite admin|public
                             [--mask "<css selector>,…"]
                             [--widths 390,768,1440] [--save]
                             [--routes /,/about,…]   (public suite only)
                             [--tolerance 2]          (levels of 255 per channel)
                             [--no-default-mask]      (public suite masks .glow)

   Proves two builds render the same. Both servers get identical treatment:
   - time frozen: the browser clock is installed at 2026-01-15T10:30:00+05:30
     and then PAUSED, and every wait advances fake time by the same amounts,
     so GSAP, React timers and MUI transitions land on identical frames;
   - fonts.googleapis.com, fonts.gstatic.com and api.iconify.design blocked
     (web fonts and admin icons are therefore NOT covered by the pixel
     comparison — the manual pass covers them);
   - the lead store reset to the same three seeded leads (fixed lead_ids and
     timestamps) through /api/leads.php. Only loopback hosts are accepted,
     because this deletes every lead in the store.

   Captures
   - admin (390, 768, 1440): login, dashboard, leads list, leads list with
     the "Interested In" menu open, a lead's detail, the delete-confirm dialog
     (always cancelled), the Guidelines password gate, each of the four
     Guidelines tabs, and the mobile menu at 390. Credentials are read from
     .env at run time and the Guidelines password from
     src/admin/pages/Guideline.jsx; neither is ever printed.
   - public: every public route of src/App.jsx at the same widths, scrolled
     to the bottom and back so every reveal has played.

   For each capture it compares (1) the two full-page PNGs pixel by pixel
   (sharp), writing a/b/diff images to qa-artifacts/parity/<suite>/ when they
   differ, and (2) a digest of every element under #root and in body-level
   portals — tag, class list, bounding box and the computed font-family,
   font-size, font-weight, line-height, color, background-color, border,
   padding, margin, display, position — printing the first twenty
   differences. It also fails if the candidate requests any /fonts/*.woff2
   (the IN-ARCH faces must stay inert on these pages).

   Determinism, found by calibrating baseline against baseline: CPU
   rasterisation (CHROMIUM_ARGS); request tracking instead of 'networkidle'
   (which resolves once and never again); waiting for the seeded leads on
   admin data pages; the legacy `.glow` gradients masked by default in the
   public suite; and a ±2/255 per-channel pixel tolerance for the raster
   noise Skia leaves on composited photo layers (see DEFAULT_MASKS and
   TOLERANCE). The style digest is always exact.

   Exit code 1 if any unmasked pixel (beyond the tolerance) or digest entry
   differs.
   ============================================ */

const fs = require('fs');
const path = require('path');
const {
  ROOT,
  ARTIFACTS,
  parseArgs,
  requirePlaywright,
  publicRoutes,
  list,
  slug,
  readEnv,
  ensureDir,
  trackNetwork,
} = require('./_shared');

const { chromium } = requirePlaywright();
const sharp = require('sharp');

/* ---------- arguments ---------- */
const args = parseArgs();
const A = typeof args.a === 'string' ? args.a.replace(/\/$/, '') : null;
const B = typeof args.b === 'string' ? args.b.replace(/\/$/, '') : null;
const SUITE = args.suite;
if (!A || !B || !['admin', 'public'].includes(SUITE)) {
  console.error(
    'usage: node scripts/qa/parity.js --a <url> --b <url> --suite admin|public ' +
      '[--mask "sel,…"] [--no-default-mask] [--widths 390,768,1440] [--routes /,/about] [--tolerance 2] [--save]'
  );
  process.exit(2);
}
// Calibrated against the baseline served twice (baseline vs baseline), with
// CPU rasterisation, Skia still repaints some composited layers differently
// from one run to the next:
// - the legacy pages' translucent radial-gradient glows (`.glow`, on a
//   parallax layer): gradient dithering of up to ±7 levels — so `.glow` is
//   masked by default in the public suite (its layout and computed styles
//   stay in the digest; only its pixels are skipped). --no-default-mask drops it;
// - tile seams across a fractionally translated photograph: ±1–2 levels —
//   covered by TOLERANCE below.
const DEFAULT_MASKS = { admin: [], public: ['.glow'] };
const MASKS = [...(args['no-default-mask'] ? [] : DEFAULT_MASKS[SUITE]), ...list(args.mask, '')];

// Per-channel pixel tolerance, in levels of 255: a pixel counts as differing
// only when a channel moves by MORE than this. Smaller changes are still
// counted and reported. --tolerance 0 makes the comparison exact. The style
// digest is always exact, so a real colour change is caught there.
const TOLERANCE = args.tolerance !== undefined && args.tolerance !== true ? Number(args.tolerance) : 2;
const WIDTHS = list(args.widths, '390,768,1440').map(Number);
const OUT = path.join(ARTIFACTS, 'parity', SUITE);
const SAVE_ALL = Boolean(args.save); // --save: keep every a/b capture, not only differing ones
const ROUTES = list(args.routes, publicRoutes().join(',')); // public suite only
const HEIGHT = 900;

/* ---------- determinism ---------- */
const FIXED_TIME = new Date('2026-01-15T10:30:00+05:30');
const BLOCKED = /^https?:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|api\.iconify\.design)\//;

// Rasterise on the CPU, in one pass, without the GPU's or the raster
// threads' timing-dependent shortcuts, so the same page paints the same
// pixels every time (calibration found ±3-level noise on photographic
// backgrounds and blurred backdrops without these).
const CHROMIUM_ARGS = [
  '--disable-gpu',
  '--disable-gpu-rasterization',
  '--disable-partial-raster',
  '--disable-skia-runtime-opts',
  '--disable-checker-imaging',
  '--disable-threaded-animation',
  '--disable-threaded-scrolling',
  '--force-color-profile=srgb',
  '--disable-lcd-text',
  '--run-all-compositor-stages-before-draw',
  '--disable-new-content-rendering-timeout',
  '--disable-image-animation-resync',
];

const SEEDS = [
  {
    lead_id: 'qa-parity-0001',
    name: 'Aarav Sharma',
    mobile: '9000000001',
    email: 'aarav.sharma@example.com',
    organization: 'Sharma Residence',
    service_interest: 'Interior Design',
    state: '',
    message: 'Three-bedroom flat on Boring Road; looking for a full interior fit-out.',
    source: 'contact-page',
    status: 'contacted',
    submitted_at: '2026-01-12T05:30:00.000Z',
    updated_at: '2026-01-12T05:30:00.000Z',
  },
  {
    lead_id: 'qa-parity-0002',
    name: 'Meera Prasad',
    mobile: '9000000002',
    email: 'meera.prasad@example.com',
    organization: '',
    service_interest: 'Something else',
    state: '',
    message: 'A small clinic on the ground floor of our house.',
    source: 'home-hero',
    status: 'consultation_booked',
    submitted_at: '2026-01-13T10:50:00.000Z',
    updated_at: '2026-01-13T10:50:00.000Z',
  },
  {
    lead_id: 'qa-parity-0003',
    name: 'Rohit Kumar',
    mobile: '9000000003',
    email: '',
    organization: 'Kumar Traders',
    service_interest: 'Interior Design',
    state: '',
    message: '',
    source: 'header-cta',
    status: 'new',
    submitted_at: '2026-01-14T03:35:00.000Z',
    updated_at: '2026-01-14T03:35:00.000Z',
  },
].map((lead) => ({
  page_url: 'http://127.0.0.1/contact',
  user_agent: 'qa-parity',
  utm_source: '',
  utm_medium: '',
  utm_campaign: '',
  utm_term: '',
  utm_content: '',
  notes: [],
  activity: [{ action: 'Lead created', status: 'new', timestamp: lead.submitted_at }],
  ...lead,
}));

const env = readEnv();

/* ---------- lead store ---------- */
const resetLeads = async (base) => {
  const host = new URL(base).hostname;
  if (!['127.0.0.1', 'localhost', '::1', '[::1]'].includes(host)) {
    throw new Error(`refusing to reset the lead store at ${base}: only loopback servers are allowed`);
  }
  const key = env.REACT_APP_LEADS_ADMIN_KEY || '';
  const api = `${base}/api/leads.php`;
  const headers = { 'Content-Type': 'application/json', 'X-Admin-Key': key };
  const listed = await fetch(`${api}?action=list`, { headers });
  if (listed.status === 401) {
    throw new Error(`${base} rejected the admin key from .env (REACT_APP_LEADS_ADMIN_KEY) — check the server's ADMIN_API_KEY`);
  }
  if (!listed.ok) throw new Error(`${api}?action=list returned ${listed.status}`);
  const { leads = [] } = await listed.json();
  if (leads.length) {
    const del = await fetch(`${api}?action=delete`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ lead_ids: leads.map((l) => l.lead_id) }),
    });
    if (!del.ok) throw new Error(`${api}?action=delete returned ${del.status}`);
  }
  for (const lead of SEEDS) {
    const res = await fetch(`${api}?action=create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead }),
    });
    if (!res.ok) throw new Error(`${api}?action=create returned ${res.status}`);
  }
  const check = await (await fetch(`${api}?action=list`, { headers })).json();
  if ((check.leads || []).length !== SEEDS.length) throw new Error(`${base}: expected ${SEEDS.length} seeded leads`);
  console.log(`  lead store ${base}: removed ${leads.length}, seeded ${SEEDS.length}`);
};

/* ---------- browser helpers ---------- */
const openContext = async (browser, width) => {
  const context = await browser.newContext({
    viewport: { width, height: HEIGHT },
    deviceScaleFactor: 1,
    locale: 'en-IN',
    timezoneId: 'Asia/Kolkata',
    colorScheme: 'light',
    reducedMotion: 'no-preference',
  });
  await context.route(BLOCKED, (route) => route.abort());
  await context.clock.install({ time: FIXED_TIME });
  // Pause so fake time only moves when this script advances it.
  await context.clock.pauseAt(new Date(FIXED_TIME.getTime() + 1000));
  const page = await context.newPage();
  page.qaQuiet = trackNetwork(page);
  const fontRequests = [];
  page.on('request', (req) => {
    if (/\/fonts\/[^/?#]+\.woff2(\?|#|$)/.test(req.url())) fontRequests.push(req.url());
  });
  return { context, page, fontRequests };
};

/** Wait (real time) until no request has been in flight for 400 ms. */
const idle = (page) => page.qaQuiet();

/** Advance fake time (fires timers and animation frames), then let I/O settle. */
const advance = async (page, ms) => {
  await page.clock.runFor(ms);
  await page.waitForTimeout(30);
};

/** Let a freshly loaded or changed page finish: network, timers, fonts. */
const settle = async (page) => {
  for (let i = 0; i < 3; i += 1) {
    await idle(page);
    await advance(page, 1000);
  }
  await page.evaluate(() => (document.fonts ? document.fonts.ready.then(() => true) : true));
  await idle(page);
  await advance(page, 500);
};

const load = async (page, url) => {
  await page.goto(url, { waitUntil: 'load', timeout: 45000 });
  await settle(page);
};

const scrollToY = async (page, y) => {
  await page.evaluate((top) => window.scrollTo({ top, left: 0, behavior: 'instant' }), y);
  await page.waitForTimeout(40); // let the scroll event dispatch
  await advance(page, 250);
};

const scrollThrough = async (page) => {
  let y = 0;
  for (let guard = 0; guard < 80; guard += 1) {
    const { height, inner } = await page.evaluate(() => ({
      height: document.documentElement.scrollHeight,
      inner: window.innerHeight,
    }));
    if (y >= height - inner) break;
    y = Math.min(y + Math.round(inner * 0.8), height - inner);
    await scrollToY(page, y);
  }
  await advance(page, 1000);
  await scrollToY(page, 0);
  await advance(page, 3000);
  await idle(page);
};

// In-page digest of every element under #root and in body-level portals.
// Masked elements stay in the digest: a mask only removes their PIXELS from
// the comparison, their layout and computed styles are still compared.
function digest() {
  const PROPS = ['font-family', 'font-size', 'font-weight', 'line-height', 'color', 'background-color', 'padding', 'margin', 'display', 'position'];
  const r2 = (n) => Math.round(n * 100) / 100;
  // Document-level elements that belong to the other surface (prompt 04's
  // IN-ARCH splash, #ia-initial-loader) are skipped while they are
  // display: none — they do not render. If one ever renders, it is digested
  // like everything else and the comparison fails.
  const OTHER_SURFACE_IDS = ['ia-initial-loader'];
  const roots = Array.from(document.body.children).filter(
    (el) =>
      !/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|LINK)$/.test(el.tagName) &&
      !(OTHER_SURFACE_IDS.includes(el.id) && getComputedStyle(el).display === 'none')
  );
  const out = [];
  roots.forEach((root) => {
    [root, ...root.querySelectorAll('*')].forEach((el) => {
      const cs = getComputedStyle(el);
      const box = el.getBoundingClientRect();
      const s = {};
      PROPS.forEach((p) => (s[p] = cs.getPropertyValue(p)));
      s.border = ['top', 'right', 'bottom', 'left']
        .map((side) => `${cs.getPropertyValue(`border-${side}-width`)} ${cs.getPropertyValue(`border-${side}-style`)} ${cs.getPropertyValue(`border-${side}-color`)}`)
        .join(' / ');
      out.push({
        t: el.tagName.toLowerCase(),
        c: el.getAttribute('class') || '',
        b: [r2(box.left + window.scrollX), r2(box.top + window.scrollY), r2(box.width), r2(box.height)],
        s,
      });
    });
  });
  return out;
}

// Page-coordinate boxes of every masked element, padded so the anti-aliased
// edge of a transformed layer is covered too.
const MASK_PAD = 4;
function maskRects([selectors, pad]) {
  const rects = [];
  selectors.forEach((sel) =>
    document.querySelectorAll(sel).forEach((el) => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      rects.push({
        x0: Math.floor(r.left + window.scrollX - pad),
        y0: Math.floor(r.top + window.scrollY - pad),
        x1: Math.ceil(r.right + window.scrollX + pad),
        y1: Math.ceil(r.bottom + window.scrollY + pad),
      });
    })
  );
  return rects;
}

const capture = async (page, fontRequests, name, width) => {
  await idle(page);
  await advance(page, 200);
  await idle(page);
  const png = await page.screenshot({ fullPage: true, animations: 'disabled', caret: 'hide' });
  const dig = await page.evaluate(digest);
  const masks = MASKS.length ? await page.evaluate(maskRects, [MASKS, MASK_PAD]) : [];
  const fonts = fontRequests.splice(0);
  return { key: `${name}-${width}`, name, width, png, digest: dig, masks, fonts };
};

/* ---------- suites ---------- */
const readGuidelinePassword = () => {
  const src = fs.readFileSync(path.join(ROOT, 'src', 'admin', 'pages', 'Guideline.jsx'), 'utf8');
  const m = src.match(/GUIDELINE_PASSWORD\s*=\s*(['"`])(.*?)\1/);
  if (!m) throw new Error('could not read the Guidelines password from src/admin/pages/Guideline.jsx');
  return m[2];
};

const runAdmin = async (browser, base, width) => {
  const shots = [];
  const { context, page, fontRequests } = await openContext(browser, width);
  const shot = async (name) => shots.push(await capture(page, fontRequests, name, width));

  // The admin loads its leads asynchronously, and calibration caught a rare
  // run where a page settled before they rendered. Wait for the seeded data
  // itself (advancing fake time, which also reaches the admin's 15 s poll),
  // so both builds are captured in the same, loaded state.
  const waitForSeeds = async (label) => {
    const name = SEEDS[1].name;
    for (let waited = 0; waited <= 20000; waited += 1000) {
      if ((await page.getByText(name, { exact: false }).count()) > 0) {
        if (waited) console.log(`    note: ${label}-${width} at ${base} needed ${waited / 1000}s more fake time for its data`);
        return;
      }
      await advance(page, 1000);
      await idle(page);
    }
    console.log(`    note: ${label}-${width} at ${base} never showed the seeded leads`);
  };
  try {
    await load(page, `${base}/admin/login`);
    await shot('login');

    const user = env.REACT_APP_ADMIN_USERNAME;
    const pass = env.REACT_APP_ADMIN_PASSWORD;
    if (!user || !pass) throw new Error('REACT_APP_ADMIN_USERNAME / REACT_APP_ADMIN_PASSWORD missing from .env');
    await page.fill('#username', user);
    await page.fill('#password', pass);
    await page.click('button[type="submit"]');
    await settle(page);
    if (/\/admin\/login/.test(page.url())) throw new Error('admin login did not succeed');

    await load(page, `${base}/admin/dashboard`);
    await waitForSeeds('dashboard');
    await shot('dashboard');

    await load(page, `${base}/admin/lms`);
    await waitForSeeds('leads');
    await shot('leads');

    // The admin's Select has no programmatic label; find it by its visible one.
    await page
      .locator('.MuiFormControl-root')
      .filter({ has: page.locator('label', { hasText: /^Interested In$/ }) })
      .getByRole('combobox')
      .click();
    await advance(page, 800);
    await shot('leads-interest-menu');
    await page.keyboard.press('Escape');
    await advance(page, 800);

    await load(page, `${base}/admin/lms/lead/${SEEDS[1].lead_id}`);
    await waitForSeeds('lead-detail');
    await shot('lead-detail');

    await load(page, `${base}/admin/lms`);
    await waitForSeeds('leads-delete');
    let del = page.locator('button[aria-label="Delete"]:visible');
    if (!(await del.count())) del = page.locator('[class*="leadCardActions"] button:nth-of-type(2)');
    await del.first().click();
    await advance(page, 800);
    await shot('leads-delete-confirm');
    await page.getByRole('button', { name: 'Cancel' }).click(); // never confirm
    await advance(page, 800);

    await load(page, `${base}/admin/guideline`);
    await shot('guideline-gate');
    await page.getByPlaceholder('Enter password').fill(readGuidelinePassword());
    await page.keyboard.press('Enter');
    await advance(page, 1000);
    const tabs = page.locator('[class*="tabBar"] button');
    const count = await tabs.count();
    if (count < 4) throw new Error(`expected 4 Guidelines tabs, found ${count}`);
    for (let i = 0; i < 4; i += 1) {
      await tabs.nth(i).click();
      await advance(page, 800);
      await scrollToY(page, 0);
      await shot(`guideline-tab-${i + 1}`);
    }

    if (width <= 390) {
      await load(page, `${base}/admin/dashboard`);
      await waitForSeeds('mobile-menu');
      await page.click('button[aria-label="Toggle navigation menu"]');
      await advance(page, 800);
      await shot('mobile-menu');
    }
  } finally {
    await context.close();
  }
  return shots;
};

const runPublic = async (browser, base, width) => {
  const shots = [];
  for (const route of ROUTES) {
    const { context, page, fontRequests } = await openContext(browser, width);
    try {
      await load(page, base + route);
      await scrollThrough(page);
      shots.push(await capture(page, fontRequests, slug(route), width));
    } finally {
      await context.close();
    }
  }
  return shots;
};

/* ---------- comparison ---------- */
const rawOf = async (png) => {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
};

const comparePixels = async (a, b, file, masks = []) => {
  const ra = await rawOf(a);
  const rb = await rawOf(b);
  if (ra.width !== rb.width || ra.height !== rb.height) {
    fs.writeFileSync(`${file}-a.png`, a);
    fs.writeFileSync(`${file}-b.png`, b);
    return { differing: Math.max(ra.width * ra.height, rb.width * rb.height), note: `size ${ra.width}×${ra.height} vs ${rb.width}×${rb.height}` };
  }
  const diff = Buffer.alloc(ra.data.length);
  let differing = 0;
  let withinTolerance = 0;
  let maxDelta = 0;
  const masked = new Uint8Array(ra.width * ra.height);
  masks.forEach(({ x0, y0, x1, y1 }) => {
    for (let y = Math.max(0, y0); y < Math.min(ra.height, y1); y += 1) {
      masked.fill(1, y * ra.width + Math.max(0, x0), y * ra.width + Math.min(ra.width, x1));
    }
  });
  for (let i = 0; i < ra.data.length; i += 4) {
    if (masked[i / 4]) {
      // masked: shown pale blue in the diff, never counted
      diff[i] = 200;
      diff[i + 1] = 220;
      diff[i + 2] = 255;
      diff[i + 3] = 255;
      continue;
    }
    const delta = Math.max(
      Math.abs(ra.data[i] - rb.data[i]),
      Math.abs(ra.data[i + 1] - rb.data[i + 1]),
      Math.abs(ra.data[i + 2] - rb.data[i + 2]),
      Math.abs(ra.data[i + 3] - rb.data[i + 3])
    );
    if (delta > maxDelta) maxDelta = delta;
    if (delta > 0 && delta <= TOLERANCE) withinTolerance += 1;
    if (delta <= TOLERANCE) {
      // faded copy of the reference for context
      diff[i] = 255 - ((255 - ra.data[i]) >> 2);
      diff[i + 1] = 255 - ((255 - ra.data[i + 1]) >> 2);
      diff[i + 2] = 255 - ((255 - ra.data[i + 2]) >> 2);
    } else {
      differing += 1;
      diff[i] = 255;
      diff[i + 1] = 0;
      diff[i + 2] = 200;
    }
    diff[i + 3] = 255;
  }
  if (differing) {
    fs.writeFileSync(`${file}-a.png`, a);
    fs.writeFileSync(`${file}-b.png`, b);
    await sharp(diff, { raw: { width: ra.width, height: ra.height, channels: 4 } }).png().toFile(`${file}-diff.png`);
  }
  const noise = withinTolerance ? `, ${withinTolerance} within ±${TOLERANCE}` : '';
  return { differing, note: `${ra.width}×${ra.height}${noise}${maxDelta ? `, max Δ ${maxDelta}` : ''}` };
};

const compareDigests = (a, b) => {
  const diffs = [];
  if (a.length !== b.length) diffs.push(`element count ${a.length} vs ${b.length}`);
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i += 1) {
    const x = a[i];
    const y = b[i];
    const who = `#${i} <${x.t}${x.c ? ` class="${x.c.slice(0, 60)}"` : ''}>`;
    if (x.t !== y.t) diffs.push(`${who} tag ${x.t} → ${y.t}`);
    if (x.c !== y.c) diffs.push(`${who} class "${x.c}" → "${y.c}"`);
    if (x.b.join() !== y.b.join()) diffs.push(`${who} box [${x.b}] → [${y.b}]`);
    Object.keys(x.s).forEach((p) => {
      if (x.s[p] !== y.s[p]) diffs.push(`${who} ${p}: ${x.s[p]} → ${y.s[p]}`);
    });
  }
  return diffs;
};

/* ---------- main ---------- */
(async () => {
  console.log(`parity (${SUITE}) — a: ${A}  b: ${B}`);
  console.log(
    `widths: ${WIDTHS.join(', ')}; pixel tolerance ±${TOLERANCE}/255${MASKS.length ? `; masked: ${MASKS.join(', ')}` : ''}`
  );
  for (const base of [A, B]) {
    const health = await fetch(`${base}/api/leads.php?action=health`).catch(() => null);
    if (!health || !health.ok) throw new Error(`${base} is not serving /api/leads.php (start it with scripts/dev-router.php)`);
  }
  await resetLeads(A);
  await resetLeads(B);
  ensureDir(OUT);

  const browser = await chromium.launch({ args: CHROMIUM_ARGS });
  const run = SUITE === 'admin' ? runAdmin : runPublic;
  let failures = 0;
  let total = 0;
  for (const width of WIDTHS) {
    const shotsA = await run(browser, A, width);
    const shotsB = await run(browser, B, width);
    const byKey = new Map(shotsB.map((s) => [s.key, s]));
    for (const sa of shotsA) {
      total += 1;
      const sb = byKey.get(sa.key);
      if (!sb) {
        failures += 1;
        console.log(`✗ ${sa.key}: missing from b`);
        continue;
      }
      if (SAVE_ALL) {
        fs.writeFileSync(path.join(OUT, `${sa.key}-a.png`), sa.png);
        fs.writeFileSync(path.join(OUT, `${sa.key}-b.png`), sb.png);
      }
      const px = await comparePixels(sa.png, sb.png, path.join(OUT, sa.key), [...sa.masks, ...sb.masks]);
      const dd = compareDigests(sa.digest, sb.digest);
      const fontLeak = sb.fonts.length ? `; b requested ${sb.fonts.length} /fonts/*.woff2` : '';
      const ok = px.differing === 0 && dd.length === 0 && !sb.fonts.length;
      if (!ok) failures += 1;
      console.log(
        `${ok ? 'ok  ' : '✗   '} ${sa.key.padEnd(30)} pixels differing: ${px.differing} (${px.note}); digest: ${sa.digest.length} elements, ${dd.length} differences${fontLeak}`
      );
      dd.slice(0, 20).forEach((d) => console.log(`       ${d}`));
      if (dd.length > 20) console.log(`       … ${dd.length - 20} more`);
    }
  }
  await browser.close();
  await resetLeads(A);
  await resetLeads(B);

  console.log(`\n${total - failures}/${total} captures identical.${failures ? ` Diff images: ${path.relative(ROOT, OUT)}/` : ''}`);
  process.exit(failures ? 1 : 0);
})().catch((err) => {
  console.error(`parity failed to run: ${err.message}`);
  process.exit(1);
});
