/* ============================================
   UnifiedLeadForm — the single enquiry form (prompt 05)
   --------------------------------------------
   One component, two places: in full on the Contact page and, compact,
   inside LeadModal (every CTA on the site opens it). There is never a
   second form.

   <UnifiedLeadForm source="contact-page" formId="contact-page" />
   <UnifiedLeadForm variant="compact" source="dock-cta" formId="modal-dock-cta"
                    prefill={{ service_interest }} context={{ label, ref }} onClose={close} />

   | prop            | meaning                                               |
   |-----------------|-------------------------------------------------------|
   | source          | the CTA key, stored as the lead's `source`            |
   | formId          | prefixes every field and error id (two may coexist)   |
   | variant         | "full" (default) · "compact" (four fields + details)  |
   | prefill         | { service_interest } — used only if it is an option   |
   | context         | { label, ref } — `label` is stored as `context_label` |
   | onSubmitSuccess | called with the lead once it is stored                |
   | onClose         | shows "Close" in the success state (the modal)        |
   | className       | extra classes on the root                             |

   Field → lead record (frozen keys never renamed):
     Your name *            → name
     Phone * (+91)          → mobile (10 digits)
     What do you need? *    → service_interest (a service title, or "Something else")
     Email                  → email
     Project location       → project_location + the composed message
     Approximate area       → project_area + the composed message
     Indicative budget      → budget_range + the composed message
     Tell us about your project → message
     (organization and state are sent empty; context.label → context_label)
   See src/utils/leadPayload.js.

   States: idle · sending (controls disabled, button busy) · duplicate
   (an info notice above the untouched form) · failure (an error notice,
   values kept, "Try again") · success (replaces the form, focus on its
   heading). No pop-up. WhatsApp, call and email are secondary — never the
   submit path. A draft lives in sessionStorage ("inarch:lead-draft") until
   the enquiry is stored. A honeypot ("company_website") filled by a bot
   shows the success state and sends nothing.
   ============================================ */

import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { submitLeadToWebhook } from '../../../utils/webhookSubmit';
import {
  getNameErrorMessage,
  getOptionalEmailErrorMessage,
  getRequiredMobileErrorMessage,
  normalizeMobile,
} from '../../../utils/validators';
import {
  EMPTY_VALUES,
  buildLeadPayload,
  composeWhatsAppBrief,
  firstName,
  formatMobile,
} from '../../../utils/leadPayload';
import { budgetRanges, isServiceOption, serviceOptions } from '../../../data/enquiry';
import { studio, studioMailHref, studioTelHref, studioWhatsAppHref } from '../../../data/siteConfig';
import { prefersReducedMotion } from '../../../motion/reducedMotion';
import { WHATSAPP_GREETING } from '../../shell/Dock/Dock';
import cx from '../../ui/_shared/cx';
import Field from '../../ui/Field/Field';
import TextInput from '../../ui/TextInput/TextInput';
import TextArea from '../../ui/TextArea/TextArea';
import SelectInput from '../../ui/SelectInput/SelectInput';
import Button from '../../ui/Button/Button';
import TextLink from '../../ui/TextLink/TextLink';
import Notice from '../../ui/Notice/Notice';
import Heading from '../../ui/Heading/Heading';
import Illustration from '../../ui/Illustration/Illustration';
import styles from './UnifiedLeadForm.module.css';

export const DRAFT_KEY = 'inarch:lead-draft';
export const MESSAGE_MAX = 500;
const COUNTER_FROM = 400;
const NAME_MAX = 50;
const DETAIL_MAX = 120;

const DETAIL_KEYS = ['email', 'project_location', 'project_area', 'budget_range'];

/** The order errors are met in, top to bottom, per variant. */
const FOCUS_ORDER = {
  full: ['name', 'mobile', 'service_interest', 'email', 'message'],
  compact: ['name', 'mobile', 'service_interest', 'message', 'email'],
};

// ---- Draft (sessionStorage; every access may throw) ----------------------

const readDraft = () => {
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return null;
    const draft = {};
    Object.keys(EMPTY_VALUES).forEach((key) => {
      if (typeof data[key] === 'string') draft[key] = data[key];
    });
    if (draft.mobile) draft.mobile = normalizeMobile(draft.mobile);
    if (draft.service_interest && !isServiceOption(draft.service_interest)) delete draft.service_interest;
    if (draft.budget_range && !budgetRanges.includes(draft.budget_range)) delete draft.budget_range;
    return draft;
  } catch (err) {
    return null;
  }
};

const writeDraft = (values) => {
  try {
    const filled = Object.keys(values).some((key) => values[key]);
    if (filled) window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(values));
    else window.sessionStorage.removeItem(DRAFT_KEY);
  } catch (err) {
    /* storage unavailable: the form works without a draft */
  }
};

const clearDraft = () => {
  try {
    window.sessionStorage.removeItem(DRAFT_KEY);
  } catch (err) {
    /* ignore */
  }
};

// ---- Validation -----------------------------------------------------------

const nameMessage = (value) => {
  const trimmed = (value || '').trim();
  if (!trimmed) return 'Please enter your name';
  if (!getNameErrorMessage(trimmed)) return '';
  if (trimmed.length < 2) return 'Please enter at least 2 letters';
  if (trimmed.length > NAME_MAX) return `Please keep your name under ${NAME_MAX} characters`;
  return 'Please use letters only (spaces, full stops, apostrophes and hyphens are fine)';
};

const VALIDATE = {
  name: (v) => nameMessage(v.name),
  mobile: (v) => getRequiredMobileErrorMessage(v.mobile),
  service_interest: (v) => (isServiceOption(v.service_interest) ? '' : 'Please choose what you need'),
  email: (v) => getOptionalEmailErrorMessage(v.email),
  message: (v) => (v.message.length > MESSAGE_MAX ? `Please keep your message under ${MESSAGE_MAX} characters` : ''),
};

const validateAll = (values) =>
  Object.keys(VALIDATE).reduce((acc, key) => {
    acc[key] = VALIDATE[key](values);
    return acc;
  }, {});

/** A browser's autofill (not a bot) put a value in the honeypot. */
const isAutofilled = (el) => {
  try {
    return el.matches(':autofill');
  } catch (err) {
    try {
      return el.matches(':-webkit-autofill');
    } catch (e) {
      return false;
    }
  }
};

const FALLBACK_FAILURE = `We couldn't submit your enquiry right now. Please try again or call us at ${studio.phoneDisplay}.`;

const UnifiedLeadForm = ({
  source = 'general',
  formId = 'lead-form',
  variant = 'full',
  prefill,
  context,
  onSubmitSuccess,
  onClose,
  className,
}) => {
  const compact = variant === 'compact';
  const ids = useId().replace(/:/g, '');
  const fid = (name) => `${formId}-${name}`;

  const [values, setValues] = useState(() => {
    const draft = typeof window !== 'undefined' ? readDraft() : null;
    const service = prefill && isServiceOption(prefill.service_interest) ? prefill.service_interest : '';
    return { ...EMPTY_VALUES, ...(draft || {}), ...(service ? { service_interest: service } : null) };
  });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  // idle · duplicate · error · success
  const [outcome, setOutcome] = useState('idle');
  const [failure, setFailure] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [sent, setSent] = useState({ name: '', mobile: '' });
  const [detailsOpen, setDetailsOpen] = useState(() => !compact || DETAIL_KEYS.some((key) => values[key]));

  const refs = {
    name: useRef(null),
    mobile: useRef(null),
    service_interest: useRef(null),
    email: useRef(null),
    message: useRef(null),
  };
  const honeypotRef = useRef(null);
  const submitRef = useRef(null);
  const noticeRef = useRef(null);
  const successHeadingRef = useRef(null);
  const sendingRef = useRef(false);
  const mountedRef = useRef(true);
  const refocusRef = useRef(null);
  // The draft records what the visitor typed: a CTA's prefill alone is not one.
  const editedRef = useRef(false);
  // Latest values, for work that runs after the render that captured them.
  const valuesRef = useRef(values);
  valuesRef.current = values;
  // While a button or link in the form is being pressed, a field's blur
  // error is held back until the press is over: shown at once, it would push
  // the pressed control down and the release would miss it (the click lost).
  const pressRef = useRef({ holding: false, field: null });

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Keep the draft in step with what is typed (never after success).
  useEffect(() => {
    if (outcome === 'success' || !editedRef.current) return;
    writeDraft(values);
  }, [values, outcome]);

  // Success: focus its heading (it replaces the form).
  useEffect(() => {
    if (outcome === 'success' && successHeadingRef.current) successHeadingRef.current.focus();
  }, [outcome]);

  // Duplicate / failure: bring the notice into view without moving focus,
  // and give focus back if disabling the fields dropped it.
  useEffect(() => {
    if (sending) return;
    if ((outcome === 'duplicate' || outcome === 'error') && noticeRef.current) {
      const el = noticeRef.current;
      if (typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ block: 'nearest', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      }
    }
    const back = refocusRef.current;
    refocusRef.current = null;
    if (back && outcome !== 'success') {
      const active = document.activeElement;
      const lost = !active || active === document.body || !active.isConnected;
      if (lost) {
        const target = back.isConnected && !back.disabled ? back : submitRef.current;
        if (target) target.focus({ preventScroll: true });
      }
    }
  }, [sending, outcome, attempt]);

  // ---- Handlers -----------------------------------------------------------

  const setField = useCallback((field, value) => {
    editedRef.current = true;
    setValues((prev) => (prev[field] === value ? prev : { ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev));
  }, []);

  const onChange = (field) => (event) => {
    const raw = event.target.value;
    setField(field, field === 'mobile' ? normalizeMobile(raw) : raw);
  };

  const validateField = useCallback((field) => {
    if (!VALIDATE[field] || sendingRef.current) return;
    const message = VALIDATE[field](valuesRef.current);
    setErrors((prev) => ((prev[field] || '') === message ? prev : { ...prev, [field]: message }));
  }, []);

  const onBlur = (field) => () => {
    if (pressRef.current.holding) {
      pressRef.current.field = field;
      return;
    }
    validateField(field);
  };

  // Capture phase: runs before the focused field's blur.
  const onPointerDownCapture = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (!event.target.closest || !event.target.closest('button, a[href]')) return;
    if (pressRef.current.holding) return;
    pressRef.current = { holding: true, field: null };
    const release = () => {
      window.removeEventListener('pointerup', release, true);
      window.removeEventListener('pointercancel', release, true);
      // After the click this press produces has been handled.
      window.setTimeout(() => {
        const { field } = pressRef.current;
        pressRef.current = { holding: false, field: null };
        if (field && mountedRef.current) validateField(field);
      }, 0);
    };
    window.addEventListener('pointerup', release, true);
    window.addEventListener('pointercancel', release, true);
  };

  const focusField = (field) => {
    if (compact && field === 'email' && !detailsOpen) {
      flushSync(() => setDetailsOpen(true));
    }
    const el = refs[field] && refs[field].current;
    if (el) el.focus();
  };

  const submit = async () => {
    if (sendingRef.current) return; // double-submit guard

    // A bot filled the hidden field: look successful, send nothing.
    const trap = honeypotRef.current;
    if (trap && trap.value && !isAutofilled(trap)) {
      clearDraft();
      setSent({ name: firstName(values.name), mobile: '' });
      setOutcome('success');
      return;
    }

    const nextErrors = validateAll(values);
    setErrors(nextErrors);
    const firstInvalid = FOCUS_ORDER[compact ? 'compact' : 'full'].find((field) => nextErrors[field]);
    if (firstInvalid) {
      focusField(firstInvalid);
      return;
    }

    sendingRef.current = true;
    refocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSending(true);

    const lead = buildLeadPayload(values, { source, context });
    let result;
    try {
      result = await submitLeadToWebhook(lead);
    } catch (err) {
      result = { success: false, message: FALLBACK_FAILURE };
    }

    sendingRef.current = false;
    if (!mountedRef.current) return;

    setSending(false);
    setAttempt((n) => n + 1);
    if (result && result.duplicate) {
      setFailure('');
      setOutcome('duplicate');
      return;
    }
    if (result && result.success) {
      clearDraft();
      setSent({ name: firstName(lead.name), mobile: lead.mobile });
      setOutcome('success');
      if (onSubmitSuccess) onSubmitSuccess(lead);
      return;
    }
    setFailure((result && result.message) || FALLBACK_FAILURE);
    setOutcome('error');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submit();
  };

  // ---- Shared bits -----------------------------------------------------

  const briefHref = studio.whatsapp ? studioWhatsAppHref(composeWhatsAppBrief(values, WHATSAPP_GREETING)) : null;
  const greetingHref = studio.whatsapp ? studioWhatsAppHref(WHATSAPP_GREETING) : null;
  const callLabel = `Call ${studio.phoneDisplay}`;
  const rootClass = cx('ia', styles.root, compact ? styles.compact : styles.full, className);

  // ---- Success -----------------------------------------------------------

  if (outcome === 'success') {
    return (
      <div className={rootClass} data-tone="paper">
        <div className={styles.success} role="status">
          <Illustration name="enquiry-sent" size={120} decorative className={styles.successArt} />
          <Heading as="h3" size="sm" ref={successHeadingRef} tabIndex={-1} className={styles.successHead}>
            {sent.name ? `Thank you, ${sent.name}.` : 'Thank you.'}
          </Heading>
          <p className={cx('ia-t-body', styles.successBody)}>
            Your enquiry has reached the studio.{' '}
            {sent.mobile ? (
              <>
                We will call you on <span className={styles.nowrap}>+91 {formatMobile(sent.mobile)}</span> to arrange an
                initial consultation.
              </>
            ) : (
              'We will call you to arrange an initial consultation.'
            )}
          </p>
          <div className={styles.successActions}>
            {greetingHref && (
              <Button variant="secondary" href={greetingHref} target="_blank" icon="chat">
                Message us on WhatsApp
              </Button>
            )}
            {onClose && <TextLink onClick={onClose}>Close</TextLink>}
          </div>
        </div>
      </div>
    );
  }

  // ---- Form -------------------------------------------------------------

  const count = values.message.length;
  const counterId = fid('message-count');
  const detailsId = fid('details');

  const notice =
    outcome === 'duplicate' ? (
      <Notice
        key={`duplicate-${attempt}`}
        ref={noticeRef}
        variant="info"
        className={styles.notice}
        title="We already have an enquiry from this number."
        actions={
          <>
            {briefHref && (
              <TextLink href={briefHref} target="_blank" accent>
                Send this brief on WhatsApp
              </TextLink>
            )}
            <TextLink href={studioTelHref} accent>
              {callLabel}
            </TextLink>
          </>
        }
      >
        The studio has your earlier details. To add to it, send this brief on WhatsApp or call us.
      </Notice>
    ) : outcome === 'error' ? (
      <Notice
        key={`error-${attempt}`}
        ref={noticeRef}
        variant="error"
        className={styles.notice}
        title="Your enquiry has not been sent."
        actions={
          <>
            <Button size="md" variant="secondary" icon="arrow-right" onClick={submit} loading={sending} loadingLabel="Sending…">
              Try again
            </Button>
            {briefHref && (
              <TextLink href={briefHref} target="_blank" accent>
                Send on WhatsApp instead
              </TextLink>
            )}
            <TextLink href={studioTelHref} accent>
              {callLabel}
            </TextLink>
          </>
        }
      >
        {failure}
      </Notice>
    ) : null;

  const nameField = (
    <Field id={fid('name')} label="Your name" required error={errors.name} className={styles.cell}>
      <TextInput
        ref={refs.name}
        name="name"
        autoComplete="name"
        maxLength={NAME_MAX}
        value={values.name}
        onChange={onChange('name')}
        onBlur={onBlur('name')}
      />
    </Field>
  );

  const phoneField = (
    <Field
      id={fid('mobile')}
      label={
        <>
          Phone<span className="ia-visually-hidden"> (+91)</span>
        </>
      }
      required
      error={errors.mobile}
      className={styles.cell}
    >
      <span className={styles.phone}>
        <span className={styles.prefix} aria-hidden="true">
          +91
        </span>
        <TextInput
          ref={refs.mobile}
          name="mobile"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          className={styles.phoneInput}
          value={values.mobile}
          onChange={onChange('mobile')}
          onBlur={onBlur('mobile')}
        />
      </span>
    </Field>
  );

  const serviceField = (
    <Field id={fid('service')} label="What do you need?" required error={errors.service_interest} className={styles.cell}>
      <SelectInput
        ref={refs.service_interest}
        name="service_interest"
        placeholder="Select a service"
        options={serviceOptions}
        value={values.service_interest}
        onChange={onChange('service_interest')}
        onBlur={onBlur('service_interest')}
      />
    </Field>
  );

  const emailField = (
    <Field id={fid('email')} label="Email" optional error={errors.email} className={styles.cell}>
      <TextInput
        ref={refs.email}
        name="email"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={onChange('email')}
        onBlur={onBlur('email')}
      />
    </Field>
  );

  const locationField = (
    <Field id={fid('location')} label="Project location" optional className={styles.cell}>
      <TextInput
        name="project_location"
        placeholder="City, area"
        maxLength={DETAIL_MAX}
        autoComplete="off"
        value={values.project_location}
        onChange={onChange('project_location')}
      />
    </Field>
  );

  const areaField = (
    <Field id={fid('area')} label="Approximate area" optional className={styles.cell}>
      <TextInput
        name="project_area"
        placeholder="e.g. 2,500 sq. ft."
        maxLength={DETAIL_MAX}
        autoComplete="off"
        value={values.project_area}
        onChange={onChange('project_area')}
      />
    </Field>
  );

  const budgetField = (
    <Field id={fid('budget')} label="Indicative budget" optional className={cx(styles.cell, styles.budget)}>
      <SelectInput
        name="budget_range"
        options={[{ value: '', label: 'Select a range' }, ...budgetRanges]}
        value={values.budget_range}
        onChange={onChange('budget_range')}
      />
    </Field>
  );

  const messageField = (
    <Field id={fid('message')} label="Tell us about your project" optional error={errors.message} className={cx(styles.cell, styles.wide)}>
      <TextArea
        ref={refs.message}
        name="message"
        rows={compact ? 3 : 4}
        maxRows={compact ? 8 : 12}
        aria-describedby={count >= COUNTER_FROM ? counterId : undefined}
        value={values.message}
        onChange={onChange('message')}
        onBlur={onBlur('message')}
      />
      {count >= COUNTER_FROM && (
        <p id={counterId} className={cx('ia-t-caption', styles.counter, count > MESSAGE_MAX && styles.over)}>
          <span aria-hidden="true">
            {count} / {MESSAGE_MAX}
          </span>
          <span className="ia-visually-hidden">
            {count} of {MESSAGE_MAX} characters used
          </span>
        </p>
      )}
    </Field>
  );

  return (
    <div className={rootClass} data-tone="paper">
      <form
        id={formId}
        className={styles.form}
        onSubmit={handleSubmit}
        onPointerDownCapture={onPointerDownCapture}
        noValidate
        data-sending={sending ? '' : undefined}
      >
        {notice}

        <fieldset className={styles.fields} disabled={sending}>
          {compact ? (
            <>
              <div className={styles.grid}>
                {nameField}
                {phoneField}
                {serviceField}
                {messageField}
              </div>
              <div className={styles.disclosure}>
                <TextLink
                  arrow={detailsOpen ? 'minus' : 'plus'}
                  aria-expanded={detailsOpen}
                  aria-controls={detailsId}
                  onClick={() => setDetailsOpen((open) => !open)}
                >
                  Add project details (optional)
                </TextLink>
              </div>
              <div id={detailsId} className={cx(styles.grid, styles.details)} hidden={!detailsOpen}>
                {emailField}
                {locationField}
                {areaField}
                {budgetField}
              </div>
            </>
          ) : (
            <div className={styles.grid}>
              {nameField}
              {phoneField}
              {serviceField}
              {emailField}
              {locationField}
              {areaField}
              {budgetField}
              {messageField}
            </div>
          )}
        </fieldset>

        <div className={styles.submit}>
          <Button
            ref={submitRef}
            type="submit"
            size="lg"
            fullWidth="mobile"
            loading={sending}
            loadingLabel="Sending…"
          >
            Send enquiry
          </Button>
        </div>

        <p className={cx('ia-t-caption', styles.privacy)}>Your details are used only to respond to this enquiry.</p>

        <div className={styles.quick}>
          <p className={cx('ia-t-small', styles.quickLead)}>Prefer to talk?</p>
          {greetingHref && (
            <TextLink href={greetingHref} target="_blank">
              WhatsApp
            </TextLink>
          )}
          {studio.phone && <TextLink href={studioTelHref}>{callLabel}</TextLink>}
          {studioMailHref && <TextLink href={studioMailHref}>Email</TextLink>}
        </div>

        {/* Honeypot: invisible to people and to assistive technology. */}
        <div className="ia-visually-hidden" aria-hidden="true">
          <label htmlFor={`${ids}-company-website`}>Leave this field empty</label>
          <input
            ref={honeypotRef}
            id={`${ids}-company-website`}
            type="text"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>
      </form>
    </div>
  );
};

export default UnifiedLeadForm;
