/* ============================================
   Masthead — the logo, and nothing that sticks
   --------------------------------------------
   Sits at the top of the page, over the first section, and scrolls away
   with it (position: absolute). 72 px tall on phones, 88 from 768, 104 from
   1024; inline padding is the page gutter.

   - Left: the logo, linking home — the wordmark (22 px tall on phones,
     26 px from 768; owner decision D-22) and the full lockup at 48 px from
     1024.
   - Right: a call button on phones and tablets; from 1024 a quiet meta line,
     "Patna, Bihar" · the phone number.
   - Its tone is the tone of the page's first section (the deepest
     [data-tone] element at the very top of <main>). It paints no background
     of its own, so over a photographic hero it shows the ivory logo on the
     hero's own overlay.
   - Old page bodies carry no [data-tone] and read as light. Their heroes
     were drawn for the old glass header (some under photographs), so until
     prompt 14 the masthead lays a translucent ivory ground over them
     ([data-legacy]) to keep the logo and the meta line legible.
   ============================================ */

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { studio, studioTelHref } from '../../../data/siteConfig';
import Logo from '../../ui/Logo/Logo';
import IconButton from '../../ui/IconButton/IconButton';
import TextLink from '../../ui/TextLink/TextLink';
import TLink from '../transition/TLink';
import useMatchMedia from '../useMatchMedia';
import { TONES } from '../useSurfaceTone';
import { MQ } from '../../../motion/tokens';
import styles from './Masthead.module.css';

/**
 * The tone of the first section of the page: the deepest [data-tone] at the
 * top of <main>. `legacy` is true when there is none (an old page body).
 */
export const leadTone = () => {
  const none = { tone: 'light', legacy: true };
  if (typeof document === 'undefined') return none;
  const main = document.getElementById('main-content');
  if (!main) return none;
  const top = main.getBoundingClientRect().top;
  let found = null;
  main.querySelectorAll('[data-tone]').forEach((el) => {
    const box = el.getBoundingClientRect();
    if (box.height > 0 && Math.abs(box.top - top) <= 1) found = el.getAttribute('data-tone');
  });
  if (found === null) return none;
  return { tone: TONES.includes(found) ? found : 'light', legacy: false };
};

const sameLead = (a, b) => a.tone === b.tone && a.legacy === b.legacy;

const useLeadTone = () => {
  const [tone, setTone] = useState({ tone: 'light', legacy: true });
  const { pathname } = useLocation();

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const next = leadTone();
      setTone((current) => (sameLead(current, next) ? current : next));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    schedule();
    const main = document.getElementById('main-content');
    const observer = main && typeof MutationObserver === 'function' ? new MutationObserver(schedule) : null;
    if (observer) observer.observe(main, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-tone'] });
    window.addEventListener('resize', schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', schedule);
      if (observer) observer.disconnect();
    };
  }, [pathname]);

  return tone;
};

const PLACE = [studio.address.city, studio.address.region].filter(Boolean).join(', ');

const Masthead = () => {
  const { tone, legacy } = useLeadTone();
  const desktop = useMatchMedia(MQ.desktop);
  const tablet = useMatchMedia('(min-width: 768px)');

  return (
    <header className={`ia ${styles.masthead}`} data-tone={tone} data-legacy={legacy ? '' : undefined}>
      <TLink to="/" className={styles.home} aria-label={`${studio.name} — home`}>
        {desktop ? (
          <Logo variant="lockup" height={48} alt="" />
        ) : (
          <Logo variant="wordmark" height={tablet ? 26 : 22} alt="" />
        )}
      </TLink>

      <div className={styles.meta}>
        {studio.phone && (
          <IconButton
            className={styles.call}
            icon="phone"
            href={studioTelHref}
            label={`Call ${studio.phoneDisplay}`}
          />
        )}
        <p className={`ia-t-label ${styles.line}`}>
          {PLACE && <span>{PLACE}</span>}
          {PLACE && studio.phone && (
            <span className={styles.sep} aria-hidden="true">
              ·
            </span>
          )}
          {studio.phone && (
            <TextLink href={studioTelHref} className={styles.tel}>
              {studio.phoneDisplay}
            </TextLink>
          )}
        </p>
      </div>
    </header>
  );
};

export default Masthead;
