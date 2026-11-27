/* ============================================
   Field — label, hint and error around one control
   --------------------------------------------
   <Field label="Full name" required error={errors.name}>
     <TextInput name="name" autoComplete="name" value={…} onChange={…} />
   </Field>

   <Field label="Budget" group optional hint="A range is enough.">
     <ChoiceChips name="budget" options={…} value={…} onChange={…} />
   </Field>

   - A visible label above the control (Manrope 600, 13 px, sentence case);
     never a placeholder standing in for a label.
   - `hint` and `error` are wired to the control with aria-describedby; an
     error also sets aria-invalid and shows the `alert` icon, so the state is
     never carried by colour alone.
   - `required`: a terracotta asterisk for sighted users and the word
     "required" for assistive technology; the control gets
     aria-required="true" (not the native attribute, so no browser bubble
     competes with the form's own validation). `optional` prints "optional".
     Both words can be replaced (`requiredText`, `optionalText`).
   - `group` renders <fieldset> + <legend> for a set of radios / chips; the
     description and invalid state then sit on the fieldset.

   The controls (TextInput, TextArea, SelectInput, ChoiceChips) read their
   id and ARIA wiring from this Field through context, so they need no
   extra props. Outside a Field they work as plain controls.
   ============================================ */

import React, { createContext, forwardRef, useContext, useId } from 'react';
import cx from '../_shared/cx';
import Icon from '../Icon/Icon';
import styles from './Field.module.css';

const FieldContext = createContext(null);

/** The surrounding Field's wiring, or null outside a Field. */
export const useField = () => useContext(FieldContext);

/**
 * Merge a control's own props with the Field's wiring. Used by every control.
 * Explicit props win, except aria-describedby, which is concatenated.
 */
export const useFieldControl = ({ id, 'aria-describedby': describedBy, 'aria-invalid': invalid, ...rest }) => {
  const field = useField();
  if (!field || field.group) {
    return { id, 'aria-describedby': describedBy, 'aria-invalid': invalid, ...rest };
  }
  const merged = [field.describedBy, describedBy].filter(Boolean).join(' ') || undefined;
  return {
    id: id || field.id,
    'aria-describedby': merged,
    'aria-invalid': invalid !== undefined ? invalid : field.invalid ? 'true' : undefined,
    'aria-required': field.required ? 'true' : undefined,
    ...rest,
  };
};

const Field = forwardRef(function Field(
  {
    label,
    hint,
    error,
    required = false,
    optional = false,
    requiredText = 'required',
    optionalText = 'optional',
    group = false,
    id: controlId,
    className,
    children,
    ...rest
  },
  ref
) {
  const auto = useId();
  const id = controlId || `ia-field-${auto.replace(/:/g, '')}`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = `${id}-error`;
  const invalid = Boolean(error);
  const describedBy = [hintId, invalid && errorId].filter(Boolean).join(' ') || undefined;

  const Root = group ? 'fieldset' : 'div';
  const LabelTag = group ? 'legend' : 'label';

  const marker = required ? (
    <>
      <span className={styles.asterisk} aria-hidden="true">
        *
      </span>
      <span className="ia-visually-hidden"> {requiredText}</span>
    </>
  ) : optional ? (
    <span className={styles.optional}> {optionalText}</span>
  ) : null;

  return (
    <Root
      ref={ref}
      className={cx(styles.field, group && styles.group, invalid && styles.invalid, className)}
      aria-describedby={group ? describedBy : undefined}
      aria-invalid={group && invalid ? 'true' : undefined}
      {...rest}
    >
      <LabelTag className={styles.label} htmlFor={group ? undefined : id} id={`${id}-label`}>
        {label}
        {marker}
      </LabelTag>
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      <FieldContext.Provider value={{ id, describedBy, invalid, required, group, labelId: `${id}-label` }}>
        {children}
      </FieldContext.Provider>
      <p id={errorId} className={styles.error} hidden={!invalid}>
        {invalid && (
          <>
            <Icon name="alert" size={16} className={styles.errorIcon} />
            <span>{error}</span>
          </>
        )}
      </p>
    </Root>
  );
});

export default Field;
