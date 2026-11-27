#!/usr/bin/env node
/* ============================================
   IN-ARCH icons — `npm run build:icons`
   --------------------------------------------
   Draws the in-house line icons from one geometry source and writes:

     public/images/inarch/icons/<name>.svg     15 static icons
     public/images/inarch/lottie/<name>.json    8 animated icons (Lottie)

   Why in-house: the brief asked for one Icons8 family, but icons8.com
   answered this build session with a Cloudflare 403 (its licence could not
   be read) and its CDN refuses SVG (403; SVG is a paid format). Following
   the brief's fallback, the icons are drawn here in the same duotone line
   style — see prompts/BUILD_LOG.md, "pending third-party assets".

   Style: 48 × 48 viewBox drawn on a 24-px grid (coordinates ×2), round caps
   and joins, a 1.5 px stroke that stays 1.5 px at every rendered size
   (`vector-effect: non-scaling-stroke`). Strokes are `currentColor`, so the
   icon follows the tone; the one accent part is `var(--ia-accent-display)`
   (falling back to currentColor outside the `ia` scope). No other colour is
   written. Inline the SVG to colour it (an <img> cannot see CSS variables).

   Lottie: the same shapes draw on with trim paths, ink first, accent last,
   once (≈ 1.1 s at 60 fps). Layers carry the classes `ia-l-ink` and
   `ia-l-accent` (Lottie `cl`), so CSS can re-tint them per tone; the JSON's
   own colours are espresso #231B15 and terracotta-500 #B5653F. Under
   reduced motion the matching static SVG is shown instead.

   Deterministic: a second run writes nothing.
   ============================================ */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ICON_DIR = path.join(ROOT, 'public', 'images', 'inarch', 'icons');
const LOTTIE_DIR = path.join(ROOT, 'public', 'images', 'inarch', 'lottie');

const STROKE = 1.5;
const ACCENT = 'var(--ia-accent-display, currentColor)';
const INK_RGB = [35, 27, 21];
const ACCENT_RGB = [181, 101, 63];

// ---------- geometry ----------
const r2 = (n) => Math.round(n * 100) / 100;

/** A path built from absolute M / L / C / Z commands plus an arc helper. */
const P = () => {
  const cmds = [];
  let cur = null;
  const api = {
    cmds,
    M(x, y) {
      cmds.push(['M', x, y]);
      cur = [x, y];
      return api;
    },
    L(x, y) {
      cmds.push(['L', x, y]);
      cur = [x, y];
      return api;
    },
    H(x) {
      return api.L(x, cur[1]);
    },
    V(y) {
      return api.L(cur[0], y);
    },
    C(x1, y1, x2, y2, x, y) {
      cmds.push(['C', x1, y1, x2, y2, x, y]);
      cur = [x, y];
      return api;
    },
    /** Arc around (cx, cy) from angle a0 to a1 (degrees, SVG orientation), from the current point. */
    A(cx, cy, r, a0, a1) {
      const steps = Math.ceil(Math.abs(a1 - a0) / 90);
      const d = (a1 - a0) / steps;
      for (let s = 0; s < steps; s += 1) {
        const t1 = ((a0 + d * s) * Math.PI) / 180;
        const t2 = ((a0 + d * (s + 1)) * Math.PI) / 180;
        const k = (4 / 3) * Math.tan((t2 - t1) / 4);
        const p0 = [cx + r * Math.cos(t1), cy + r * Math.sin(t1)];
        const p3 = [cx + r * Math.cos(t2), cy + r * Math.sin(t2)];
        api.C(
          p0[0] - k * r * Math.sin(t1),
          p0[1] + k * r * Math.cos(t1),
          p3[0] + k * r * Math.sin(t2),
          p3[1] - k * r * Math.cos(t2),
          p3[0],
          p3[1]
        );
      }
      return api;
    },
    Z() {
      cmds.push(['Z']);
      return api;
    },
  };
  return api;
};

// Shape constructors. `accent` marks the accent part; `fill` draws a filled dot.
const path$ = (p, opts = {}) => ({ type: 'path', cmds: p.cmds, ...opts });
const line = (x1, y1, x2, y2, opts) => path$(P().M(x1, y1).L(x2, y2), opts);
const poly = (pts, closed, opts) => {
  const p = P().M(...pts[0]);
  pts.slice(1).forEach((pt) => p.L(...pt));
  if (closed) p.Z();
  return path$(p, opts);
};
const circle = (cx, cy, r, opts = {}) => ({ type: 'circle', cx, cy, r, ...opts });
const rect = (x, y, w, h, rx = 0, opts = {}) => ({ type: 'rect', x, y, w, h, rx, ...opts });
const A = { accent: true };

// ---------- the icons (48-unit grid) ----------
const ICONS = {
  // Two speech bubbles: the studio listens, then answers.
  'process-01-consultation': [
    path$(P().M(9, 7).H(24).A(24, 11, 4, -90, 0).V(21).A(24, 21, 4, 0, 90).H(17).L(10, 31).V(25).A(9, 21, 4, 90, 180).V(11).A(9, 11, 4, 180, 270).Z()),
    circle(11, 16, 1.5, { fill: true }),
    circle(16.5, 16, 1.5, { fill: true }),
    circle(22, 16, 1.5, { fill: true }),
    path$(P().M(28, 19).H(38).A(38, 23, 4, -90, 0).V(31).A(38, 31, 4, 0, 90).H(37).L(38, 42).L(31, 35).H(24).A(24, 31, 4, 90, 180).V(25), A),
  ],
  // A plot with contour lines and a north point.
  'process-02-site-study': [
    poly([[6, 19], [27, 15], [31, 41], [8, 42]], true),
    path$(P().M(10, 27).C(15, 24, 20, 30, 28.5, 26.5)),
    path$(P().M(10.5, 35).C(16, 32, 21, 37, 29.5, 33.5)),
    circle(37, 11, 6.5, A),
    poly([[37, 6.5], [39.5, 14], [37, 12.5], [34.5, 14]], true, { accent: true, fill: true }),
  ],
  // A bubble diagram: spaces and how they relate.
  'process-03-concept': [
    circle(17, 19, 9),
    circle(35, 13, 5),
    line(25.6, 16.3, 30.2, 14.4),
    line(22.9, 25.8, 26.4, 29.7),
    line(34.3, 18, 32.9, 27.1),
    circle(31, 34, 7, A),
  ],
  // Stacked sheets: plans, elevations and sections refined together.
  'process-04-development': [
    poly([[6, 25], [24, 33], [42, 25]], false),
    poly([[6, 32], [24, 40], [42, 32]], false),
    poly([[24, 10], [42, 18], [24, 26], [6, 18]], true, A),
  ],
  // A drawing sheet with a plan and title block, and a set square.
  'process-05-drawings': [
    rect(5, 6, 24, 34, 1.5),
    poly([[10, 12], [24, 12], [24, 22], [18, 22], [18, 28], [10, 28]], true),
    line(5, 33, 29, 33),
    line(18, 33, 18, 40),
    poly([[31, 42], [44, 42], [44, 28]], true, A),
    poly([[35.5, 39.5], [41.5, 39.5], [41.5, 33.5]], true, A),
  ],
  // Three parties linked: consultants, contractors and the studio.
  'process-06-coordination': [
    circle(10, 36, 5),
    circle(38, 36, 5),
    line(21.6, 14.4, 12.4, 31.6),
    line(26.4, 14.4, 35.6, 31.6),
    line(15, 36, 33, 36),
    circle(24, 10, 5, A),
  ],
  // A clipboard with a tick: the work checked against the intent.
  'process-07-completion': [
    path$(P().M(18, 9).H(12).A(12, 11, 2, -90, -180).V(41).A(12, 41, 2, 180, 90).H(36).A(36, 41, 2, 90, 0).V(11).A(36, 11, 2, 0, -90).H(30)),
    rect(18, 5, 12, 7, 1.5),
    poly([[17, 27], [22, 32], [31, 21]], false, A),
  ],

  // Two volumes on a ground line.
  'service-e01-architecture': [
    path$(P().M(9, 42).V(10).H(23).V(42)),
    line(13, 16, 19, 16),
    line(13, 23, 19, 23),
    line(13, 30, 19, 30),
    line(5, 42, 43, 42),
    path$(P().M(23, 22).H(39).V(42), A),
    line(27, 29, 35, 29, A),
  ],
  // A sofa under a pendant lamp.
  'service-e02-interiors': [
    path$(P().M(12, 33).V(26).A(15, 26, 3, 180, 270).H(33).A(33, 26, 3, 270, 360).V(33)),
    path$(P().M(6, 33).A(9, 33, 3, 180, 360).V(36).H(36).V(33).A(39, 33, 3, 180, 360).V(40).H(6).Z()),
    line(9.5, 40, 9.5, 43),
    line(38.5, 40, 38.5, 43),
    line(24, 4, 24, 11, A),
    poly([[18, 17], [20, 11], [28, 11], [30, 17]], true, A),
  ],
  // A house with a chimney.
  'service-e03-residential': [
    poly([[6, 22], [24, 8], [42, 22]], false),
    path$(P().M(10, 19).V(41).H(38).V(19)),
    path$(P().M(32, 14.2).V(8).H(36).V(17.3)),
    rect(30, 26, 4, 4, 0.5),
    path$(P().M(19, 41).V(30).H(26).V(41), A),
  ],
  // A tower beside a columned hall.
  'service-e04-commercial': [
    path$(P().M(7, 42).V(8).H(20).V(42)),
    line(11, 15, 16, 15),
    line(11, 22, 16, 22),
    line(11, 29, 16, 29),
    line(4, 42, 44, 42),
    line(24, 25, 42, 25),
    line(27.5, 25, 27.5, 39),
    line(33, 25, 33, 39),
    line(38.5, 25, 38.5, 39),
    line(24, 39, 42, 39),
    poly([[23, 22], [33, 15.5], [43, 22]], true, A),
  ],
  // A screen showing a 3D form.
  'service-e05-visualisation': [
    rect(5, 8, 38, 26, 2),
    line(20, 34, 19, 41),
    line(28, 34, 29, 41),
    line(15, 41, 33, 41),
    poly([[24, 13], [31, 17], [24, 21], [17, 17]], true, A),
    poly([[17, 17], [17, 25], [24, 29], [31, 25], [31, 17]], false, A),
    line(24, 21, 24, 29, A),
  ],
  // A tower crane lifting a load.
  'service-e06-site': [
    line(13, 12, 13, 42),
    line(19, 12, 19, 42),
    poly([[13, 16], [19, 22], [13, 28], [19, 34], [13, 40]], false),
    line(5, 12, 43, 12),
    poly([[6, 12], [16, 5], [42, 12]], false),
    line(5, 42, 43, 42),
    line(35, 12, 35, 23, A),
    rect(30, 23, 10, 7, 0.5, A),
  ],
  // A paint roller.
  'service-e07-renovation': [
    poly([[34, 11.5], [40, 11.5], [40, 21], [24, 21], [24, 28]], false),
    rect(21, 28, 6, 14, 2),
    rect(8, 7, 26, 9, 2, A),
  ],

  // Static fallback of the "sent / done" Lottie.
  'status-done': [circle(24, 24, 17), poly([[16, 24.5], [21.5, 30], [32.5, 19]], false, A)],
};

const LOTTIE = [
  'process-01-consultation',
  'process-02-site-study',
  'process-03-concept',
  'process-04-development',
  'process-05-drawings',
  'process-06-coordination',
  'process-07-completion',
  'status-done',
];

// ---------- SVG ----------
const svgD = (cmds) =>
  cmds
    .map(([c, ...n]) => (c === 'Z' ? 'Z' : `${c}${n.map((v) => r2(v)).join(' ')}`))
    .join('');

const svgEl = (s) => {
  const paint = [];
  if (s.fill) {
    paint.push(`fill="${s.accent ? ACCENT : 'currentColor'}"`, 'stroke="none"');
  } else if (s.accent) {
    paint.push(`stroke="${ACCENT}"`);
  }
  const common = [...paint, 'vector-effect="non-scaling-stroke"'].join(' ');
  if (s.type === 'circle') return `<circle cx="${r2(s.cx)}" cy="${r2(s.cy)}" r="${r2(s.r)}" ${common}/>`;
  if (s.type === 'rect') {
    const rx = s.rx ? ` rx="${r2(s.rx)}"` : '';
    return `<rect x="${r2(s.x)}" y="${r2(s.y)}" width="${r2(s.w)}" height="${r2(s.h)}"${rx} ${common}/>`;
  }
  return `<path d="${svgD(s.cmds)}" ${common}/>`;
};

const toSvg = (shapes) =>
  [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor"',
    ` stroke-width="${STROKE}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">`,
    ...shapes.filter((s) => !s.accent).map((s) => `\n  ${svgEl(s)}`),
    ...shapes.filter((s) => s.accent).map((s) => `\n  ${svgEl(s)}`),
    '\n</svg>\n',
  ].join('');

// ---------- Lottie ----------
const FR = 60;
const DRAW = 30; // frames per stroke
const STAGGER = 5;
const rgb1 = (c) => [...c.map((n) => Number((n / 255).toFixed(4))), 1];
const st = (v) => ({ a: 0, k: v });
const ease = (t0, t1, from, to) => ({
  a: 1,
  k: [
    { t: t0, s: from, i: { x: [0.16], y: [1] }, o: { x: [0.3], y: [0] } },
    { t: t1, s: to },
  ],
});

/** Lottie contours for a path (one `sh` per subpath). */
const lottiePaths = (cmds) => {
  const out = [];
  let cur = null;
  const flush = () => {
    if (!cur) return;
    if (cur.c && cur.v.length > 1) {
      const a = cur.v[0];
      const b = cur.v[cur.v.length - 1];
      if (Math.abs(a[0] - b[0]) < 1e-6 && Math.abs(a[1] - b[1]) < 1e-6) {
        cur.i[0] = cur.i[cur.i.length - 1];
        cur.v.pop();
        cur.i.pop();
        cur.o.pop();
      }
    }
    out.push({ ty: 'sh', ks: st({ i: cur.i, o: cur.o, v: cur.v, c: cur.c }) });
    cur = null;
  };
  cmds.forEach(([c, ...n]) => {
    if (c === 'M') {
      flush();
      cur = { v: [[r2(n[0]), r2(n[1])]], i: [[0, 0]], o: [[0, 0]], c: false };
    } else if (c === 'L') {
      cur.v.push([r2(n[0]), r2(n[1])]);
      cur.i.push([0, 0]);
      cur.o.push([0, 0]);
    } else if (c === 'C') {
      const last = cur.v.length - 1;
      const [px, py] = cur.v[last];
      cur.o[last] = [r2(n[0] - px), r2(n[1] - py)];
      cur.v.push([r2(n[4]), r2(n[5])]);
      cur.i.push([r2(n[2] - n[4]), r2(n[3] - n[5])]);
      cur.o.push([0, 0]);
    } else if (c === 'Z') {
      cur.c = true;
    }
  });
  flush();
  return out;
};

const lottieShape = (s) => {
  if (s.type === 'circle') return [{ ty: 'el', d: 1, p: st([r2(s.cx), r2(s.cy)]), s: st([r2(s.r * 2), r2(s.r * 2)]) }];
  if (s.type === 'rect') {
    return [{ ty: 'rc', d: 1, p: st([r2(s.x + s.w / 2), r2(s.y + s.h / 2)]), s: st([r2(s.w), r2(s.h)]), r: st(r2(s.rx || 0)) }];
  }
  return lottiePaths(s.cmds);
};

const centreOf = (s) => {
  if (s.type === 'circle') return [s.cx, s.cy];
  if (s.type === 'rect') return [s.x + s.w / 2, s.y + s.h / 2];
  const pts = s.cmds.filter((c) => c[0] !== 'Z').map((c) => c.slice(-2));
  return [pts.reduce((a, p) => a + p[0], 0) / pts.length, pts.reduce((a, p) => a + p[1], 0) / pts.length];
};

const toLottie = (name, shapes) => {
  const ordered = [...shapes.filter((s) => !s.accent), ...shapes.filter((s) => s.accent)];
  const groups = { ink: [], accent: [] };
  ordered.forEach((s, idx) => {
    const t0 = idx * STAGGER;
    const t1 = t0 + DRAW;
    const colour = rgb1(s.accent ? ACCENT_RGB : INK_RGB);
    const items = [...lottieShape(s)];
    const [cx, cy] = centreOf(s).map(r2);
    let tr = { ty: 'tr', p: st([0, 0]), a: st([0, 0]), s: st([100, 100]), r: st(0), o: st(100), sk: st(0), sa: st(0) };
    if (s.fill) {
      items.push({ ty: 'fl', c: st(colour), o: st(100), r: 1 });
      tr = { ...tr, p: st([cx, cy]), a: st([cx, cy]), s: ease(t0 + 8, t1, [0, 0], [100, 100]) };
    } else {
      items.push({ ty: 'tm', s: st(0), e: ease(t0, t1, [0], [100]), o: st(0), m: 1 });
      items.push({ ty: 'st', c: st(colour), o: st(100), w: st(STROKE), lc: 2, lj: 2, ml: 4 });
    }
    items.push(tr);
    groups[s.accent ? 'accent' : 'ink'].push({ ty: 'gr', nm: `${s.accent ? 'a' : 'i'}${idx}`, np: items.length, it: items });
  });
  const op = (ordered.length - 1) * STAGGER + DRAW + 1;
  const layer = (ind, nm, cl, shapesList) => ({
    ddd: 0,
    ind,
    ty: 4,
    nm,
    cl,
    sr: 1,
    ks: { o: st(100), r: st(0), p: st([0, 0, 0]), a: st([0, 0, 0]), s: st([100, 100, 100]) },
    ao: 0,
    shapes: shapesList,
    ip: 0,
    op,
    st: 0,
    bm: 0,
  });
  // Accent layer first in the array = drawn on top.
  return {
    v: '5.7.4',
    fr: FR,
    ip: 0,
    op,
    w: 48,
    h: 48,
    nm: name,
    ddd: 0,
    assets: [],
    layers: [layer(1, 'accent', 'ia-l-accent', groups.accent), layer(2, 'ink', 'ia-l-ink', groups.ink)],
  };
};

// ---------- write ----------
const writeIfChanged = (file, content) => {
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === content) return false;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  return true;
};

let written = 0;
Object.entries(ICONS).forEach(([name, shapes]) => {
  const accents = shapes.filter((s) => s.accent).length;
  if (!accents) throw new Error(`${name}: no accent part`);
  const svg = toSvg(shapes);
  if (writeIfChanged(path.join(ICON_DIR, `${name}.svg`), svg)) written += 1;
  console.log(`icon   ${name.padEnd(28)} ${String(Buffer.byteLength(svg)).padStart(5)} B`);
});
LOTTIE.forEach((name) => {
  const json = `${JSON.stringify(toLottie(name, ICONS[name]))}\n`;
  const bytes = Buffer.byteLength(json);
  if (bytes >= 40 * 1024) throw new Error(`${name}.json is ${bytes} B (≥ 40 KB)`);
  if (writeIfChanged(path.join(LOTTIE_DIR, `${name}.json`), json)) written += 1;
  console.log(`lottie ${name.padEnd(28)} ${String(bytes).padStart(5)} B`);
});
console.log(`${written} file(s) written`);

module.exports = { ICONS, LOTTIE };
