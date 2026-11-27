/* ============================================
   ScrollMarquee — words that travel only as the page scrolls
   --------------------------------------------
   <ScrollMarquee items={['Architecture', 'Interiors', 'Visualisation', 'Delivery']} />

   A row of words in a display size that moves sideways ONLY with the
   scroll: a ScrollTrigger scrub on the row's x transform, from the moment
   the band enters the viewport to the moment it leaves. It never moves on a
   timer, so it needs no pause control, and the page itself always moves
   1:1 with the finger or wheel.

   - The first copy is the readable one; the duplicate copies that fill the
     row are aria-hidden. With `decorative`, every copy is hidden.
   - Over one pass it travels exactly one copy's width (100 / copies % of
     the row), so no gap ever opens at the end. `copies` defaults to 2;
     keep one copy at least as wide as the viewport.
   - `direction`: "left" (default) or "right". `size`: a display step
     (2xl · xl · lg · md · sm; default lg). `separator`: what sits between
     words (default "·"), always aria-hidden.
   - Under reduced motion it is static. The band clips its own overflow,
     so it never widens the page.
   ============================================ */

import React, { Fragment, forwardRef, useRef } from 'react';
import { gsap, useGSAP, scheduleRefresh } from '../../../animations/gsapSetup';
import { MQ, EASE, PARALLAX } from '../../../motion/tokens';
import cx from '../_shared/cx';
import { useMergedRef } from '../_shared/refs';
import styles from './ScrollMarquee.module.css';

const SIZES = ['2xl', 'xl', 'lg', 'md', 'sm'];

const Copy = ({ items, separator, size, hidden }) => (
  <p className={cx(`ia-t-display-${size}`, styles.copy)} aria-hidden={hidden ? true : undefined}>
    {items.map((item, i) => (
      <Fragment key={i}>
        <span className={styles.word}>{item}</span>{' '}
        <span className={styles.separator} aria-hidden="true">
          {separator}
        </span>{' '}
      </Fragment>
    ))}
  </p>
);

const ScrollMarquee = forwardRef(function ScrollMarquee(
  { items = [], copies = 2, direction = 'left', size = 'lg', separator = '·', decorative = false, className, ...rest },
  forwardedRef
) {
  const root = useRef(null);
  const ref = useMergedRef(forwardedRef, root);
  const count = Math.max(2, Math.round(copies));
  const step = SIZES.includes(size) ? size : 'lg';

  useGSAP(
    () => {
      const el = root.current;
      const track = el && el.querySelector('[data-marquee-track]');
      if (!track) return undefined;
      const mm = gsap.matchMedia();
      mm.add({ all: 'all', reduce: MQ.reduce }, (context) => {
        if (context.conditions.reduce) return;
        const shift = 100 / count;
        const [from, to] = direction === 'right' ? [-shift, 0] : [0, -shift];
        gsap.fromTo(
          track,
          { xPercent: from },
          {
            xPercent: to,
            ease: EASE.scrub,
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: PARALLAX.scrub },
          }
        );
        scheduleRefresh();
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [count, direction, items.length], revertOnUpdate: true }
  );

  return (
    <div ref={ref} className={cx(styles.band, className)} aria-hidden={decorative ? true : undefined} {...rest}>
      <div className={styles.track} data-marquee-track="">
        {Array.from({ length: count }, (_, i) => (
          <Copy key={i} items={items} separator={separator} size={step} hidden={i > 0} />
        ))}
      </div>
    </div>
  );
});

export default ScrollMarquee;
