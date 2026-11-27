/* ============================================
   Lede — the opening paragraph under a headline
   --------------------------------------------
   body-lg (17 → 21 px), measure 52ch, --ia-fg. `as` defaults to <p>.
   ============================================ */

import React, { forwardRef } from 'react';
import cx from '../_shared/cx';
import styles from './Lede.module.css';

const Lede = forwardRef(function Lede({ as: Tag = 'p', className, children, ...rest }, ref) {
  return (
    <Tag ref={ref} className={cx('ia-t-body-lg', styles.opening, className)} {...rest}>
      {children}
    </Tag>
  );
});

export default Lede;
