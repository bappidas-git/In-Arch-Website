/* ============================================
   SurfaceManager
   --------------------------------------------
   Keeps `document.documentElement.dataset.surface` in step with the router,
   in a layout effect so the attribute is correct before the incoming route
   paints. Renders nothing. Must sit inside <BrowserRouter>.
   ============================================ */

import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSurface } from './surface';

// Same guard as ScrollManager in src/App.jsx: keeps the module importable
// from a Node test renderer.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const SurfaceManager = () => {
  const { pathname } = useLocation();

  useIsomorphicLayoutEffect(() => {
    const surface = getSurface(pathname);
    if (document.documentElement.dataset.surface !== surface) {
      document.documentElement.dataset.surface = surface;
    }
  }, [pathname]);

  return null;
};

export default SurfaceManager;
