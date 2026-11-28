/* ============================================
   Footer — silent where the client supplied nothing
   ============================================ */

import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ModalProvider } from '../../../context/ModalContext';
import { studio } from '../../../data/siteConfig';
import { services } from '../../../data/services';
import { NAV_LINKS } from '../../../data/navigation';
import Footer from '../Footer/Footer';

const renderFooter = () =>
  render(
    <MemoryRouter>
      <ModalProvider>
        <Footer />
      </ModalProvider>
    </MemoryRouter>
  );

describe('Footer', () => {
  test('the email is still empty in studio (owner decision D-03)', () => {
    expect(studio.email).toBe('');
  });

  test('renders no email row while studio.email is empty', () => {
    const { container } = renderFooter();
    expect(container.querySelector('[data-footer-email]')).toBeNull();
    expect(container.querySelector('a[href^="mailto:"]')).toBeNull();
  });

  test('is a dark contentinfo landmark in the ia scope', () => {
    renderFooter();
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('ia');
    expect(footer).toHaveAttribute('data-tone', 'dark');
  });

  test('Explore lists the six destinations', () => {
    renderFooter();
    const nav = screen.getByRole('navigation', { name: 'Footer' });
    expect(within(nav).getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual(NAV_LINKS.map((l) => l.to));
  });

  test('Services links each of the seven to its /expertise deep link', () => {
    renderFooter();
    const group = screen.getByRole('region', { name: 'Services' });
    services.forEach((service) => {
      expect(within(group).getByRole('link', { name: service.title })).toHaveAttribute('href', `/expertise#${service.id}`);
    });
  });

  test('Talk: phone and WhatsApp; the block is marked for the dock', () => {
    const { container } = renderFooter();
    expect(container.querySelector(`a[href="tel:${studio.phone}"]`)).not.toBeNull();
    expect(container.querySelector(`a[href^="https://wa.me/${studio.whatsapp}"]`)).not.toBeNull();
    expect(container.querySelector('[data-footer-contact]')).not.toBeNull();
  });

  test('legal row: copyright, developer credit in a new tab, back to top', () => {
    renderFooter();
    expect(screen.getByText(new RegExp(`${new Date().getFullYear()} In-Arch Architects & Interior Designer`))).toBeInTheDocument();
    const credit = screen.getByRole('link', { name: /Assam Digital \(opens in a new tab\)/ });
    expect(credit).toHaveAttribute('target', '_blank');
    expect(credit).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByRole('button', { name: 'Back to top' })).toBeInTheDocument();
  });

  test('no Icons8 credit while no Icons8 asset ships (D-13)', () => {
    renderFooter();
    expect(screen.queryByRole('link', { name: /Icons8/ })).toBeNull();
  });
});
