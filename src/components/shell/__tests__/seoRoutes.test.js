/* ============================================
   SEOHead route resolution for the routes added by prompt 04
   ============================================ */

import { resolvePage } from '../../common/SEO/SEOHead';
import { seoConfig } from '../../../config/seo';

const { pages } = seoConfig;

describe('resolvePage', () => {
  test('pending routes resolve to the noindex pending entry', () => {
    ['/interior-design', '/portfolio', '/portfolio/', '/portfolio/ivory-kitchen'].forEach((path) => {
      expect(resolvePage(path)).toBe(pages.pending);
    });
    expect(pages.pending.noindex).toBe(true);
    expect(pages.pending.robots).toMatch(/noindex/);
  });

  test('old pages, admin and unknown URLs are unchanged', () => {
    expect(resolvePage('/')).toBe(pages.home);
    expect(resolvePage('/about')).toBe(pages.about);
    expect(resolvePage('/industries')).toBe(pages.industries);
    expect(resolvePage('/admin/dashboard')).toBe(pages.admin);
    expect(resolvePage('/nonsense')).toBe(pages.notFound);
  });

  test('site-level values come from the studio', () => {
    expect(seoConfig.siteName).toBe('In-Arch Architects & Interior Designer');
    expect(seoConfig.defaultTitle).toBe('In-Arch Architects & Interior Designer | Architects in Patna, Bihar');
    expect(seoConfig.organization.name).toBe('In-Arch Architects & Interior Designer');
    expect(pages.admin.title).toBe('Admin Panel — Dulcey Lead Services');
  });

  test('the new entries exist', () => {
    expect(pages.interiors.path).toBe('/interior-design');
    expect(pages.portfolio.path).toBe('/portfolio');
    expect(pages.project).toBeDefined();
  });
});
