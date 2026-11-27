#!/usr/bin/env node
/* ============================================
   Public-site check — scripts/qa/public-check.js
   --------------------------------------------
   node scripts/qa/public-check.js [--base http://127.0.0.1:8080]
                                   [--routes /,/about,…]
                                   [--widths 360,390,768,1024,1280,1440,1920]

   For every route × width it loads the page, waits for network idle and
   fonts, scrolls to the bottom and back so lazy content mounts, then fails on:
   - any console.error or uncaught page error;
   - any same-origin request that returns ≥ 400 (or fails outright);
   - horizontal overflow (scrollWidth > innerWidth + 1);
   - any serious / critical axe violation (wcag2a, wcag2aa, wcag21aa, wcag22aa);
   - at widths ≤ 768: any visible link or button inside `.ia` smaller than
     44 × 44 CSS px.
   The 390 and 1440 runs are repeated with prefers-reduced-motion: reduce.
   Full-page screenshots go to qa-artifacts/public/ (git-ignored).
   Exit code 1 on any failure.
   ============================================ */

const path = require('path');
const {
  ROOT,
  ARTIFACTS,
  parseArgs,
  requirePlaywright,
  publicRoutes,
  list,
  slug,
  ensureDir,
  trackNetwork,
} = require('./_shared');

const { chromium } = requirePlaywright();

const args = parseArgs();
const BASE = String(args.base && args.base !== true ? args.base : 'http://127.0.0.1:8080').replace(/\/$/, '');
const ROUTES = list(args.routes, publicRoutes().join(','));
const WIDTHS = list(args.widths, '360,390,768,1024,1280,1440,1920').map(Number);
const REDUCED_WIDTHS = [390, 1440].filter((w) => WIDTHS.includes(w));
const AXE_PATH = path.join(ROOT, 'node_modules', 'axe-core', 'axe.min.js');
const OUT = path.join(ARTIFACTS, 'public');
const HEIGHT = 900;

const origin = new URL(BASE).origin;

const settle = (page, ms) => page.waitForTimeout(ms);

/** Scroll down in viewport steps (so lazy content and reveals mount), then back. */
const scrollThrough = async (page) => {
  let y = 0;
  for (let guard = 0; guard < 80; guard += 1) {
    const { height, inner } = await page.evaluate(() => ({
      height: document.documentElement.scrollHeight,
      inner: window.innerHeight,
    }));
    if (y >= height - inner) break;
    y = Math.min(y + Math.round(inner * 0.8), height - inner);
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await settle(page, 120);
  }
  await settle(page, 400);
  await page.evaluate(() => window.scrollTo(0, 0));
  await settle(page, 1200);
};

// In-page: visible links / buttons inside .ia smaller than 44 × 44.
function smallTargets() {
  const describe = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += `#${el.id}`;
    const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).filter(Boolean).slice(0, 2) : [];
    if (cls.length) s += `.${cls.join('.')}`;
    const label = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
    return label ? `${s} "${label}"` : s;
  };
  const out = [];
  document.querySelectorAll('.ia a[href], .ia button, .ia [role="button"]').forEach((el) => {
    // The Design Lab forces the press state (scale 0.98) for display; a real
    // press is transient, so a forced one is not a resting target size.
    if (el.closest('[data-force-active]')) return;
    const visible =
      typeof el.checkVisibility === 'function'
        ? el.checkVisibility({ checkOpacity: false, checkVisibilityCSS: true })
        : el.offsetParent !== null;
    if (!visible) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return;
    if (r.width < 44 || r.height < 44) {
      out.push(`${describe(el)} ${r.width.toFixed(1)}×${r.height.toFixed(1)}`);
    }
  });
  return out;
}

const checkOne = async (browser, route, width, reducedMotion) => {
  const label = `${route} @${width}${reducedMotion ? ' (reduced motion)' : ''}`;
  const failures = [];
  const notes = [];
  const context = await browser.newContext({
    viewport: { width, height: HEIGHT },
    deviceScaleFactor: 1,
    hasTouch: width <= 768,
    isMobile: width <= 768,
    reducedMotion: reducedMotion ? 'reduce' : 'no-preference',
  });
  const page = await context.newPage();
  const quiet = trackNetwork(page);

  page.on('console', (msg) => {
    if (msg.type() === 'error') failures.push(`console.error: ${msg.text().slice(0, 300)}`);
  });
  page.on('pageerror', (err) => failures.push(`page error: ${err.message.slice(0, 300)}`));
  page.on('response', (res) => {
    const url = res.url();
    if (url.startsWith(origin) && res.status() >= 400) failures.push(`HTTP ${res.status()} ${url.slice(origin.length)}`);
  });
  page.on('requestfailed', (req) => {
    const url = req.url();
    const text = (req.failure() && req.failure().errorText) || 'failed';
    if (url.startsWith(origin) && !/ERR_ABORTED/.test(text)) failures.push(`request failed: ${url.slice(origin.length)} (${text})`);
  });

  try {
    await page.goto(BASE + route, { waitUntil: 'load', timeout: 45000 });
    if (!(await quiet())) notes.push('network did not go quiet in 20 s');
    await page.evaluate(() => (document.fonts ? document.fonts.ready.then(() => true) : true));
    await scrollThrough(page);
    if (!(await quiet())) notes.push('network did not go quiet after scrolling');

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    if (overflow.scrollWidth > overflow.innerWidth + 1) {
      failures.push(`horizontal overflow: scrollWidth ${overflow.scrollWidth} > innerWidth ${overflow.innerWidth}`);
    }

    await page.addScriptTag({ path: AXE_PATH });
    const axe = await page.evaluate(async () => {
      const result = await window.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] },
        resultTypes: ['violations'],
      });
      return result.violations
        .filter((v) => v.impact === 'serious' || v.impact === 'critical')
        .map((v) => ({
          id: v.id,
          impact: v.impact,
          help: v.help,
          nodes: v.nodes.slice(0, 5).map((n) => n.target.join(' ')),
          count: v.nodes.length,
        }));
    });
    axe.forEach((v) =>
      failures.push(`axe ${v.impact} ${v.id} (${v.count}): ${v.help} — ${v.nodes.join(' | ')}`)
    );

    if (width <= 768) {
      const small = await page.evaluate(smallTargets);
      small.forEach((s) => failures.push(`target < 44×44 inside .ia: ${s}`));
    }

    ensureDir(OUT);
    const file = path.join(OUT, `${slug(route)}-${width}${reducedMotion ? '-reduced' : ''}.png`);
    await page.screenshot({ path: file, fullPage: true });
  } catch (err) {
    failures.push(`run error: ${err.message.split('\n')[0]}`);
  } finally {
    await context.close();
  }
  return { label, failures, notes };
};

(async () => {
  console.log(`public-check → ${BASE}`);
  console.log(`routes: ${ROUTES.join(' ')}`);
  console.log(`widths: ${WIDTHS.join(' ')} (+ reduced motion at ${REDUCED_WIDTHS.join(', ') || 'none'})\n`);

  const browser = await chromium.launch();
  const results = [];
  for (const route of ROUTES) {
    for (const width of WIDTHS) {
      const r = await checkOne(browser, route, width, false);
      results.push(r);
      console.log(`${r.failures.length ? 'FAIL' : 'ok  '} ${r.label}${r.notes.length ? `  (${r.notes.join('; ')})` : ''}`);
    }
    for (const width of REDUCED_WIDTHS) {
      const r = await checkOne(browser, route, width, true);
      results.push(r);
      console.log(`${r.failures.length ? 'FAIL' : 'ok  '} ${r.label}`);
    }
  }
  await browser.close();

  const failed = results.filter((r) => r.failures.length);
  console.log('\n──────── summary ────────');
  console.log(`${results.length - failed.length}/${results.length} runs clean. Screenshots: ${path.relative(ROOT, OUT)}/`);
  failed.forEach((r) => {
    console.log(`\n✗ ${r.label}`);
    [...new Set(r.failures)].forEach((f) => console.log(`   - ${f}`));
  });
  process.exit(failed.length ? 1 : 0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
