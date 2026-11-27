/* ============================================
   Kit internals — tone lookup
   --------------------------------------------
   Every primitive reads the tone *variables* in CSS and needs no tone of its
   own. The few that must choose a different FILE per tone (Logo) resolve the
   nearest `[data-tone]` in the DOM, which is the same element the CSS
   variables come from. A tone attribute that changes later (the dock follows
   the section beneath it) is picked up through a MutationObserver on that
   one element.
   ============================================ */

import { useEffect, useState } from 'react';
import { useIsoLayoutEffect } from './refs';

export const TONES = ['light', 'sand', 'paper', 'dark'];

export const isDarkTone = (tone) => tone === 'dark';

/** The tone named by the nearest `[data-tone]` at or above `el`; `.ia` alone is light. */
export const toneOf = (el) => {
  const host = el && el.closest ? el.closest('[data-tone]') : null;
  const tone = host ? host.getAttribute('data-tone') : 'light';
  return { tone: TONES.includes(tone) ? tone : 'light', host };
};

/**
 * Resolve the tone around `ref` before the first paint.
 * @param {React.RefObject} ref   an element inside the tone
 * @param {string} [forced]       an explicit tone wins, no lookup
 * @returns {string|null}         null until resolved (render nothing tone-specific yet)
 */
export const useNearestTone = (ref, forced) => {
  const [tone, setTone] = useState(forced || null);
  const [host, setHost] = useState(null);

  useIsoLayoutEffect(() => {
    if (forced) {
      setTone(forced);
      setHost(null);
      return;
    }
    const found = toneOf(ref.current);
    setTone(found.tone);
    setHost(found.host);
  }, [forced, ref]);

  useEffect(() => {
    if (forced || !host || typeof MutationObserver === 'undefined') return undefined;
    const observer = new MutationObserver(() => setTone(toneOf(ref.current).tone));
    observer.observe(host, { attributes: true, attributeFilter: ['data-tone'] });
    return () => observer.disconnect();
  }, [forced, host, ref]);

  return tone;
};
