/* ============================================
   Reduced motion
   --------------------------------------------
   `prefersReducedMotion()` is the one-shot check shared with the legacy
   animations (src/animations/gsapSetup.js). `useReducedMotion()` is the
   reactive version for components that must re-render when the OS setting
   changes (e.g. to stop a marquee).
   ============================================ */

import { useSyncExternalStore } from 'react';
import { prefersReducedMotion } from '../animations/gsapSetup';
import { MQ } from './tokens';

const getQuery = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(MQ.reduce)
    : null;

const subscribe = (onChange) => {
  const mql = getQuery();
  if (!mql) return () => {};
  if (typeof mql.addEventListener === 'function') {
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }
  // Safari < 14
  mql.addListener(onChange);
  return () => mql.removeListener(onChange);
};

const getSnapshot = () => {
  const mql = getQuery();
  return mql ? mql.matches : false;
};

const getServerSnapshot = () => false;

/** True while the visitor asks for reduced motion; updates live. */
export const useReducedMotion = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

export { prefersReducedMotion };
