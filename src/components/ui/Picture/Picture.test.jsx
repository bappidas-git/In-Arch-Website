import React from 'react';
import { render, screen } from '@testing-library/react';
import Picture from './Picture';
import manifest from '../../../data/imageManifest.json';
import { ALT } from '../../../data/images';

const SIZES = '(min-width: 1024px) 40vw, 100vw';

describe('Picture', () => {
  test('emits AVIF and WebP sources and a JPEG img with width, height and sizes from the manifest', () => {
    const entry = manifest['home-intro'];
    const { container } = render(<Picture image="home-intro" sizes={SIZES} />);
    const sources = container.querySelectorAll('picture > source');
    expect(Array.from(sources).map((s) => s.getAttribute('type'))).toEqual(['image/avif', 'image/webp']);

    const expectSet = (format) => entry.sources[format].map(({ w, src }) => `${src} ${w}w`).join(', ');
    expect(sources[0]).toHaveAttribute('srcset', expectSet('avif'));
    expect(sources[1]).toHaveAttribute('srcset', expectSet('webp'));
    sources.forEach((s) => expect(s).toHaveAttribute('sizes', SIZES));

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('srcset', expectSet('jpg'));
    expect(img.getAttribute('src')).toMatch(/\.jpg$/);
    expect(img).toHaveAttribute('width', String(entry.width));
    expect(img).toHaveAttribute('height', String(entry.height));
    expect(img).toHaveAttribute('sizes', SIZES);
    expect(img).toHaveAttribute('alt', ALT['home-intro']);
  });

  test('lazy by default; priority is eager with fetchpriority="high"', () => {
    const { rerender } = render(<Picture image="home-intro" sizes={SIZES} />);
    let img = screen.getByRole('img');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('decoding', 'async');
    expect(img).not.toHaveAttribute('fetchpriority');

    rerender(<Picture image="home-intro" sizes={SIZES} priority />);
    img = screen.getByRole('img');
    expect(img).toHaveAttribute('loading', 'eager');
    expect(img).toHaveAttribute('fetchpriority', 'high');
  });

  test('alt can be overridden, including empty for decoration', () => {
    const { container } = render(<Picture image="home-intro" sizes={SIZES} alt="" />);
    expect(container.querySelector('img')).toHaveAttribute('alt', '');
  });

  test('art direction: extra <source media> sets come first, with their own size', () => {
    const tall = manifest['home-hero-tall'];
    const { container } = render(
      <Picture image="home-hero-wide" sizes="100vw" art={[{ media: '(max-width: 767px)', image: 'home-hero-tall' }]} />
    );
    const sources = Array.from(container.querySelectorAll('picture > source'));
    expect(sources).toHaveLength(5);
    const art = sources.slice(0, 3);
    art.forEach((s) => {
      expect(s).toHaveAttribute('media', '(max-width: 767px)');
      expect(s).toHaveAttribute('width', String(tall.width));
      expect(s).toHaveAttribute('height', String(tall.height));
    });
    expect(art.map((s) => s.getAttribute('type'))).toEqual(['image/avif', 'image/webp', 'image/jpeg']);
    expect(sources[3]).not.toHaveAttribute('media');
  });

  test('the placeholder is the wrapper background', () => {
    const { container } = render(<Picture image="home-intro" sizes={SIZES} />);
    expect(container.querySelector('picture').style.backgroundImage).toContain('data:image/webp;base64');
  });
});
