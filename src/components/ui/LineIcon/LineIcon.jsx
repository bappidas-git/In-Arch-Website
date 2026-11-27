/* ============================================
   LineIcon — a content icon from public/images/inarch/icons/
   --------------------------------------------
   <LineIcon name="service-e02-interiors" size={48} />

   The illustrative icons for services, process steps and statuses
   (prompt 02): ink in currentColor, one accent stroke in
   --ia-accent-display. They must be inline to follow the tone, so the file
   is fetched once per name, cached for the session, and written into the
   span. Each is our own generated SVG on the same origin
   (scripts/build-icons.js); anything that is not an <svg> is ignored.

   Decorative by default; pass `title` when the icon carries meaning on its
   own. Also the static fallback inside LottieIcon. The kit's UI glyphs
   (arrows, close, phone …) are `Icon`, not this.
   ============================================ */

import React, { forwardRef, useEffect, useState } from 'react';
import cx from '../_shared/cx';
import styles from './LineIcon.module.css';

const requests = new Map();
const texts = new Map();

export const lineIconUrl = (name) => `/images/inarch/icons/${name}.svg`;

const clean = (text) => {
  const trimmed = String(text || '').trim();
  if (!/^<svg[\s>]/i.test(trimmed)) return '';
  return trimmed.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/\son\w+="[^"]*"/gi, '');
};

const loadIcon = (name) => {
  const url = lineIconUrl(name);
  if (!requests.has(url)) {
    requests.set(
      url,
      fetch(url)
        .then((r) => (r.ok ? r.text() : ''))
        .then((text) => {
          const svg = clean(text);
          texts.set(url, svg);
          return svg;
        })
        .catch(() => '')
    );
  }
  return requests.get(url);
};

const LineIcon = forwardRef(function LineIcon({ name, size = 48, title, className, style, ...rest }, ref) {
  const [svg, setSvg] = useState(() => texts.get(lineIconUrl(name)) || '');

  useEffect(() => {
    const cached = texts.get(lineIconUrl(name));
    if (cached !== undefined) {
      setSvg(cached);
      return undefined;
    }
    if (typeof fetch !== 'function') return undefined;
    let live = true;
    loadIcon(name).then((text) => live && setSvg(text));
    return () => {
      live = false;
    };
  }, [name]);

  return (
    <span
      ref={ref}
      className={cx(styles.icon, className)}
      style={{ width: size, height: size, ...style }}
      role={title ? 'img' : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      data-line-icon={name}
      // Our own generated file, same origin, checked by `clean` above.
      dangerouslySetInnerHTML={{ __html: svg }}
      {...rest}
    />
  );
});

export default LineIcon;
