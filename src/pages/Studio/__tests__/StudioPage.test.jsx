/* ============================================
   Studio (prompt 08): the page at /about and its six sections
   ============================================ */

import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { studio, studioMapsHref, studioTelHref } from '../../../data/siteConfig';
import { about, mission, philosophy, principal, vision } from '../../../data/studioContent';
import { seoConfig } from '../../../config/seo';
import StudioPage from '../StudioPage';
import StudioHero, { heroLede } from '../sections/StudioHero';
import AboutSection from '../sections/AboutSection';
import PhilosophySection from '../sections/PhilosophySection';
import VisionMissionSection, { visionParts } from '../sections/VisionMissionSection';
import PrincipalSection, { biography, credentialFacts, educationLines } from '../sections/PrincipalSection';
import VisitSection from '../sections/VisitSection';

const mockOpen = jest.fn();
jest.mock('../../../context/ModalContext', () => ({
  useModal: () => ({ openLeadModal: mockOpen }),
}));

jest.mock('../../../components/shell/transition/usePageReady', () => () => {});

beforeAll(() => {
  jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
});

afterAll(() => {
  window.scrollTo.mockRestore();
});

beforeEach(() => {
  mockOpen.mockClear();
});

const renderInScope = (ui) =>
  render(
    <MemoryRouter>
      <div className="ia">{ui}</div>
    </MemoryRouter>
  );

const oneAccent = (heading) => expect(heading.querySelectorAll('em')).toHaveLength(1);
const squash = (text) => text.replace(/\s+/g, ' ').trim();

describe('StudioPage', () => {
  test('one ia root, one h1, six bands in the planned tones, the principal at #principal', () => {
    const { container } = render(
      <MemoryRouter>
        <StudioPage />
      </MemoryRouter>
    );
    const root = container.firstChild;
    expect(root).toHaveClass('ia');
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    const bands = Array.from(root.children);
    expect(bands.map((band) => band.getAttribute('data-tone'))).toEqual(['light', 'light', 'dark', 'sand', 'light', 'dark']);
    expect(bands.every((band) => band.tagName === 'SECTION')).toBe(true);
    expect(container.querySelector('#principal')).toBe(bands[4]);
    // Every band has an accessible name.
    bands.forEach((band) => {
      expect(band.getAttribute('aria-labelledby') || band.getAttribute('aria-label')).toBeTruthy();
    });
    // Headings in order: h1, then h2s, with h3s only below an h2.
    const levels = Array.from(container.querySelectorAll('h1, h2, h3')).map((h) => Number(h.tagName[1]));
    expect(levels[0]).toBe(1);
    levels.slice(1).forEach((level, i) => expect(level - levels[i]).toBeLessThanOrEqual(1));
  });

  test('says nothing the client did not supply', () => {
    const { container } = render(
      <MemoryRouter>
        <StudioPage />
      </MemoryRouter>
    );
    const text = container.textContent;
    expect(text).not.toMatch(/["“”]/);
    expect(text).not.toMatch(/years? of experience|established|founded|since \d{4}|team of|clients include|award|rating|testimonial/i);
    // The previous brand and its sector (written as classes so a plain grep of this folder stays empty).
    expect(text).not.toMatch(/du[l]cey|ph[a]rma|trust\. s[e]curity/i);
    expect(container.querySelector('a[href^="mailto:"]')).toBeNull();
  });

  test('the SEO entry', () => {
    const { about: entry } = seoConfig.pages;
    expect(entry.path).toBe('/about');
    expect(entry.title).toBe('About In-Arch Architects, Patna | IN-ARCH');
    expect(entry.description).toBe(
      'In-Arch Architects & Interior Designer is an architecture and interior design practice in Patna, Bihar, led by Principal Architect Ar. Mohammad Hassanuddin, a registered architect with the Council of Architecture, India.'
    );
    expect(entry.breadcrumb).toBe('Studio');
    expect(entry.robots).toBe('index, follow');
  });
});

describe('StudioHero', () => {
  test('the h1, the eyebrow and the lede with the place from studio', () => {
    renderInScope(<StudioHero />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(squash(h1.textContent)).toBe('Design with purpose.');
    oneAccent(h1);
    expect(h1.querySelector('em').textContent).toBe('purpose.');
    // The first principle of the PDF's design philosophy, in sentence case.
    expect(`${philosophy[0].title}.`.toLowerCase()).toBe('design with purpose.');
    expect(screen.getByText('The studio')).toBeInTheDocument();
    expect(heroLede()).toBe(
      'An architecture and interior design practice in Patna, Bihar, focused on spaces that are functional, visually appealing and thoughtfully planned.'
    );
    expect(screen.getByText(heroLede())).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Design with purpose.' })).toHaveAttribute('data-tone', 'light');
  });

  test('the band: the 21:9 crop with the 4:3 crop below 768 px, loaded eagerly, in a revealing, drifting frame', () => {
    const { container } = renderInScope(<StudioHero />);
    const img = container.querySelector('img');
    expect(img.getAttribute('src')).toMatch(/studio-band-wide-/);
    expect(img).toHaveAttribute('loading', 'eager');
    expect(img).toHaveAttribute('fetchpriority', 'high');
    expect(img).toHaveAttribute('sizes', '100vw');
    expect(img.getAttribute('alt')).toBeTruthy();
    const tall = container.querySelector('source[media="(max-width: 767px)"]');
    expect(tall.getAttribute('srcset')).toMatch(/studio-band-tall-/);
    const frame = container.querySelector('[data-m="shutter"]');
    expect(frame).toHaveAttribute('data-m-parallax');
    expect(frame.style.getPropertyValue('--frame-ratio')).toBe('4 / 3');
    expect(frame.style.getPropertyValue('--frame-ratio-md')).toBe('21 / 9');
  });
});

describe('AboutSection', () => {
  test('paragraphs two to five of "About In-Arch", verbatim, under the heading', () => {
    renderInScope(<AboutSection />);
    const region = screen.getByRole('region', { name: /Understanding people/ });
    const h2 = within(region).getByRole('heading', { level: 2 });
    expect(squash(h2.textContent)).toBe('Understanding people, then designing for them.');
    oneAccent(h2);
    const paragraphs = Array.from(region.querySelectorAll('p')).filter((p) => !p.closest('[class*="eyebrow"]'));
    const prose = paragraphs.map((p) => p.textContent).filter((t) => about.includes(t));
    expect(prose).toEqual(about.slice(1, 5));
    expect(screen.getByText(about[1])).toHaveClass('ia-t-body-lg');
    about.slice(2, 5).forEach((paragraph) => expect(screen.getByText(paragraph)).toHaveClass('ia-t-body'));
    expect(region.querySelector('img')).toBeNull();
  });
});

describe('PhilosophySection', () => {
  test('the four principles, titles and sentences verbatim, as an ordered list', () => {
    renderInScope(<PhilosophySection />);
    const region = screen.getByRole('region', { name: /Four principles/ });
    expect(region).toHaveAttribute('data-tone', 'dark');
    oneAccent(within(region).getByRole('heading', { level: 2 }));
    const list = region.querySelector('ol');
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(4);
    items.forEach((item, i) => {
      expect(within(item).getByRole('heading', { level: 3 }).textContent).toBe(philosophy[i].title);
      expect(within(item).getByText(philosophy[i].text)).toBeInTheDocument();
    });
    expect(philosophy.map((p) => p.title)).toEqual([
      'Design with Purpose',
      'Aesthetics with Functionality',
      'Attention to Detail',
      'Client-Centric Approach',
    ]);
  });

  test('the panel numeral follows the principle crossing the middle of the viewport', () => {
    let observerCallback = null;
    const observed = [];
    const original = window.IntersectionObserver;
    window.IntersectionObserver = class {
      constructor(callback, options) {
        observerCallback = callback;
        this.options = options;
      }

      observe(el) {
        observed.push(el);
      }

      disconnect() {}
    };
    try {
      const { container } = renderInScope(<PhilosophySection />);
      const current = () => container.querySelector('[data-current]');
      expect(current().textContent).toBe('01');
      expect(current().closest('[aria-hidden="true"]')).not.toBeNull();
      expect(observed).toHaveLength(4);
      act(() => observerCallback([{ target: observed[2], isIntersecting: true }]));
      expect(current().textContent).toBe('03');
      act(() => observerCallback([{ target: observed[2], isIntersecting: false }]));
      expect(current().textContent).toBe('03');
      expect(container.querySelectorAll('[data-current]')).toHaveLength(1);
    } finally {
      window.IntersectionObserver = original;
    }
  });

  test('the detail photograph sits in a 4:5 frame and is lazy', () => {
    const { container } = renderInScope(<PhilosophySection />);
    const img = container.querySelector('img');
    expect(img.getAttribute('src')).toMatch(/studio-detail-/);
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(container.querySelector('[data-m="shutter"]').style.getPropertyValue('--frame-ratio')).toBe('4 / 5');
  });
});

describe('VisionMissionSection', () => {
  test('the vision verbatim as the h2, with one accent and unchanged words', () => {
    renderInScope(<VisionMissionSection />);
    const region = screen.getByRole('region', { name: 'Vision and mission' });
    expect(region).toHaveAttribute('data-tone', 'sand');
    const h2 = within(region).getByRole('heading', { level: 2 });
    expect(squash(h2.textContent)).toBe(vision);
    oneAccent(h2);
    const { lead, accent } = visionParts();
    expect(`${lead} ${accent}`).toBe(vision);
    expect(accent).toBe('meaningful built environments.');
    expect(visionParts('A sentence without the clause.')).toEqual({ lead: 'A sentence without the clause.', accent: '' });
  });

  test('the five mission points verbatim, numbered 01–05, in order', () => {
    renderInScope(<VisionMissionSection />);
    const list = screen.getByRole('list', { name: 'Mission' });
    expect(list.tagName).toBe('OL');
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(5);
    items.forEach((item, i) => {
      expect(within(item).getByText(mission[i])).toBeInTheDocument();
      expect(item.textContent.startsWith(String(i + 1).padStart(2, '0'))).toBe(true);
    });
  });
});

describe('PrincipalSection', () => {
  test('name, role, biography and the statement — set apart, never in quotation marks', () => {
    renderInScope(<PrincipalSection />);
    const region = screen.getByRole('region', { name: /Hassanuddin/ });
    expect(region).toHaveAttribute('id', 'principal');
    const h2 = within(region).getByRole('heading', { level: 2 });
    expect(squash(h2.textContent)).toBe('Ar. Mohammad Hassanuddin.');
    oneAccent(h2);
    expect(within(region).getByText(studio.principal.role)).toBeInTheDocument();
    const { prose, statement } = biography();
    expect(prose).toEqual(principal.bio.slice(0, 4));
    prose.forEach((paragraph) => expect(within(region).getByText(paragraph)).toBeInTheDocument());
    expect(statement).toBe(
      'He believes in continuously improving design skills, exploring new ideas and delivering projects with a strong focus on functionality and aesthetics.'
    );
    const statementEl = within(region).getByText(statement);
    expect(statementEl).toHaveClass('ia-t-display-sm');
    expect(statementEl.tagName).toBe('P');
    expect(statementEl.closest('blockquote, q')).toBeNull();
    // Said once only.
    expect(within(region).getAllByText(statement)).toHaveLength(1);
  });

  test('the five credentials, the experience in the PDF’s order and the education', () => {
    renderInScope(<PrincipalSection />);
    const facts = credentialFacts();
    expect(facts).toHaveLength(5);
    facts.forEach((fact, i) => expect(`${fact.label}, ${fact.value}.`).toBe(principal.credentials[i]));
    const terms = screen.getAllByRole('term').map((t) => t.textContent);
    expect(terms).toEqual(facts.map((f) => f.label));

    const table = screen.getByRole('table', { name: 'Experience' });
    const rows = within(table).getAllByRole('row').slice(1);
    expect(rows.map((row) => within(row).getAllByRole('cell').map((c) => c.textContent))).toEqual([
      ['Council of Architecture, India', 'Registered Architect', 'December 2020 – Present'],
      ['Zenith', 'Project Architect', ''],
      ['Patna Municipal Corporation', 'Registered Architect', 'December 2020 – Present'],
      ['Gaya Municipal Corporation', 'Registered Architect', 'December 2020 – Present'],
      ['Novarch Consultants, New Delhi', 'Architectural Intern', 'May 2020 – November 2020'],
    ]);
    expect(within(table).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Organisation', 'Role', 'Period']);

    expect(educationLines()).toEqual([
      'Bachelor of Architecture (B.Arch)',
      'Piloo Mody College of Architecture (PMCA), Cuttack, Odisha',
    ]);
    const education = screen.getByRole('heading', { level: 3, name: 'Education' }).parentElement;
    educationLines().forEach((line) => expect(within(education).getByText(line)).toBeInTheDocument());
  });

  test('no portrait supplied: the typographic plate, hidden from assistive technology', () => {
    expect(studio.principal.portrait).toBeFalsy();
    const { container } = renderInScope(<PrincipalSection />);
    const frame = container.querySelector('[data-m="shutter"]');
    expect(frame.style.getPropertyValue('--frame-ratio')).toBe('4 / 5');
    const plate = frame.querySelector('[data-tone="dark"]');
    expect(plate).toHaveAttribute('aria-hidden', 'true');
    expect(plate.textContent).toBe(studio.principal.title);
    expect(plate.querySelector('img[data-logo-variant="mark"]')).toHaveAttribute('height', '72');
    expect(frame.querySelector('picture')).toBeNull();
  });

  test('a portrait key renders that photograph in the same slot instead', () => {
    const before = studio.principal.portrait;
    studio.principal.portrait = 'studio-detail';
    try {
      const { container } = renderInScope(<PrincipalSection />);
      const frame = container.querySelector('[data-m="shutter"]');
      expect(frame.style.getPropertyValue('--frame-ratio')).toBe('4 / 5');
      expect(frame.querySelector('[data-tone="dark"]')).toBeNull();
      const img = frame.querySelector('img');
      expect(img.getAttribute('src')).toMatch(/studio-detail-/);
      expect(img).toHaveAttribute('alt', studio.principal.name);
      expect(img).toHaveAttribute('loading', 'lazy');
    } finally {
      studio.principal.portrait = before;
    }
  });
});

describe('VisitSection', () => {
  test('Talk first, then Visit; phone, WhatsApp and directions links well-formed; no email', () => {
    const { container } = renderInScope(<VisitSection />);
    const region = screen.getByRole('region', { name: 'Visit and talk' });
    expect(region).toHaveAttribute('data-tone', 'dark');
    const labels = within(region).getAllByRole('heading', { level: 3 }).map((h) => h.textContent);
    expect(labels).toEqual(['Talk', 'Visit']);

    const tel = within(region).getByRole('link', { name: studio.phoneDisplay });
    expect(tel).toHaveAttribute('href', studioTelHref);

    const whatsapp = within(region).getByRole('link', { name: /WhatsApp/ });
    expect(whatsapp.getAttribute('href')).toMatch(new RegExp(`^https://wa\\.me/${studio.whatsapp}\\?text=`));
    expect(whatsapp).toHaveAttribute('target', '_blank');
    expect(whatsapp.getAttribute('rel')).toMatch(/noopener/);
    expect(whatsapp.textContent).toMatch(/opens in a new tab/);

    const directions = within(region).getByRole('link', { name: /Get directions/ });
    expect(directions).toHaveAttribute('href', studioMapsHref);
    expect(directions).toHaveAttribute('target', '_blank');
    expect(directions.getAttribute('rel')).toMatch(/noopener/);
    expect(directions.textContent).toMatch(/opens in a new tab/);

    expect(region.querySelector('address').textContent).toBe('Boring RoadPatna, BiharIndia');
    expect(within(region).getByText('From 10:00 AM')).toBeInTheDocument();
    expect(container.querySelector('a[href^="mailto:"]')).toBeNull();
  });

  test('"Talk to the studio" is secondary and opens the sheet as studio-closing', () => {
    renderInScope(<VisitSection />);
    const button = screen.getByRole('button', { name: /Talk to the studio/ });
    expect(button).not.toHaveAttribute('data-primary-cta');
    fireEvent.click(button);
    expect(mockOpen).toHaveBeenCalledWith('studio-closing', { context: { label: 'Studio' } });
  });
});
