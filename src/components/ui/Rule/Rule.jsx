/* ============================================
   Rule — a 1 px line
   --------------------------------------------
   <Rule />            hairline (--ia-line), drawn from the left by the
                       motion hook (data-m="rule") inside a useMotionScope
   <Rule strong />     --ia-line-strong
   <Rule animate={false} />

   An <hr> (a thematic break for assistive technology); pass
   aria-hidden="true" when it is purely decorative.
   ============================================ */

import React, { forwardRef } from 'react';
import cx from '../_shared/cx';
import styles from './Rule.module.css';

const Rule = forwardRef(function Rule({ strong = false, animate = true, className, ...rest }, ref) {
  return (
    <hr ref={ref} className={cx(styles.line, strong && styles.strong, className)} data-m={animate ? 'rule' : undefined} {...rest} />
  );
});

export default Rule;
