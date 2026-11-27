/* ============================================
   Skeleton — a static placeholder block
   --------------------------------------------
   <Skeleton ratio="4/5" />
   <Skeleton width="60%" height="1.25em" />

   A plain block in --ia-placeholder (stone on light tones, forest-3 on
   dark). No shimmer, no motion. Hidden from assistive technology: announce
   loading with a live region where it matters.
   ============================================ */

import React, { forwardRef } from 'react';
import cx from '../_shared/cx';
import styles from './Skeleton.module.css';

const Skeleton = forwardRef(function Skeleton(
  { as: Tag = 'span', width, height, ratio, className, style, ...rest },
  ref
) {
  return (
    <Tag
      ref={ref}
      className={cx(styles.block, className)}
      style={{
        width,
        height: ratio ? undefined : height,
        aspectRatio: ratio ? String(ratio).replace('/', ' / ') : undefined,
        ...style,
      }}
      aria-hidden="true"
      {...rest}
    />
  );
});

export default Skeleton;
