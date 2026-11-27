/* ============================================
   Shared helpers for the QA scripts (scripts/qa/*.js)
   ============================================ */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const ARTIFACTS = path.join(ROOT, 'qa-artifacts');

/** Parse `--name value` / `--flag` pairs. */
const parseArgs = (argv = process.argv.slice(2)) => {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const [key, inline] = arg.slice(2).split('=');
    if (inline !== undefined) out[key] = inline;
    else if (argv[i + 1] !== undefined && !argv[i + 1].startsWith('--')) out[key] = argv[++i];
    else out[key] = true;
  }
  return out;
};

/**
 * The Playwright already installed in the session (never a project
 * dependency). Exits with a clear message when it is missing.
 */
const requirePlaywright = () => {
  try {
    return require('playwright');
  } catch (err) {
    console.error(
      'Playwright cannot be resolved. These QA scripts use the Playwright installed in the session ' +
        '(require("playwright")); it is deliberately not a project dependency. Install it globally ' +
        'or run in an environment that provides it. Stopping.'
    );
    process.exit(2);
  }
};

/** Placeholder path used to exercise the `*` (404) route. */
const NOT_FOUND_PATH = '/__qa-not-found';

/**
 * Every public route in the <Route> table of src/App.jsx: literal paths,
 * minus /admin*, with the `*` catch-all mapped to a nonsense URL.
 */
const publicRoutes = () => {
  const src = fs.readFileSync(path.join(ROOT, 'src', 'App.jsx'), 'utf8');
  const paths = [...src.matchAll(/<Route\b[^>]*?\bpath="([^"]+)"/g)].map((m) => m[1]);
  const routes = [];
  paths.forEach((p) => {
    if (p === '/admin' || p.startsWith('/admin/')) return;
    const route = p === '*' ? NOT_FOUND_PATH : p;
    if (route.includes(':')) return; // parameterised routes need a concrete value
    if (!routes.includes(route)) routes.push(route);
  });
  return routes;
};

const list = (value, fallback) =>
  (value && value !== true ? String(value) : fallback)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

/** File-system-safe name for a route. */
const slug = (route) => (route === '/' ? 'home' : route.replace(/^\//, '').replace(/[^\w-]+/g, '_'));

/** Read KEY=value pairs from .env without ever printing them. */
const readEnv = (file = path.join(ROOT, '.env')) => {
  const env = {};
  if (!fs.existsSync(file)) return env;
  fs.readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .forEach((line) => {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
    });
  return env;
};

const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true });

/**
 * Track in-flight requests on a page and return `waitQuiet()`, which
 * resolves once nothing has been in flight for `quietMs` of real time.
 *
 * Needed because page.waitForLoadState('networkidle') resolves immediately
 * once a navigation has been idle ONCE, so it cannot catch a request that a
 * timer or an effect starts later (e.g. the admin's lead fetch).
 */
const trackNetwork = (page) => {
  const inflight = new Set();
  let lastChange = Date.now();
  const done = (req) => {
    inflight.delete(req);
    lastChange = Date.now();
  };
  page.on('request', (req) => {
    inflight.add(req);
    lastChange = Date.now();
  });
  page.on('requestfinished', done);
  page.on('requestfailed', done);
  page.on('framenavigated', (frame) => {
    if (frame === page.mainFrame()) lastChange = Date.now();
  });
  return async ({ quietMs = 400, timeout = 20000 } = {}) => {
    const start = Date.now();
    for (;;) {
      if (inflight.size === 0 && Date.now() - lastChange >= quietMs) return true;
      if (Date.now() - start > timeout) return false;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  };
};

module.exports = {
  ROOT,
  ARTIFACTS,
  NOT_FOUND_PATH,
  parseArgs,
  requirePlaywright,
  publicRoutes,
  list,
  slug,
  readEnv,
  ensureDir,
  trackNetwork,
};
