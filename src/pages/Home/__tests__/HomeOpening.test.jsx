/* ============================================
   Home opening (prompt 06): the hero and the opening statement
   ============================================ */

import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { studio } from '../../../data/siteConfig';
import { about, heroLine } from '../../../data/studioContent';
import { services } from '../../../data/services';
import { seoConfig } from '../../../config/seo';
import HeroSection, { taglineLines, HERO_TITLE_ID } from '../sections/HeroSection';
import ManifestoSection from '../sections/ManifestoSection';

const mockOpen = jest.fn();
jest.mock('../../../context/ModalContext', () => ({
  useModal: () => ({ openLeadModal: mockOpen }),
}));

// ScrollTrigger refreshes call window.scrollTo, which jsdom does not implement.
beforeAll(() => {
  jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
});

afterAll(() => {
  window.scrollTo.mockRestore();
});

const renderInScope = (ui) =>
  render(
    <MemoryRouter>
      <div className="ia">{ui}</div>
    </MemoryRouter>
  );

describe('taglineLines', () => {
  test('one sentence per line, in sentence case', () => {
    expect(taglineLines('Designing Spaces. Shaping Experiences.')).toEqual(['Designing spaces.', 'Shaping experiences.']);
  });

  test('keeps acronyms and copes with one sentence', () => {
    expect(taglineLines('Spaces in 3D. IN-ARCH Builds.')).toEqual(['Spaces in 3D.', 'IN-ARCH builds.']);
    expect(taglineLines('Spaces For Living')).toEqual(['Spaces for living']);
  });

  test('the studio tagline (owner decision D-10) gives two lines', () => {
    expect(taglineLines(studio.tagline)).toHaveLength(2);
  });
});

describe('HeroSection', () => {
  beforeEach(() => mockOpen.mockClear());

  test('a dark band named by its one h1; the second line is the accent', () => {
    renderInScope(<HeroSection />);
    const region = screen.getByRole('region', { name: /Designing spaces\.\s*Shaping experiences\./ });
    expect(region).toHaveAttribute('data-tone', 'dark');
    const h1 = within(region).getByRole('heading', { level: 1 });
    expect(h1).toHaveAttribute('id', HERO_TITLE_ID);
    expect(h1.querySelectorAll('em')).toHaveLength(1);
    expect(h1.querySelector('em')).toHaveTextContent('Shaping experiences.');
  });

  test('copy comes from the data modules', () => {
    renderInScope(<HeroSection />);
    expect(screen.getByText(heroLine)).toBeInTheDocument();
    expect(screen.getByText(`Architecture & interior design — ${studio.address.city}`)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`Led by ${studio.principal.name}`))).toBeInTheDocument();
  });

  test('"Start a project" is the primary CTA and opens the modal as home-hero', async () => {
    renderInScope(<HeroSection />);
    const cta = screen.getByRole('button', { name: /Start a project/ });
    expect(cta).toHaveAttribute('data-primary-cta');
    await userEvent.click(cta);
    expect(mockOpen).toHaveBeenCalledWith('home-hero', { context: { label: 'Home — hero' } });
  });

  test('"View selected work" links to /portfolio', () => {
    renderInScope(<HeroSection />);
    expect(screen.getByRole('link', { name: /View selected work/ })).toHaveAttribute('href', '/portfolio');
  });

  test('the photograph is the eager, high-priority, art-directed first-screen image', () => {
    const { container } = renderInScope(<HeroSection />);
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('loading', 'eager');
    expect(img).toHaveAttribute('fetchpriority', 'high');
    expect(img).toHaveAttribute('sizes', '100vw');
    expect(img).toHaveAttribute('width');
    expect(img).toHaveAttribute('height');
    const tall = container.querySelector('source[media="(max-width: 767px)"][type="image/avif"]');
    expect(tall.getAttribute('srcset')).toMatch(/home-hero-tall-480\.avif 480w/);
    expect(container.querySelector('source:not([media])[type="image/avif"]').getAttribute('srcset')).toMatch(/home-hero-wide-1920\.avif/);
  });
});

describe('ManifestoSection', () => {
  test('a light band, an h2 with one accent, the first About paragraph and the studio link', () => {
    renderInScope(<ManifestoSection />);
    const region = screen.getByRole('region', { name: 'The practice' });
    expect(region).toHaveAttribute('data-tone', 'light');
    const h2 = within(region).getByRole('heading', { level: 2 });
    expect(h2).toHaveTextContent(/^Architecture is more than the creation of buildings\./);
    expect(h2.querySelectorAll('em')).toHaveLength(1);
    expect(within(region).getByText(about[0])).toBeInTheDocument();
    expect(within(region).getByRole('link', { name: /Discover the studio/ })).toHaveAttribute('href', '/about');
    const img = region.querySelector('img');
    expect(img).toHaveAttribute('loading', 'lazy');
  });
});

describe('Home SEO entry', () => {
  const { home } = seoConfig.pages;

  test('title and description from PDF §12', () => {
    expect(home.title).toBe('In-Arch Architects & Interior Designer | Architects in Patna, Bihar');
    expect(home.description).toBe(
      'In-Arch Architects & Interior Designer, led by Ar. Mohammad Hassanuddin, offers architectural design, residential planning, interior design, 3D visualisation and project consultancy in Patna, Bihar.'
    );
    expect(home.services).toBe(true);
  });

  test('keywords leave out the superlative', () => {
    expect(home.keywords).toMatch(/Architects in Patna/);
    expect(home.keywords).not.toMatch(/best/i);
  });

  test('the service schema lists the seven services with their /expertise deep links', () => {
    expect(seoConfig.services.items.map((i) => i.name)).toEqual(services.map((s) => s.title));
    seoConfig.services.items.forEach((item, i) => expect(item.url).toMatch(new RegExp(`/expertise#e0${i + 1}$`)));
    expect(seoConfig.organization.knowsAbout).toEqual(services.map((s) => s.title));
  });
});
