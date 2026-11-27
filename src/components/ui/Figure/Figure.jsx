/* ============================================
   Figure — a photograph with its caption
   --------------------------------------------
   <Figure caption="Prayer unit with lattice-cut doors">
     <Frame ratio="3/2"><Picture image="g-ph09" sizes="…" alt="" /></Frame>
   </Figure>

   <figure> + <figcaption> in `.ia-t-caption` (13 px, --ia-fg-2). When the
   caption already says what the picture shows, give the picture alt="" so
   it is not read twice.
   ============================================ */

import React, { forwardRef } from 'react';
import cx from '../_shared/cx';
import styles from './Figure.module.css';

const Figure = forwardRef(function Figure({ caption, className, children, ...rest }, ref) {
  return (
    <figure ref={ref} className={cx(styles.figure, className)} {...rest}>
      {children}
      {caption && <figcaption className={cx('ia-t-caption', styles.caption)}>{caption}</figcaption>}
    </figure>
  );
});

export default Figure;
