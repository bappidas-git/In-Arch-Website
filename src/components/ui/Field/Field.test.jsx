import React from 'react';
import { render, screen } from '@testing-library/react';
import Field from './Field';
import TextInput from '../TextInput/TextInput';
import TextArea from '../TextArea/TextArea';
import SelectInput from '../SelectInput/SelectInput';
import ChoiceChips from '../ChoiceChips/ChoiceChips';

describe('Field', () => {
  test('connects the label to the control', () => {
    render(
      <Field label="Full name">
        <TextInput name="name" />
      </Field>
    );
    const input = screen.getByLabelText('Full name');
    expect(input.tagName).toBe('INPUT');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  test('wires the hint and the error with aria-describedby and aria-invalid', () => {
    render(
      <Field label="Mobile number" hint="Ten digits." error="Enter a 10-digit mobile number." required>
        <TextInput name="mobile" />
      </Field>
    );
    const input = screen.getByRole('textbox', { name: /Mobile number/ });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).toHaveAccessibleDescription('Ten digits. Enter a 10-digit mobile number.');
    const ids = input.getAttribute('aria-describedby').split(' ');
    expect(ids).toHaveLength(2);
    expect(document.getElementById(ids[0])).toHaveTextContent('Ten digits.');
    expect(document.getElementById(ids[1])).toHaveTextContent('Enter a 10-digit mobile number.');
  });

  test('without an error, only the hint describes the control', () => {
    render(
      <Field label="Email" hint="We only use it to reply." optional>
        <TextInput name="email" type="email" />
      </Field>
    );
    const input = screen.getByRole('textbox', { name: /Email/ });
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input).toHaveAccessibleDescription('We only use it to reply.');
    expect(screen.getByText(/optional/)).toBeInTheDocument();
  });

  test('says "required" to assistive technology; the asterisk is visual only', () => {
    const { container } = render(
      <Field label="Full name" required>
        <TextInput name="name" />
      </Field>
    );
    expect(screen.getByRole('textbox', { name: 'Full name required' })).toBeInTheDocument();
    const star = Array.from(container.querySelectorAll('[aria-hidden="true"]')).find((el) => el.textContent === '*');
    expect(star).toBeDefined();
  });

  test('wires TextArea and SelectInput the same way', () => {
    render(
      <>
        <Field label="Message" error="Too long.">
          <TextArea name="message" />
        </Field>
        <Field label="Interested in" hint="Pick one.">
          <SelectInput name="service" placeholder="Choose" options={['Interior Design', 'Renovation']} />
        </Field>
      </>
    );
    expect(screen.getByRole('textbox', { name: 'Message' })).toHaveAttribute('aria-invalid', 'true');
    const select = screen.getByRole('combobox', { name: 'Interested in' });
    expect(select).toHaveAccessibleDescription('Pick one.');
    expect(select).toHaveValue('');
  });

  test('group: a fieldset named by its legend, described and invalid as a whole', () => {
    render(
      <Field label="Budget" group error="Choose a range.">
        <ChoiceChips name="budget" options={['Under ₹10 lakh', 'Not sure yet']} />
      </Field>
    );
    const group = screen.getByRole('group', { name: 'Budget' });
    expect(group).toHaveAttribute('aria-invalid', 'true');
    expect(group).toHaveAccessibleDescription('Choose a range.');
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });
});
