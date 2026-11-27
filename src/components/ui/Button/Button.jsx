/* ============================================
   Button — the "wipe & swap" CTA
   --------------------------------------------
   <Button onClick={…}>Start a project</Button>
   <Button variant="secondary" size="md" to="/portfolio">View work</Button>
   <Button variant="ghost" href={studioTelHref} icon="phone">Call</Button>
   <Button type="submit" loading={sending} loadingLabel="Sending…" fullWidth="mobile">Send enquiry</Button>

   | prop         | values                                   | default          |
   |--------------|------------------------------------------|------------------|
   | variant      | primary · secondary · ghost (on photos)  | primary          |
   | size         | lg (52 px, 28 px inline) · md (44, 20)   | lg               |
   | to / href    | internal (LinkProvider) / plain link     | <button>         |
   | type         | button · submit · reset                  | button           |
   | icon         | an Icon name, or null for none           | arrow-up-right   |
   | fullWidth    | true · "mobile" (only below 768 px)      | false            |
   | disabled     | native on <button>; aria-disabled on links |                |
   | aria-disabled| stays focusable, activation swallowed    |                  |
   | loading      | aria-busy, label → loadingLabel, width   |                  |
   |              | locked, activation swallowed             |                  |
   | magnetic     | lg only: follows a fine pointer ≤ 6 px,  | false            |
   |              | springs back in 400 ms; never on touch   |                  |
   |              | or under reduced motion                  |                  |

   Hover (fine pointers) and focus-visible: the fill wipes up from the
   bottom edge (scaleY 0 → 1, 400 ms expo) while the arrow swaps.
   Press: scale 0.98, 150 ms. Under reduced motion only the colours change.
   The label and the loading label share one grid cell, so the button is
   always as wide as the longer of the two and never jumps while sending.
   ============================================ */

import React, { forwardRef, useEffect, useRef } from 'react';
import cx from '../_shared/cx';
import { useMergedRef } from '../_shared/refs';
import { useAction } from '../_shared/action';
import ArrowSwap from '../_shared/ArrowSwap';
import { MQ } from '../../../motion/tokens';
import styles from './Button.module.css';

const MAGNET_PX = 6;
const clamp = (n) => Math.max(-MAGNET_PX, Math.min(MAGNET_PX, n));

const useMagnet = (ref, enabled) => {
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el || typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const fine = window.matchMedia(MQ.fine);
    const reduce = window.matchMedia(MQ.reduce);
    let box = null;
    let current = [0, 0];

    const set = (x, y) => {
      current = [x, y];
      el.style.setProperty('--ia-mx', `${x.toFixed(2)}px`);
      el.style.setProperty('--ia-my', `${y.toFixed(2)}px`);
    };
    const enter = () => {
      const r = el.getBoundingClientRect();
      // Measure the resting box, without the offset currently applied.
      box = { cx: r.left - current[0] + r.width / 2, cy: r.top - current[1] + r.height / 2, hw: r.width / 2, hh: r.height / 2 };
    };
    const move = (event) => {
      if (event.pointerType !== 'mouse' || !fine.matches || reduce.matches) return;
      if (!box) enter();
      el.setAttribute('data-magnet', 'on');
      set(clamp(((event.clientX - box.cx) / box.hw) * MAGNET_PX), clamp(((event.clientY - box.cy) / box.hh) * MAGNET_PX));
    };
    const leave = () => {
      box = null;
      el.removeAttribute('data-magnet');
      set(0, 0);
    };

    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointerenter', enter);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      leave();
    };
  }, [ref, enabled]);
};

const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'lg',
    to,
    href,
    type,
    target,
    rel,
    icon = 'arrow-up-right',
    fullWidth = false,
    disabled = false,
    loading = false,
    loadingLabel,
    magnetic = false,
    onClick,
    className,
    children,
    'aria-disabled': ariaDisabled,
    ...rest
  },
  forwardedRef
) {
  const local = useRef(null);
  const ref = useMergedRef(forwardedRef, local);
  const { Tag, props, inactive } = useAction({ to, href, type, disabled, loading, onClick, target, rel, ariaDisabled });
  useMagnet(local, magnetic && size === 'lg' && !inactive);

  return (
    <Tag
      ref={ref}
      className={cx(
        styles.cta,
        styles[variant] || styles.primary,
        size === 'md' ? styles.md : styles.lg,
        fullWidth === true && styles.full,
        fullWidth === 'mobile' && styles.fullMobile,
        inactive ? styles.inactive : styles.enabled,
        className
      )}
      data-ia-swap=""
      data-loading={loading && loadingLabel ? '' : undefined}
      {...props}
      {...rest}
    >
      <span className={styles.fill} aria-hidden="true" />
      <span className={styles.labels}>
        <span className={styles.label}>{children}</span>
        {loadingLabel && <span className={styles.loadingLabel}>{loadingLabel}</span>}
      </span>
      {icon && <ArrowSwap name={icon} size={16} className={styles.arrow} />}
    </Tag>
  );
});

export default Button;
