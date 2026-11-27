/* ============================================
   Section — one band of a page
   --------------------------------------------
   <Section tone="dark" rhythm="compact" id="work" minHeight="screen">…</Section>

   | prop      | values                                   | effect                              |
   |-----------|------------------------------------------|-------------------------------------|
   | tone      | light · sand · paper · dark              | data-tone: switches every tone      |
   |           |                                          | variable and paints the background |
   | rhythm    | default · compact · none                 | padding-block: --ia-section-y (80 → |
   |           |                                          | 192 px) · --ia-section-y-sm · 0     |
   | minHeight | "screen"                                 | min-height: 100svh (never 100vh)    |
   | as        | any element, default <section>           |                                     |

   Must sit inside an `.ia` scope. A <section> is only a landmark when it is
   named, so pass `aria-labelledby` (the heading's id) when it should be one.
   ============================================ */

import React, { forwardRef } from 'react';
import cx from '../_shared/cx';
import styles from './Section.module.css';

const Section = forwardRef(function Section(
  { as: Tag = 'section', tone, rhythm = 'default', minHeight, className, children, ...rest },
  ref
) {
  return (
    <Tag
      ref={ref}
      data-tone={tone}
      className={cx(styles.band, styles[`rhythm-${rhythm}`], minHeight === 'screen' && styles.screen, className)}
      {...rest}
    >
      {children}
    </Tag>
  );
});

export default Section;
