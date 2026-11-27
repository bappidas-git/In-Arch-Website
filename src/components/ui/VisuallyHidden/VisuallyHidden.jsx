/* ============================================
   VisuallyHidden — text for assistive technology only
   --------------------------------------------
   Uses the `.ia-visually-hidden` helper (src/styles/inarch/layout.css).
   `as` defaults to <span>.
   ============================================ */

import React, { forwardRef } from 'react';
import cx from '../_shared/cx';

const VisuallyHidden = forwardRef(function VisuallyHidden({ as: Tag = 'span', className, children, ...rest }, ref) {
  return (
    <Tag ref={ref} className={cx('ia-visually-hidden', className)} {...rest}>
      {children}
    </Tag>
  );
});

export default VisuallyHidden;
