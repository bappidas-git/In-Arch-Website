/* ============================================
   Text — Manrope running text
   --------------------------------------------
   <Text size="sm" muted>…</Text>

   | size    | class          | px       |
   |---------|----------------|----------|
   | lg      | .ia-t-body-lg  | 17 → 21  |
   | md      | .ia-t-body     | 16 → 17  |  (default)
   | sm      | .ia-t-small    | 14       |
   | caption | .ia-t-caption  | 13       |

   `muted` uses --ia-fg-2. The measure is capped at 68ch. `as` defaults to <p>.
   ============================================ */

import React, { forwardRef } from 'react';
import cx from '../_shared/cx';
import styles from './Text.module.css';

const SIZE_CLASS = { lg: 'ia-t-body-lg', md: 'ia-t-body', sm: 'ia-t-small', caption: 'ia-t-caption' };

const Text = forwardRef(function Text({ as: Tag = 'p', size = 'md', muted = false, className, children, ...rest }, ref) {
  return (
    <Tag ref={ref} className={cx(SIZE_CLASS[size] || SIZE_CLASS.md, styles.text, muted && styles.muted, className)} {...rest}>
      {children}
    </Tag>
  );
});

export default Text;
