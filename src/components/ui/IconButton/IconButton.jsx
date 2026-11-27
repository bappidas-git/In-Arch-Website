/* ============================================
   IconButton — the round control
   --------------------------------------------
   <IconButton label="Next project" icon="arrow-right" onClick={next} />
   <IconButton label="Call +91 72928 31128" icon="phone" href={studioTelHref} />
   <IconButton label="Close" icon="close" variant="ghost" onClick={close} />

   A 48 px circle with a 1 px border (--ia-line-strong, ≥ 3:1) and a 20 px
   icon. Hover (fine pointers) and focus-visible: a fill in --ia-fg wipes up
   and an arrow swaps in its own direction (other glyphs stay put).
   Press: scale 0.94. `label` is required: it is the accessible name.

   | prop     | values                                 | default        |
   |----------|----------------------------------------|----------------|
   | label    | accessible name (aria-label)           | required       |
   | icon     | an Icon name                           | arrow-up-right |
   | variant  | default · ghost (ivory, over photographs) | default     |
   | size     | 48 · 44 (px)                           | 48             |
   | to/href/disabled/aria-disabled | as Button        |                |
   ============================================ */

import React, { forwardRef } from 'react';
import cx from '../_shared/cx';
import { devWarn } from '../_shared/dev';
import { useAction } from '../_shared/action';
import ArrowSwap from '../_shared/ArrowSwap';
import styles from './IconButton.module.css';

const IconButton = forwardRef(function IconButton(
  {
    label,
    icon = 'arrow-up-right',
    variant = 'default',
    size = 48,
    to,
    href,
    type,
    target,
    rel,
    disabled = false,
    onClick,
    className,
    style,
    'aria-disabled': ariaDisabled,
    ...rest
  },
  ref
) {
  if (!label && !rest['aria-labelledby']) devWarn('IconButton: `label` is required — it is the accessible name.');
  const { Tag, props, inactive } = useAction({ to, href, type, disabled, onClick, target, rel, ariaDisabled });
  const px = size === 44 ? 44 : 48;

  return (
    <Tag
      ref={ref}
      className={cx(styles.round, variant === 'ghost' && styles.ghost, inactive ? styles.inactive : styles.enabled, className)}
      style={{ '--ib-size': `${px}px`, ...style }}
      aria-label={label}
      data-ia-swap=""
      {...props}
      {...rest}
    >
      <span className={styles.fill} aria-hidden="true" />
      <ArrowSwap name={icon} size={20} className={styles.icon} />
    </Tag>
  );
});

export default IconButton;
