/* ============================================
   Kit internals — refs
   ============================================ */

import { useCallback, useEffect, useLayoutEffect } from 'react';

const assign = (ref, value) => {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
};

/** One callback ref that writes to every ref passed (forwarded + local). */
export const useMergedRef = (...refs) =>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useCallback((value) => refs.forEach((ref) => assign(ref, value)), refs);

/** useLayoutEffect in the browser, useEffect where there is no DOM. */
export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
