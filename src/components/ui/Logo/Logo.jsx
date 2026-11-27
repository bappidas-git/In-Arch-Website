/* ============================================
   Logo — the IN-ARCH brand files
   --------------------------------------------
   <Logo variant="lockup" height={48} />      (≥ 44 px tall)
   <Logo variant="wordmark" height={22} />    (below 44 px: no descriptor line)
   <Logo variant="mark" height={26} alt="" /> (the "IA" monogram)

   Picks the file from `studio.logos` (src/data/siteConfig.js) by tone:
   the espresso-ink files on light, sand and paper; the ivory-ink files on
   dark. `tone` defaults to the nearest `[data-tone]` (the same element the
   CSS tone variables come from) and follows it if it changes. The <img>
   gets its src only once the tone is known — before the first paint — so
   the wrong file is never requested.

   `alt` defaults to `studio.fullName`; pass alt="" when visible text beside
   it already names the studio. Intrinsic width / height are set from the
   file's ratio. The logo is never recoloured, outlined or stretched.
   In development it warns when the lockup is asked for below 44 px.
   ============================================ */

import React, { forwardRef, useRef } from 'react';
import { studio } from '../../../data/siteConfig';
import cx from '../_shared/cx';
import { devWarn } from '../_shared/dev';
import { useMergedRef } from '../_shared/refs';
import { isDarkTone, useNearestTone } from '../_shared/tone';
import styles from './Logo.module.css';

const ROLES = {
  lockup: { light: 'lockupOnLight', dark: 'lockupOnDark' },
  wordmark: { light: 'wordmarkOnLight', dark: 'wordmarkOnDark' },
  mark: { light: 'markOnLight', dark: 'markOnDark' },
};

/** The brand file for a variant on a tone (exported for tests and the Lab). */
export const logoFile = (variant, tone) => {
  const role = ROLES[variant] || ROLES.lockup;
  return studio.logos[isDarkTone(tone) ? role.dark : role.light];
};

const Logo = forwardRef(function Logo(
  { variant = 'lockup', height = 48, tone: forcedTone, alt = studio.fullName, className, style, ...rest },
  forwardedRef
) {
  const local = useRef(null);
  const ref = useMergedRef(forwardedRef, local);
  const tone = useNearestTone(local, forcedTone);

  if (variant === 'lockup' && height < 44) {
    devWarn(`Logo: the lockup's descriptor line is illegible below 44 px (asked for ${height} px). Use variant="wordmark".`);
  }

  const file = logoFile(variant, tone || 'light');
  const width = Math.round((height * file.width) / file.height);
  const srcSet = file.variants ? file.variants.map((v) => `${v.src} ${v.width}w`).join(', ') : undefined;

  return (
    <img
      ref={ref}
      className={cx(styles.logo, className)}
      src={tone ? file.src : undefined}
      srcSet={tone ? srcSet : undefined}
      sizes={tone && srcSet ? `${width}px` : undefined}
      width={width}
      height={height}
      alt={alt}
      decoding="async"
      data-logo-variant={variant}
      data-logo-tone={tone || undefined}
      style={{ height, width: 'auto', ...style }}
      {...rest}
    />
  );
});

export default Logo;
