/* ============================================
   images — photograph derivatives with their alt text
   --------------------------------------------
   `image(key)` returns the manifest entry (src/data/imageManifest.json,
   written by scripts/build-images.js) merged with its alt text:

     { key, width, height, ratio, sources: { avif, webp, jpg: [{ w, src }] },
       placeholder, alt }

   An unknown key throws in development (a typo should fail loudly) and
   returns null in production (the caller renders nothing).

   Alt text is observational and specific: what is in the frame, with
   cautious material words. Never promotional, never a place, client, brand
   or material species. Swatches are described as close-ups. A page that
   uses a photograph purely as decoration passes `alt=""` itself.
   ============================================ */

import manifest from './imageManifest.json';

const HALL_WIDE =
  'Living hall with a backlit veined panel set into a fluted timber-tone wall above a floating white console, beside lit open shelving';
const HALL_FEATURE = 'Backlit veined panel set into a fluted timber-tone wall above a floating white console';
const HALL_LOW =
  'Wide view of a living hall with two lit tray ceilings, a fluted timber-tone feature wall with a backlit veined panel, open shelving and a glossy veined floor';
const MOULDING_CORNER =
  'Corner of a room with framed wall mouldings under a tray ceiling outlined in light and a timber-tone ceiling fan';
const MOULDING_ROOM = 'Room with framed wall mouldings under a tray ceiling outlined in light and a timber-tone ceiling fan';
const MEDIA_CEILING = 'Tray ceiling with linear lights and a ceiling fan above a wave-textured wall between fluted panels';
const GRAPHITE_FRONT =
  'Symmetrical U-shaped kitchen with graphite high-gloss units, warm under-cabinet light and a lit ceiling frame';
const ARCHES_DETAIL =
  'Arched open-shelf partition beside a green fluted arched niche with a wall lamp and the arm of a teal buttoned sofa';
const BLACK_KITCHEN = 'L-shaped kitchen with black high-gloss wall units, a white worktop and a blue-veined splashback';
const IVORY_KITCHEN =
  'Kitchen with ivory high-gloss units, a dark stone-look worktop, a grey veined splashback and wicker baskets';
const PRAYER_OPEN =
  'Prayer unit with lattice-cut doors open onto a backlit lattice panel, lit shelves and a stone-look ledge';
const PRAYER_MINT = 'Prayer unit with lattice-cut doors open onto a backlit carved panel, against a mint wall';

export const ALT = {
  'home-hero-wide': HALL_WIDE,
  'home-hero-tall': HALL_FEATURE,
  'home-intro': MOULDING_CORNER,
  'studio-band-wide': HALL_LOW,
  'studio-band-tall': 'Feature wall with a backlit veined panel and angled open shelving under a lit tray ceiling',
  'studio-detail': MEDIA_CEILING,
  'expertise-interiors': GRAPHITE_FRONT,
  'interiors-hero-tall': 'Living room with two arched niches lined in green fluted panels above a teal buttoned sofa',
  'interiors-living': ARCHES_DETAIL,
  'interiors-inset': 'Corner of a kitchen with graphite high-gloss wall units, a rolling shutter unit and a lit splashback',
  'interiors-kitchen': BLACK_KITCHEN,
  'interiors-detail-a': PRAYER_MINT,
  'interiors-detail-b': PRAYER_OPEN,
  'interiors-detail-c': IVORY_KITCHEN,
  'contact-nook': 'Seating nook with a dark buttoned L-shaped bench and a patterned blind',
  'pr-walnut-cover-tall': HALL_FEATURE,
  'pr-walnut-cover-wide': 'Fluted timber-tone feature wall with a backlit veined panel, a floating console and lit open shelving',
  'pr-arches-cover-tall': 'Arched open-shelf partition beside a green fluted arched niche with a wall lamp',
  'pr-arches-cover-wide': ARCHES_DETAIL,
  'pr-panelled-cover-tall': MOULDING_CORNER,
  'pr-panelled-cover-wide': MOULDING_ROOM,
  'pr-graphite-cover-tall': 'Graphite high-gloss kitchen units around a hob, with warm light beneath the wall units',
  'pr-graphite-cover-wide': GRAPHITE_FRONT,
  'pr-black-cover-tall': 'Corner of an L-shaped kitchen with black high-gloss units, a white worktop and a blue-veined splashback',
  'pr-black-cover-wide': BLACK_KITCHEN,
  'pr-ivory-cover-tall': 'Ivory high-gloss wall units above a hob on a dark stone-look worktop',
  'pr-ivory-cover-wide': IVORY_KITCHEN,
  'pr-pooja-cover-tall': 'Prayer unit with a backlit lattice panel between lit shelves above a stone-look ledge',
  'pr-pooja-cover-wide': PRAYER_OPEN,
  'g-ph08': HALL_WIDE,
  'g-ph07': HALL_LOW,
  'g-ph14': 'Arched open-shelf partition and green fluted arched niches with wall lamps above a teal buttoned sofa',
  'g-ph06': MOULDING_ROOM,
  'g-ph02': BLACK_KITCHEN,
  'g-ph04': IVORY_KITCHEN,
  'g-ph01':
    'Living room with an arched open-shelf partition and two green fluted arched niches above a teal buttoned L-sofa and ottoman',
  'g-ph03': GRAPHITE_FRONT,
  'g-ph09': PRAYER_OPEN,
  'g-ph05': MEDIA_CEILING,
  'g-ph11': 'Seating nook with a dark buttoned L-shaped bench, chairs and a patterned blind',
  'g-ph12a': PRAYER_MINT,
  'g-ph12b': 'Prayer unit with lattice-cut doors open, seen from one side, above closed timber-tone storage',
  'g-ph10': 'Graphite high-gloss kitchen seen from the side, with a rolling shutter unit, an angled hood and a hob',
  'sw-fluted': 'Close-up of green fluted panelling',
  'sw-stone': 'Close-up of a veined stone-look gloss panel',
  'sw-lattice': 'Close-up of a backlit lattice panel',
  'sw-gloss': 'Close-up of ivory high-gloss cabinet doors with slim handles',
  'sw-moulding': 'Close-up of a framed wall moulding',
  'sw-tufting': 'Close-up of a buttoned upholstered sofa back',
  'og-source': HALL_FEATURE,
};

/** Every key the manifest holds, in build order. */
export const IMAGE_KEYS = Object.keys(manifest);

/** True if `key` is a built derivative. */
export const hasImage = (key) => Object.prototype.hasOwnProperty.call(manifest, key);

/**
 * The derivative for `key`, with its alt text.
 * Throws in development for an unknown key; null in production.
 */
export const image = (key) => {
  if (!hasImage(key)) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(`image("${key}"): no such key in src/data/imageManifest.json`);
    }
    return null;
  }
  return { ...manifest[key], alt: ALT[key] || '' };
};

/** `srcset` string for one format of a derivative: "/images/…-480.avif 480w, …". */
export const srcSet = (entry, format) => entry.sources[format].map(({ w, src }) => `${src} ${w}w`).join(', ');

export default image;
