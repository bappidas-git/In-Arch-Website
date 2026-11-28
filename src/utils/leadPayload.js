/* ============================================
   leadPayload — form values → the lead record (prompt 05)
   --------------------------------------------
   Pure functions: no DOM, no network, no storage. The form calls
   buildLeadPayload() and hands the result to submitLeadToWebhook(), which
   adds the enrichment (lead_id, status, timestamps, page URL, user agent,
   UTM values, notes, activity) exactly as before.

   The frozen record keys this builds are always present:
     name, mobile, email, organization (''), service_interest, state (''),
     message, source
   and, only when there is something to say, four additive keys the
   schemaless store keeps as sent:
     project_location, project_area, budget_range, context_label

   Why the composed message: the admin (frozen) shows only the fields it
   knows, and shows `message` as one paragraph with line breaks collapsed.
   So the project details are also written into `message`, as one line
   after the visitor's own words:
     "<their words> — Project details: Location: …; Area: …; Budget: …."
   ============================================ */

import { normalizeMobile } from './validators';

/** The values the form keeps (and the draft stores). */
export const EMPTY_VALUES = Object.freeze({
  name: '',
  mobile: '',
  service_interest: '',
  email: '',
  project_location: '',
  project_area: '',
  budget_range: '',
  message: '',
});

/** Keys every lead built here carries (the rest are added by webhookSubmit). */
export const LEAD_BASE_KEYS = Object.freeze([
  'name',
  'mobile',
  'email',
  'organization',
  'service_interest',
  'state',
  'message',
  'source',
]);

/** Additive keys, present only when filled. */
export const LEAD_EXTRA_KEYS = Object.freeze(['project_location', 'project_area', 'budget_range', 'context_label']);

const clean = (value) => (typeof value === 'string' ? value.trim() : value == null ? '' : String(value).trim());

/** "Location: …; Area: …; Budget: …" for whichever details exist, or ''. */
const projectDetails = (values = {}) =>
  [
    ['Location', clean(values.project_location)],
    ['Area', clean(values.project_area)],
    ['Budget', clean(values.budget_range)],
  ]
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join('; ');

/**
 * The `message` the admin will show: the visitor's own words first (trimmed,
 * otherwise unchanged), then — only if any exist — the project details.
 *
 * @example composeMessage({ message: 'A 3BHK flat.', project_area: '1,400 sq. ft.', budget_range: 'Not sure yet' })
 *   // 'A 3BHK flat. — Project details: Area: 1,400 sq. ft.; Budget: Not sure yet.'
 * @returns {string} '' when there is nothing at all.
 */
export const composeMessage = (values = {}) => {
  const own = clean(values.message);
  const details = projectDetails(values);
  if (!details) return own;
  // One closing full stop, not two ("… 2,500 sq. ft." stays as typed).
  const block = `Project details: ${details}${/[.!?]$/.test(details) ? '' : '.'}`;
  return own ? `${own} — ${block}` : block;
};

/**
 * The lead object for submitLeadToWebhook(). Never mutates `values`.
 *
 * @param {Object} values - the form values (see EMPTY_VALUES)
 * @param {Object} [meta]
 * @param {string} [meta.source] - the CTA key, stored as `source`
 * @param {{ label?: string, ref?: string }} [meta.context] - where the
 *   visitor came from; `label` is stored as `context_label`
 */
export const buildLeadPayload = (values = {}, { source, context } = {}) => {
  const lead = {
    name: clean(values.name),
    mobile: normalizeMobile(values.mobile),
    email: clean(values.email),
    organization: '',
    service_interest: clean(values.service_interest),
    state: '',
    message: composeMessage(values),
    source: clean(source) || 'general',
  };
  const location = clean(values.project_location);
  const area = clean(values.project_area);
  const budget = clean(values.budget_range);
  const label = context && typeof context === 'object' ? clean(context.label) : '';
  if (location) lead.project_location = location;
  if (area) lead.project_area = area;
  if (budget) lead.budget_range = budget;
  if (label) lead.context_label = label;
  return lead;
};

/** "98765 43210" — a 10-digit mobile in the studio's own grouping. */
export const formatMobile = (mobile) => {
  const digits = normalizeMobile(mobile);
  return digits.length === 10 ? `${digits.slice(0, 5)} ${digits.slice(5)}` : digits;
};

/**
 * The brief a visitor can send on WhatsApp when the store cannot take the
 * enquiry (a duplicate number, or a failure): greeting, name, service and
 * the composed message, one item per line.
 *
 * @param {Object} values - the form values
 * @param {string} greeting - the first line (the dock's WhatsApp greeting)
 */
export const composeWhatsAppBrief = (values = {}, greeting = '') => {
  const lines = [clean(greeting)].filter(Boolean);
  const name = clean(values.name);
  const service = clean(values.service_interest);
  const message = composeMessage(values);
  if (name) lines.push(`Name: ${name}`);
  if (service) lines.push(`Service: ${service}`);
  if (message) lines.push(message);
  return lines.join('\n');
};

/** The visitor's first name, for "Thank you, {first name}." */
export const firstName = (name) => clean(name).split(/\s+/)[0] || '';
