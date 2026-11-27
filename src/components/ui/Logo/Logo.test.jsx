import React from 'react';
import { act, render, screen } from '@testing-library/react';
import Logo from './Logo';
import { studio } from '../../../data/siteConfig';

describe('Logo', () => {
  test('chooses the dark-ink file on a light tone', () => {
    render(
      <div className="ia" data-tone="light">
        <Logo variant="lockup" height={48} />
      </div>
    );
    const img = screen.getByRole('img', { name: studio.fullName });
    expect(img).toHaveAttribute('src', studio.logos.lockupOnLight.src);
    expect(img.getAttribute('src')).toMatch(/on-light/);
  });

  test('chooses the ivory file on a dark tone', () => {
    render(
      <div className="ia" data-tone="dark">
        <Logo variant="wordmark" height={26} />
      </div>
    );
    expect(screen.getByRole('img')).toHaveAttribute('src', studio.logos.wordmarkOnDark.src);
  });

  test('sand and paper count as light; the nearest tone wins', () => {
    render(
      <div className="ia" data-tone="dark">
        <div data-tone="paper">
          <Logo variant="mark" height={26} />
        </div>
      </div>
    );
    expect(screen.getByRole('img')).toHaveAttribute('src', studio.logos.markOnLight.src);
  });

  test('an explicit tone overrides the surroundings', () => {
    render(
      <div className="ia" data-tone="light">
        <Logo variant="mark" height={26} tone="dark" />
      </div>
    );
    expect(screen.getByRole('img')).toHaveAttribute('src', studio.logos.markOnDark.src);
  });

  test('sets intrinsic width and height from the file ratio, alt from studio.fullName', () => {
    render(<Logo variant="lockup" height={48} />);
    const img = screen.getByRole('img', { name: studio.fullName });
    const file = studio.logos.lockupOnLight;
    expect(img).toHaveAttribute('height', '48');
    expect(img).toHaveAttribute('width', String(Math.round((48 * file.width) / file.height)));
    expect(img.getAttribute('srcset')).toContain('800w');
  });

  test('follows a tone that changes later', async () => {
    const { container } = render(
      <div className="ia" data-tone="light" data-testid="host">
        <Logo variant="wordmark" height={22} />
      </div>
    );
    const host = container.firstChild;
    await act(async () => {
      host.setAttribute('data-tone', 'dark');
      await Promise.resolve();
    });
    expect(screen.getByRole('img')).toHaveAttribute('src', studio.logos.wordmarkOnDark.src);
  });
});
