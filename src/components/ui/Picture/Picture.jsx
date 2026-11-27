/* ============================================
   Picture — every photograph on the site
   --------------------------------------------
   <Picture image="home-intro" sizes="(min-width: 1024px) 40vw, 100vw" />
   <Picture
     image="home-hero-wide"
     art={[{ media: '(max-width: 767px)', image: 'home-hero-tall' }]}
     sizes="100vw"
     priority
   />

   Reads one key of src/data/imageManifest.json (through src/data/images.js)
   and renders <picture> with AVIF and WebP <source>s and a JPEG <img>
   carrying srcset, sizes, width and height (so the box is reserved before
   the file arrives).

   | prop     | meaning                                                      |
   |----------|--------------------------------------------------------------|
   | image    | manifest key (an unknown key throws in development)          |
   | sizes    | required — the rendered width per breakpoint                 |
   | priority | eager + fetchpriority="high" (the first-screen image only);  |
   |          | otherwise loading="lazy" + decoding="async"                  |
   | alt      | overrides the manifest's alt text; alt="" for decoration     |
   | art      | [{ media, image, sizes? }] — art-directed crops, emitted as  |
   |          | extra <source media> sets (with their own width / height)    |
   |          | ahead of the default ones; the first match wins              |

   The manifest's blurred placeholder is the <picture>'s background. The
   image fades in over 400 ms once decoded; an image that is already
   complete (cached) shows at once, and under reduced motion there is no
   fade. In development it warns when `sizes` is missing or no alt text
   exists. The ref and unknown props go to the <picture>; `imgClassName`
   styles the <img>.
   ============================================ */

import React, { forwardRef, useRef, useState } from 'react';
import { image as imageEntry, srcSet } from '../../../data/images';
import cx from '../_shared/cx';
import { devWarn } from '../_shared/dev';
import { useIsoLayoutEffect } from '../_shared/refs';
import styles from './Picture.module.css';

const FORMATS = [
  ['avif', 'image/avif'],
  ['webp', 'image/webp'],
];

/** The JPEG for the plain `src`: 1080 px if there is one, else the largest ≤ 1440. */
export const fallbackSrc = (entry) => {
  const jpgs = entry.sources.jpg;
  const exact = jpgs.find((s) => s.w === 1080);
  if (exact) return exact.src;
  const under = jpgs.filter((s) => s.w <= 1440);
  return (under.length ? under[under.length - 1] : jpgs[0]).src;
};

const Picture = forwardRef(function Picture(
  { image: key, sizes, priority = false, alt, art, className, imgClassName, style, onLoad, onError, ...rest },
  ref
) {
  const entry = imageEntry(key);
  const imgRef = useRef(null);
  // 'idle'    — rendered, not yet checked (visible: no flash for cached files)
  // 'pending' — still downloading: hidden over the placeholder
  // 'loaded'  — decoded: fades in
  const [state, setState] = useState('idle');

  useIsoLayoutEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    setState(img.complete && img.naturalWidth > 0 ? 'loaded' : 'pending');
  }, [key]);

  if (!entry) return null;

  if (!sizes) devWarn(`Picture "${key}": \`sizes\` is required (the rendered width per breakpoint).`);
  if (alt === undefined && !entry.alt) devWarn(`Picture "${key}": no alt text in the manifest and no \`alt\` passed (use alt="" for decoration).`);

  const handleLoad = (event) => {
    const img = event.currentTarget;
    const done = () => setState('loaded');
    if (typeof img.decode === 'function') img.decode().then(done, done);
    else done();
    if (onLoad) onLoad(event);
  };

  const handleError = (event) => {
    setState('loaded'); // show the alt text rather than an invisible box
    if (onError) onError(event);
  };

  const artSets = (art || [])
    .map((a) => ({ ...a, entry: imageEntry(a.image) }))
    .filter((a) => a.entry);

  return (
    <picture
      ref={ref}
      className={cx(styles.picture, className)}
      data-state={state}
      style={{ backgroundImage: entry.placeholder ? `url("${entry.placeholder}")` : undefined, ...style }}
      {...rest}
    >
      {artSets.map((a) =>
        [...FORMATS, ['jpg', 'image/jpeg']].map(([format, type]) => (
          <source
            key={`${a.image}-${format}`}
            media={a.media}
            type={type}
            srcSet={srcSet(a.entry, format)}
            sizes={a.sizes || sizes}
            width={a.entry.width}
            height={a.entry.height}
          />
        ))
      )}
      {FORMATS.map(([format, type]) => (
        <source key={format} type={type} srcSet={srcSet(entry, format)} sizes={sizes} />
      ))}
      <img
        ref={imgRef}
        className={cx(styles.img, imgClassName)}
        src={fallbackSrc(entry)}
        srcSet={srcSet(entry, 'jpg')}
        sizes={sizes}
        width={entry.width}
        height={entry.height}
        alt={alt !== undefined ? alt : entry.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? undefined : 'async'}
        fetchpriority={priority ? 'high' : undefined}
        onLoad={handleLoad}
        onError={handleError}
      />
    </picture>
  );
});

export default Picture;
