/* ============================================
   Illustration — one of the four unDraw drawings
   --------------------------------------------
   <Illustration name="nothing-here" size={160} title="Two blank clipboards" />
   <Illustration name="enquiry-sent" size={120} decorative />

   | name            | for                         | intrinsic   |
   |-----------------|-----------------------------|-------------|
   | not-found       | the 404 page                | 860 × 571   |
   | enquiry-sent    | the form's success state    | 670 × 800   |
   | nothing-here    | an empty portfolio filter   | 648 × 632   |
   | something-broke | the error state             | 800 × 430   |

   Every illustration needs either a `title` (its alt text) or the
   `decorative` flag (alt=""); in development it warns when it has neither.
   `size` is the rendered width in px (default: the intrinsic width, capped
   at the container). They are coloured for light surfaces — place them on
   ivory, sand or paper.
   ============================================ */

import React, { forwardRef } from 'react';
import cx from '../_shared/cx';
import { devWarn } from '../_shared/dev';
import styles from './Illustration.module.css';

export const ILLUSTRATIONS = {
  'not-found': { width: 860, height: 571 },
  'enquiry-sent': { width: 670, height: 800 },
  'nothing-here': { width: 648, height: 632 },
  'something-broke': { width: 800, height: 430 },
};

const Illustration = forwardRef(function Illustration(
  { name, title, decorative = false, size, className, style, ...rest },
  ref
) {
  const art = ILLUSTRATIONS[name];
  if (!art) {
    devWarn(`Illustration: unknown name "${name}". Known: ${Object.keys(ILLUSTRATIONS).join(', ')}.`);
    return null;
  }
  if (!decorative && !title) devWarn(`Illustration "${name}": pass a \`title\` (its alt text) or \`decorative\`.`);

  return (
    <img
      ref={ref}
      className={cx(styles.art, className)}
      src={`/images/inarch/illustrations/${name}.svg`}
      width={art.width}
      height={art.height}
      alt={decorative ? '' : title || ''}
      loading="lazy"
      decoding="async"
      style={{ width: size ? `${size}px` : undefined, ...style }}
      {...rest}
    />
  );
});

export default Illustration;
