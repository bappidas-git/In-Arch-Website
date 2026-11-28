/* ============================================
   generate-og.js — the Open Graph / social share image (IN-ARCH, prompt 04)
   --------------------------------------------
   public/og-image.png, 1200 × 630: the `og-source` photograph (the client's
   own ph08, cut by scripts/build-images.js) under a forest overlay
   rgba(22, 30, 25, 0.62), with the ivory lockup centred-left at 520 px
   wide. No other text: the build machine's fonts are not the brand's.

   Inputs (both already in public/, produced by earlier prompts):
     public/images/inarch/og-source-1200.jpg       (npm run build:images)
     public/images/brand/inarch-lockup-on-dark-1600.png   (npm run build:brand)

   Usage:  node scripts/generate-og.js   (npm run generate:og)
   Requires dev dep: sharp
   ============================================ */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const PHOTO = path.join(ROOT, 'public', 'images', 'inarch', 'og-source-1200.jpg');
const LOCKUP = path.join(ROOT, 'public', 'images', 'brand', 'inarch-lockup-on-dark-1600.png');
const OUT = path.join(ROOT, 'public', 'og-image.png');

const W = 1200;
const H = 630;
const OVERLAY = { r: 22, g: 30, b: 25, alpha: 0.62 }; // forest #161E19 at 62 %
const LOCKUP_WIDTH = 520;
// Left edge of the lockup: the page gutter at 1440 (57 px) scaled up to read
// as a deliberate margin on a share card.
const LEFT = 96;

async function main() {
  for (const file of [PHOTO, LOCKUP]) {
    if (!fs.existsSync(file)) throw new Error(`Missing input: ${path.relative(ROOT, file)}`);
  }

  const photo = await sharp(PHOTO).resize(W, H, { fit: 'cover' }).removeAlpha().png().toBuffer();
  const overlay = await sharp({ create: { width: W, height: H, channels: 4, background: OVERLAY } })
    .png()
    .toBuffer();
  const lockup = await sharp(LOCKUP).resize({ width: LOCKUP_WIDTH, kernel: 'lanczos3' }).png().toBuffer();
  const { height: lockupH } = await sharp(lockup).metadata();

  const composed = await sharp(photo)
    .composite([
      { input: overlay, left: 0, top: 0 },
      { input: lockup, left: LEFT, top: Math.round((H - lockupH) / 2) },
    ])
    .png()
    .toBuffer();

  // Flatten to opaque RGB in a second pass (sharp composites last).
  // A 256-colour palette (dithered) keeps the card well under the ~300 KB
  // that some messengers accept for a link preview; the 62 % overlay leaves
  // few tones to band.
  await sharp(composed).removeAlpha().png({ palette: true, quality: 90, effort: 10, dither: 1, compressionLevel: 9 }).toFile(OUT);
  const kb = (fs.statSync(OUT).size / 1024).toFixed(1);
  console.log(`Wrote ${path.relative(ROOT, OUT)} (${W}×${H}, ${kb} KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
