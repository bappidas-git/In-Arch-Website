/* ============================================
   navigation — the six destinations match the route table (prompt 04)
   ============================================ */

import fs from 'fs';
import path from 'path';
import { matchPath } from 'react-router-dom';
import { NAV_LINKS, navCurrent } from '../navigation';

const APP = fs.readFileSync(path.join(__dirname, '..', '..', 'App.jsx'), 'utf8');
const ROUTE_PATHS = [...APP.matchAll(/<Route\b[^>]*?\bpath="([^"]+)"/g)].map((m) => m[1]).filter((p) => p !== '*');

describe('NAV_LINKS', () => {
  test('has six entries in the agreed order', () => {
    expect(NAV_LINKS.map((l) => [l.num, l.to, l.label])).toEqual([
      ['01', '/', 'Home'],
      ['02', '/about', 'Studio'],
      ['03', '/expertise', 'Expertise'],
      ['04', '/interior-design', 'Interior Design'],
      ['05', '/portfolio', 'Portfolio'],
      ['06', '/contact', 'Contact'],
    ]);
  });

  test('every entry has the { to, label, num, descriptor } shape', () => {
    NAV_LINKS.forEach((link) => {
      expect(Object.keys(link).sort()).toEqual(['descriptor', 'label', 'num', 'to']);
      expect(link.descriptor.length).toBeGreaterThan(0);
    });
  });

  test('the six `to` values are unique', () => {
    expect(new Set(NAV_LINKS.map((l) => l.to)).size).toBe(6);
  });

  test.each(NAV_LINKS.map((l) => [l.to]))('%s matches a <Route> in App.jsx', (to) => {
    expect(ROUTE_PATHS.some((p) => matchPath({ path: p, end: true }, to))).toBe(true);
  });

  test('/industries has left the navigation but still has a route', () => {
    expect(NAV_LINKS.some((l) => l.to === '/industries')).toBe(false);
    expect(ROUTE_PATHS).toContain('/industries');
  });

  test('the three routes built later exist', () => {
    expect(ROUTE_PATHS).toEqual(expect.arrayContaining(['/interior-design', '/portfolio', '/portfolio/:slug']));
  });
});

describe('navCurrent', () => {
  test('exact match is the page', () => {
    expect(navCurrent('/about', '/about')).toBe('page');
    expect(navCurrent('/about', '/about/')).toBe('page');
  });

  test('a sub-path keeps its section marked', () => {
    expect(navCurrent('/portfolio', '/portfolio/ivory-kitchen')).toBe('true');
  });

  test('Home matches only /', () => {
    expect(navCurrent('/', '/')).toBe('page');
    expect(navCurrent('/', '/about')).toBeNull();
  });

  test('no partial-name matches', () => {
    expect(navCurrent('/portfolio', '/portfolios')).toBeNull();
  });
});
