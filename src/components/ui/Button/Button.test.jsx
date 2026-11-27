import React, { forwardRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Button from './Button';
import LinkProvider from '../LinkProvider/LinkProvider';

describe('Button', () => {
  test('renders a <button type="button"> by default', () => {
    render(<Button>Start a project</Button>);
    const button = screen.getByRole('button', { name: 'Start a project' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
  });

  test('renders a submit button when asked', () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute('type', 'submit');
  });

  test('renders a plain <a href> for href, with rel on new-tab links', () => {
    render(
      <Button href="https://wa.me/917292831128" target="_blank">
        WhatsApp
      </Button>
    );
    const link = screen.getByRole('link', { name: 'WhatsApp' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://wa.me/917292831128');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('renders react-router Link for `to` by default', () => {
    render(
      <MemoryRouter>
        <Button to="/portfolio">View work</Button>
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'View work' })).toHaveAttribute('href', '/portfolio');
  });

  test('renders the LinkProvider component for `to`', () => {
    const FakeLink = forwardRef(({ to, children, ...rest }, ref) => (
      <a ref={ref} href={`#fake${to}`} data-fake-link="" {...rest}>
        {children}
      </a>
    ));
    render(
      <LinkProvider component={FakeLink}>
        <Button to="/about">Studio</Button>
      </LinkProvider>
    );
    const link = screen.getByRole('link', { name: 'Studio' });
    expect(link).toHaveAttribute('data-fake-link');
    expect(link).toHaveAttribute('href', '#fake/about');
  });

  test('loading: aria-busy, the loading label, and no activation', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    const onSubmit = jest.fn((e) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button type="submit" loading loadingLabel="Sending…" onClick={onClick}>
          Send enquiry
        </Button>
      </form>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveTextContent('Sending…');
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test('disabled: native attribute, cannot be activated', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Button disabled onClick={onClick}>
        Send
      </Button>
    );
    const button = screen.getByRole('button', { name: 'Send' });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  test('aria-disabled: stays focusable, still cannot be activated', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Button aria-disabled="true" onClick={onClick}>
        Send
      </Button>
    );
    const button = screen.getByRole('button', { name: 'Send' });
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  test('a disabled link is marked aria-disabled and does not navigate', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Button href="/contact" disabled onClick={onClick}>
        Contact
      </Button>
    );
    const link = screen.getByRole('link', { name: 'Contact' });
    expect(link).toHaveAttribute('aria-disabled', 'true');
    await user.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });

  test('forwards refs and unknown props to the root', () => {
    const ref = React.createRef();
    render(
      <Button ref={ref} data-primary-cta="" className="extra">
        Go
      </Button>
    );
    expect(ref.current).toBe(screen.getByRole('button', { name: 'Go' }));
    expect(ref.current).toHaveAttribute('data-primary-cta');
    expect(ref.current).toHaveClass('extra');
  });
});
