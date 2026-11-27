#!/usr/bin/env node
/* ============================================
   IN-ARCH brand files — `npm run build:brand`
   --------------------------------------------
   Cuts trimmed copies of the supplied logos (`logos/`, read-only source
   material) into `public/images/brand/`. No recolouring, no redrawing: each
   file is an extract of the supplied artwork in its own ink, resized with
   Lanczos, alpha channel preserved (see `cut` for how the ink stays exact).

   File names carry the output width because `/images/**` is served
   `immutable` for a year (public/.htaccess): a re-cut must use a new name.

   The outputs are committed. Re-run only when a source logo changes; the
   script then verifies every output (size, transparent corners, ink colour,
   artwork touching all four edges) and exits non-zero on a failure.
   A second run with unchanged sources writes nothing.

   Rule for every surface: under 44 px tall use the wordmark-only file (the
   descriptor line is illegible there); from 44 px use the full lockup. Keep
   clear space equal to the cap height of the "I" on all sides. Never tint,
   outline or stretch the logo, and never place it on a busy part of a
   photograph without the forest overlay behind it.
   ============================================ */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'logos');
const OUT = path.join(ROOT, 'public', 'images', 'brand');

// Measured with sharp on the supplied files (see prompts/BUILD_LOG.md, prompt 02):
// logo 4800 × 1560, artwork x 226–4572 (x 4573 holds two pixels at alpha ≤ 6),
// y 338–1219; wordmark band y 338–870, x 226–3910; descriptor band y 1090–1219
// at alpha 209 (≈ 82 %). Monogram 512 × 512, artwork x 123–388, y 161–350.
const LOCKUP = { left: 226, top: 338, width: 4347, height: 882 };
const WORDMARK = { left: 226, top: 338, width: 3685, height: 533 };
const MONOGRAM = { left: 123, top: 161, width: 266, height: 190 };

const INK_ON_LIGHT = [0x23, 0x1b, 0x15]; // #231B15 espresso
const INK_ON_DARK = [0xf4, 0xef, 0xe7]; // #F4EFE7 ivory

const LIGHT_LOGO = 'in-arch-logo-light-transparent.png'; // espresso ink, for light backgrounds
const DARK_LOGO = 'in-arch-logo-dark-transparent.png'; // ivory ink, for dark backgrounds
const LIGHT_MARK = 'in-arch-favicon-light-transparent.png';
const DARK_MARK = 'in-arch-favicon-dark-transparent.png';

const JOBS = [
  { out: 'inarch-lockup-on-light-1600.png', src: LIGHT_LOGO, box: LOCKUP, size: [1600, 325], ink: INK_ON_LIGHT },
  { out: 'inarch-lockup-on-light-800.png', src: LIGHT_LOGO, box: LOCKUP, size: [800, 162], ink: INK_ON_LIGHT },
  { out: 'inarch-lockup-on-dark-1600.png', src: DARK_LOGO, box: LOCKUP, size: [1600, 325], ink: INK_ON_DARK },
  { out: 'inarch-lockup-on-dark-800.png', src: DARK_LOGO, box: LOCKUP, size: [800, 162], ink: INK_ON_DARK },
  { out: 'inarch-wordmark-on-light-1383.png', src: LIGHT_LOGO, box: WORDMARK, size: [1383, 200], ink: INK_ON_LIGHT },
  { out: 'inarch-wordmark-on-dark-1383.png', src: DARK_LOGO, box: WORDMARK, size: [1383, 200], ink: INK_ON_DARK },
  { out: 'inarch-mark-on-light-266.png', src: LIGHT_MARK, box: MONOGRAM, size: null, ink: INK_ON_LIGHT },
  { out: 'inarch-mark-on-dark-266.png', src: DARK_MARK, box: MONOGRAM, size: null, ink: INK_ON_DARK },
];

/**
 * Extract (and, for the lockups and wordmarks, resize) one file.
 *
 * Resized files: only the alpha channel is resampled (Lanczos 3); the colour
 * channels are the supplied ink. The supplied logos are one flat ink colour
 * over alpha, and resampling RGB through premultiplied alpha lets Lanczos
 * overshoot shift opaque edge pixels by up to 53 levels. Keeping the ink flat
 * keeps the logo exactly its own colour. The one side effect: the source
 * descriptor line, stored one level off (#221B15 / #F4EFE8 at alpha 209),
 * comes out as the exact ink.
 *
 * Native-size files (the monogram) are a plain extract, byte for byte.
 */
const cut = async ({ src, box, size, ink }) => {
  const png = { compressionLevel: 9, adaptiveFiltering: true, palette: false };
  const base = sharp(path.join(SRC, src)).ensureAlpha().extract(box);
  if (!size) return base.png(png).toBuffer();
  const [width, height] = size;
  const alpha = await base
    .resize(width, height, { fit: 'fill', kernel: sharp.kernel.lanczos3 })
    .extractChannel(3)
    .raw()
    .toBuffer();
  return sharp({ create: { width, height, channels: 3, background: { r: ink[0], g: ink[1], b: ink[2] } } })
    .joinChannel(alpha, { raw: { width, height, channels: 1 } })
    .png(png)
    .toBuffer();
};

/**
 * Size, transparent background, ink and edge contact of one output buffer.
 *
 * The crop is tight, so glyph corners (the "I", the descriptor's first "A")
 * sit in the image corners: corner alpha is artwork, not background. The
 * background test is therefore "every pixel that is not ink is fully
 * transparent", plus a minimum share of fully transparent pixels.
 */
const verify = async (buffer, job) => {
  const { data, info } = await sharp(buffer).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels } = info;
  const expected = job.size || [job.box.width, job.box.height];
  const problems = [];
  if (channels !== 4) problems.push(`expected RGBA, got ${channels} channels`);
  if (W !== expected[0] || H !== expected[1]) problems.push(`size ${W}×${H}, expected ${expected.join('×')}`);

  const alphaAt = (x, y) => data[(y * W + x) * channels + 3];
  const corners = [alphaAt(0, 0), alphaAt(W - 1, 0), alphaAt(0, H - 1), alphaAt(W - 1, H - 1)];

  // Every edge row/column must carry some artwork (no leftover padding).
  const edge = { top: 0, bottom: 0, left: 0, right: 0 };
  for (let x = 0; x < W; x += 1) {
    edge.top = Math.max(edge.top, alphaAt(x, 0));
    edge.bottom = Math.max(edge.bottom, alphaAt(x, H - 1));
  }
  for (let y = 0; y < H; y += 1) {
    edge.left = Math.max(edge.left, alphaAt(0, y));
    edge.right = Math.max(edge.right, alphaAt(W - 1, y));
  }
  Object.entries(edge).forEach(([side, a]) => {
    if (a === 0) problems.push(`padding on the ${side} edge`);
  });

  // Ink: every fully opaque pixel is exactly the logo ink. Resized files are
  // flat ink at every alpha; the native monogram keeps the source's own
  // antialiased fringe (alpha < 255) as supplied.
  let clear = 0;
  let opaque = 0;
  let exact = 0;
  let fringeDelta = 0;
  for (let p = 0; p < W * H; p += 1) {
    const i = p * channels;
    const a = data[i + 3];
    if (a === 0) {
      clear += 1;
      continue;
    }
    const d = Math.max(
      Math.abs(data[i] - job.ink[0]),
      Math.abs(data[i + 1] - job.ink[1]),
      Math.abs(data[i + 2] - job.ink[2])
    );
    if (a === 255) {
      opaque += 1;
      if (d === 0) exact += 1;
    } else {
      fringeDelta = Math.max(fringeDelta, d);
    }
  }
  const clearShare = clear / (W * H);
  if (clearShare < 0.4) problems.push(`only ${(clearShare * 100).toFixed(1)} % of pixels are transparent`);
  if (opaque === 0) problems.push('no fully opaque ink');
  if (exact !== opaque) problems.push(`${opaque - exact} opaque pixels are not the ink colour`);
  if (job.size && fringeDelta !== 0) problems.push(`semi-transparent pixels deviate from the ink by ${fringeDelta}`);

  return { W, H, corners, edge, clearShare, opaque, exact, fringeDelta, problems };
};

const hex = (rgb) => `#${rgb.map((n) => n.toString(16).padStart(2, '0')).join('').toUpperCase()}`;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  let failed = 0;
  for (const job of JOBS) {
    const buffer = await cut(job);
    const target = path.join(OUT, job.out);
    const changed = !fs.existsSync(target) || !fs.readFileSync(target).equals(buffer);
    if (changed) fs.writeFileSync(target, buffer);
    const r = await verify(buffer, job);
    failed += r.problems.length ? 1 : 0;
    console.log(
      `${r.problems.length ? 'FAIL' : 'ok  '} ${job.out.padEnd(36)} ${String(r.W).padStart(4)}×${String(r.H).padEnd(4)} ` +
        `${String(buffer.length).padStart(6)} B  ink ${hex(job.ink)} (${r.exact}/${r.opaque} opaque exact, fringe Δ ${r.fringeDelta})  ` +
        `clear ${(r.clearShare * 100).toFixed(1)} %  corners ${r.corners.join('/')}  ` +
        `${changed ? 'written' : 'unchanged'}${r.problems.length ? `  → ${r.problems.join('; ')}` : ''}`
    );
  }
  if (failed) {
    console.error(`\n${failed} brand file(s) failed verification.`);
    process.exit(1);
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
