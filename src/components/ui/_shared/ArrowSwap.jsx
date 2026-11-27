/* ============================================
   Kit internals — the "swap" half of "wipe & swap"
   --------------------------------------------
   Two copies of an icon in an `overflow: hidden` box. While the HOST is
   hovered (fine pointers only) or keyboard-focused, the first copy leaves
   in the arrow's own direction (arrow-up-right: to 100 %, −100 %) and the
   second arrives from the opposite side (−100 %, 100 % → 0), 400 ms expo.

   The host is any ancestor carrying `data-ia-swap` (Button, IconButton,
   ProjectTile). Glyphs that do not travel (phone, chat, close …) render one
   copy and stay still. Under reduced motion nothing moves.
   ============================================ */

import React from 'react';
import Icon, { swapVector } from '../Icon/Icon';
import cx from './cx';
import styles from './ArrowSwap.module.css';

const ArrowSwap = ({ name = 'arrow-up-right', size = 16, className }) => {
  const vector = swapVector(name);
  const style = vector
    ? { '--ia-swap-x': `${vector[0] * 100}%`, '--ia-swap-y': `${vector[1] * 100}%`, width: size, height: size }
    : { width: size, height: size };
  return (
    <span className={cx(styles.box, vector && styles.travels, className)} style={style} aria-hidden="true">
      <span className={styles.first}>
        <Icon name={name} size={size} />
      </span>
      {vector && (
        <span className={styles.second}>
          <Icon name={name} size={size} />
        </span>
      )}
    </span>
  );
};

export default ArrowSwap;
