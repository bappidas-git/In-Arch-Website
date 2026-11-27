/* ============================================
   Design Lab helpers (development only)
   ============================================ */

import { useEffect, useState } from 'react';

/** Parse `#RGB`, `#RRGGBB`, `rgb()` or `rgba()` into [r, g, b] (0–255). */
export const parseColour = (value) => {
  const v = String(value || '').trim();
  if (v.startsWith('#')) {
    let hex = v.slice(1);
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
    const n = parseInt(hex.slice(0, 6), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const m = v.match(/rgba?\(([^)]+)\)/i);
  if (m) return m[1].split(/[\s,/]+/).slice(0, 3).map(Number);
  return null;
};

const channel = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

export const luminance = ([r, g, b]) =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

/** WCAG 2 contrast ratio between two colour strings. */
export const contrast = (a, b) => {
  const ca = parseColour(a);
  const cb = parseColour(b);
  if (!ca || !cb) return NaN;
  const [hi, lo] = [luminance(ca), luminance(cb)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

export const toHex = (value) => {
  const c = parseColour(value);
  if (!c) return String(value);
  return `#${c.map((n) => n.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
};

/** Read a custom property from :root. */
export const readToken = (name) =>
  typeof window === 'undefined'
    ? ''
    : getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/**
 * Evaluate `clamp(min rem, a rem + b vw, max rem)` at a viewport width,
 * with 1rem = 16px. Returns pixels.
 */
export const clampPx = ([min, a, b, max], width) =>
  Math.min(max * 16, Math.max(min * 16, a * 16 + (b / 100) * width));

/** Viewport width as CSS `vw` sees it (scrollbar included), live. */
export const useViewportWidth = () => {
  const read = () => (typeof window === 'undefined' ? 0 : window.innerWidth);
  const [width, setWidth] = useState(read);
  useEffect(() => {
    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setWidth(read()));
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
    };
  }, []);
  return width;
};

/** The breakpoints of the design contract (min-width). */
export const BREAKPOINTS = [768, 1024, 1280, 1440, 1920];

export const activeBreakpoint = (width) =>
  BREAKPOINTS.filter((bp) => width >= bp).pop() || 0;
