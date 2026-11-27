/* ============================================
   SelectInput — a native <select> in the field box
   --------------------------------------------
   <Field label="Interested in" required>
     <SelectInput name="service" placeholder="Choose a service" options={serviceTitles} value={…} onChange={…} />
   </Field>

   Native <select> (so phones get their own picker) with the box of
   TextInput and a custom chevron. `options` is a list of strings or
   { value, label } objects; `<option>` children also work. `placeholder`
   adds a first, empty, disabled option that is shown until a choice is made.

   Like the other controls, the ref and every other prop go to the control
   itself (the <select>); `className` styles the wrapper that holds the
   chevron.
   ============================================ */

import React, { forwardRef, useState } from 'react';
import cx from '../_shared/cx';
import Icon from '../Icon/Icon';
import { useFieldControl } from '../Field/Field';
import control from '../_shared/Control.module.css';
import styles from './SelectInput.module.css';

const toOption = (option) => (typeof option === 'string' ? { value: option, label: option } : option);

const SelectInput = forwardRef(function SelectInput(
  { options, placeholder, className, children, onChange, ...props },
  ref
) {
  const wired = useFieldControl(props);
  const controlled = wired.value !== undefined;
  // Uncontrolled: remember whether a real option has been chosen yet.
  const [chosen, setChosen] = useState(() => Boolean(wired.defaultValue));
  const empty = controlled ? wired.value === '' : !chosen;
  const handleChange = (event) => {
    if (!controlled) setChosen(event.target.value !== '');
    if (onChange) onChange(event);
  };
  return (
    <span className={cx(styles.wrap, className)}>
      <select
        ref={ref}
        className={cx(control.control, styles.select, placeholder && empty && styles.showingPlaceholder)}
        {...(placeholder && !controlled && wired.defaultValue === undefined ? { defaultValue: '' } : null)}
        {...wired}
        onChange={handleChange}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options
          ? options.map(toOption).map((o) => (
              <option key={o.value} value={o.value} disabled={o.disabled}>
                {o.label}
              </option>
            ))
          : children}
      </select>
      <Icon name="chevron-down" size={20} className={styles.chevron} />
    </span>
  );
});

export default SelectInput;
