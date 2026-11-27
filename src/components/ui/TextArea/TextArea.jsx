/* ============================================
   TextArea — a field that grows with its content
   --------------------------------------------
   <Field label="Tell us about your space" optional>
     <TextArea name="message" maxLength={500} value={…} onChange={…} />
   </Field>

   The same box as TextInput. It starts at `rows` lines (default 4) and
   grows with the text up to `maxRows` (default 12), then scrolls. Growth is
   measured from scrollHeight on every change, so it works controlled or
   uncontrolled and in every browser (no reliance on `field-sizing`).
   ============================================ */

import React, { forwardRef, useCallback, useRef } from 'react';
import cx from '../_shared/cx';
import { useIsoLayoutEffect, useMergedRef } from '../_shared/refs';
import { useFieldControl } from '../Field/Field';
import control from '../_shared/Control.module.css';
import styles from './TextArea.module.css';

const TextArea = forwardRef(function TextArea(
  { rows = 4, maxRows = 12, className, style, onInput, ...props },
  forwardedRef
) {
  const local = useRef(null);
  const ref = useMergedRef(forwardedRef, local);
  const wired = useFieldControl(props);

  const fit = useCallback(() => {
    const el = local.current;
    if (!el || typeof window === 'undefined') return;
    const cs = window.getComputedStyle(el);
    const line = parseFloat(cs.lineHeight) || 22;
    const chrome =
      parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
    const max = line * maxRows + chrome;
    el.style.height = 'auto';
    const needed = el.scrollHeight + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
    el.style.height = `${Math.min(needed, max)}px`;
    el.style.overflowY = needed > max ? 'auto' : 'hidden';
  }, [maxRows]);

  // Controlled: re-fit whenever the value changes (including resets).
  useIsoLayoutEffect(() => {
    fit();
  }, [fit, props.value]);

  const handleInput = (event) => {
    fit();
    if (onInput) onInput(event);
  };

  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cx(control.control, styles.area, className)}
      style={style}
      onInput={handleInput}
      {...wired}
    />
  );
});

export default TextArea;
