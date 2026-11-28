/* ============================================
   Home, the rest (prompt 07): selected work, belief, services ledger,
   how we work, principal, invitation — and the page as a whole
   ============================================ */

import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { studio, studioTelHref } from '../../../data/siteConfig';
import { closingCta, homeCredentials } from '../../../data/studioContent';
import { services } from '../../../data/services';
import { getProject, projects } from '../../../data/projects';
import { phases, processSteps } from '../../../data/process';
import SelectedWorkSection, { FEATURED_SLUGS, featuredTiles } from '../sections/SelectedWorkSection';
import StatementSection from '../sections/StatementSection';
import ServicesIndexSection, { serviceHref } from '../sections/ServicesIndexSection';
import HowWeWorkSection, { phaseRows } from '../sections/HowWeWorkSection';
import PrincipalSection, { nameParts } from '../sections/PrincipalSection';
import ClosingSection from '../sections/ClosingSection';
import HomePage from '../HomePage';

const mockOpen = jest.fn();
jest.mock('../../../context/ModalContext', () => ({
  useModal: () => ({ openLeadModal: mockOpen }),
}));

jest.mock('../../../components/shell/transition/usePageReady', () => () => {});

// LineIcon fetches its SVG after mount; a static stand-in keeps these
// tests synchronous (the kit's own tests cover the fetch).
jest.mock('../../../components/ui/LineIcon/LineIcon', () => {
  const ReactLib = jest.requireActual('react');
  return {
    __esModule: true,
    default: ({ name }) => ReactLib.createElement('span', { 'data-line-icon': name, 'aria-hidden': true }),
  };
});

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

const oneAccent = (heading) => expect(heading.querySelectorAll('em')).toHaveLength(1);

describe('SelectedWorkSection', () => {
  test('three real projects, none of them the hero’s, each linking to its case study', () => {
    expect(FEATURED_SLUGS.every((slug) => getProject(slug))).toBe(true);
    expect(FEATURED_SLUGS).not.toContain('walnut-and-marble-living-hall');
    renderInScope(<SelectedWorkSection />);
    const region = screen.getByRole('region', { name: /Spaces we have designed\./ });
    expect(region).toHaveAttribute('data-tone', 'sand');
    oneAccent(within(region).getByRole('heading', { level: 2 }));
    const tiles = within(region).getAllByRole('heading', { level: 3 });
    expect(tiles.map((h) => h.textContent)).toEqual(FEATURED_SLUGS.map((slug) => getProject(slug).title));
    FEATURED_SLUGS.forEach((slug) => {
      const link = within(region).getByRole('link', { name: new RegExp(getProject(slug).title) });
      expect(link).toHaveAttribute('href', `/portfolio/${slug}`);
    });
    expect(within(region).getByRole('link', { name: /View all work/ })).toHaveAttribute('href', '/portfolio');
  });

  test('tiles show the portfolio number and category, and no location, year, area or client', () => {
    const tiles = featuredTiles();
    expect(tiles.map((t) => t.index)).toEqual(FEATURED_SLUGS.map((slug) => projects.findIndex((p) => p.slug === slug) + 1));
    const { container } = renderInScope(<SelectedWorkSection />);
    expect(container.textContent).not.toMatch(/\b(19|20)\d\d\b|sq\.?\s?ft|Patna/);
    expect(screen.getAllByText('Interior Design').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Modular Kitchens').length).toBeGreaterThan(0);
  });

  test('every tile image is lazy with dimensions; B and C switch to their 3:2 crop from 1024 px', () => {
    const { container } = renderInScope(<SelectedWorkSection />);
    const imgs = container.querySelectorAll('img');
    expect(imgs).toHaveLength(3);
    imgs.forEach((img) => {
      expect(img).toHaveAttribute('loading', 'lazy');
      expect(img).toHaveAttribute('width');
      expect(img).toHaveAttribute('height');
      expect(img.getAttribute('sizes')).toMatch(/78vw$/);
    });
    const wide = container.querySelectorAll('source[media="(min-width: 1024px)"][type="image/avif"]');
    expect(wide).toHaveLength(2);
    expect(wide[0].getAttribute('srcset')).toMatch(/pr-black-cover-wide/);
    expect(wide[1].getAttribute('srcset')).toMatch(/pr-pooja-cover-wide/);
  });

  test('a polite "1 / 3" counter and previous / next buttons that stay focusable at the ends', async () => {
    renderInScope(<SelectedWorkSection />);
    const status = screen.getByText(/Project 1 of 3/).closest('[aria-live]');
    expect(status).toHaveAttribute('aria-live', 'polite');
    const prev = screen.getByRole('button', { name: 'Previous project' });
    const next = screen.getByRole('button', { name: 'Next project' });
    expect(prev).toHaveAttribute('aria-disabled', 'true');
    expect(next).not.toHaveAttribute('aria-disabled');
    expect(prev).not.toBeDisabled();
    await userEvent.click(prev);
    expect(screen.getByText(/Project 1 of 3/)).toBeInTheDocument();
  });

  test('the counter follows the row when it scrolls', () => {
    renderInScope(<SelectedWorkSection />);
    const row = document.getElementById('home-work-row');
    const items = row.querySelectorAll('[data-work-item]');
    [0, 320, 640].forEach((left, i) => Object.defineProperty(items[i], 'offsetLeft', { value: 20 + left, configurable: true }));
    Object.defineProperty(row, 'scrollWidth', { value: 1300, configurable: true });
    Object.defineProperty(row, 'clientWidth', { value: 390, configurable: true });
    // Runs the frame at once; returns 0 because the callback has already
    // cleared the pending-frame id by the time the id would be stored.
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb();
      return 0;
    });
    act(() => {
      row.scrollLeft = 330;
      fireEvent.scroll(row);
    });
    expect(screen.getByText(/Project 2 of 3/)).toBeInTheDocument();
    act(() => {
      row.scrollLeft = 640;
      fireEvent.scroll(row);
    });
    expect(screen.getByText(/Project 3 of 3/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next project' })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('button', { name: 'Previous project' })).not.toHaveAttribute('aria-disabled');
    window.requestAnimationFrame.mockRestore();
  });
});

describe('StatementSection', () => {
  test('one sentence on forest, then the three kinds of work — no image, no button', () => {
    renderInScope(<StatementSection />);
    const region = screen.getByRole('region', { name: /Every space tells a story\./ });
    expect(region).toHaveAttribute('data-tone', 'dark');
    const h2 = within(region).getByRole('heading', { level: 2 });
    expect(h2).toHaveClass('ia-t-display-xl');
    oneAccent(h2);
    expect(h2.querySelector('em')).toHaveTextContent('tells a story.');
    expect(within(region).getByText('Residential · Commercial · Interiors')).toBeInTheDocument();
    expect(region.querySelector('img, button, a')).toBeNull();
  });
});

describe('ServicesIndexSection', () => {
  test('seven rows from the data, each one link to its /expertise item', () => {
    renderInScope(<ServicesIndexSection />);
    const region = screen.getByRole('region', { name: /From concept to completion\./ });
    expect(region).toHaveAttribute('data-tone', 'light');
    oneAccent(within(region).getByRole('heading', { level: 2 }));
    const rows = within(region).getAllByRole('listitem');
    expect(rows).toHaveLength(services.length);
    services.forEach((service, i) => {
      const link = within(rows[i]).getByRole('link');
      expect(link).toHaveAttribute('href', serviceHref(service));
      expect(link.getAttribute('href')).toBe(`/expertise#${service.id}`);
      expect(within(link).getByRole('heading', { level: 3 })).toHaveTextContent(service.title);
      expect(link).toHaveTextContent(service.tagline);
      expect(link).toHaveTextContent(service.num);
    });
  });

  test('the lede names the count the data holds, and Interiors point to their own page', () => {
    expect(services).toHaveLength(7);
    renderInScope(<ServicesIndexSection />);
    expect(screen.getByText('Seven services, each set out in full on the Expertise page.')).toBeInTheDocument();
    expect(screen.getByText('Interiors have a page of their own.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Interior Design/ })).toHaveAttribute('href', '/interior-design');
  });

  test('no hover preview without a fine pointer (jsdom matches nothing)', () => {
    const { container } = renderInScope(<ServicesIndexSection />);
    expect(container.querySelector('[data-line-icon]')).toBeNull();
  });
});

describe('HowWeWorkSection', () => {
  test('four phases grouping the seven steps, each with its first step’s icon', () => {
    const rows = phaseRows();
    expect(rows.map((r) => r.title)).toEqual(['Understand', 'Imagine', 'Detail', 'Deliver']);
    expect(rows.flatMap((r) => r.steps)).toEqual(processSteps.map((s) => s.title));
    expect(rows[0].icon).toBe(processSteps[0].icon);
    expect(rows.map((r) => r.numeral)).toEqual(['01', '02', '03', '04']);

    renderInScope(<HowWeWorkSection />);
    const region = screen.getByRole('region', { name: /A collaborative, detail-oriented process\./ });
    expect(region).toHaveAttribute('data-tone', 'sand');
    oneAccent(within(region).getByRole('heading', { level: 2 }));
    expect(within(region).getAllByRole('heading', { level: 3 })).toHaveLength(phases.length);
    expect(
      within(region).getByText((_, el) => el.tagName === 'P' && el.textContent === 'Initial Consultation · Site Study & Analysis')
    ).toBeInTheDocument();
    expect(within(region).getByRole('link', { name: /See the full seven-step process/ })).toHaveAttribute(
      'href',
      '/expertise#process'
    );
  });
});

describe('PrincipalSection', () => {
  test('nameParts', () => {
    expect(nameParts('Ar. Mohammad Hassanuddin')).toEqual({ lead: 'Ar. Mohammad', accent: 'Hassanuddin.' });
    expect(nameParts('Hassanuddin')).toEqual({ lead: '', accent: 'Hassanuddin.' });
  });

  test('name, role, the three credentials and the link — nothing else', () => {
    renderInScope(<PrincipalSection />);
    const region = screen.getByRole('region', { name: `${studio.principal.name}.` });
    expect(region).toHaveAttribute('data-tone', 'light');
    const h2 = within(region).getByRole('heading', { level: 2 });
    oneAccent(h2);
    expect(within(region).getByText(studio.principal.role)).toBeInTheDocument();
    expect(region.querySelectorAll('dt')).toHaveLength(3);
    homeCredentials.forEach(({ value }) => expect(within(region).getByText(value)).toBeInTheDocument());
    expect(within(region).getByRole('link', { name: /About the principal/ })).toHaveAttribute('href', '/about#principal');
    expect(region.querySelector('img, blockquote')).toBeNull();
    expect(region.textContent).not.toMatch(/\byears?\b|\b(19|20)\d\d\b|COA\/|CA\/\d/i);
  });
});

describe('ClosingSection', () => {
  beforeEach(() => mockOpen.mockClear());

  test('the PDF headline and line, one primary button as home-closing, WhatsApp and call', async () => {
    renderInScope(<ClosingSection />);
    const region = screen.getByRole('region', { name: /Have a project in mind\?/ });
    expect(region).toHaveAttribute('data-tone', 'dark');
    const h2 = within(region).getByRole('heading', { level: 2 });
    expect(h2).toHaveClass('ia-t-display-xl');
    oneAccent(h2);
    expect(within(region).getByText(closingCta.text)).toBeInTheDocument();

    const cta = within(region).getByRole('button', { name: /Start a conversation/ });
    expect(cta).toHaveAttribute('data-primary-cta');
    expect(region.querySelectorAll('[data-primary-cta]')).toHaveLength(1);
    await userEvent.click(cta);
    expect(mockOpen).toHaveBeenCalledWith('home-closing', { context: { label: 'Home — closing' } });

    const wa = within(region).getByRole('link', { name: /WhatsApp/ });
    expect(wa.getAttribute('href')).toMatch(new RegExp(`^https://wa\\.me/${studio.whatsapp}\\?text=.+`));
    expect(wa).toHaveAttribute('rel', expect.stringContaining('noopener'));
    expect(within(region).getByRole('link', { name: `Call ${studio.phoneDisplay}` })).toHaveAttribute('href', studioTelHref);
  });
});

describe('HomePage', () => {
  test('one ia root, eight bands in the specified tones, one h1, no link to /industries', () => {
    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    const root = container.firstElementChild;
    expect(root).toHaveClass('ia');
    expect(container.children).toHaveLength(1);
    const bands = Array.from(root.children);
    expect(bands.map((b) => b.getAttribute('data-tone'))).toEqual([
      'dark',
      'light',
      'sand',
      'dark',
      'light',
      'sand',
      'light',
      'dark',
    ]);
    bands.forEach((band) => expect(band.tagName).toBe('SECTION'));
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(7);
    expect(container.querySelector('a[href^="/industries"]')).toBeNull();
  });

  test('every deep link points at data that exists', () => {
    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    const hrefs = Array.from(container.querySelectorAll('a[href]')).map((a) => a.getAttribute('href'));
    hrefs
      .filter((h) => h.startsWith('/portfolio/'))
      .forEach((h) => expect(getProject(h.replace('/portfolio/', ''))).toBeDefined());
    const ids = services.map((s) => s.id);
    hrefs
      .filter((h) => /^\/expertise#e\d/.test(h))
      .forEach((h) => expect(ids).toContain(h.split('#')[1]));
    expect(hrefs.filter((h) => /^\/expertise#e\d/.test(h))).toHaveLength(7);
    expect(hrefs).toEqual(expect.arrayContaining(['/about', '/about#principal', '/portfolio', '/interior-design']));
  });
});
