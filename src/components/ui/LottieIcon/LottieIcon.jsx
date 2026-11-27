/* ============================================
   LottieIcon — an animated content icon, played once
   --------------------------------------------
   <LottieIcon name="process-03-concept" size={48} />
   <LottieIcon name="status-done" icon="status-done" size={96} title="Sent" />

   - Shows the matching static SVG (LineIcon `icon`, default = `name`) first.
   - Loads the player (lottie-web's light build, through a dynamic import,
     so it never enters the main bundle) and the JSON
     (public/images/inarch/lottie/<name>.json) only when the icon comes
     within 200 px of the viewport.
   - Plays once when at least half of it is visible, then stays on its last
     frame; the static SVG is swapped out at that moment, so the icon is
     never blank.
   - Keeps the static SVG on error, under reduced motion (the player is
     never requested) and where IntersectionObserver does not exist.

   The animations are drawn with a 1.5 px stroke at 48 px; at other sizes the
   stroke scales with the box (2 px at 64), so prefer 48.
   ============================================ */

import React, { forwardRef, useEffect, useRef, useState } from 'react';
import cx from '../_shared/cx';
import { useMergedRef } from '../_shared/refs';
import { useReducedMotion } from '../../../motion/reducedMotion';
import LineIcon from '../LineIcon/LineIcon';
import styles from './LottieIcon.module.css';

export const lottieUrl = (name) => `/images/inarch/lottie/${name}.json`;

const LottieIcon = forwardRef(function LottieIcon({ name, icon, size = 48, title, className, style, ...rest }, forwardedRef) {
  const root = useRef(null);
  const host = useRef(null);
  const ref = useMergedRef(forwardedRef, root);
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (reduced || !el || typeof IntersectionObserver === 'undefined') return undefined;
    let anim = null;
    let half = null;
    let cancelled = false;

    const start = () =>
      import('lottie-web/build/player/lottie_light')
        .then(({ default: lottie }) => {
          if (cancelled || !host.current) return;
          anim = lottie.loadAnimation({
            container: host.current,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            path: lottieUrl(name),
            rendererSettings: { progressiveLoad: true },
          });
          anim.addEventListener('data_failed', () => {
            if (!cancelled) setPlaying(false);
          });
          anim.addEventListener('DOMLoaded', () => {
            if (cancelled) return;
            half = new IntersectionObserver(
              ([entry]) => {
                if (!entry || entry.intersectionRatio < 0.5) return;
                half.disconnect();
                setPlaying(true);
                anim.goToAndPlay(0, true);
              },
              { threshold: [0.5] }
            );
            half.observe(el);
          });
        })
        .catch(() => {
          if (!cancelled) setPlaying(false);
        });

    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry || !entry.isIntersecting) return;
        near.disconnect();
        start();
      },
      { rootMargin: '200px 0px' }
    );
    near.observe(el);

    return () => {
      cancelled = true;
      near.disconnect();
      if (half) half.disconnect();
      if (anim) anim.destroy();
      setPlaying(false);
    };
  }, [name, reduced]);

  const showLottie = playing && !reduced;

  return (
    <span
      ref={ref}
      className={cx(styles.lottie, className)}
      style={{ width: size, height: size, ...style }}
      role={title ? 'img' : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      data-lottie={name}
      data-playing={showLottie ? '' : undefined}
      {...rest}
    >
      <LineIcon name={icon || name} size={size} className={styles.still} />
      {!reduced && <span ref={host} className={styles.player} />}
    </span>
  );
});

export default LottieIcon;
