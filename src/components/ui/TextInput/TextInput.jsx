/* ============================================
   TextInput — a single-line field
   --------------------------------------------
   <Field label="Mobile number" required error={…}>
     <TextInput name="mobile" type="tel" inputMode="numeric" autoComplete="tel-national" … />
   </Field>

   Min-height 52 px, padding 14 × 16 px, 16 px text (no iOS zoom), surface
   --ia-field-bg (paper on light tones, forest-2 on dark), 1 px
   --ia-line-strong border, 2 px radius. Focus: accent border plus the
   standard ring. Error (from the Field, or aria-invalid): the error colour
   border; the Field prints the message with an icon. Every other prop goes
   to the <input>.
   ============================================ */

import React, { forwardRef } from 'react';
import cx from '../_shared/cx';
import { useFieldControl } from '../Field/Field';
import control from '../_shared/Control.module.css';

const TextInput = forwardRef(function TextInput({ type = 'text', className, ...props }, ref) {
  const wired = useFieldControl(props);
  return <input ref={ref} type={type} className={cx(control.control, className)} {...wired} />;
});

export default TextInput;
