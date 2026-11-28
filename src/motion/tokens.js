/* ============================================
   IN-ARCH motion tokens (GSAP side)
   --------------------------------------------
   Seconds for GSAP. The CSS side lives in src/styles/inarch/tokens.css
   (--ia-dur-*, --ia-ease-*). Transform and opacity only.
   ============================================ */

/** Durations (s): 150 / 240 / 400 / 700 / 1000 ms. */
export const DUR = {
  press: 0.15,
  hover: 0.24,
  ui: 0.4,
  reveal: 0.7,
  hero: 1.0,
};

/**
 * The few named exceptions the design contract gives for one specific
 * movement. Anything not listed here uses DUR.
 */
export const DUR_NAMED = {
  rule: 0.9, // rule draw
  shutterImage: 1.4, // image settle inside a shutter
  overlayIn: 0.5, // index overlay (and lead sheet) rising in
  overlayOut: 0.35, // … and leaving
  curtainLift: 0.55, // the page curtain leaving upward (it covers in DUR.ui)
  heroSettle: 1.6, // the Home hero photograph settling on load
};

/** `data-m="settle"`: the photograph eases in from this scale to 1. */
export const SETTLE = { from: 1.08 };

/**
 * `data-m="words"`: a statement's words go from 25 % to 100 % opacity as the
 * block's top travels from 80 % to 35 % of the viewport height (scrubbed,
 * once: when every word is opaque the trigger retires and they stay so).
 */
export const WORDS = { from: 0.25, start: 'top 80%', end: 'top 35%', stagger: 0.1 };

export const EASE = {
  out: 'power3.out', // reveals
  lines: 'expo.out', // headline lines
  mask: 'power3.inOut', // masks and the page curtain
  scrub: 'none', // scroll-scrubbed
};

/** Rise distance (px): 24 on mobile, 40 from 1024. */
export const RISE = { sm: 24, lg: 40 };

export const STAGGER = { lines: 0.08, items: 0.08 };

/** ScrollTrigger start for every reveal; reveals play once. */
export const START = 'top 85%';

/** Parallax drift caps (yPercent) and scrub smoothing (s). */
export const PARALLAX = { capSm: 4, capLg: 7, scrub: 0.6 };

export const MQ = {
  desktop: '(min-width: 1024px)',
  reduce: '(prefers-reduced-motion: reduce)',
  fine: '(hover: hover) and (pointer: fine)',
};
