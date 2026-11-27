/* ============================================
   Grid + Col — the 4 / 8 / 12 column grid
   --------------------------------------------
   Grid is `.ia-grid`: 4 columns / 16 px gap below 768, 8 / 24 px from 768,
   12 / 32 px from 1024, 40 px gap from 1440.

   Col declares its placement in markup, mobile first. Each level inherits
   from the one below unless it says otherwise:

     <Grid>
       <Col span="full" lg={{ start: 1, span: 5 }}>…</Col>
       <Col span={4} md={{ start: 2, span: 6 }} lg={{ start: 7, span: 6 }} xl={{ start: 8, span: 5 }}>…</Col>
     </Grid>

   | prop    | min-width | value                                               |
   |---------|-----------|-----------------------------------------------------|
   | span    | base      | number of columns, or "full" (1 / -1). Default full |
   | start   | base      | first column (1-based); omitted = auto placement   |
   | md      | 768       | a number (span) or { span, start }                  |
   | lg      | 1024      | 〃                                                  |
   | xl      | 1280      | 〃                                                  |

   The resolved values are written as custom properties (--ia-col,
   --ia-col-md, --ia-col-lg, --ia-col-xl), so the asymmetric editorial
   layouts are plain markup and need no per-page CSS.
   `align` sets align-self (start | center | end | stretch).
   ============================================ */

import React, { forwardRef } from 'react';
import cx from '../_shared/cx';
import styles from './Grid.module.css';

const LEVELS = ['md', 'lg', 'xl'];

const normalise = (value) => {
  if (value === undefined || value === null) return {};
  if (typeof value === 'number' || value === 'full') return { span: value };
  return value;
};

const placement = ({ span, start }) => {
  if (span === 'full' || span === undefined) return start ? `${start} / -1` : '1 / -1';
  return `${start || 'auto'} / span ${span}`;
};

/**
 * { '--ia-col': '1 / -1', '--ia-col-md': '1 / -1', '--ia-col-lg': '7 / span 6', … }
 * Every level is written, resolved, even when it only repeats the level
 * below: custom properties inherit, so a Col nested in another Col's grid
 * must never pick up its parent's values. Exported for tests and the Lab.
 */
export const colVars = ({ span = 'full', start, md, lg, xl }) => {
  const given = { md, lg, xl };
  let current = { span, start };
  const vars = { '--ia-col': placement(current) };
  LEVELS.forEach((level) => {
    if (given[level] !== undefined) current = { ...current, ...normalise(given[level]) };
    vars[`--ia-col-${level}`] = placement(current);
  });
  return vars;
};

export const Col = forwardRef(function Col(
  { as: Tag = 'div', span, start, md, lg, xl, align, className, style, children, ...rest },
  ref
) {
  return (
    <Tag
      ref={ref}
      className={cx(styles.col, align && styles[`align-${align}`], className)}
      style={{ ...colVars({ span, start, md, lg, xl }), ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
});

const Grid = forwardRef(function Grid({ as: Tag = 'div', className, children, ...rest }, ref) {
  return (
    <Tag ref={ref} className={cx('ia-grid', className)} {...rest}>
      {children}
    </Tag>
  );
});

export default Grid;
