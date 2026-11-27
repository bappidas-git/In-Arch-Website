/* ============================================
   ChoiceChips — a radio group drawn as chips
   --------------------------------------------
   <Field label="Budget" group optional>
     <ChoiceChips name="budget" options={budgetOptions} value={budget} onChange={(e) => setBudget(e.target.value)} />
   </Field>

   Real <input type="radio">s under the chips, so the browser provides the
   radio behaviour: Tab enters the group at the chosen chip, the arrow keys
   move the selection, Space selects. Chips are ≥ 44 px tall with a 1 px
   border; the chosen chip is filled (--ia-fg / --ia-bg) and carries a tick,
   so the state does not rely on colour.

   `options`: strings or { value, label, disabled }. Controlled with
   `value` + `onChange(event)`, or uncontrolled with `defaultValue`.
   Inside a `<Field group>` the fieldset names the group; standalone, pass
   `aria-label` (it then renders role="radiogroup").
   ============================================ */

import React, { forwardRef } from 'react';
import cx from '../_shared/cx';
import Icon from '../Icon/Icon';
import { useField } from '../Field/Field';
import styles from './ChoiceChips.module.css';

const toOption = (option) => (typeof option === 'string' ? { value: option, label: option } : option);

const ChoiceChips = forwardRef(function ChoiceChips(
  { name, options = [], value, defaultValue, onChange, disabled = false, className, ...rest },
  ref
) {
  const field = useField();
  const inGroup = Boolean(field && field.group);
  const controlled = value !== undefined;

  return (
    <div
      ref={ref}
      className={cx(styles.chips, field && field.invalid && styles.invalid, className)}
      role={inGroup ? undefined : 'radiogroup'}
      {...rest}
    >
      {options.map(toOption).map((option) => {
        const checked = controlled ? value === option.value : undefined;
        return (
          <label key={option.value} className={cx(styles.chip, (disabled || option.disabled) && styles.off)}>
            <input
              type="radio"
              className={styles.input}
              name={name}
              value={option.value}
              checked={checked}
              defaultChecked={controlled ? undefined : defaultValue === option.value}
              onChange={onChange}
              disabled={disabled || option.disabled}
            />
            <span className={styles.face}>
              <Icon name="check" size={16} className={styles.tick} />
              <span>{option.label}</span>
            </span>
          </label>
        );
      })}
    </div>
  );
});

export default ChoiceChips;
