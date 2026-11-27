/* ============================================
   IN-ARCH tokens — contract test
   --------------------------------------------
   Reads the CSS as text (Jest does not render CSS) and checks:
   1. every token of the design contract exists on :root with its value;
   2. nothing in src/styles/inarch/ can match an element outside `.ia`.
   ============================================ */

const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(DIR, file), 'utf8');
const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');
const norm = (v) => v.replace(/\s+/g, ' ').replace(/\s*,\s*/g, ', ').trim().toLowerCase();

const EXPECTED = {
  // Light surfaces
  '--ia-ivory': '#F4EFE7',
  '--ia-paper': '#FAF7F2',
  '--ia-sand': '#E9E3D8',
  '--ia-stone': '#DAD3C6',
  // Dark surfaces
  '--ia-forest': '#161E19',
  '--ia-forest-2': '#1E2823',
  '--ia-forest-3': '#28342E',
  // Ink
  '--ia-espresso': '#231B15',
  '--ia-ink-2': '#4F453D',
  '--ia-ink-3': '#6B6058',
  '--ia-mist': '#B9BDB6',
  '--ia-mist-2': '#8E958D',
  // Accent
  '--ia-terracotta-700': '#8F4A2B',
  '--ia-terracotta-500': '#B5653F',
  '--ia-terracotta-300': '#DDA27F',
  // Lines
  '--ia-hairline': '#D8D0C3',
  '--ia-border': '#8A7F74',
  '--ia-hairline-dark': '#28342E',
  '--ia-border-dark': '#8E958D',
  // Feedback
  '--ia-success': '#3F6B4F',
  '--ia-success-dark': '#8FBF9F',
  '--ia-error': '#A4372A',
  '--ia-error-dark': '#F0A090',
  // Fonts
  '--ia-font-serif': '"Fraunces", "Fraunces Fallback", "Iowan Old Style", "Palatino Linotype", Georgia, serif',
  '--ia-font-sans': '"Manrope", "Manrope Fallback", "Avenir Next", "Segoe UI", system-ui, -apple-system, sans-serif',
  // Type scale
  '--ia-fs-display-2xl': 'clamp(2.75rem, 1.2rem + 7.2vw, 8.5rem)',
  '--ia-fs-display-xl': 'clamp(2.5rem, 1.35rem + 5.2vw, 6.5rem)',
  '--ia-fs-display-lg': 'clamp(2rem, 1.3rem + 3.2vw, 4.5rem)',
  '--ia-fs-display-md': 'clamp(1.625rem, 1.25rem + 1.7vw, 2.75rem)',
  '--ia-fs-display-sm': 'clamp(1.375rem, 1.2rem + 0.8vw, 1.875rem)',
  '--ia-fs-body-lg': 'clamp(1.0625rem, 0.98rem + 0.38vw, 1.3125rem)',
  '--ia-fs-body': 'clamp(1rem, 0.97rem + 0.14vw, 1.0625rem)',
  '--ia-fs-small': '0.875rem',
  '--ia-fs-caption': '0.8125rem',
  '--ia-fs-label': '0.75rem',
  // Space
  '--ia-space-1': '0.25rem',
  '--ia-space-2': '0.5rem',
  '--ia-space-3': '0.75rem',
  '--ia-space-4': '1rem',
  '--ia-space-5': '1.25rem',
  '--ia-space-6': '1.5rem',
  '--ia-space-8': '2rem',
  '--ia-space-10': '2.5rem',
  '--ia-space-12': '3rem',
  '--ia-space-16': '4rem',
  '--ia-space-20': '5rem',
  '--ia-space-24': '6rem',
  '--ia-space-32': '8rem',
  '--ia-space-40': '10rem',
  '--ia-space-48': '12rem',
  // Layout
  '--ia-section-y': 'clamp(5rem, 3rem + 9vw, 12rem)',
  '--ia-section-y-sm': 'clamp(3.5rem, 2.5rem + 4.5vw, 7.5rem)',
  '--ia-gutter': 'clamp(1.25rem, 0.5rem + 3.4vw, 5rem)',
  '--ia-max': '105rem',
  '--ia-measure': '68ch',
  '--ia-radius': '2px',
  '--ia-dock-clearance': '6rem',
  // Motion
  '--ia-dur-1': '150ms',
  '--ia-dur-2': '240ms',
  '--ia-dur-3': '400ms',
  '--ia-dur-4': '700ms',
  '--ia-dur-5': '1000ms',
  '--ia-ease-out': 'cubic-bezier(0.22, 1, 0.36, 1)',
  '--ia-ease-in-out': 'cubic-bezier(0.65, 0, 0.35, 1)',
  '--ia-ease-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
  // Elevation / layers
  '--ia-shadow-overlay': '0 24px 60px rgba(22, 30, 25, 0.18)',
  '--ia-z-dock': '80',
  '--ia-z-overlay': '120',
  '--ia-z-modal': '200',
  '--ia-z-curtain': '300',
};

// Minimal CSS walker: returns [{ selector, body }] for every style rule,
// descending into @media / @supports and skipping @font-face / @import.
const rules = (css) => {
  const out = [];
  const walk = (src) => {
    let i = 0;
    while (i < src.length) {
      const brace = src.indexOf('{', i);
      const semi = src.indexOf(';', i);
      if (brace === -1) break;
      if (semi !== -1 && semi < brace) {
        i = semi + 1; // @import … ;
        continue;
      }
      const prelude = src.slice(i, brace).trim();
      let depth = 1;
      let j = brace + 1;
      while (j < src.length && depth) {
        if (src[j] === '{') depth += 1;
        if (src[j] === '}') depth -= 1;
        j += 1;
      }
      const body = src.slice(brace + 1, j - 1);
      if (/^@(media|supports|layer|container)\b/.test(prelude)) walk(body);
      else if (!/^@font-face\b/.test(prelude)) out.push({ selector: prelude, body });
      i = j;
    }
  };
  walk(stripComments(css));
  return out;
};

// Split a selector list on top-level commas (not inside :where()/:is()).
const splitSelectors = (list) => {
  const parts = [];
  let depth = 0;
  let current = '';
  for (const ch of list) {
    if (ch === '(') depth += 1;
    if (ch === ')') depth -= 1;
    if (ch === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else current += ch;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
};

describe('tokens.css', () => {
  const css = stripComments(read('tokens.css'));
  const declared = {};
  rules(css)
    .filter((r) => r.selector === ':root')
    .forEach((r) => {
      for (const m of r.body.matchAll(/(--ia-[\w-]+)\s*:\s*([^;]+);/g)) declared[m[1]] = m[2];
    });

  test.each(Object.entries(EXPECTED))('%s is %s', (name, value) => {
    expect(declared).toHaveProperty([name]);
    expect(norm(declared[name])).toBe(norm(value));
  });

  test('every token is prefixed --ia-', () => {
    for (const m of css.matchAll(/(--[\w-]+)\s*:/g)) expect(m[1].startsWith('--ia-')).toBe(true);
  });
});

describe('src/styles/inarch/ cannot leak outside .ia', () => {
  const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.css'));
  const ALLOWED = /^(:root$|\.ia(?![\w-])|\.ia-[\w-]|:where\(\.ia(?![\w-]))/;

  test('the five layers are present and index.css imports them in order', () => {
    const imports = [...read('index.css').matchAll(/@import\s+['"]\.\/([\w-]+\.css)['"]/g)].map((m) => m[1]);
    expect(imports).toEqual(['tokens.css', 'fonts.css', 'base.css', 'type.css', 'layout.css']);
  });

  test.each(files)('%s: every selector starts with :root, .ia, :where(.ia) or an ia- class', (file) => {
    const offenders = [];
    rules(read(file)).forEach(({ selector, body }) => {
      splitSelectors(selector).forEach((sel) => {
        if (!ALLOWED.test(sel)) offenders.push(sel);
      });
      if (selector === ':root') {
        body
          .split(';')
          .map((d) => d.trim())
          .filter(Boolean)
          .forEach((d) => {
            if (!d.startsWith('--')) offenders.push(`:root { ${d} }`);
          });
      }
    });
    expect(offenders).toEqual([]);
  });

  test('fonts.css only declares the two local() fallback families', () => {
    const css = stripComments(read('fonts.css'));
    const families = [...css.matchAll(/font-family:\s*"([^"]+)"/g)].map((m) => m[1]);
    expect(new Set(families)).toEqual(new Set(['Fraunces Fallback', 'Manrope Fallback']));
    expect(css).not.toMatch(/url\(/);
  });
});
