/* ============================================
   credits — every asset the site ships, its source and its licence
   --------------------------------------------
   Mirrors public/images/inarch/CREDITS.md (the human-readable copy). No
   asset is committed without a line here. Licences were read at fetch time,
   2026-11-27.

   `footerCredits` is what the footer must show (prompt 04 renders it).
   Icons8's free licence requires a visible link to Icons8 — but this build
   ships no Icons8 asset: icons8.com refused this session (Cloudflare 403),
   so the icons were drawn in-house (see `icons` below and the build log's
   "pending third-party assets"). The list is therefore empty. If Icons8
   icons replace the in-house set without a paid licence (owner decision
   D-13: none assumed), add ICONS8_CREDIT to `footerCredits`.
   ============================================ */

const FETCHED = '2026-11-27';

/** The link Icons8's free licence asks for, ready for when Icons8 assets are used. */
export const ICONS8_CREDIT = { label: 'Icons by Icons8', href: 'https://icons8.com' };

/** Credits the footer must display. Empty: nothing shipped requires one. */
export const footerCredits = [];

export const credits = [
  {
    id: 'photographs',
    name: 'Interior photographs (13)',
    kind: 'photograph',
    source: 'Supplied by IN-ARCH (in-arch images/, .jpg1–.jpg16; three are repeats)',
    sourceUrl: '',
    author: 'In-Arch Architects & Interior Designer',
    licence: "The client's own material, used on the client's website",
    fetched: FETCHED,
    changes:
      'Cropped per scripts/image-specs.js to remove a person, reflections, loose cables, clutter and appliances; resized; saturation × 0.94; sharpened σ 0.5; metadata stripped; AVIF / WebP / JPEG.',
    files: 'public/images/inarch/*.{avif,webp,jpg}',
  },
  {
    id: 'logos',
    name: 'IN-ARCH logo, wordmark and monogram',
    kind: 'logo',
    source: 'Supplied by IN-ARCH (logos/)',
    sourceUrl: '',
    author: 'In-Arch Architects & Interior Designer',
    licence: "The client's own mark",
    fetched: FETCHED,
    changes: 'Trimmed to the artwork and resized (alpha resampled, ink kept exact); no recolouring or redrawing.',
    files: 'public/images/brand/*.png',
  },
  {
    id: 'icons',
    name: 'Line icons (15 static, 8 animated)',
    kind: 'icon',
    source: 'Drawn for this site (scripts/build-icons.js)',
    sourceUrl: '',
    author: 'IN-ARCH website build',
    licence: 'Original work for IN-ARCH; no third-party licence',
    fetched: FETCHED,
    changes:
      'Substitute for the Icons8 family the brief asked for: icons8.com answered with a Cloudflare 403 and its CDN refuses SVG, so its licence could not be read and no Icons8 asset was used.',
    files: 'public/images/inarch/icons/*.svg, public/images/inarch/lottie/*.json',
  },
  {
    id: 'undraw-not-found',
    name: 'Page not found',
    kind: 'illustration',
    source: 'unDraw',
    sourceUrl: 'https://undraw.co/illustrations (page-not-found_6wni)',
    author: 'Katerina Limpitsouni',
    licence: 'unDraw licence: free for commercial use, modification allowed, no attribution required',
    fetched: FETCHED,
    changes: 'Recoloured to the brand (scripts/recolour-illustrations.js); a 20 % black grid made opaque stone.',
    files: 'public/images/inarch/illustrations/not-found.svg',
  },
  {
    id: 'undraw-enquiry-sent',
    name: 'Message Sent',
    kind: 'illustration',
    source: 'unDraw',
    sourceUrl: 'https://undraw.co/illustrations (message-sent_iyz6)',
    author: 'Katerina Limpitsouni',
    licence: 'unDraw licence: free for commercial use, modification allowed, no attribution required',
    fetched: FETCHED,
    changes: 'Recoloured to the brand (scripts/recolour-illustrations.js).',
    files: 'public/images/inarch/illustrations/enquiry-sent.svg',
  },
  {
    id: 'undraw-nothing-here',
    name: 'No data',
    kind: 'illustration',
    source: 'unDraw',
    sourceUrl: 'https://undraw.co/illustrations (no-data_ig65)',
    author: 'Katerina Limpitsouni',
    licence: 'unDraw licence: free for commercial use, modification allowed, no attribution required',
    fetched: FETCHED,
    changes: 'Recoloured to the brand (scripts/recolour-illustrations.js).',
    files: 'public/images/inarch/illustrations/nothing-here.svg',
  },
  {
    id: 'undraw-something-broke',
    name: 'Connection lost',
    kind: 'illustration',
    source: 'unDraw',
    sourceUrl: 'https://undraw.co/illustrations (connection-lost_am29)',
    author: 'Katerina Limpitsouni',
    licence: 'unDraw licence: free for commercial use, modification allowed, no attribution required',
    fetched: FETCHED,
    changes: 'Recoloured to the brand (scripts/recolour-illustrations.js); a 10 % black strip made opaque stone.',
    files: 'public/images/inarch/illustrations/something-broke.svg',
  },
  {
    id: 'font-fraunces',
    name: 'Fraunces (variable, roman and italic)',
    kind: 'font',
    source: 'Fontsource, @fontsource-variable/fraunces 5.3.0',
    sourceUrl: 'https://fontsource.org/fonts/fraunces',
    author: 'The Fraunces Project Authors (Undercase Type)',
    licence: 'SIL Open Font License 1.1',
    fetched: FETCHED,
    changes: 'Latin subset WOFF2 self-hosted (prompt 01); licence text in public/fonts/fraunces-OFL.txt.',
    files: 'public/fonts/fraunces-v1-latin.woff2, public/fonts/fraunces-v1-latin-italic.woff2',
  },
  {
    id: 'font-manrope',
    name: 'Manrope (variable)',
    kind: 'font',
    source: 'Fontsource, @fontsource-variable/manrope 5.3.0',
    sourceUrl: 'https://fontsource.org/fonts/manrope',
    author: 'The Manrope Project Authors (Mikhail Sharanda)',
    licence: 'SIL Open Font License 1.1',
    fetched: FETCHED,
    changes: 'Latin subset WOFF2 self-hosted (prompt 01); licence text in public/fonts/manrope-OFL.txt.',
    files: 'public/fonts/manrope-v1-latin.woff2',
  },
];

/**
 * Third-party assets the brief asked for that this build could not fetch.
 * Each surface that wanted one falls back as noted.
 */
export const pendingAssets = [
  {
    id: 'icons8',
    wanted: 'Icons8 line icons (14 static) and animated icons (8 Lottie)',
    reason: 'icons8.com: Cloudflare 403; img.icons8.com: SVG refused (403). Licence unreadable.',
    fallback: 'In-house icons in the same duotone line style (scripts/build-icons.js).',
  },
  {
    id: 'os-light',
    wanted: 'Open-licence photograph "os-light" (key expertise-atmosphere, 3:2)',
    reason: 'unsplash.com: bot challenge; pexels.com: Cloudflare 403. Licence and search unreadable.',
    fallback: 'Skipped. The Expertise page uses a typographic hero or an in-house line drawing.',
  },
  {
    id: 'os-drawing',
    wanted: 'Open-licence photograph "os-drawing" (key expertise-drawing, 4:5)',
    reason: 'As above.',
    fallback: 'Skipped. The Expertise page works without it.',
  },
];

export default credits;
