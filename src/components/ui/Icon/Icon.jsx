/* ============================================
   Icon — the kit's UI glyphs
   --------------------------------------------
   <Icon name="arrow-up-right" size={16} />
   <Icon name="phone" title="Call" />          (meaningful on its own)

   One module holds every glyph (the "sprite"): drawn on a 24 px grid with a
   1.5 px round-capped stroke in currentColor. Each <Icon> renders its own
   small inline <svg> from that source, so nothing is injected into the
   document and the icons follow the text colour and the tone.
   `vector-effect: non-scaling-stroke` keeps the stroke at 1.5 CSS px at
   every size, like the content icons from prompt 02.

   Decorative by default (aria-hidden). Pass `title` only when the icon is
   the sole content of something that needs a name — and prefer an
   accessible name on the control itself (IconButton's `label`).

   WhatsApp uses the generic `chat` glyph beside the word "WhatsApp"; the
   WhatsApp logo is never redrawn or recoloured.

   The content icons for services and process (public/images/inarch/icons/)
   are a separate, illustrative set: see LineIcon and LottieIcon.
   ============================================ */

import React, { forwardRef } from 'react';
import cx from '../_shared/cx';
import { devWarn } from '../_shared/dev';
import styles from './Icon.module.css';

const p = (d) => ({ d });
const circle = (cx, cy, r) => ({ circle: [cx, cy, r] });
const dot = (cx, cy) => ({ dot: [cx, cy, 0.9] });

/** The sprite: every glyph as path / circle data on the 24 px grid. */
export const GLYPHS = {
  'arrow-up-right': [p('M7 17L17 7'), p('M8.5 7H17V15.5')],
  'arrow-right': [p('M4.5 12H19.5'), p('M13.5 6L19.5 12L13.5 18')],
  'arrow-left': [p('M19.5 12H4.5'), p('M10.5 6L4.5 12L10.5 18')],
  'arrow-down': [p('M12 4.5V19.5'), p('M6 13.5L12 19.5L18 13.5')],
  'arrow-up': [p('M12 19.5V4.5'), p('M6 10.5L12 4.5L18 10.5')],
  'chevron-down': [p('M6.5 9.5L12 15L17.5 9.5')],
  plus: [p('M12 5V19'), p('M5 12H19')],
  minus: [p('M5 12H19')],
  close: [p('M6.5 6.5L17.5 17.5'), p('M17.5 6.5L6.5 17.5')],
  menu: [p('M4 9H20'), p('M4 15H20')],
  phone: [
    p(
      'M8.2 3.5H5.6C4.4 3.5 3.5 4.5 3.6 5.7C4.3 13.5 10.5 19.7 18.3 20.4C19.5 20.5 20.5 19.6 20.5 18.4V15.8C20.5 15.3 20.2 14.9 19.7 14.8L16.4 13.9C16 13.8 15.6 13.9 15.3 14.2L13.9 15.6C11.4 14.3 9.7 12.6 8.4 10.1L9.8 8.7C10.1 8.4 10.2 8 10.1 7.6L9.2 4.3C9.1 3.8 8.7 3.5 8.2 3.5Z'
    ),
  ],
  chat: [
    p(
      'M5 4.5H19C19.83 4.5 20.5 5.17 20.5 6V15C20.5 15.83 19.83 16.5 19 16.5H11L6.5 20V16.5H5C4.17 16.5 3.5 15.83 3.5 15V6C3.5 5.17 4.17 4.5 5 4.5Z'
    ),
  ],
  mail: [
    p('M5 5.5H19C19.83 5.5 20.5 6.17 20.5 7V17C20.5 17.83 19.83 18.5 19 18.5H5C4.17 18.5 3.5 17.83 3.5 17V7C3.5 6.17 4.17 5.5 5 5.5Z'),
    p('M4 7L12 13L20 7'),
  ],
  pin: [
    p('M12 21C12 21 5.5 14.9 5.5 9.75C5.5 6.16 8.41 3.25 12 3.25C15.59 3.25 18.5 6.16 18.5 9.75C18.5 14.9 12 21 12 21Z'),
    circle(12, 9.75, 2.5),
  ],
  clock: [circle(12, 12, 8.5), p('M12 7.5V12L15 14')],
  check: [p('M5 12.5L9.5 17L19 7.5')],
  alert: [circle(12, 12, 8.5), p('M12 7.5V13'), dot(12, 16.25)],
  info: [circle(12, 12, 8.5), p('M12 11V16.5'), dot(12, 7.75)],
  external: [
    p('M18 13.5V18C18 18.83 17.33 19.5 16.5 19.5H6C5.17 19.5 4.5 18.83 4.5 18V7.5C4.5 6.67 5.17 6 6 6H10.5'),
    p('M14 4.5H19.5V10'),
    p('M19.5 4.5L11 13'),
  ],
};

export const ICON_NAMES = Object.keys(GLYPHS);

/**
 * Direction an arrow leaves in when it swaps ([x, y] in box widths);
 * null for glyphs that do not travel.
 */
export const swapVector = (name) =>
  ({
    'arrow-up-right': [1, -1],
    external: [1, -1],
    'arrow-right': [1, 0],
    'arrow-left': [-1, 0],
    'arrow-down': [0, 1],
    'arrow-up': [0, -1],
  }[name] || null);

const Shape = ({ shape }) => {
  if (shape.d) return <path d={shape.d} vectorEffect="non-scaling-stroke" />;
  if (shape.circle) {
    const [x, y, r] = shape.circle;
    return <circle cx={x} cy={y} r={r} vectorEffect="non-scaling-stroke" />;
  }
  const [x, y, r] = shape.dot;
  return <circle cx={x} cy={y} r={r} fill="currentColor" stroke="none" />;
};

const Icon = forwardRef(function Icon({ name, size = 24, title, className, ...rest }, ref) {
  const glyph = GLYPHS[name];
  if (!glyph) {
    devWarn(`Icon: unknown name "${name}". Known: ${ICON_NAMES.join(', ')}.`);
    return null;
  }
  return (
    <svg
      ref={ref}
      className={cx(styles.icon, className)}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title || undefined}
      data-icon={name}
      {...rest}
    >
      {title && <title>{title}</title>}
      {glyph.map((shape, i) => (
        <Shape key={i} shape={shape} />
      ))}
    </svg>
  );
});

export default Icon;
