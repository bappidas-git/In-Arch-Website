/* ============================================
   IN-ARCH photograph derivatives — the crop table, as data
   --------------------------------------------
   Read by scripts/build-images.js (`npm run build:images`). Every number
   here was checked by eye on the rendered derivative (Design Lab, "Assets &
   content") against the exclusions listed per source. Change a number, run
   the script with `--recut`, and look again.

   Coordinates are percentages of the source frame (for the collage halves,
   of that half). Crop forms:

     { ratio: [w, h], focal: [x, y], within: { x: [a, b], y: [c, d] } }
         the largest box of that ratio inside `within` (default: the whole
         frame), centred on `focal` (default: the centre of `within`) and
         clamped to `within`. `width: n` instead fixes the box width at n %
         of the source width (used for the texture swatches).
     { box: [left, top, width, height] }
         an explicit box; its own ratio is kept.
     { within: { … } }   (no ratio)
         the whole window, natural ratio ("full frame" minus an exclusion).

   `widths` are output widths in CSS pixels. The script never writes a width
   above the source's `sharpTo` (the width at which the phone photograph is
   still sharp) or above the crop's own pixel width, and fails if a spec asks
   for one.

   Immutable caching: `/images/**` is served `immutable` for a year, so once
   a derivative has been deployed, re-cutting it must give it a new file
   name — set `rev: 2` (files become `<key>-v2-<width>.<ext>`) or rename the
   key. The script refuses to overwrite an existing file with different
   bytes unless `--recut` is passed.

   Sources are the client's own photographs in `in-arch images/` (dot-named,
   read-only, never served). `.jpg13`, `.jpg15` and `.jpg16` repeat `.jpg2`,
   `.jpg6` and `.jpg3` (mean grey difference ≤ 1.6 / 255 at 96 × 54) and are
   never used.
   ============================================ */

/** Pixel x at which `.jpg12.jpg` (a two-picture collage) is split. */
const COLLAGE_SPLIT_X = 1857;

/**
 * The 13 unique photographs. `exclude` lists what every derivative of the
 * source must keep out of frame (percent of the source; checked at full
 * resolution), so the crop table below can be read against it.
 */
const SOURCES = {
  ph01: {
    file: '.jpg1.jpg',
    sharpTo: 1440,
    shows: 'living room, teal buttoned L-sofa, two green fluted arched niches with wall lamps, arched shelving partition',
    exclude: ['person at the left edge: x 0–4 (keep x ≥ 9)'],
  },
  ph02: {
    file: '.jpg2.jpg',
    sharpTo: 1920,
    shows: 'L-shaped kitchen, black high-gloss wall units, white worktop, blue-veined splashback',
    exclude: [
      'tap with a loose hose: x 0–17, y 45–100 (the hose reaches x 17, not 12)',
      "photographer's silhouette reflected in the gloss wall unit: x 75–78.5, y 38–49 (not in the brief)",
      'clean window: x 17.5–74.5',
    ],
  },
  ph03: {
    file: '.jpg3.jpg',
    sharpTo: 1440,
    shows: 'U-shaped kitchen, frontal and symmetrical, graphite high-gloss units, warm under-cabinet light',
    exclude: [],
  },
  ph04: {
    file: '.jpg4.jpg',
    sharpTo: 1920,
    shows: 'kitchen, frontal, ivory high-gloss units, dark stone-look worktop, grey veined splashback, wicker baskets',
    exclude: [
      'branded carton inside the right glazed unit: x 48–52.6, y 45.7–51.2 — avoided where the framing allows (tall cover, swatch); the frontal 16:9 and 3:2 frames cannot avoid it',
    ],
  },
  ph05: {
    file: '.jpg5.jpg',
    sharpTo: 1920,
    shows: 'living hall, backlit wave-textured media wall between fluted panels, floating console, tray ceiling',
    exclude: [
      'air-conditioner: x 11–23, y 30–45',
      'orange cloth bundles and a box on the floor: x 26–39, y 73–81',
      'socket with a hanging cable on the media wall: x 44–45.6, y 51–68 (the brief placed it at x 34)',
      'remote on the console: x 37–40, y 68–70',
      'doorway: x ≥ 76',
      'bouquet: x 85–100, y 63–69',
    ],
  },
  ph06: {
    file: '.jpg6.jpg',
    sharpTo: 1920,
    shows: 'room corner with framed wall mouldings, tray ceiling outlined in light, timber-tone ceiling fan',
    exclude: [
      'bouquet on the cabinet: x 8–18, y 61–70',
      'coiled loose cable under a switch plate: x 21.5–23, y 52–56 (not in the brief) — keep x ≥ 25.5',
    ],
  },
  ph07: {
    file: '.jpg7.jpg',
    sharpTo: 1920,
    shows: 'large living hall from a low angle, fluted timber-tone wall with a backlit veined panel, open shelving, two tray ceilings',
    exclude: ['strong wide-angle distortion at the edges: no tight edge crops'],
  },
  ph08: {
    file: '.jpg8.jpg',
    sharpTo: 1920,
    shows: 'the same hall, closer: fluted timber-tone feature wall with a backlit veined panel, floating console, shelving unit',
    exclude: [],
  },
  ph09: {
    file: '.jpg9.jpg',
    sharpTo: 1440,
    shows: 'prayer unit, timber-tone cabinet, lattice-cut doors open onto a backlit lattice panel, stone ledge',
    exclude: [
      'air-conditioner: x 8–30, y 0–14.2',
      'storage box on top of the unit: x 61–69, y 11–15.9',
      'so every frame starts at y ≥ 16.5',
    ],
  },
  ph10: {
    file: '.jpg10.jpg',
    sharpTo: 960,
    shows: 'the graphite kitchen from the side',
    exclude: [
      'tap in the foreground: x ≥ 66.5 (the brief said 70)',
      'packaging on the open shelf: x 0–10, y 78–82, and a box at x 0–5, y 92–100',
    ],
  },
  ph11: {
    file: '.jpg11.jpg',
    sharpTo: 1080,
    shows: 'seating nook, dark buttoned L-bench and chairs, patterned blind',
    exclude: ['mirror reflecting the photographer: x 0–24', 'door frame: x ≥ 92'],
  },
  ph12a: {
    file: '.jpg12.jpg',
    split: 'left',
    sharpTo: 1080,
    shows: 'left half of a collage: a prayer unit with lattice-cut doors on a mint wall',
    exclude: [],
  },
  ph12b: {
    file: '.jpg12.jpg',
    split: 'right',
    sharpTo: 1080,
    shows: 'right half of a collage: the ph09 prayer unit from another angle',
    exclude: ['air-conditioner: x 0–22, y 0–25.4 of this half', 'storage box on top of the unit: y ≤ 25 — keep y ≥ 26'],
  },
  ph14: {
    file: '.jpg14.jpg',
    sharpTo: 1920,
    shows: 'detail of the ph01 room: arched shelving partition, green fluted arch with a lamp, arm of the sofa',
    exclude: [
      'seen through the shelving, in the next room: a mirror with a dangling cable (x 10.5–16.2, y 47–51) and a remote on a shelf (x 17–19.6, y 54–56) — tiny; avoided where the framing allows',
    ],
  },
};

const W4 = [480, 768, 1080];
const W5 = [480, 768, 1080, 1440];
const WG = [480, 768, 1080, 1440, 1920];

/**
 * The derivatives. Order is the manifest's order. `review` records what was
 * checked on the rendered file; `deviation` records where the numbers differ
 * from the brief and why.
 */
const DERIVATIVES = [
  // ---------- Home ----------
  {
    key: 'home-hero-wide',
    source: 'ph08',
    crop: { ratio: [16, 9] },
    widths: [768, 1080, 1440, 1920],
    review: 'full frame; fan blade tip and a dark doorway at the far left are part of the room',
  },
  {
    key: 'home-hero-tall',
    source: 'ph08',
    crop: { ratio: [4, 5], focal: [45, 52] },
    widths: W4,
    review: 'veined panel, fluted wall and console; clean',
  },
  {
    key: 'home-intro',
    source: 'ph06',
    crop: { ratio: [4, 5], focal: [62, 50] },
    widths: W4,
    review: 'mouldings, tray ceiling and fan; the loose cable (x 22) and bouquet are outside',
  },

  // ---------- Studio ----------
  {
    key: 'studio-band-wide',
    source: 'ph07',
    crop: { ratio: [21, 9], focal: [50, 52] },
    widths: [768, 1080, 1440, 1920],
    review: 'whole hall; edges keep their distortion but nothing is cut tight',
  },
  {
    key: 'studio-band-tall',
    source: 'ph07',
    crop: { ratio: [4, 3], focal: [62, 55] },
    widths: W4,
    review: 'feature wall, shelving and ceilings',
  },
  {
    key: 'studio-detail',
    source: 'ph05',
    crop: { box: [34, 0, 41.5, 50.5] },
    widths: W4,
    review: 'tray ceiling, fan and the upper media wall between fluted panels',
    deviation:
      'brief box 36, 0, 42, 62 would include the socket and hanging cable (x 44–45.6 from y 51) and the doorway edge (x ≥ 76): the box stops at y 50.5 and x 75.5',
  },

  // ---------- Expertise ----------
  {
    key: 'expertise-interiors',
    source: 'ph03',
    crop: { ratio: [4, 5] },
    widths: [480, 768, 960],
    review: 'symmetrical U-kitchen; clean',
  },

  // ---------- Interior Design ----------
  {
    key: 'interiors-hero-tall',
    source: 'ph01',
    crop: { ratio: [4, 5], focal: [60, 55], within: { x: [9, 100] } },
    widths: W4,
    review: 'both green arches and the sofa; the person (x ≤ 4) is outside',
  },
  {
    key: 'interiors-living',
    source: 'ph14',
    crop: { ratio: [3, 2] },
    widths: [768, 1080, 1440],
    review:
      "arched shelving, green arch, sofa; the next room's mirror lead seen through the shelving is about 25 px at 1440 — accepted (avoiding it cuts the arch)",
  },
  {
    key: 'interiors-inset',
    source: 'ph10',
    crop: { ratio: [4, 5], focal: [43.5, 50], within: { x: [0, 66] } },
    widths: [320, 480, 640],
    review: 'wall units, hood and shutter; the tap (x ≥ 66.5) and the shelf packaging are outside',
    deviation: 'the tap begins at x 66.5, so the window ends at 66 instead of 70',
  },
  {
    key: 'interiors-kitchen',
    source: 'ph02',
    crop: { ratio: [3, 2], focal: [58, 45], within: { x: [17.5, 74.5] } },
    widths: [480, 768, 1080, 1440],
    review: 'wall units, splashback, worktop and drawers; hose and reflection outside',
    deviation:
      'window x 17.5–74.5 instead of x ≥ 12: the hose reaches x 17 and the photographer is reflected at x 75–78.5',
  },
  {
    key: 'interiors-detail-a',
    source: 'ph12a',
    crop: { ratio: [4, 5] },
    widths: W4,
    review: 'prayer unit on the mint wall; clean',
  },
  {
    key: 'interiors-detail-b',
    source: 'ph09',
    crop: { ratio: [16, 9], within: { y: [16.5, 100] } },
    widths: W5,
    review: 'both lattice doors open, backlit panel, ledge and cabinet',
    deviation:
      '16:9 from y ≥ 16.5 (83.5 % of the frame) instead of the full frame: the air-conditioner ends at y 14.2 and a storage box on the unit at y 15.9',
  },
  {
    key: 'interiors-detail-c',
    source: 'ph04',
    crop: { ratio: [16, 9] },
    widths: W5,
    review: 'full frontal kitchen',
    deviation: 'the carton in the right glazed unit stays: no 16:9 frontal frame avoids it (the brief allows this)',
  },

  // ---------- Contact ----------
  {
    key: 'contact-nook',
    source: 'ph11',
    crop: { ratio: [4, 5], focal: [58, 60], within: { x: [24, 92] } },
    widths: [480, 768],
    review: 'buttoned bench, chairs and blind; mirror and door frame outside',
  },

  // ---------- Project covers ----------
  {
    key: 'pr-walnut-cover-tall',
    source: 'ph08',
    crop: { ratio: [4, 5], focal: [45, 52] },
    widths: W4,
    review: 'as home-hero-tall',
  },
  {
    key: 'pr-walnut-cover-wide',
    source: 'ph08',
    crop: { ratio: [3, 2], focal: [50, 52] },
    widths: W5,
    review: 'feature wall, console and shelving',
  },
  {
    key: 'pr-arches-cover-tall',
    source: 'ph14',
    crop: { ratio: [4, 5], focal: [45, 50] },
    widths: W4,
    review: 'shelving arch edge and the green arch with its lamp',
  },
  {
    key: 'pr-arches-cover-wide',
    source: 'ph14',
    crop: { ratio: [3, 2] },
    widths: W5,
    review: 'as interiors-living',
  },
  {
    key: 'pr-panelled-cover-tall',
    source: 'ph06',
    crop: { ratio: [4, 5], focal: [62, 50] },
    widths: W4,
    review: 'as home-intro',
  },
  {
    key: 'pr-panelled-cover-wide',
    source: 'ph06',
    crop: { ratio: [3, 2], focal: [58, 50], within: { x: [25.5, 100] } },
    widths: W5,
    review: 'mouldings, ceiling and fan; bouquet and loose cable outside',
    deviation: 'window x ≥ 25.5 (88 % height): the bouquet reaches x 18 and a loose cable hangs at x 22',
  },
  {
    key: 'pr-graphite-cover-tall',
    source: 'ph03',
    crop: { ratio: [4, 5] },
    widths: [480, 768, 960],
    review: 'centred; clean',
  },
  {
    key: 'pr-graphite-cover-wide',
    source: 'ph03',
    crop: { ratio: [3, 2] },
    widths: [480, 768, 960],
    review: 'centred; clean',
  },
  {
    key: 'pr-black-cover-tall',
    source: 'ph02',
    crop: { ratio: [4, 5], focal: [62, 48], within: { x: [17.5, 74.5] } },
    widths: W4,
    review: 'corner of the L, splashback and worktop; reflection outside',
    deviation: 'focal clamped by the clean window (box x 29.5–74.5)',
  },
  {
    key: 'pr-black-cover-wide',
    source: 'ph02',
    crop: { ratio: [3, 2], focal: [58, 45], within: { x: [17.5, 74.5] } },
    widths: W5,
    review: 'as interiors-kitchen',
    deviation: 'as interiors-kitchen',
  },
  {
    key: 'pr-ivory-cover-tall',
    source: 'ph04',
    crop: { ratio: [4, 5], focal: [76, 50], within: { x: [53.5, 100] } },
    widths: W4,
    review: 'right half of the kitchen: wall units, hob, corner units; the carton is outside',
    deviation: 'focal 76 / 50 instead of 55 / 50 so the cover avoids the carton',
  },
  {
    key: 'pr-ivory-cover-wide',
    source: 'ph04',
    crop: { ratio: [3, 2] },
    widths: W5,
    review: 'centred frontal kitchen',
    deviation: 'carton stays, small (no 3:2 frontal frame avoids it)',
  },
  {
    key: 'pr-pooja-cover-tall',
    source: 'ph09',
    crop: { ratio: [4, 5], within: { y: [16.5, 100] } },
    widths: W4,
    review: 'inner unit: backlit lattice, shelves, ledge and cabinet',
    deviation:
      'brief box 27.5, 0, 45, 100 includes the corner of the air-conditioner and the storage box: 4:5 below y 16.5 (box x 31.2–68.8), which leaves the open doors to the wide cover',
  },
  {
    key: 'pr-pooja-cover-wide',
    source: 'ph09',
    crop: { ratio: [3, 2], within: { y: [16.5, 100] } },
    widths: W4,
    review: 'unit with both doors open; air-conditioner and storage box outside',
  },

  // ---------- Gallery (case studies) ----------
  { key: 'g-ph08', source: 'ph08', crop: { ratio: [16, 9] }, widths: WG, review: 'full frame' },
  { key: 'g-ph07', source: 'ph07', crop: { ratio: [16, 9] }, widths: WG, review: 'full frame' },
  {
    key: 'g-ph14',
    source: 'ph14',
    crop: { ratio: [16, 9] },
    widths: WG,
    review:
      "full frame; through the shelving, the next room's mirror has a dangling power lead (about 30 px at 1920) — reads as part of the vanity, accepted (avoiding it cuts the arch)",
  },
  {
    key: 'g-ph06',
    source: 'ph06',
    crop: { ratio: [4, 3], within: { x: [25.5, 100] } },
    widths: WG,
    review: 'mouldings and ceiling; bouquet and loose cable outside',
    deviation: '4:3 from x ≥ 25.5 instead of the full frame (bouquet, loose cable)',
  },
  {
    key: 'g-ph02',
    source: 'ph02',
    crop: { ratio: [1, 1], focal: [46, 54], within: { x: [17.5, 74.5] } },
    widths: WG,
    review: 'kitchen inside the clean window',
    deviation: 'square, x 17.5–74.5 (hose and reflection), instead of full frame from x ≥ 12',
  },
  {
    key: 'g-ph04',
    source: 'ph04',
    crop: { ratio: [16, 9] },
    widths: WG,
    review: 'full frame',
    deviation: 'carton stays (full frame)',
  },
  {
    key: 'g-ph01',
    source: 'ph01',
    crop: { within: { x: [9, 100] } },
    widths: W5,
    review: 'full height from x ≥ 9; the person is outside',
  },
  { key: 'g-ph03', source: 'ph03', crop: { ratio: [16, 9] }, widths: W5, review: 'full frame' },
  {
    key: 'g-ph09',
    source: 'ph09',
    crop: { ratio: [16, 9], within: { y: [16.5, 100] } },
    widths: W5,
    review: 'as interiors-detail-b',
    deviation: 'from y ≥ 16.5 (air-conditioner, storage box)',
  },
  {
    key: 'g-ph05',
    source: 'ph05',
    crop: { box: [34, 0, 41.5, 50.5] },
    widths: W5,
    review: 'the studio-detail box',
    deviation: 'as studio-detail',
  },
  {
    key: 'g-ph11',
    source: 'ph11',
    crop: { ratio: [4, 3], within: { x: [24, 92] } },
    widths: W4,
    review: 'nook between the mirror and the door frame',
  },
  { key: 'g-ph12a', source: 'ph12a', crop: { ratio: [4, 5] }, widths: W4, review: 'as interiors-detail-a' },
  {
    key: 'g-ph12b',
    source: 'ph12b',
    crop: { ratio: [4, 5], focal: [47, 62], within: { y: [26, 100] } },
    widths: W4,
    review: 'second angle of the unit with its doors; air-conditioner and storage box outside',
    deviation: 'below y 26 instead of the whole half: the air-conditioner reaches y 25.4',
  },
  {
    key: 'g-ph10',
    source: 'ph10',
    crop: { box: [10, 20, 56, 66.4] },
    widths: [480, 768, 960],
    review: 'wall units, hood, worktop and hob; tap and shelf packaging outside',
    deviation: '3:2 box x 10–66 instead of x ≤ 70 (tap at 66.5; packaging at x ≤ 10)',
  },

  // ---------- Texture swatches (1:1) ----------
  {
    key: 'sw-fluted',
    source: 'ph14',
    crop: { ratio: [1, 1], focal: [62.5, 54.3], width: 18.5 },
    widths: [320, 640],
    review: 'green fluted panelling inside the arch, below the lamp and above the sofa',
    deviation:
      'from ph14 instead of ph08 box 20, 30, 20, 30: that box is mostly the veined panel, and no fluted strip in ph08 is wider than about 230 px',
  },
  {
    key: 'sw-stone',
    source: 'ph08',
    crop: { ratio: [1, 1], focal: [33, 45.5], width: 13 },
    widths: [320, 480],
    review: 'veined stone-look panel between the light streaks; socket outside',
    deviation: 'the panel is only about 540 px tall, so the largest clean square is 500 px: widths 320 and 480',
  },
  {
    key: 'sw-lattice',
    source: 'ph09',
    crop: { ratio: [1, 1], focal: [49.7, 32.5], width: 12.6 },
    widths: [320, 480],
    review: 'backlit lattice panel above the figures',
    deviation:
      'the brief box reaches the figures (from y 44); the clean panel above them is about 490 px square: widths 320 and 480',
  },
  {
    key: 'sw-gloss',
    source: 'ph04',
    crop: { ratio: [1, 1], focal: [65, 36], width: 16.7 },
    widths: [320, 640],
    review: 'ivory high-gloss wall units with handles; carton outside',
  },
  {
    key: 'sw-moulding',
    source: 'ph06',
    crop: { ratio: [1, 1], focal: [72, 55], width: 20 },
    widths: [320, 640],
    review: 'framed wall moulding',
  },
  {
    key: 'sw-tufting',
    source: 'ph14',
    crop: { ratio: [1, 1], focal: [64, 85], width: 13.5 },
    widths: [320, 480],
    review: 'buttoned sofa back',
    deviation: 'the tufted back is about 520 px tall in the source: widths 320 and 480',
  },

  // ---------- Open Graph source (prompt 04 composes the final image) ----------
  {
    key: 'og-source',
    source: 'ph08',
    crop: { ratio: [1200, 630], focal: [50, 50] },
    widths: [1200],
    review: 'full width, centred',
  },
];

module.exports = { COLLAGE_SPLIT_X, SOURCES, DERIVATIVES };
