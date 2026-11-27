/* ============================================
   Surfaces
   --------------------------------------------
   The site has two surfaces that share one HTML document: the public site
   and the admin (`/admin`, `/admin/*`). The current surface is written to
   `<html data-surface="public | admin">` — first by the inline script in
   public/index.html (before any CSS applies), then kept in sync on
   client-side navigation by SurfaceManager. Document-level public styles
   (prompt 04 onwards) are scoped under html[data-surface="public"] so they
   can never reach the admin.

   Keep this test identical to the regular expression in public/index.html:
   /^\/admin(\/|$)/
   ============================================ */

export const SURFACES = Object.freeze({ PUBLIC: 'public', ADMIN: 'admin' });

/**
 * @param {string} pathname e.g. `location.pathname`
 * @returns {'admin' | 'public'}
 */
export const getSurface = (pathname = '') =>
  pathname === '/admin' || pathname.startsWith('/admin/')
    ? SURFACES.ADMIN
    : SURFACES.PUBLIC;
