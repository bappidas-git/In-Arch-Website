import {
  EMPTY_VALUES,
  LEAD_BASE_KEYS,
  LEAD_EXTRA_KEYS,
  buildLeadPayload,
  composeMessage,
  composeWhatsAppBrief,
  firstName,
  formatMobile,
} from '../leadPayload';

const sorted = (obj) => Object.keys(obj).sort();

const FULL = {
  name: '  Rahul Kumar ',
  mobile: '+91 98765 43210',
  service_interest: 'Interior Design',
  email: ' rahul@example.com ',
  project_location: ' Patna, Boring Road ',
  project_area: ' 2,500 sq. ft. ',
  budget_range: '₹25 – 50 lakh',
  message: '  A three-bedroom flat.  ',
};

describe('buildLeadPayload', () => {
  it('returns exactly the base keys for minimal input, organization and state empty', () => {
    const lead = buildLeadPayload(
      { name: 'Rahul', mobile: '9876543210', service_interest: 'Interior Design' },
      { source: 'dock-cta' }
    );
    expect(sorted(lead)).toEqual([...LEAD_BASE_KEYS].sort());
    expect(lead).toEqual({
      name: 'Rahul',
      mobile: '9876543210',
      email: '',
      organization: '',
      service_interest: 'Interior Design',
      state: '',
      message: '',
      source: 'dock-cta',
    });
  });

  it('adds the four extra keys only when there is something to say, and trims every string', () => {
    const lead = buildLeadPayload(FULL, {
      source: 'project-graphite-kitchen',
      context: { label: ' Portfolio — Graphite Gloss Kitchen ', ref: 'graphite-kitchen' },
    });
    expect(sorted(lead)).toEqual([...LEAD_BASE_KEYS, ...LEAD_EXTRA_KEYS].sort());
    expect(lead).toEqual({
      name: 'Rahul Kumar',
      mobile: '9876543210',
      email: 'rahul@example.com',
      organization: '',
      service_interest: 'Interior Design',
      state: '',
      message:
        'A three-bedroom flat. — Project details: Location: Patna, Boring Road; Area: 2,500 sq. ft.; Budget: ₹25 – 50 lakh.',
      source: 'project-graphite-kitchen',
      project_location: 'Patna, Boring Road',
      project_area: '2,500 sq. ft.',
      budget_range: '₹25 – 50 lakh',
      context_label: 'Portfolio — Graphite Gloss Kitchen',
    });
  });

  it('never drops organization or state, whatever is passed', () => {
    const lead = buildLeadPayload({ ...FULL, organization: 'ACME', state: 'Bihar' }, { source: 'x' });
    expect(lead.organization).toBe('');
    expect(lead.state).toBe('');
    expect(buildLeadPayload()).toMatchObject({ organization: '', state: '', source: 'general' });
  });

  it('ignores blank extras and a context without a label', () => {
    const lead = buildLeadPayload(
      { ...EMPTY_VALUES, name: 'A B', project_location: '   ', budget_range: '' },
      { source: 'footer-cta', context: { ref: 'x' } }
    );
    expect(sorted(lead)).toEqual([...LEAD_BASE_KEYS].sort());
  });

  it('does not mutate its input', () => {
    const values = { ...FULL };
    const context = { label: 'Home' };
    const snapshot = JSON.stringify({ values, context });
    buildLeadPayload(values, { source: 'home-hero', context });
    expect(JSON.stringify({ values, context })).toBe(snapshot);
  });
});

describe('composeMessage', () => {
  it('message only: the visitor’s words, trimmed, unchanged', () => {
    expect(composeMessage({ message: '  Line one\nline two  ' })).toBe('Line one\nline two');
  });

  it('details only: starts at "Project details:"', () => {
    expect(composeMessage({ project_location: 'Patna', budget_range: 'Not sure yet' })).toBe(
      'Project details: Location: Patna; Budget: Not sure yet.'
    );
  });

  it('both: words first, then " — Project details: …"', () => {
    expect(composeMessage({ message: 'Kitchen.', project_area: '120 sq ft' })).toBe(
      'Kitchen. — Project details: Area: 120 sq ft.'
    );
  });

  it('keeps one closing full stop when a value already ends with one', () => {
    expect(composeMessage({ project_area: '2,500 sq. ft.' })).toBe('Project details: Area: 2,500 sq. ft.');
  });

  it('neither: an empty string', () => {
    expect(composeMessage({})).toBe('');
    expect(composeMessage(EMPTY_VALUES)).toBe('');
    expect(composeMessage()).toBe('');
  });
});

describe('helpers', () => {
  it('composeWhatsAppBrief: greeting, name, service, composed message', () => {
    expect(composeWhatsAppBrief(FULL, 'Hello IN-ARCH.')).toBe(
      [
        'Hello IN-ARCH.',
        'Name: Rahul Kumar',
        'Service: Interior Design',
        'A three-bedroom flat. — Project details: Location: Patna, Boring Road; Area: 2,500 sq. ft.; Budget: ₹25 – 50 lakh.',
      ].join('\n')
    );
    expect(composeWhatsAppBrief({}, 'Hi')).toBe('Hi');
  });

  it('formatMobile and firstName', () => {
    expect(formatMobile('9876543210')).toBe('98765 43210');
    expect(formatMobile('+91 98765 43210')).toBe('98765 43210');
    expect(firstName('  राहुल कुमार ')).toBe('राहुल');
    expect(firstName('')).toBe('');
  });
});
