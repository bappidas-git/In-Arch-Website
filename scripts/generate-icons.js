/* ============================================
   generate-icons.js — favicons and PWA icons (IN-ARCH, prompt 04)
   --------------------------------------------
   The ivory "IA" monogram on a solid espresso #231B15 tile, so the icon reads
   on light and dark browser chrome alike.

   Source: logos/in-arch-favicon-dark-transparent.png — the client's own
   monogram file for dark backgrounds (ivory #F4EFE7 ink on transparency,
   512 × 512, the mark itself 266 × 190). Read at build time only; nothing
   loads from logos/ at run time. Only the mark's ALPHA is used: the ink is
   filled with the logo's own ivory, so no edge pixel drifts in colour when
   it is resampled (the same rule as scripts/build-brand-assets.js).

   The strokes are hairlines (about 7.5 % of the mark's width: 1 px at
   16 px). For the 16 – 48 px sizes the alpha is thickened — blurred slightly
   at 4× the output size, then steepened — so "IA" stays legible in a tab,
   without changing its proportions. From 180 px the mark is drawn as cut.

   Outputs (public/, file names fixed: public/.htaccess and the manifest
   depend on them):
     favicon.ico            16 + 32 + 48 (thickened)
     favicon.png            32 (thickened)
     apple-touch-icon.png   180, opaque (iOS rounds the corners itself)
     logo192.png, logo512.png        manifest purpose "any"
     maskable-192.png, maskable-512.png   purpose "maskable": opaque, the mark
                                          inside the central 80 % safe circle

   Today's (Dulcey) favicon.ico, favicon.png and apple-touch-icon.png were
   copied byte for byte to public/legacy-icons/ before this first ran; the
   admin surface points at those until prompt 15 (public/index.html).

   Usage:  node scripts/generate-icons.js   (npm run generate:icons)
   Requires dev deps: sharp, png-to-ico
   ============================================ */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const pngToIco = require('png-to-ico').default || require('png-to-ico');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const MARK_FILE = path.join(ROOT, 'logos', 'in-arch-favicon-dark-transparent.png');

const ESPRESSO = { r: 0x23, g: 0x1b, b: 0x15 }; // the logo's ink — the tile
const IVORY = { r: 0xf4, g: 0xef, b: 0xe7 }; // the logo's ivory — the mark

// Fraction of the tile's WIDTH the mark spans (it is 1.4 : 1, wider than tall).
const WIDTH_PCT = {
  favicon: 0.8, // 16–48 px: every pixel counts
  apple: 0.6, // iOS rounds the corners
  any: 0.64, // install prompt, tab strip
  // The mark's corners must sit inside a centred circle of 80 % of the
  // tile: half-diagonal = w/2 · √(1 + (190/266)²) ≤ 0.4 → w ≤ 0.65. 0.52
  // leaves a margin for launchers that crop tighter than the spec.
  maskable: 0.52,
};

// Thickening for the small sizes: Gaussian σ (in output pixels) and the
// steepening applied to the blurred alpha (a' = gain · a + offset, clamped).
const THICKEN = { sigma: 0.55, gain: 2.6, offset: -30 };
const SUPERSAMPLE = 4;

/** The mark's alpha channel, trimmed to the artwork (266 × 190). */
async function markAlpha() {
  const trimmed = await sharp(MARK_FILE).trim({ threshold: 10 }).png().toBuffer();
  return sharp(trimmed).extractChannel(3).png().toBuffer();
}

/**
 * The mark at `width` px wide as an RGBA PNG: ivory ink, the source's alpha
 * (thickened when asked).
 */
async function renderMark(alpha, width, thicken) {
  const meta = await sharp(alpha).metadata();
  const height = Math.max(1, Math.round((width * meta.height) / meta.width));
  let mask;
  if (thicken) {
    const big = await sharp(alpha)
      .resize({ width: width * SUPERSAMPLE, height: height * SUPERSAMPLE, kernel: 'lanczos3' })
      .blur(Math.max(0.3, thicken.sigma * SUPERSAMPLE))
      .linear(thicken.gain, thicken.offset)
      .toColourspace('b-w')
      .png()
      .toBuffer();
    mask = await sharp(big).resize({ width, height, kernel: 'lanczos3' }).toColourspace('b-w').raw().toBuffer();
  } else {
    mask = await sharp(alpha).resize({ width, height, kernel: 'lanczos3' }).toColourspace('b-w').raw().toBuffer();
  }
  const ink = await sharp({ create: { width, height, channels: 3, background: IVORY } })
    .raw()
    .toBuffer();
  return sharp(ink, { raw: { width, height, channels: 3 } })
    .joinChannel(mask, { raw: { width, height, channels: 1 } })
    .png()
    .toBuffer();
}

/** An opaque espresso square with the mark centred at `widthPct` of its width. */
async function tile(alpha, size, widthPct, thicken = null) {
  const mark = await renderMark(alpha, Math.max(1, Math.round(size * widthPct)), thicken);
  const composed = await sharp({ create: { width: size, height: size, channels: 3, background: ESPRESSO } })
    .composite([{ input: mark, gravity: 'center' }])
    .png()
    .toBuffer();
  // sharp composites last in its pipeline, so drop the alpha channel in a
  // second pass: every icon is a fully opaque RGB file.
  return sharp(composed).removeAlpha().png({ compressionLevel: 9 }).toBuffer();
}

async function main() {
  console.log(`Reading ${path.relative(ROOT, MARK_FILE)}…`);
  const alpha = await markAlpha();
  const m = await sharp(alpha).metadata();
  console.log(`Mark trimmed to ${m.width}×${m.height}`);

  const out = (name) => path.join(PUBLIC_DIR, name);
  const write = async (name, buffer) => {
    fs.writeFileSync(out(name), buffer);
    const meta = await sharp(buffer).metadata();
    console.log(`  ${name.padEnd(22)} ${meta.width}×${meta.height}  ${(buffer.length / 1024).toFixed(1)} KB`);
  };

  // favicon.png (32) and favicon.ico (16 / 32 / 48), thickened.
  await write('favicon.png', await tile(alpha, 32, WIDTH_PCT.favicon, THICKEN));
  const icoPngs = await Promise.all([16, 32, 48].map((s) => tile(alpha, s, WIDTH_PCT.favicon, THICKEN)));
  fs.writeFileSync(out('favicon.ico'), await pngToIco(icoPngs));
  console.log(`  ${'favicon.ico'.padEnd(22)} 16 + 32 + 48  ${(fs.statSync(out('favicon.ico')).size / 1024).toFixed(1)} KB`);

  await write('apple-touch-icon.png', await tile(alpha, 180, WIDTH_PCT.apple));
  await write('logo192.png', await tile(alpha, 192, WIDTH_PCT.any));
  await write('logo512.png', await tile(alpha, 512, WIDTH_PCT.any));
  await write('maskable-192.png', await tile(alpha, 192, WIDTH_PCT.maskable));
  await write('maskable-512.png', await tile(alpha, 512, WIDTH_PCT.maskable));

  console.log('Icons written to public/.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
