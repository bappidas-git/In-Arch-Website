/* ============================================
   Content model — truth and consistency (prompt 02)
   --------------------------------------------
   Guards the data layer every later prompt reads: the facts, the copy
   from `details of in-arch.pdf`, the image manifest and the asset files.
   ============================================ */

import fs from 'fs';
import path from 'path';

import siteConfig, {
  LOGO_SIZE,
  studio,
  studioMailHref,
  studioMapsHref,
  studioTelHref,
  studioUrl,
  studioWhatsAppHref,
  studioAddressLines,
  studioHoursLabel,
} from '../siteConfig';
import { services, serviceTitles, SOMETHING_ELSE, getService } from '../services';
import { processSteps, phases, statusIcons } from '../process';
import { faqs, FAQ_TOPICS } from '../faqs';
import studioContent from '../studioContent';
import { categories, projects, nextProject } from '../projects';
import { interiorFaqIds, roomStories, materials, scopeGroups, renovation } from '../interiors';
import { credits, footerCredits } from '../credits';
import manifest from '../imageManifest.json';
import { ALT, image, srcSet } from '../images';

const ROOT = path.resolve(__dirname, '../../..');
const DATA = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const NEW_DATA_FILES = [
  'services.js',
  'process.js',
  'faqs.js',
  'studioContent.js',
  'interiors.js',
  'projects.js',
  'credits.js',
  'images.js',
];

const read = (file) => fs.readFileSync(file, 'utf8');
const exists = (publicPath) => fs.existsSync(path.join(PUBLIC, publicPath));
const pngSize = (publicPath) => {
  const buf = fs.readFileSync(path.join(PUBLIC, publicPath));
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
};

describe('services', () => {
  it('has the seven services e01–e07 with unique slugs and full fields', () => {
    expect(services.map((s) => s.id)).toEqual(['e01', 'e02', 'e03', 'e04', 'e05', 'e06', 'e07']);
    expect(new Set(services.map((s) => s.slug)).size).toBe(7);
    services.forEach((s, i) => {
      expect(s.num).toBe(String(i + 1).padStart(2, '0'));
      ['slug', 'title', 'tagline', 'description', 'group', 'icon'].forEach((k) => expect(s[k]).toBeTruthy());
      expect(s.scope.length).toBeGreaterThan(5);
      expect(exists(`/images/inarch/icons/${s.icon}.svg`)).toBe(true);
    });
    // Only the interior work has the client's own photographs.
    expect(services.filter((s) => s.image !== null).every((s) => manifest[s.image] !== undefined)).toBe(true);
    expect(services.find((s) => s.id === 'e02').image).toBe('expertise-interiors');
  });

  it('exports the seven titles and the exact "Something else" string the admin hard-codes', () => {
    expect(serviceTitles).toHaveLength(7);
    expect(serviceTitles).toEqual(services.map((s) => s.title));
    expect(SOMETHING_ELSE).toBe('Something else');
    expect(getService('e02').title).toBe('Interior Design');
    expect(getService('renovation').id).toBe('e07');
  });
});

describe('process', () => {
  it('has the seven steps with their icons and animations', () => {
    expect(processSteps.map((s) => s.title)).toEqual([
      'Initial Consultation',
      'Site Study & Analysis',
      'Conceptual Design',
      'Design Development',
      'Detailed Drawings',
      'Project Coordination',
      'Project Completion',
    ]);
    [...processSteps, statusIcons.done].forEach((s) => {
      expect(exists(`/images/inarch/icons/${s.icon}.svg`)).toBe(true);
      expect(exists(`/images/inarch/lottie/${s.lottie}.json`)).toBe(true);
    });
  });

  it('groups every step into exactly one of the four phases', () => {
    expect(phases.map((p) => p.title)).toEqual(['Understand', 'Imagine', 'Detail', 'Deliver']);
    expect(phases.flatMap((p) => p.steps)).toEqual(processSteps.map((s) => s.num));
  });
});

describe('faqs', () => {
  it('has the eight questions with known topics', () => {
    expect(faqs.map((f) => f.id)).toEqual(['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8']);
    faqs.forEach((f) => {
      expect(f.question).toMatch(/\?$/);
      expect(f.answer.length).toBeGreaterThan(40);
      expect(f.topics.length).toBeGreaterThan(0);
      f.topics.forEach((t) => expect(FAQ_TOPICS).toContain(t));
    });
    interiorFaqIds.forEach((id) => expect(faqs.find((f) => f.id === id)).toBeDefined());
  });
});

describe('studio content', () => {
  it('carries the PDF sections at their expected sizes', () => {
    expect(studioContent.about).toHaveLength(5);
    expect(studioContent.mission).toHaveLength(5);
    expect(studioContent.philosophy.map((p) => p.title)).toEqual([
      'Design with Purpose',
      'Aesthetics with Functionality',
      'Attention to Detail',
      'Client-Centric Approach',
    ]);
    expect(studioContent.differentiators).toHaveLength(7);
    expect(studioContent.principal.credentials).toHaveLength(5);
    expect(studioContent.principal.bio).toHaveLength(5);
  });

  it('sets the Home statement from the second About sentence, only its opening words removed', () => {
    const { lead, accent } = studioContent.homeStatement;
    const joined = `${lead} ${accent}`.replace('buildings. It is', 'buildings; it is');
    expect(studioContent.about[1]).toBe(`The practice believes that ${joined.charAt(0).toLowerCase()}${joined.slice(1)}`);
  });

  it('keeps the hero credit words and the principal title from the PDF', () => {
    expect(studioContent.heroDisciplines).toEqual(['Architecture', 'Interior Design', '3D Visualisation']);
    expect(studioContent.principal.role.startsWith(`${studio.principal.title} |`)).toBe(true);
  });

  it('lists the experience in the PDF order, with no dates for Zenith', () => {
    const rows = studioContent.principal.experience;
    expect(rows.map((r) => r.organisation)).toEqual([
      'Council of Architecture, India',
      'Zenith',
      'Patna Municipal Corporation',
      'Gaya Municipal Corporation',
      'Novarch Consultants, New Delhi',
    ]);
    expect(rows.find((r) => r.organisation === 'Zenith').period).toBe('');
  });
});

describe('interiors', () => {
  it('regroups the twelve interior scope items and the renovation list', () => {
    const regrouped = scopeGroups.flatMap((g) => g.items);
    expect(scopeGroups).toHaveLength(4);
    expect(regrouped).toHaveLength(12);
    expect(new Set(regrouped)).toEqual(new Set(getService('e02').scope));
    expect(renovation.items).toEqual(getService('e07').scope);
  });

  it('ties every story and swatch to real images and projects', () => {
    const slugs = new Set(projects.map((p) => p.slug));
    roomStories.forEach((s) => {
      s.images.forEach((k) => expect(manifest[k]).toBeDefined());
      s.projects.forEach((p) => expect(slugs.has(p)).toBe(true));
    });
    materials.forEach((m) => {
      expect(manifest[m.image]).toBeDefined();
      expect(slugs.has(m.project)).toBe(true);
    });
  });
});

describe('projects', () => {
  it('has seven unverified projects with unique slugs, real images and valid categories', () => {
    expect(categories).toHaveLength(6);
    const categoryIds = new Set(categories.map((c) => c.id));
    expect(projects).toHaveLength(7);
    expect(new Set(projects.map((p) => p.slug)).size).toBe(7);
    projects.forEach((p) => {
      expect(p.images.length).toBeGreaterThan(0);
      p.images.forEach((k) => expect(manifest[k]).toBeDefined());
      expect(manifest[p.cover.tall]).toBeDefined();
      expect(manifest[p.cover.wide]).toBeDefined();
      expect(categoryIds.has(p.category)).toBe(true);
      expect(p.verified).toBe(false);
      ['location', 'area', 'year', 'client'].forEach((k) => expect(p[k]).toBe(''));
      expect(p.summary.split(/(?<=\.)\s+/)).toHaveLength(2);
    });
    expect(nextProject(projects[6].slug).slug).toBe(projects[0].slug);
  });

  it('never uses the dummy site’s invented project names', () => {
    const text = NEW_DATA_FILES.map((f) => read(path.join(DATA, f))).join('\n');
    ['Courtyard House', 'Urban Calm', 'The Avenue', 'The Workspace', 'Green Land', 'The Dining Room'].forEach((name) =>
      expect(text).not.toContain(name)
    );
  });
});

describe('images', () => {
  const keyLike = /['"]((?:home|studio|expertise|interiors|contact|pr|g|sw|og)-[a-z0-9-]+)['"]/g;

  it('resolves every image key referenced anywhere in src/data/, each with alt text', () => {
    const referenced = new Set();
    fs.readdirSync(DATA)
      .filter((f) => f.endsWith('.js'))
      .forEach((f) => {
        for (const m of read(path.join(DATA, f)).matchAll(keyLike)) {
          // Skip strings that are not image keys (slugs, category ids, scope labels).
          if (/^(interiors-|pr-|g-ph|sw-|og-|home-|studio-|expertise-interiors|contact-)/.test(m[1]) && !m[1].endsWith('-')) {
            referenced.add(m[1]);
          }
        }
      });
    expect(referenced.size).toBeGreaterThan(40);
    referenced.forEach((k) => {
      expect([k, manifest[k] !== undefined]).toEqual([k, true]);
      expect([k, (ALT[k] || '').length > 10]).toEqual([k, true]);
    });
  });

  it('has alt text for exactly the keys the manifest holds', () => {
    expect(Object.keys(ALT).sort()).toEqual(Object.keys(manifest).sort());
  });

  it('describes files that exist, three formats per width, at the stated size', () => {
    Object.values(manifest).forEach((entry) => {
      const widths = entry.sources.jpg.map((s) => s.w);
      expect([...widths].sort((a, b) => a - b)).toEqual(widths);
      ['avif', 'webp', 'jpg'].forEach((f) => {
        expect(entry.sources[f].map((s) => s.w)).toEqual(widths);
        entry.sources[f].forEach((s) => {
          expect(s.src).toBe(`/images/inarch/${entry.key}-${s.w}.${f}`);
          expect(exists(s.src)).toBe(true);
        });
      });
      expect(entry.width).toBe(widths[widths.length - 1]);
      expect(entry.ratio).toBeCloseTo(entry.width / entry.height, 3);
      expect(entry.placeholder.startsWith('data:image/webp;base64,')).toBe(true);
      expect(entry.placeholder.length).toBeLessThan(700);
    });
  });

  it('image() merges alt text and fails loudly on an unknown key', () => {
    const hero = image('home-hero-wide');
    expect(hero.alt).toMatch(/living hall/i);
    expect(srcSet(hero, 'avif')).toMatch(/home-hero-wide-768\.avif 768w/);
    expect(() => image('no-such-key')).toThrow(/no such key/);
  });

  it('derives nothing from the repeated photographs', () => {
    const report = JSON.parse(read(path.join(ROOT, 'src/lab/imageReport.json')));
    Object.values(report).forEach((r) => expect(['.jpg13.jpg', '.jpg15.jpg', '.jpg16.jpg']).not.toContain(r.file));
  });
});

describe('icons, animations and illustrations', () => {
  const iconDir = path.join(PUBLIC, 'images/inarch/icons');

  it('draws every icon in currentColor plus the accent variable only', () => {
    const files = fs.readdirSync(iconDir).filter((f) => f.endsWith('.svg'));
    expect(files.length).toBeGreaterThanOrEqual(14);
    files.forEach((f) => {
      const svg = read(path.join(iconDir, f));
      expect(svg).toContain('viewBox="0 0 48 48"');
      expect(svg).toContain('stroke="currentColor"');
      expect(svg).toContain('stroke-width="1.5"');
      expect(svg).toContain('var(--ia-accent-display');
      expect(svg).not.toMatch(/#[0-9a-f]{3,6}\b|rgba?\(|style=/i);
    });
  });

  it('keeps every animation small, classed for re-tinting and finite', () => {
    const dir = path.join(PUBLIC, 'images/inarch/lottie');
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
    expect(files).toHaveLength(8);
    files.forEach((f) => {
      const raw = read(path.join(dir, f));
      expect(Buffer.byteLength(raw)).toBeLessThan(40 * 1024);
      const json = JSON.parse(raw);
      expect(json.layers.map((l) => l.cl).sort()).toEqual(['ia-l-accent', 'ia-l-ink']);
      expect(json.op).toBeGreaterThan(json.ip);
    });
  });

  it('colours the four illustrations with brand colours only', () => {
    const brand = new Set(['#B5653F', '#231B15', '#E9E3D8', '#DAD3C6', '#FAF7F2']);
    ['not-found', 'enquiry-sent', 'nothing-here', 'something-broke'].forEach((name) => {
      const svg = read(path.join(PUBLIC, `images/inarch/illustrations/${name}.svg`));
      expect(Buffer.byteLength(svg)).toBeLessThan(30 * 1024);
      (svg.match(/#[0-9a-f]{3,6}\b/gi) || []).forEach((c) => expect(brand.has(c.toUpperCase())).toBe(true));
      expect(svg).not.toMatch(/Gradient|<filter|opacity=/);
    });
  });
});

describe('studio facts', () => {
  it('holds the supplied facts and leaves the unsupplied ones empty', () => {
    expect(studio.phone).toBe('+917292831128');
    expect(studio.whatsapp).toBe('917292831128');
    // Empty until prompts/00_INDEX.md §12 records the client's answer (D-03, D-05, D-04).
    expect(studio.email).toBe('');
    expect(studio.siteUrl).toBe('');
    expect(studio.address.postalCode).toBe('');
    expect(siteConfig.studio).toBe(studio);
  });

  it('builds links that render nothing for missing values', () => {
    expect(studioTelHref).toBe('tel:+917292831128');
    expect(studioWhatsAppHref()).toBe('https://wa.me/917292831128');
    expect(studioWhatsAppHref('Hello & welcome')).toBe('https://wa.me/917292831128?text=Hello%20%26%20welcome');
    expect(studioMailHref).toBeNull();
    expect(studioMapsHref).toBe(
      'https://www.google.com/maps/search/?api=1&query=In-Arch%20Architects%20%26%20Interior%20Designer%2C%20Boring%20Road%2C%20Patna%2C%20Bihar'
    );
    expect(studioUrl('/portfolio')).toBe(`${window.location.origin}/portfolio`);
    expect(studioAddressLines).toEqual(['Boring Road', 'Patna, Bihar', 'India']);
    expect(studioHoursLabel).toBe('From 10:00 AM');
  });

  it('points every logo at a real file of the stated size', () => {
    Object.values(studio.logos).forEach((logo) => {
      [logo, ...(logo.variants || [])].forEach((f) => {
        expect(exists(f.src)).toBe(true);
        expect(pngSize(f.src)).toEqual({ width: f.width, height: f.height });
      });
    });
  });

  it('keeps the admin-bound values at their baseline', () => {
    expect(siteConfig.brandName).toBe('Dulcey Lead Services');
    expect(siteConfig.legalName).toBe('Dulcey Lead Services');
    expect(siteConfig.logo).toBe('/images/logo/dulcey-wordmark-1351.png');
    expect(LOGO_SIZE).toEqual({ width: 1351, height: 200 });
  });
});

describe('truthfulness', () => {
  it('keeps the old brand, filler, mail links, ratings, awards and testimonials out of the new data', () => {
    NEW_DATA_FILES.forEach((f) => {
      const text = read(path.join(DATA, f));
      expect([f, /dulcey/i.test(text)]).toEqual([f, false]);
      expect([f, /lorem/i.test(text)]).toEqual([f, false]);
      expect([f, /mailto:/i.test(text)]).toEqual([f, false]);
      expect([f, /★|☆|\b\d(\.\d)?\s*(\/\s*5|stars?)\b|\brating/i.test(text)]).toEqual([f, false]);
      expect([f, /\baward/i.test(text)]).toEqual([f, false]);
      expect([f, /testimonial/i.test(text)]).toEqual([f, false]);
    });
  });

  it('credits every shipped asset and owes no footer credit', () => {
    expect(credits.map((c) => c.id)).toEqual(
      expect.arrayContaining(['photographs', 'logos', 'icons', 'font-fraunces', 'font-manrope'])
    );
    credits.forEach((c) => ['name', 'source', 'licence', 'fetched', 'changes', 'files'].forEach((k) => expect(c[k]).toBeTruthy()));
    expect(footerCredits).toEqual([]);
  });
});
