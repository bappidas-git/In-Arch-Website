/* ============================================
   useScrollLock — freeze the page behind an overlay
   --------------------------------------------
   useScrollLock(isOpen);

   Extracted from the lead modal (src/components/common/LeadModal), with the
   same behaviour:
   - the body is fixed at the current offset (overflow hidden, position
     fixed, top −scrollY, width 100 %), so the page does not jump and iOS
     cannot scroll it;
   - on release the body's previous inline styles come back, and the
     visitor is put back at their offset — but ONLY if the route has not
     changed meanwhile (a back / forward gesture can change it under an open
     overlay; replaying the offset onto another page would drop them in the
     wrong place, and ScrollManager already owns that page's position);
   - `scheduleRefresh()` runs on both edges: fixing the body collapses the
     document, which invalidates every ScrollTrigger measurement behind the
     overlay.

   Two additions that only make it safer:
   - locks are counted, so two overlays open at once (a lightbox over a
     sheet) lock once and release once, when the last one closes;
   - the offset is restored with behavior "instant", so the document's
     `scroll-behavior: smooth` cannot animate the jump back.
   ============================================ */

import { useEffect } from 'react';
import { scheduleRefresh } from '../animations/gsapSetup';

// Shared by every caller: one lock on the body however many overlays ask.
let holders = 0;
let saved = null;

const lock = () => {
  holders += 1;
  if (holders > 1) return;
  const { body } = document;
  const scrollY = window.scrollY;
  saved = {
    scrollY,
    route: window.location.pathname + window.location.search,
    styles: {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    },
  };
  body.style.overflow = 'hidden';
  body.style.position = 'fixed';
  body.style.top = `-${scrollY}px`;
  body.style.width = '100%';
  scheduleRefresh();
};

const release = () => {
  holders = Math.max(0, holders - 1);
  if (holders > 0 || !saved) return;
  const { body } = document;
  const { scrollY, route, styles } = saved;
  saved = null;
  body.style.overflow = styles.overflow;
  body.style.position = styles.position;
  body.style.top = styles.top;
  body.style.width = styles.width;
  if (window.location.pathname + window.location.search === route) {
    try {
      window.scrollTo({ top: scrollY, left: 0, behavior: 'instant' });
    } catch (e) {
      window.scrollTo(0, scrollY);
    }
  }
  scheduleRefresh();
};

export default function useScrollLock(active) {
  useEffect(() => {
    if (!active || typeof document === 'undefined') return undefined;
    lock();
    return release;
  }, [active]);
}
