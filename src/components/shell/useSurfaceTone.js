/* ============================================
   useSurfaceTone — the tone of the page under a point on screen
   --------------------------------------------
   const tone = useSurfaceTone(() => ({ x: 4, y: window.innerHeight - 40 }));

   Reports the `data-tone` ("light" | "sand" | "paper" | "dark") of the
   section that is currently under the given viewport position. The dock
   uses it at its own vertical centre so it always reads as part of the
   page beneath it.

   - The point is re-measured on scroll and resize (once per frame), when
     the page's DOM changes (a lazy route resolving, content mounting) and
     on every route change.
   - Floating shell layers (dock, index overlay, curtain — anything marked
     [data-shell-float]) are looked through, so the dock never reads itself.
   - Content without any [data-tone] ancestor — the old pages, until their
     prompts replace them — reads as "light".
   ============================================ */

import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const TONES = ['light', 'sand', 'paper', 'dark'];

const asTone = (value) => (TONES.includes(value) ? value : 'light');

/** The tone at viewport point (x, y), looking through floating shell layers. */
export const toneAtPoint = (x, y) => {
  if (typeof document === 'undefined') return 'light';
  const stack =
    typeof document.elementsFromPoint === 'function'
      ? document.elementsFromPoint(x, y)
      : [document.elementFromPoint(x, y)].filter(Boolean);
  for (let i = 0; i < stack.length; i += 1) {
    const el = stack[i];
    if (el === document.documentElement || el === document.body) continue;
    if (el.closest('[data-shell-float]')) continue;
    const host = el.closest('[data-tone]');
    return host ? asTone(host.getAttribute('data-tone')) : 'light';
  }
  return 'light';
};

/**
 * @param {() => ({x: number, y: number}) | null} getPoint  viewport point to sample
 * @param {Object}  [options]
 * @param {boolean} [options.enabled=true]
 * @returns {'light'|'sand'|'paper'|'dark'}
 */
export default function useSurfaceTone(getPoint, { enabled = true } = {}) {
  const [tone, setTone] = useState('light');
  const { pathname } = useLocation();
  const pointRef = useRef(getPoint);
  pointRef.current = getPoint;

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return undefined;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const point = pointRef.current();
      if (!point) return;
      setTone(toneAtPoint(point.x, point.y));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    const root = document.getElementById('root') || document.body;
    const observer = typeof MutationObserver === 'function' ? new MutationObserver(schedule) : null;
    if (observer) observer.observe(root, { childList: true, subtree: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (observer) observer.disconnect();
    };
  }, [enabled, pathname]);

  return tone;
}
