/* ============================================
   siteConfig — Single source of business truth
   --------------------------------------------
   Every contact/company fact used across the site, SEO, and docs lives
   here. Components MUST import from this file rather than hard-coding
   phone numbers, emails, addresses, or logo URLs.
   ============================================ */

const CLOUDINARY_BASE = 'https://res.cloudinary.com/dn9gyaiik/image/upload';

export const siteConfig = {
  legalName: 'Dulcey Lead Services',
  brandName: 'Dulcey Lead Services',
  tagline: 'Beyond Business Support',
  taglineSecondary: 'Your Partner in Business Leadership',
  phone: '+917099002522',
  phoneDisplay: '+91 70990 02522',
  // Landline, published alongside the mobile. `landline` is the E.164 form the
  // `tel:` href needs (leading STD `0` dropped, `+91` prefixed) so the link
  // dials from abroad as well as within India; `landlineDisplay` is the local
  // STD form the client publishes and the one the footer prints.
  landline: '+9136134924379',
  landlineDisplay: '0361 34924379',
  email: 'dulceyleadservices@gmail.com',
  // No postal address: the brand material publishes none, and the site
  // deliberately claims none in its schemas either.
  siteUrl: 'https://www.dulceyleadservices.com',
  // The wordmark lockup, self-hosted under `public/images/logo/`. Both PNGs
  // carry a real alpha channel — the background is transparent, so the mark
  // sits on white, grey, and ink surfaces without a plate behind it. They are
  // one 1351x200 master each rather than a per-surface render; at 21 KB with
  // `/images/**` served immutable, that is cheaper than the round trips.
  // Site-root paths, so they resolve from any route — wrap in `absoluteUrl()`
  // wherever a schema or meta tag needs a fully qualified URL.
  //
  // The `-1351` suffix is the width, matching the convention the rest of
  // `/images/**` uses (`hero-home-v3-2880.webp`). Those files answer `immutable`
  // for a year, so re-cutting the artwork means a NEW filename — overwriting
  // in place would leave every returning visitor on the previous render.
  logo: '/images/logo/dulcey-wordmark-1351.png',
  logoWhite: '/images/logo/dulcey-wordmark-white-1351.png',
  // The "D" mark. Its Cloudinary public_id still carries the old spelling —
  // that is the asset's immutable delivery path, not a brand string.
  // **No longer drawn anywhere.** The favicon/PWA set is cut from `logoMark`
  // below, and the `public/index.html` splash — its last consumer — now draws
  // `logoMark` too. Kept as the archive of the original "D"; if a surface ever
  // needs it again, the public_id must still not be folded into a rebrand
  // find-and-replace.
  logoIcon: `${CLOUDINARY_BASE}/v1785484838/Dulecy-Logo-Icon_hylrpw.png`,
  // The "DLS" initialism mark, self-hosted alongside the wordmark and carrying
  // the same real alpha channel (peak 255 as supplied — the wordmark's
  // alpha-normalisation pass does not apply). Trimmed to the artwork's own
  // bounding box, so a CSS `width` maps straight onto the visible mark with no
  // dead padding to compensate for. This is the favicon source:
  // `scripts/generate-icons.js` reads the file straight off disk, so a re-cut
  // needs `MARK_FILE` there updated and `npm run generate:icons` re-run.
  // It is also the splash mark: the `public/index.html` initial loader
  // hard-codes this same path. Nothing in `src/` draws it today, though —
  // the React tree's one consumer was the Home hero watermark, removed in
  // [2.18.0]. The `-860` suffix is the width, and
  // `/images/**` answers `immutable`, so re-cutting means a NEW filename.
  logoMark: '/images/logo/dls-mark-860.png',
  social: {}, // fill when the client provides profiles; components must hide empty entries
  // Studio credit rendered in the footer's legal row. External site, so the
  // footer opens it in a new tab.
  developer: {
    name: 'Assam Digital',
    url: 'https://assamdigital.com',
  },
};

// =========================================
// Derived helpers
// =========================================

/** `tel:` href for the primary phone number. */
export const telHref = `tel:${siteConfig.phone}`;

/** `tel:` href for the landline. */
export const telLandlineHref = `tel:${siteConfig.landline}`;

/** `mailto:` href for the company email. */
export const mailHref = `mailto:${siteConfig.email}`;

/**
 * Intrinsic pixel size of the two wordmark PNGs.
 *
 * Every `<img>` that draws the lockup sets these as its `width`/`height`
 * attributes so the browser reserves the right 6.76:1 box before the file
 * lands. CSS then sets the rendered height and leaves `width: auto`.
 */
export const LOGO_SIZE = { width: 1351, height: 200 };

/**
 * Intrinsic pixel size of the "DLS" mark PNG.
 *
 * Same contract as `LOGO_SIZE`: the `<img>` sets these as its `width`/`height`
 * attributes so the browser reserves the right 1.87:1 box before the file
 * lands, and CSS sets the rendered width with `height: auto`.
 */
export const MARK_SIZE = { width: 860, height: 460 };

/**
 * Absolute URL for a site-root path, left alone if it is already absolute.
 *
 * The logos moved from Cloudinary to `public/images/`, so the values in
 * `siteConfig` are now root-relative. Schemas, Open Graph tags, and anything
 * else a crawler reads need the fully qualified form.
 *
 * @example absoluteUrl(siteConfig.logo)  // https://www.dulceyleadservices.com/images/logo/…
 */
export const absoluteUrl = (pathOrUrl) =>
  /^https?:\/\//i.test(pathOrUrl)
    ? pathOrUrl
    : `${siteConfig.siteUrl}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;

/* ============================================
   studio — IN-ARCH's facts (prompt 02)
   --------------------------------------------
   The new public site reads every business fact from `studio`, never from
   the legacy keys above: those still feed the old pages and the admin
   (`brandName`, `legalName`, `logo` and `LOGO_SIZE` stay as they are until
   prompt 15). Source: `details of in-arch.pdf` §1, §3, §9, read against the
   owner decisions in prompts/00_INDEX.md §12.

   Empty string = not supplied by the client. Every surface renders nothing
   for an empty value: no blank row, no dead link.
   ============================================ */

const brandFile = (name, width, height) => ({ src: `/images/brand/${name}`, width, height });

export const studio = {
  name: 'IN-ARCH',
  fullName: 'In-Arch Architects & Interior Designer',
  descriptor: 'Architects & Interior Designer',
  // The PDF's "suggested tagline" (§1), adopted by owner decision D-10.
  tagline: 'Designing Spaces. Shaping Experiences.',
  // PDF §10 F, the footer line.
  blurb: 'Thoughtful architectural and interior design solutions from Patna, Bihar.',
  // No portrait supplied (D-11): a typographic plate stands in.
  // `title` is the role alone (PDF §3), for short credit lines.
  principal: { name: 'Ar. Mohammad Hassanuddin', title: 'Principal Architect', role: 'Principal Architect & Founder', portrait: null },
  phone: '+917292831128',
  phoneDisplay: '+91 72928 31128',
  whatsapp: '917292831128',
  // Not supplied (D-03). The address on the dummy site is unconfirmed and not used.
  email: '',
  // The PDF's address as it stands (D-04); building, floor and PIN code still needed.
  address: { line1: 'Boring Road', city: 'Patna', region: 'Bihar', country: 'India', postalCode: '' },
  // "10:00 AM onwards" (PDF §9); days and closing time not supplied (D-14).
  hours: { opensAt: '10:00 AM', note: '' },
  // Not supplied (D-05): run-time URLs use the current origin until it is.
  siteUrl: '',
  // Hidden until supplied (D-12). Ratings are never hard-coded.
  social: { instagram: '', facebook: '', linkedin: '', googleBusiness: '' },
  // Name-based search until an exact location is supplied (D-16); prompt 13 verifies it.
  map: {
    query: 'In-Arch Architects & Interior Designer, Boring Road, Patna, Bihar',
    embedUrl: '',
    lat: null,
    lng: null,
  },
  // Cut from logos/ by scripts/build-brand-assets.js. Below 44 px tall use a
  // wordmark (the descriptor line is illegible there); from 44 px the lockup.
  // Keep clear space equal to the cap height of the "I" on every side.
  logos: {
    lockupOnLight: {
      ...brandFile('inarch-lockup-on-light-1600.png', 1600, 325),
      variants: [
        brandFile('inarch-lockup-on-light-800.png', 800, 162),
        brandFile('inarch-lockup-on-light-1600.png', 1600, 325),
      ],
    },
    lockupOnDark: {
      ...brandFile('inarch-lockup-on-dark-1600.png', 1600, 325),
      variants: [
        brandFile('inarch-lockup-on-dark-800.png', 800, 162),
        brandFile('inarch-lockup-on-dark-1600.png', 1600, 325),
      ],
    },
    wordmarkOnLight: brandFile('inarch-wordmark-on-light-1383.png', 1383, 200),
    wordmarkOnDark: brandFile('inarch-wordmark-on-dark-1383.png', 1383, 200),
    markOnLight: brandFile('inarch-mark-on-light-266.png', 266, 190),
    markOnDark: brandFile('inarch-mark-on-dark-266.png', 266, 190),
  },
};

siteConfig.studio = studio;

/** `tel:` href for the studio phone. */
export const studioTelHref = `tel:${studio.phone}`;

/**
 * WhatsApp chat link, optionally with a pre-filled message.
 *
 * @example studioWhatsAppHref('Hello') // https://wa.me/917292831128?text=Hello
 */
export const studioWhatsAppHref = (text = '') =>
  `https://wa.me/${studio.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

/** `mailto:` href, or `null` while no email address is supplied (render nothing). */
export const studioMailHref = studio.email ? `mailto:${studio.email}` : null;

/** Google Maps search for the studio (name-based until D-16 supplies a pin). */
export const studioMapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(studio.map.query)}`;

/** The address as display lines, empty parts dropped: ['Boring Road', 'Patna, Bihar', 'India']. */
export const studioAddressLines = [
  studio.address.line1,
  [studio.address.city, [studio.address.region, studio.address.postalCode].filter(Boolean).join(' ')]
    .filter(Boolean)
    .join(', '),
  studio.address.country,
].filter(Boolean);

/** Opening hours as one line ("From 10:00 AM"), or '' when nothing is known. */
export const studioHoursLabel = [studio.hours.opensAt && `From ${studio.hours.opensAt}`, studio.hours.note]
  .filter(Boolean)
  .join(' · ');

/**
 * Absolute URL on the studio's own site. Uses `studio.siteUrl` once the
 * domain is known (D-05) and the current origin until then.
 *
 * @example studioUrl('/portfolio') // https://<origin>/portfolio
 */
export const studioUrl = (path = '/') => {
  const base = studio.siteUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  if (/^https?:\/\//i.test(path)) return path;
  return `${base.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;
};

/**
 * Display URL for a Cloudinary asset, capped to the size that surface
 * actually renders (Prompt 12).
 *
 * `f_auto` negotiates WebP/AVIF, `q_auto:best` keeps a brand mark's edges
 * clean, and `w`/`h` should be passed at **2× the CSS box** so it stays crisp
 * on retina.
 *
 * Only `logoIcon` still lives on Cloudinary — the wordmark and the "DLS" mark
 * are self-hosted and ship at one size each — so a non-Cloudinary URL is
 * returned untouched rather than silently no-op'ing through a `.replace()`
 * that never matches.
 *
 * **Currently has no caller, and neither does its one possible subject.** The
 * Home hero watermark that used it now draws the self-hosted `logoMark`, and
 * the `index.html` splash — the last surface on the Cloudinary `logoIcon` —
 * moved to `logoMark` too. Kept because `logoIcon` is still exported and this
 * is the only way to size it if a surface ever draws it again.
 *
 * @example logoAt(siteConfig.logoIcon, { w: 760 })
 */
export const logoAt = (url, { w, h } = {}) => {
  if (!url.includes('/image/upload/')) return url;
  const size = [w && `w_${w}`, h && `h_${h}`].filter(Boolean).join(',');
  const transform = ['f_auto', 'q_auto:best', size].filter(Boolean).join(',');
  return url.replace('/image/upload/', `/image/upload/${transform}/`);
};

export default siteConfig;
