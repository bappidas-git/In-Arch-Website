/* ============================================
   useMatchMedia — a live media-query boolean for the shell
   --------------------------------------------
   const desktop = useMatchMedia('(min-width: 1024px)');

   Read synchronously on the first render (client-only app), so the right
   variant paints first; follows changes (rotation, resize).
   ============================================ */

import { useCallback, useSyncExternalStore } from 'react';

export default function useMatchMedia(query) {
  const subscribe = useCallback(
    (onChange) => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {};
      const mql = window.matchMedia(query);
      if (typeof mql.addEventListener === 'function') {
        mql.addEventListener('change', onChange);
        return () => mql.removeEventListener('change', onChange);
      }
      mql.addListener(onChange);
      return () => mql.removeListener(onChange);
    },
    [query]
  );
  const getSnapshot = () =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia(query).matches : false;
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
