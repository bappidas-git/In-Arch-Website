/* ============================================
   Chip — a filter toggle or a quick choice
   --------------------------------------------
   <Chip pressed={active === 'all'} count={7} onClick={…}>All</Chip>        filter toggle
   <Chip onClick={() => openLeadModal(…)}>Interior Design</Chip>             plain action

   A <button>, ≥ 44 px tall, 1 px border. With `pressed` (true / false) it is
   a toggle: aria-pressed, and the pressed chip is filled (--ia-fg on
   --ia-bg). Without it, no aria-pressed — a one-off action. `count` is shown
   after the label and read with it ("Interior Design 4"). Hover (fine
   pointers) / focus-visible: the border darkens to --ia-fg; press: 0.98.
   `to` / `href` render a link; a "pressed" link is marked aria-current.
   ============================================ */

import React, { forwardRef } from 'react';
import cx from '../_shared/cx';
import { useAction } from '../_shared/action';
import styles from './Chip.module.css';

const Chip = forwardRef(function Chip(
  { pressed, count, to, href, type, disabled = false, onClick, className, children, 'aria-disabled': ariaDisabled, ...rest },
  ref
) {
  const { Tag, props, inactive } = useAction({ to, href, type, disabled, onClick, ariaDisabled });
  const isLink = to !== undefined || href !== undefined;
  const state = {};
  if (pressed !== undefined) {
    if (isLink) state['aria-current'] = pressed ? 'true' : undefined;
    else state['aria-pressed'] = Boolean(pressed);
  }

  return (
    <Tag
      ref={ref}
      className={cx(styles.chip, pressed && styles.on, inactive ? styles.inactive : styles.enabled, className)}
      {...props}
      {...state}
      {...rest}
    >
      <span>{children}</span>
      {count !== undefined && count !== null && <span className={styles.count}>{count}</span>}
    </Tag>
  );
});

export default Chip;
