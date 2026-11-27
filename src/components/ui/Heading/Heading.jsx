/* ============================================
   Heading — Fraunces display headings
   --------------------------------------------
   <Heading as="h1" size="2xl" lines>
     Designing spaces, <em>shaping experiences.</em>
   </Heading>

   | prop  | values                      | default |
   |-------|-----------------------------|---------|
   | as    | h1 · h2 · h3 · h4           | h2      |
   | size  | 2xl · xl · lg · md · sm     | lg      |
   | lines | adds data-m="lines" (headline lines rise through masks inside a
   |       | useMotionScope section)                |

   The one accent phrase is passed as <em> and set italic in
   --ia-accent-display (terracotta-500 on light tones, -300 on dark).
   In development it warns when more than one <em> is supplied, and when the
   accent renders below 24 px on a light tone (terracotta-500 only reaches
   3.75:1 there — large text only). `size="sm"` is 22 px below a 600 px
   viewport, so keep the accent out of small headings on light tones.
   ============================================ */

import React, { Children, forwardRef, isValidElement, useEffect, useRef } from 'react';
import cx from '../_shared/cx';
import { devWarn, isDev } from '../_shared/dev';
import { useMergedRef } from '../_shared/refs';
import { isDarkTone, toneOf } from '../_shared/tone';
import styles from './Heading.module.css';

const LEVELS = ['h1', 'h2', 'h3', 'h4'];
const SIZES = ['2xl', 'xl', 'lg', 'md', 'sm'];

/** Count <em> elements anywhere in a React children tree. */
export const countEm = (children) => {
  let count = 0;
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === 'em') count += 1;
    if (child.props && child.props.children) count += countEm(child.props.children);
  });
  return count;
};

const Heading = forwardRef(function Heading(
  { as = 'h2', size = 'lg', lines = false, className, children, ...rest },
  forwardedRef
) {
  const local = useRef(null);
  const ref = useMergedRef(forwardedRef, local);
  const Tag = LEVELS.includes(as) ? as : 'h2';
  const step = SIZES.includes(size) ? size : 'lg';

  if (isDev) {
    if (!LEVELS.includes(as)) devWarn(`Heading: as="${as}" is not one of ${LEVELS.join(', ')}.`);
    if (countEm(children) > 1) devWarn('Heading: one italic accent phrase per headline — more than one <em> was supplied.');
  }

  useEffect(() => {
    if (!isDev || !local.current || typeof window === 'undefined') return;
    const em = local.current.querySelector('em');
    if (!em) return;
    const px = parseFloat(window.getComputedStyle(em).fontSize);
    if (px && px < 24 && !isDarkTone(toneOf(local.current).tone)) {
      devWarn(
        `Heading: the accent phrase renders at ${px.toFixed(1)} px on a light tone; terracotta-500 needs ≥ 24 px (3.75:1). Use a larger size or drop the <em>.`
      );
    }
  });

  return (
    <Tag
      ref={ref}
      className={cx(`ia-t-display-${step}`, styles.heading, className)}
      data-m={lines ? 'lines' : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
});

export default Heading;
