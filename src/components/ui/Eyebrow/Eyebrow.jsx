/* ============================================
   Eyebrow — the numbered label
   --------------------------------------------
   <Eyebrow index={1}>The practice</Eyebrow>   → "01 —— THE PRACTICE"
   <Eyebrow>Architecture & interior design — Patna</Eyebrow>   (no number)

   The index (numbers are zero-padded to two digits) is set in --ia-accent,
   followed by a 32 px hairline and the label, all in `.ia-t-label`
   (12 px, 600, uppercase, 0.18em). An eyebrow is never the only heading of
   a section: it sits above a Heading. The hairline is decorative.
   ============================================ */

import React, { forwardRef } from 'react';
import cx from '../_shared/cx';
import styles from './Eyebrow.module.css';

export const padIndex = (index) =>
  typeof index === 'number' && Number.isFinite(index) ? String(index).padStart(2, '0') : index;

const Eyebrow = forwardRef(function Eyebrow({ as: Tag = 'p', index, className, children, ...rest }, ref) {
  const hasIndex = index !== undefined && index !== null && index !== '';
  return (
    <Tag ref={ref} className={cx('ia-t-label', styles.eyebrow, className)} {...rest}>
      {hasIndex && <span className={styles.index}>{padIndex(index)}</span>}
      <span className={styles.rule} aria-hidden="true" />
      <span className={styles.label}>{children}</span>
    </Tag>
  );
});

export default Eyebrow;
