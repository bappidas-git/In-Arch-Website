/* ============================================
   Design Lab — "Primitives": forms (development only)
   --------------------------------------------
   1. Every field state on all four tones (rest, filled, focus, error,
      disabled).
   2. A working form built only from the field primitives, with live
      validation (on blur, then on every change), the first invalid field
      focused on submit, a loading button and a success notice. It sends
      nothing: prompt 05 owns the real enquiry form.
   3. Notice in its three variants on every tone.
   ============================================ */

import React, { useRef, useState } from 'react';
import {
  Button,
  ChoiceChips,
  Field,
  Notice,
  SelectInput,
  TextArea,
  TextInput,
  TextLink,
} from '../../../components/ui';
import { serviceTitles, SOMETHING_ELSE } from '../../../data/services';
import { Block, FORCE, TONES, TonePanel } from './LabBits';
import styles from '../PrimitivesSection.module.css';

const SERVICE_OPTIONS = [...serviceTitles, SOMETHING_ELSE];
// Demo values only (owner decision D-09); prompt 05 moves them into the data layer.
const BUDGETS = ['Under ₹10 lakh', '₹10–25 lakh', '₹25–50 lakh', '₹50 lakh–₹1 crore', 'Above ₹1 crore', 'Not sure yet'];

const FieldStates = ({ tone }) => (
  <TonePanel tone={tone}>
    <div className={styles.fieldGrid}>
      <Field label="Full name" required hint="Rest, with a placeholder.">
        <TextInput name={`lab-${tone}-name`} placeholder="Your name" autoComplete="off" />
      </Field>
      <Field label="Full name" required hint="Filled.">
        <TextInput name={`lab-${tone}-filled`} defaultValue="Ananya Sinha" autoComplete="off" />
      </Field>
      <Field label="Mobile number" required hint="Focus (forced).">
        <TextInput name={`lab-${tone}-focus`} type="tel" defaultValue="98765" autoComplete="off" {...FORCE.focus} />
      </Field>
      <Field label="Mobile number" required error="Enter a 10-digit mobile number.">
        <TextInput name={`lab-${tone}-error`} type="tel" defaultValue="98765" autoComplete="off" />
      </Field>
      <Field label="Email" optional hint="Disabled.">
        <TextInput name={`lab-${tone}-disabled`} type="email" disabled defaultValue="name@example.com" />
      </Field>
      <Field label="Interested in" required error="Choose what you need help with.">
        <SelectInput name={`lab-${tone}-service`} placeholder="Choose a service" options={SERVICE_OPTIONS} />
      </Field>
      <Field label="Tell us about your space" optional hint="Grows with its content up to 12 lines.">
        <TextArea name={`lab-${tone}-message`} rows={3} defaultValue={'A three-bedroom flat.\nKitchen and living room first.'} />
      </Field>
      <Field label="Budget" group optional error={tone === 'dark' ? 'Choose a range (error state).' : undefined}>
        <ChoiceChips name={`lab-${tone}-budget`} options={BUDGETS.slice(0, 4)} defaultValue={BUDGETS[1]} />
      </Field>
    </div>
  </TonePanel>
);

const digits = (value) => {
  let d = String(value || '').replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('91')) d = d.slice(2);
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  return d;
};

const VALIDATORS = {
  name: (v) => (/^[\p{L}][\p{L} .'-]{1,79}$/u.test(v.trim()) ? '' : 'Enter your name (letters only).'),
  mobile: (v) => (/^[6-9]\d{9}$/.test(digits(v)) ? '' : 'Enter a 10-digit Indian mobile number.'),
  email: (v) => (!v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email address, or leave it empty.'),
  service: (v) => (v ? '' : 'Choose what you need help with.'),
  message: (v) => (v.length <= 500 ? '' : 'Keep the message under 500 characters.'),
};

const EMPTY = { name: '', mobile: '', email: '', service: '', budget: '', message: '' };

const LiveForm = () => {
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | invalid
  const formRef = useRef(null);

  const errorOf = (name) => (VALIDATORS[name] ? VALIDATORS[name](values[name]) : '');
  const shown = (name) => (touched[name] ? errorOf(name) : '');

  const update = (name) => (event) => {
    setValues((v) => ({ ...v, [name]: event.target.value }));
    if (status === 'sent' || status === 'invalid') setStatus('idle');
  };
  const blur = (name) => () => setTouched((t) => ({ ...t, [name]: true }));

  const submit = (event) => {
    event.preventDefault();
    const all = Object.keys(VALIDATORS).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(all);
    const firstInvalid = Object.keys(VALIDATORS).find((k) => VALIDATORS[k](values[k]));
    if (firstInvalid) {
      setStatus('invalid');
      const el = formRef.current && formRef.current.querySelector(`[name="lab-live-${firstInvalid}"]`);
      if (el) el.focus();
      return;
    }
    setStatus('sending');
    window.setTimeout(() => setStatus('sent'), 1200);
  };

  const reset = () => {
    setValues(EMPTY);
    setTouched({});
    setStatus('idle');
  };

  return (
    <form ref={formRef} className={styles.form} noValidate onSubmit={submit} aria-label="Demo enquiry form">
      <div className={styles.formRow}>
        <Field label="Full name" required error={shown('name')}>
          <TextInput name="lab-live-name" autoComplete="name" value={values.name} onChange={update('name')} onBlur={blur('name')} />
        </Field>
        <Field label="Mobile number" required hint="+91 and a leading 0 are removed." error={shown('mobile')}>
          <TextInput
            name="lab-live-mobile"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            value={values.mobile}
            onChange={update('mobile')}
            onBlur={blur('mobile')}
          />
        </Field>
      </div>
      <Field label="Email" optional error={shown('email')}>
        <TextInput name="lab-live-email" type="email" autoComplete="email" value={values.email} onChange={update('email')} onBlur={blur('email')} />
      </Field>
      <Field label="Interested in" required error={shown('service')}>
        <SelectInput
          name="lab-live-service"
          placeholder="Choose a service"
          options={SERVICE_OPTIONS}
          value={values.service}
          onChange={update('service')}
          onBlur={blur('service')}
        />
      </Field>
      <Field label="Budget" group optional hint="A range is enough.">
        <ChoiceChips name="lab-live-budget" options={BUDGETS} value={values.budget} onChange={update('budget')} />
      </Field>
      <Field label="Tell us about your space" optional hint={`${values.message.length} / 500 characters`} error={shown('message')}>
        <TextArea name="lab-live-message" value={values.message} onChange={update('message')} onBlur={blur('message')} />
      </Field>
      {status === 'invalid' && (
        <Notice variant="error" title="Some details need another look.">
          The first field to fix has the focus.
        </Notice>
      )}
      {status === 'sent' && (
        <Notice variant="success" title="Validated — nothing was sent." actions={<TextLink onClick={reset}>Start again</TextLink>}>
          This Lab form only demonstrates the field primitives. The real enquiry form arrives in prompt 05.
        </Notice>
      )}
      <div className={styles.formActions}>
        <Button type="submit" fullWidth="mobile" loading={status === 'sending'} loadingLabel="Sending…">
          Send enquiry
        </Button>
        <TextLink onClick={reset}>Clear the form</TextLink>
      </div>
    </form>
  );
};

const Notices = ({ tone }) => (
  <TonePanel tone={tone}>
    <div className={styles.matrix}>
      <Notice variant="info" role={undefined} title="We already have an enquiry from this number.">
        The studio has your earlier details.
      </Notice>
      <Notice variant="success" role={undefined} title="Thank you.">
        Your enquiry has reached the studio.
      </Notice>
      <Notice
        variant="error"
        role={undefined}
        title="We could not send your enquiry."
        actions={
          <>
            <Button size="md" variant="secondary" icon={null}>
              Try again
            </Button>
            <TextLink href="#lab-primitives" arrow>
              Another way
            </TextLink>
          </>
        }
      >
        Your details are still here.
      </Notice>
    </div>
  </TonePanel>
);

export const FormsBlock = () => (
  <>
    <Block
      title="Fields — every state on every tone"
      note="Visible labels above every control (13 px, 600), 16 px input text, 52 px boxes, a ≥ 3:1 border. Errors carry an icon and text, never colour alone. Required: a terracotta asterisk plus the word “required” for assistive technology."
    >
      <div className={styles.toneStack}>
        {TONES.map((tone) => (
          <FieldStates key={tone} tone={tone} />
        ))}
      </div>
    </Block>
    <Block
      title="A form with live validation"
      note="Built only from Field, TextInput, SelectInput, ChoiceChips, TextArea, Notice and Button. Errors appear when a field is left and update as you type; on submit the first invalid field takes the focus. Nothing is sent."
    >
      <div data-tone="paper" className={styles.formPanel}>
        <LiveForm />
      </div>
    </Block>
    <Block
      title="Notice"
      note="info and success are role=status, error is role=alert (shown here without a role, so the Lab does not announce twelve messages on load)."
    >
      <div className={styles.toneGrid}>
        {TONES.map((tone) => (
          <Notices key={tone} tone={tone} />
        ))}
      </div>
    </Block>
  </>
);
