/* ============================================
   Stack — vertical rhythm
   --------------------------------------------
   <Stack gap={6}>…</Stack>   → children 24 px apart

   `gap` is a step of the 4 px spacing scale (the --ia-space-N tokens):
   1 · 2 · 3 · 4 · 5 · 6 · 8 · 10 · 12 · 16 · 20 · 24 · 32 · 40 · 48
   (4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128 · 160 · 192 px).
   Default 4 (16 px). `align` sets align-items (start | center | end | stretch).
   ============================================ */

import React, { forwardRef } from 'react';
import cx from '../_shared/cx';
import { devWarn } from '../_shared/dev';
import styles from './Stack.module.css';

export const SPACE_STEPS = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48];

const Stack = forwardRef(function Stack(
  { as: Tag = 'div', gap = 4, align = 'stretch', className, style, children, ...rest },
  ref
) {
  let step = gap;
  if (!SPACE_STEPS.includes(gap)) {
    devWarn(`Stack: gap={${gap}} is not a spacing step (${SPACE_STEPS.join(', ')}); using 4.`);
    step = 4;
  }
  return (
    <Tag
      ref={ref}
      className={cx(styles.stack, styles[`align-${align}`], className)}
      style={{ '--ia-stack-gap': `var(--ia-space-${step})`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
});

export default Stack;
