/* ============================================
   Frame — the box a photograph sits in
   --------------------------------------------
   <Frame ratio="4/5" reveal parallax>
     <Picture image="home-intro" sizes="(min-width: 1024px) 40vw, 100vw" />
   </Frame>

   An aspect-ratio box with overflow hidden. The picture fills it with
   object-fit: cover, over the tone's placeholder fill.

   | prop     | effect                                                         |
   |----------|----------------------------------------------------------------|
   | ratio    | 4/5 · 3/2 · 16/9 · 21/9 · 1/1 (default 4/5)                    |
   | reveal   | data-m="shutter" + the cover: inside a useMotionScope section  |
   |          | the cover slides away while the image settles 1.12 → 1         |
   | parallax | data-m-parallax: the image drifts while the frame crosses the  |
   |          | viewport. The image is rendered 14 % taller (7 % above and     |
   |          | below) and the drift is capped at 6 % of its own height        |
   |          | (6 × 1.14 = 6.84 % of the frame), so no edge ever shows; the   |
   |          | motion hook caps it further, at 4 %, below 1024 px.            |
   |          | `true` = 6, or pass a smaller number.                          |
   | arch     | fully rounded top — reserved for the Interior Design page      |

   The cover rests OFF the image in CSS and the motion hook moves it over
   the picture before revealing, so without JavaScript or under reduced
   motion the photograph is simply there.
   ============================================ */

import React, { forwardRef } from 'react';
import cx from '../_shared/cx';
import { devWarn } from '../_shared/dev';
import styles from './Frame.module.css';

export const RATIOS = ['4/5', '3/2', '16/9', '21/9', '1/1'];
const PARALLAX_MAX = 6;

const Frame = forwardRef(function Frame(
  { as: Tag = 'div', ratio = '4/5', reveal = false, parallax = false, arch = false, className, style, children, ...rest },
  ref
) {
  if (!RATIOS.includes(ratio)) devWarn(`Frame: ratio "${ratio}" is not one of ${RATIOS.join(', ')}.`);
  const amount =
    parallax === true ? PARALLAX_MAX : typeof parallax === 'number' ? Math.max(0, Math.min(parallax, PARALLAX_MAX)) : 0;

  return (
    <Tag
      ref={ref}
      className={cx(styles.frame, arch && styles.arch, amount > 0 && styles.drift, className)}
      style={{ '--frame-ratio': String(ratio).replace('/', ' / '), ...style }}
      data-m={reveal ? 'shutter' : undefined}
      data-m-parallax={amount > 0 ? amount : undefined}
      {...rest}
    >
      <div className={styles.media} data-m-media="">
        {children}
      </div>
      {reveal && <span className={styles.cover} data-m-cover="" aria-hidden="true" />}
    </Tag>
  );
});

export default Frame;
