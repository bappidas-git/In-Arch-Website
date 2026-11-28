/* ============================================
   navigation — the six public destinations (IN-ARCH, prompt 04)
   --------------------------------------------
   One list, read by every surface that navigates:
   - the Index Dock (desktop: entries 02–06; the "IA" mark stands for Home),
   - the index overlay (all six rows, with `num` and `descriptor`),
   - the footer's "Explore" group.

   `to` must match a <Route> in src/App.jsx (a unit test checks it).
   `/industries` has left the navigation: it is still reachable by URL until
   prompt 11 forwards it to /portfolio (owner decision D-17).
   ============================================ */

export const NAV_LINKS = [
  { to: '/', label: 'Home', num: '01', descriptor: 'Overview' },
  { to: '/about', label: 'Studio', num: '02', descriptor: 'Practice, philosophy and principal architect' },
  { to: '/expertise', label: 'Expertise', num: '03', descriptor: 'Seven services, one process' },
  {
    to: '/interior-design',
    label: 'Interior Design',
    num: '04',
    descriptor: 'Homes, kitchens and made-to-measure detail',
  },
  { to: '/portfolio', label: 'Portfolio', num: '05', descriptor: 'Selected work' },
  { to: '/contact', label: 'Contact', num: '06', descriptor: 'Start a project' },
];

/**
 * Whether a nav entry is the current page, or an ancestor of it.
 * Home matches only `/`; every other entry also matches its sub-paths
 * (`/portfolio/<slug>` keeps Portfolio marked).
 *
 * @returns {'page' | 'true' | null} the `aria-current` value, or null
 */
export const navCurrent = (to, pathname = '') => {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (path === to) return 'page';
  if (to !== '/' && path.startsWith(`${to}/`)) return 'true';
  return null;
};

export default NAV_LINKS;
