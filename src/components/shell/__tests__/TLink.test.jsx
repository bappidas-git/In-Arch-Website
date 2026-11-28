/* ============================================
   TLink — plain clicks go to the transition; everything else is a link
   ============================================ */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import TLink, { shouldTransition, isExternal } from '../transition/TLink';
import { TransitionContext } from '../transition/TransitionProvider';

const Where = () => {
  const location = useLocation();
  return <output data-testid="where">{location.pathname + location.hash}</output>;
};

const setup = (link, { provider = true, at = '/' } = {}) => {
  const api = { navigate: jest.fn(), preload: jest.fn() };
  const tree = (
    <MemoryRouter initialEntries={[at]}>
      <Routes>
        <Route
          path="*"
          element={
            <>
              {link}
              <Where />
            </>
          }
        />
      </Routes>
    </MemoryRouter>
  );
  render(provider ? <TransitionContext.Provider value={api}>{tree}</TransitionContext.Provider> : tree);
  return api;
};

describe('TLink', () => {
  test('a plain left click on another path is handed to the transition', () => {
    const api = setup(<TLink to="/portfolio">Portfolio</TLink>);
    const link = screen.getByRole('link', { name: 'Portfolio' });
    expect(link).toHaveAttribute('href', '/portfolio');
    fireEvent.click(link, { button: 0 });
    expect(api.navigate).toHaveBeenCalledWith('/portfolio', { replace: undefined, state: undefined });
    // The router did not navigate by itself: the provider does that under cover.
    expect(screen.getByTestId('where')).toHaveTextContent(/^\/$/);
  });

  test.each([
    ['metaKey', { metaKey: true }],
    ['ctrlKey', { ctrlKey: true }],
    ['shiftKey', { shiftKey: true }],
    ['altKey', { altKey: true }],
    ['middle button', { button: 1 }],
  ])('a click with %s is left alone', (_, init) => {
    const api = setup(<TLink to="/portfolio">Portfolio</TLink>);
    fireEvent.click(screen.getByRole('link', { name: 'Portfolio' }), { button: 0, ...init });
    expect(api.navigate).not.toHaveBeenCalled();
  });

  test('target="_blank" is left alone', () => {
    const api = setup(
      <TLink to="/portfolio" target="_blank">
        Portfolio
      </TLink>
    );
    fireEvent.click(screen.getByRole('link', { name: 'Portfolio' }), { button: 0 });
    expect(api.navigate).not.toHaveBeenCalled();
  });

  test('an external URL is left alone', () => {
    const api = setup(<TLink to="https://wa.me/917292831128">WhatsApp</TLink>);
    const link = screen.getByRole('link', { name: 'WhatsApp' });
    expect(link).toHaveAttribute('href', 'https://wa.me/917292831128');
    fireEvent.click(link, { button: 0 });
    expect(api.navigate).not.toHaveBeenCalled();
  });

  test('a hash-only link is left alone and handled by the router', () => {
    const api = setup(<TLink to="#enquiry">Enquiry</TLink>, { at: '/contact' });
    fireEvent.click(screen.getByRole('link', { name: 'Enquiry' }), { button: 0 });
    expect(api.navigate).not.toHaveBeenCalled();
    expect(screen.getByTestId('where')).toHaveTextContent('/contact#enquiry');
  });

  test('a link to the current path (with a hash) is left alone', () => {
    const api = setup(<TLink to="/expertise#e03">Item 03</TLink>, { at: '/expertise' });
    fireEvent.click(screen.getByRole('link', { name: 'Item 03' }), { button: 0 });
    expect(api.navigate).not.toHaveBeenCalled();
    expect(screen.getByTestId('where')).toHaveTextContent('/expertise#e03');
  });

  test('a click its own handler prevented is left alone', () => {
    const api = setup(
      <TLink to="/portfolio" onClick={(e) => e.preventDefault()}>
        Portfolio
      </TLink>
    );
    fireEvent.click(screen.getByRole('link', { name: 'Portfolio' }), { button: 0 });
    expect(api.navigate).not.toHaveBeenCalled();
  });

  test('without a provider it is an ordinary router link', () => {
    setup(<TLink to="/portfolio">Portfolio</TLink>, { provider: false });
    fireEvent.click(screen.getByRole('link', { name: 'Portfolio' }), { button: 0 });
    expect(screen.getByTestId('where')).toHaveTextContent('/portfolio');
  });

  test('hover, focus and touch warm the target route', () => {
    const api = setup(<TLink to="/about">Studio</TLink>);
    const link = screen.getByRole('link', { name: 'Studio' });
    fireEvent.pointerEnter(link);
    fireEvent.focus(link);
    fireEvent.touchStart(link);
    expect(api.preload).toHaveBeenCalledTimes(3);
    expect(api.preload).toHaveBeenCalledWith('/about');
  });
});

describe('shouldTransition / isExternal', () => {
  const plain = { button: 0 };
  const base = { to: '/a', currentPath: '/', nextPath: '/a' };

  test('rules', () => {
    expect(shouldTransition(plain, base)).toBe(true);
    expect(shouldTransition({ ...plain, defaultPrevented: true }, base)).toBe(false);
    expect(shouldTransition(plain, { ...base, reloadDocument: true })).toBe(false);
    expect(shouldTransition(plain, { ...base, target: '_self' })).toBe(true);
    expect(shouldTransition(plain, { ...base, currentPath: '/a/' })).toBe(false);
  });

  test('external detection', () => {
    ['https://x.y', 'tel:+91', 'mailto:a@b', '//cdn.x'].forEach((to) => expect(isExternal(to)).toBe(true));
    ['/about', '#x', 'about', { pathname: '/a' }].forEach((to) => expect(isExternal(to)).toBe(false));
  });
});
