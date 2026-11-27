/* ============================================
   Container — the page column
   --------------------------------------------
   `.ia-container` (src/styles/inarch/layout.css): full width up to 1680 px,
   centred, with the fluid page gutter (20 px at 360 → 80 px max).

   <Container as="header">…</Container>
   ============================================ */

import React, { forwardRef } from 'react';
import cx from '../_shared/cx';

const Container = forwardRef(function Container({ as: Tag = 'div', className, children, ...rest }, ref) {
  return (
    <Tag ref={ref} className={cx('ia-container', className)} {...rest}>
      {children}
    </Tag>
  );
});

export default Container;
