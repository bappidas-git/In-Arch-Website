import React from 'react';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UnifiedLeadForm, { DRAFT_KEY } from '../UnifiedLeadForm';
import { submitLeadToWebhook } from '../../../../utils/webhookSubmit';

jest.mock('../../../../utils/webhookSubmit', () => ({
  submitLeadToWebhook: jest.fn(),
}));

const nameInput = () => screen.getByLabelText(/^your name/i);
const phoneInput = () => screen.getByLabelText(/^phone/i);
const serviceSelect = () => screen.getByLabelText(/^what do you need/i);
const messageInput = () => screen.getByLabelText(/^tell us about your project/i);
const submitButton = () => screen.getByRole('button', { name: /send enquiry/i });

const fillRequired = async (user, { name = 'Rahul Kumar', mobile = '9876543210', service = 'Interior Design' } = {}) => {
  await user.type(nameInput(), name);
  await user.type(phoneInput(), mobile);
  await user.selectOptions(serviceSelect(), service);
};

/** A promise the test resolves by hand. */
const deferred = () => {
  let resolve;
  const promise = new Promise((r) => {
    resolve = r;
  });
  return { promise, resolve };
};

beforeEach(() => {
  submitLeadToWebhook.mockReset();
  window.sessionStorage.clear();
});

describe('UnifiedLeadForm', () => {
  it('renders the full variant with all eight fields inside an .ia paper scope', () => {
    const { container } = render(<UnifiedLeadForm source="contact-page" formId="contact-page" />);
    const root = container.firstChild;
    expect(root).toHaveClass('ia');
    expect(root).toHaveAttribute('data-tone', 'paper');
    expect(container.querySelector('form#contact-page')).toBeInTheDocument();
    [/^your name/i, /^phone/i, /^what do you need/i, /^email/i, /^project location/i, /^approximate area/i, /^indicative budget/i, /^tell us about your project/i].forEach(
      (label) => expect(screen.getByLabelText(label)).toBeVisible()
    );
    // ids carry the formId prefix
    expect(nameInput()).toHaveAttribute('id', 'contact-page-name');
    expect(phoneInput()).toHaveAttribute('autocomplete', 'tel-national');
    expect(phoneInput()).toHaveAttribute('inputmode', 'numeric');
    // the service options: seven titles + "Something else", after the placeholder
    const options = within(serviceSelect()).getAllByRole('option').map((o) => o.textContent);
    expect(options[0]).toBe('Select a service');
    expect(options).toHaveLength(9);
    expect(options[8]).toBe('Something else');
  });

  it('shows the three required errors on an empty submit and focuses "Your name"', async () => {
    const user = userEvent.setup();
    render(<UnifiedLeadForm source="dock-cta" formId="t" variant="compact" />);
    await user.click(submitButton());

    expect(submitLeadToWebhook).not.toHaveBeenCalled();
    expect(nameInput()).toHaveFocus();
    expect(screen.getByText('Please enter your name')).toBeInTheDocument();
    expect(screen.getByText('Please enter a 10-digit mobile number')).toBeInTheDocument();
    expect(screen.getByText('Please choose what you need')).toBeInTheDocument();
    expect(document.querySelectorAll('[aria-invalid="true"]')).toHaveLength(3);
    // each error is tied to its field
    expect(nameInput().getAttribute('aria-describedby')).toContain('t-name-error');
    // never disabled for validity
    expect(submitButton()).not.toBeDisabled();

    // an error clears as soon as the field changes
    await user.type(nameInput(), 'R');
    expect(screen.queryByText('Please enter your name')).not.toBeInTheDocument();
  });

  it('validates on blur with plain messages', async () => {
    const user = userEvent.setup();
    render(<UnifiedLeadForm formId="t" />);
    await user.type(phoneInput(), '5876543210');
    await user.tab();
    expect(screen.getByText('Mobile numbers start with 6, 7, 8 or 9')).toBeInTheDocument();
    await user.type(screen.getByLabelText(/^email/i), 'rahul@');
    await user.tab();
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('holds a blur error while a button is pressed, then shows it', async () => {
    const user = userEvent.setup();
    render(<UnifiedLeadForm formId="m" variant="compact" />);
    await user.type(phoneInput(), '58765');
    // pressing the disclosure blurs the phone field
    await user.click(screen.getByRole('button', { name: /add project details/i }));
    expect(screen.getByRole('button', { name: /add project details/i })).toHaveAttribute('aria-expanded', 'true');
    expect(await screen.findByText('Please enter a 10-digit mobile number')).toBeInTheDocument();
  });

  it('a press on "Send enquiry" from an invalid field still submits the validation', async () => {
    const user = userEvent.setup();
    render(<UnifiedLeadForm formId="t" />);
    await user.type(phoneInput(), '5876543210');
    await user.click(submitButton());
    expect(nameInput()).toHaveFocus();
    expect(document.querySelectorAll('[aria-invalid="true"]')).toHaveLength(3);
    expect(await screen.findByText('Mobile numbers start with 6, 7, 8 or 9')).toBeInTheDocument();
  });

  it('normalises a pasted +91 number to ten digits', async () => {
    const user = userEvent.setup();
    render(<UnifiedLeadForm formId="t" />);
    await user.click(phoneInput());
    await user.paste('+91 98765 43210');
    expect(phoneInput()).toHaveValue('9876543210');
  });

  it('pre-selects a valid service and ignores anything else', () => {
    const { unmount } = render(<UnifiedLeadForm formId="a" prefill={{ service_interest: 'Interior Design' }} />);
    expect(serviceSelect()).toHaveValue('Interior Design');
    unmount();
    render(<UnifiedLeadForm formId="b" prefill={{ service_interest: 'HR & People Management' }} />);
    expect(serviceSelect()).toHaveValue('');
  });

  it('compact: four visible fields and a disclosure for the details', async () => {
    const user = userEvent.setup();
    render(<UnifiedLeadForm formId="m" variant="compact" />);
    expect(nameInput()).toBeVisible();
    expect(messageInput()).toHaveAttribute('rows', '3');
    const toggle = screen.getByRole('button', { name: /add project details/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByLabelText(/^email/i)).not.toBeVisible();

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByLabelText(/^email/i)).toBeVisible();
    expect(screen.getByLabelText(/^indicative budget/i)).toBeVisible();
  });

  it('compact: an invalid hidden email opens the details and takes focus', async () => {
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ email: 'bad@' }));
    const user = userEvent.setup();
    render(<UnifiedLeadForm formId="m" variant="compact" />);
    // a draft with details opens the disclosure; close it again
    await user.click(screen.getByRole('button', { name: /add project details/i }));
    await fillRequired(user);
    await user.click(submitButton());
    expect(submitLeadToWebhook).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/^email/i)).toHaveFocus();
    expect(screen.getByRole('button', { name: /add project details/i })).toHaveAttribute('aria-expanded', 'true');
  });

  it('shows "Sending…", sets aria-busy, disables the fields and ignores a second press', async () => {
    const pending = deferred();
    submitLeadToWebhook.mockReturnValue(pending.promise);
    const user = userEvent.setup();
    render(<UnifiedLeadForm formId="t" source="contact-page" />);
    await fillRequired(user);
    await user.click(submitButton());

    expect(submitButton()).toHaveAttribute('aria-busy', 'true');
    expect(submitButton()).toHaveTextContent('Sending…');
    expect(nameInput()).toBeDisabled();
    await user.click(submitButton());
    expect(submitLeadToWebhook).toHaveBeenCalledTimes(1);

    await act(async () => {
      pending.resolve({ success: true, message: 'ok' });
    });
  });

  it('success: sends the payload, replaces the form, focuses the heading and clears the draft', async () => {
    submitLeadToWebhook.mockResolvedValue({ success: true, message: 'Lead submitted successfully' });
    const onSubmitSuccess = jest.fn();
    const onClose = jest.fn();
    const user = userEvent.setup();
    render(
      <UnifiedLeadForm
        formId="m"
        variant="compact"
        source="project-graphite-kitchen"
        context={{ label: 'Portfolio — Graphite Gloss Kitchen', ref: 'graphite-kitchen' }}
        onSubmitSuccess={onSubmitSuccess}
        onClose={onClose}
      />
    );
    await fillRequired(user);
    await user.type(messageInput(), 'A kitchen.');
    await user.click(screen.getByRole('button', { name: /add project details/i }));
    await user.type(screen.getByLabelText(/^approximate area/i), '120 sq ft');
    expect(window.sessionStorage.getItem(DRAFT_KEY)).toContain('Rahul Kumar');
    await user.click(submitButton());

    const heading = await screen.findByRole('heading', { name: 'Thank you, Rahul.' });
    expect(heading).toHaveFocus();
    expect(screen.getByRole('status')).toHaveTextContent('We will call you on +91 98765 43210 to arrange an initial consultation.');
    expect(screen.queryByRole('button', { name: /send enquiry/i })).not.toBeInTheDocument();
    expect(window.sessionStorage.getItem(DRAFT_KEY)).toBeNull();

    const lead = submitLeadToWebhook.mock.calls[0][0];
    expect(lead).toEqual({
      name: 'Rahul Kumar',
      mobile: '9876543210',
      email: '',
      organization: '',
      service_interest: 'Interior Design',
      state: '',
      message: 'A kitchen. — Project details: Area: 120 sq ft.',
      source: 'project-graphite-kitchen',
      project_area: '120 sq ft',
      context_label: 'Portfolio — Graphite Gloss Kitchen',
    });
    expect(onSubmitSuccess).toHaveBeenCalledWith(lead);
    expect(screen.getByRole('link', { name: /message us on whatsapp/i })).toHaveAttribute(
      'href',
      expect.stringContaining('https://wa.me/917292831128?text=')
    );
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('duplicate: an info notice above the untouched form, with the brief on WhatsApp', async () => {
    submitLeadToWebhook.mockResolvedValue({ success: true, duplicate: true, message: 'dup' });
    const user = userEvent.setup();
    render(<UnifiedLeadForm formId="t" source="contact-page" />);
    await fillRequired(user);
    await user.type(messageInput(), 'Second enquiry');
    await user.click(submitButton());

    const notice = await screen.findByText('We already have an enquiry from this number.');
    const region = notice.closest('[role="status"]');
    expect(region).toHaveTextContent('send this brief on WhatsApp or call us');
    const brief = within(region).getByRole('link', { name: /send this brief on whatsapp/i });
    const text = decodeURIComponent(brief.getAttribute('href').split('?text=')[1]);
    expect(text).toContain('Name: Rahul Kumar');
    expect(text).toContain('Service: Interior Design');
    expect(text).toContain('Second enquiry');
    expect(within(region).getByRole('link', { name: 'Call +91 72928 31128' })).toHaveAttribute('href', 'tel:+917292831128');
    // nothing typed is lost
    expect(nameInput()).toHaveValue('Rahul Kumar');
    expect(phoneInput()).toHaveValue('9876543210');
    expect(messageInput()).toHaveValue('Second enquiry');
    // the notice sits above the fields
    expect(region.compareDocumentPosition(nameInput()) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('failure: an error notice with the returned message, values kept, and a working "Try again"', async () => {
    submitLeadToWebhook
      .mockResolvedValueOnce({
        success: false,
        message: 'Network error. Please check your connection and try again, or call us at +91 72928 31128.',
      })
      .mockResolvedValueOnce({ success: true, message: 'ok' });
    const user = userEvent.setup();
    render(<UnifiedLeadForm formId="t" />);
    await fillRequired(user);
    await user.click(submitButton());

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Network error. Please check your connection and try again, or call us at +91 72928 31128.');
    expect(within(alert).getByRole('link', { name: /send on whatsapp instead/i })).toBeInTheDocument();
    expect(within(alert).getByRole('link', { name: /^call/i })).toBeInTheDocument();
    expect(nameInput()).toHaveValue('Rahul Kumar');

    await user.click(within(alert).getByRole('button', { name: /try again/i }));
    expect(await screen.findByRole('heading', { name: 'Thank you, Rahul.' })).toBeInTheDocument();
    expect(submitLeadToWebhook).toHaveBeenCalledTimes(2);
  });

  it('a thrown error still ends in the failure notice', async () => {
    submitLeadToWebhook.mockRejectedValue(new Error('boom'));
    const user = userEvent.setup();
    render(<UnifiedLeadForm formId="t" />);
    await fillRequired(user);
    await user.click(submitButton());
    expect(await screen.findByRole('alert')).toHaveTextContent('+91 72928 31128');
  });

  it('restores a draft on mount and keeps it in step with typing', async () => {
    window.sessionStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ name: 'Asha', mobile: '+91 91234 56789', service_interest: 'Not a service', message: 'Hello' })
    );
    const user = userEvent.setup();
    render(<UnifiedLeadForm formId="t" />);
    expect(nameInput()).toHaveValue('Asha');
    expect(phoneInput()).toHaveValue('9123456789');
    expect(serviceSelect()).toHaveValue('');
    expect(messageInput()).toHaveValue('Hello');

    await user.type(nameInput(), ' Rao');
    await waitFor(() => expect(JSON.parse(window.sessionStorage.getItem(DRAFT_KEY)).name).toBe('Asha Rao'));
  });

  it('a CTA prefill wins over the draft’s service', () => {
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ service_interest: 'Interior Design' }));
    render(<UnifiedLeadForm formId="t" prefill={{ service_interest: 'Residential Architecture' }} />);
    expect(serviceSelect()).toHaveValue('Residential Architecture');
  });

  it('honeypot: a filled hidden field shows success and sends nothing', async () => {
    const user = userEvent.setup();
    const { container } = render(<UnifiedLeadForm formId="t" />);
    const trap = container.querySelector('input[name="company_website"]');
    expect(trap).toHaveAttribute('tabindex', '-1');
    expect(trap).toHaveAttribute('autocomplete', 'off');
    expect(trap.closest('[aria-hidden="true"]')).toBeInTheDocument();
    trap.value = 'http://spam.example';
    await user.type(nameInput(), 'Bot');
    await user.click(submitButton());
    expect(await screen.findByRole('heading', { name: 'Thank you, Bot.' })).toBeInTheDocument();
    expect(submitLeadToWebhook).not.toHaveBeenCalled();
  });

  it('counts characters from 400 and rejects more than 500', async () => {
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ message: 'x'.repeat(399) }));
    const user = userEvent.setup();
    render(<UnifiedLeadForm formId="t" />);
    expect(screen.queryByText('399 / 500')).not.toBeInTheDocument();
    await user.type(messageInput(), 'x');
    expect(screen.getByText('400 / 500')).toBeInTheDocument();
    expect(messageInput().getAttribute('aria-describedby')).toContain('t-message-count');

    await user.click(messageInput());
    await user.paste('y'.repeat(101));
    await fillRequired(user);
    await user.click(submitButton());
    expect(screen.getByText('Please keep your message under 500 characters')).toBeInTheDocument();
    expect(messageInput()).toHaveFocus();
    expect(submitLeadToWebhook).not.toHaveBeenCalled();
  });
});
