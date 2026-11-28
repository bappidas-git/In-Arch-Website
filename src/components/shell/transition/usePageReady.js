/* ============================================
   usePageReady — tell the page transition the page can be shown
   --------------------------------------------
   usePageReady();                    // ready as soon as it mounts
   usePageReady(heroDecoded);         // ready once the hero image has decoded

   Called once at the top of a page component. During a curtain transition
   the provider keeps the curtain down until this page says it is ready —
   never longer than 1200 ms. Outside a transition it does nothing.

   Pages that do not call it (the old pages, until their prompts replace
   them) are revealed as soon as their route has committed: `RouteMounted`,
   rendered by src/App.jsx after each route element, reports that. A page
   that calls usePageReady claims the decision for itself during the commit
   (a layout effect), before RouteMounted reports (a passive effect).
   ============================================ */

import { useContext, useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TransitionContext } from './TransitionProvider';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function usePageReady(ready = true) {
  const transition = useContext(TransitionContext);
  const { pathname } = useLocation();

  useIsoLayoutEffect(() => {
    if (transition) transition.claimReady(pathname);
  }, [transition, pathname]);

  useEffect(() => {
    if (transition && ready) transition.signalReady(pathname);
  }, [transition, pathname, ready]);
}

/** Rendered after each route element: "this route has committed". */
export const RouteMounted = () => {
  const transition = useContext(TransitionContext);
  const { pathname } = useLocation();

  useEffect(() => {
    if (transition) transition.routeMounted(pathname);
  }, [transition, pathname]);

  return null;
};
