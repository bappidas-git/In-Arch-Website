import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LeadModal from '../LeadModal';

jest.mock('../../../../utils/webhookSubmit', () => ({ submitLeadToWebhook: jest.fn() }));

describe('LeadModal', () => {
  const realScrollTo = window.scrollTo;
  beforeAll(() => {
    window.scrollTo = jest.fn(); // jsdom does not implement it; useScrollLock restores the offset with it
  });
  afterAll(() => {
    window.scrollTo = realScrollTo;
  });
  beforeEach(() => window.sessionStorage.clear());

  it('is a named modal dialog, focuses its heading and shows the CTA context', async () => {
    const onClose = jest.fn();
    render(
      <LeadModal
        isOpen
        onClose={onClose}
        source="project-graphite-kitchen"
        serviceInterest="Interior Design"
        context={{ label: 'Portfolio — Graphite Gloss Kitchen', ref: 'graphite-kitchen' }}
      />
    );
    const dialog = screen.getByRole('dialog', { name: 'Tell us about your space.' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog.closest('.ia')).toHaveAttribute('data-tone', 'paper');
    expect(screen.getByRole('heading', { name: 'Tell us about your space.' })).toHaveFocus();
    expect(dialog).toHaveTextContent('Enquiring about: Interior Design');
    expect(dialog).toHaveTextContent('From: Portfolio — Graphite Gloss Kitchen');
    // the compact form, pre-selected, with the modal's formId
    expect(screen.getByLabelText(/^what do you need/i)).toHaveValue('Interior Design');
    expect(screen.getByLabelText(/^your name/i)).toHaveAttribute('id', 'modal-project-graphite-kitchen-name');
    expect(document.body.style.position).toBe('fixed');

    const user = userEvent.setup();
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
    await user.click(screen.getAllByRole('button', { name: 'Close' })[0]);
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('ignores a service that is not an option and shows no context line without context', () => {
    render(<LeadModal isOpen onClose={() => {}} source="expertise-e03" serviceInterest="HR & People Management" />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).not.toHaveTextContent('Enquiring about');
    expect(dialog).not.toHaveTextContent('From:');
    expect(screen.getByLabelText(/^what do you need/i)).toHaveValue('');
  });

  it('renders nothing while closed and releases the scroll lock', () => {
    const { rerender } = render(<LeadModal isOpen onClose={() => {}} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    act(() => {
      rerender(<LeadModal isOpen={false} onClose={() => {}} />);
    });
    expect(document.body.style.position).toBe('');
  });
});
