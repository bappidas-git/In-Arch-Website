/* ============================================
   TransitionProvider — page transitions for the public site
   --------------------------------------------
   Wraps the public routes (src/App.jsx). Internal links hand plain clicks
   to `navigate(to)` (see TLink.jsx); everything else navigates as usual.

   A curtain navigation, in order:
   1. the Curtain (forest, ivory "IA") covers from the bottom —
      yPercent 100 → 0, 400 ms power3.inOut — while the target route's chunk
      is preloaded; hero motion is held back (src/motion/revealGate.js);
   2. the router navigates under cover (ScrollManager resets the scroll);
   3. the provider waits for the new page to say it is ready —
      `usePageReady()`, or, for a page that does not use it, the route
      having committed (`RouteMounted`) — capped at 1200 ms;
   4. the curtain leaves upward (0 → −100, 550 ms), hero motion (`data-m-now`)
      starts, focus moves to <main> (unless the URL has a hash) and the
      RouteAnnouncer reads out the new document title.

   No curtain for back / forward (the page fades in over 240 ms), under
   prefers-reduced-motion (nothing moves at all), or for a navigation that
   did not come through `navigate()`. Those still get the focus move and
   the announcement.

   Robustness: a click while covering only retargets; a click while waiting
   navigates again under the same cover; a click while lifting re-covers
   from where the curtain is; a back / forward gesture mid-transition
   cancels it; a 4 s watchdog always ends a transition. The curtain can
   never be left down.

   Every tween is created through useGSAP's contextSafe, so it is reverted
   if the provider unmounts.
   ============================================ */

import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { resolvePath, useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { gsap, useGSAP } from '../../../animations/gsapSetup';
// Direct module imports, not the src/motion barrel: the barrel re-exports
// useMotionScope, which registers SplitText as a side effect, and the shell
// is in the main bundle.
import { DUR, DUR_NAMED, EASE } from '../../../motion/tokens';
import { prefersReducedMotion } from '../../../motion/reducedMotion';
import { holdReveal, releaseReveal } from '../../../motion/revealGate';

export const TransitionContext = createContext(null);

/** The transition API (`navigate`, `preload`, …), or null outside the provider. */
export const useTransition = () => useContext(TransitionContext);

/** Timings, exported for tests and QA. Seconds unless the name says ms. */
export const TRANSITION_TIMING = {
  cover: DUR.ui, // 0.4
  lift: DUR_NAMED.curtainLift, // 0.55
  popFade: DUR.hover, // 0.24
  readyCapMs: 1200,
  watchdogMs: 4000,
};

const normalise = (pathname = '/') => (pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname);

const mainElement = () => (typeof document === 'undefined' ? null : document.getElementById('main-content'));

const TransitionProvider = ({ preload, children }) => {
  const routerNavigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();
  const { contextSafe } = useGSAP();

  // Everything mutable lives in one ref, so the API object never changes
  // identity and no consumer re-renders because of a transition.
  const state = useRef({
    phase: 'idle', // idle · covering · waiting · revealing
    target: null, // { to, options } awaiting navigation
    expected: null, // pathname the router was sent to, while waiting for it
    ownPath: null, // the same, until the location effect has seen it commit
    claimed: false, // the incoming page uses usePageReady()
    navId: 0, // bumps on every navigation under cover
    settleFrame: 0, // pending double-rAF before the lift
    curtain: null,
    announce: null,
    tween: null,
    capTimer: 0,
    watchdog: 0,
  }).current;

  const latest = useRef({});
  latest.current = { routerNavigate, preload, contextSafe, pathname: location.pathname };

  const api = useMemo(() => {
    const clearTimers = () => {
      window.clearTimeout(state.capTimer);
      window.clearTimeout(state.watchdog);
      if (state.settleFrame) window.cancelAnimationFrame(state.settleFrame);
      state.capTimer = 0;
      state.watchdog = 0;
      state.settleFrame = 0;
    };

    const killTween = () => {
      if (state.tween) state.tween.kill();
      state.tween = null;
    };

    const run = (fn) => latest.current.contextSafe(fn)();

    const hideCurtain = () => {
      killTween();
      if (state.curtain) gsap.set(state.curtain, { yPercent: 100, visibility: 'hidden' });
    };

    /** Focus <main> (unless there is a hash target) and announce the title. */
    const settle = () => {
      const main = mainElement();
      if (main && !window.location.hash) main.focus({ preventScroll: true });
      if (state.announce) state.announce();
    };

    const pathOf = (to) => {
      try {
        return normalise(resolvePath(to, latest.current.pathname).pathname);
      } catch (err) {
        return null;
      }
    };

    const warm = (pathname) => {
      if (!pathname || typeof latest.current.preload !== 'function') return;
      try {
        const pending = latest.current.preload(pathname);
        // A failed chunk shows up when the route renders (ErrorBoundary);
        // a failed warm-up must not become an unhandled rejection.
        if (pending && typeof pending.catch === 'function') pending.catch(() => {});
      } catch (err) {
        /* ignore — the route loads on navigation instead */
      }
    };

    const reveal = () => {
      if (state.phase !== 'waiting') return;
      if (!state.curtain) {
        abort();
        settle();
        return;
      }
      clearTimers();
      state.phase = 'revealing';
      state.expected = null;
      releaseReveal();
      settle();
      run(() => {
        killTween();
        state.tween = gsap.to(state.curtain, {
          yPercent: -100,
          duration: TRANSITION_TIMING.lift,
          ease: EASE.mask,
          onComplete: () => {
            state.tween = null;
            state.phase = 'idle';
            if (state.curtain) gsap.set(state.curtain, { yPercent: 100, visibility: 'hidden' });
          },
        });
      });
    };

    /**
     * The page is ready: lift two animation frames later, so the new page's
     * first layout and paint (and any refresh it queued for the next frame)
     * happen while it is still covered, not in the first frames of the lift.
     * A newer navigation in between cancels this one (the id changes).
     */
    const revealSoon = () => {
      if (state.phase !== 'waiting' || state.settleFrame) return;
      const id = state.navId;
      state.settleFrame = window.requestAnimationFrame(() => {
        state.settleFrame = window.requestAnimationFrame(() => {
          state.settleFrame = 0;
          if (state.navId === id) reveal();
        });
      });
    };

    const cancelSettle = () => {
      if (state.settleFrame) window.cancelAnimationFrame(state.settleFrame);
      state.settleFrame = 0;
    };

    const navigateUnderCover = () => {
      const target = state.target;
      state.target = null;
      window.clearTimeout(state.capTimer);
      cancelSettle();
      state.navId += 1;
      state.phase = 'waiting';
      state.claimed = false;
      if (!target) {
        reveal();
        return;
      }
      state.expected = pathOf(target.to);
      state.ownPath = state.expected;
      latest.current.routerNavigate(target.to, target.options);
      state.capTimer = window.setTimeout(reveal, TRANSITION_TIMING.readyCapMs);
    };

    const cover = () => {
      if (!state.curtain) return;
      clearTimers();
      const wasIdle = state.phase === 'idle';
      state.phase = 'covering';
      holdReveal();
      run(() => {
        killTween();
        if (wasIdle) gsap.set(state.curtain, { yPercent: 100 });
        gsap.set(state.curtain, { visibility: 'visible' });
        state.tween = gsap.to(state.curtain, {
          yPercent: 0,
          duration: TRANSITION_TIMING.cover,
          ease: EASE.mask,
          onComplete: () => {
            state.tween = null;
            if (state.phase === 'covering') navigateUnderCover();
          },
        });
      });
      // Whatever happens, a transition ends.
      state.watchdog = window.setTimeout(() => {
        if (state.phase === 'covering') navigateUnderCover();
        if (state.phase === 'waiting') reveal();
      }, TRANSITION_TIMING.watchdogMs);
    };

    /** Abandon a transition at once (a back / forward gesture overtook it). */
    function abort() {
      clearTimers();
      hideCurtain();
      state.phase = 'idle';
      state.target = null;
      state.expected = null;
      releaseReveal();
    }

    /**
     * Navigate with the curtain. Falls back to a plain navigation under
     * reduced motion or before the curtain has mounted.
     */
    const navigate = (to, options = {}) => {
      if (!state.curtain || prefersReducedMotion()) {
        latest.current.routerNavigate(to, options);
        return;
      }
      state.target = { to, options };
      warm(pathOf(to));
      if (state.phase === 'covering') return; // the cover will take the latest target
      if (state.phase === 'waiting') {
        navigateUnderCover(); // already covered: go straight there
        return;
      }
      cover(); // idle, or lifting: (re)cover from wherever the curtain is
    };

    const accepts = (pathname) =>
      state.phase === 'waiting' && state.expected !== null && normalise(pathname) === state.expected;

    return {
      navigate,
      preload: (pathname) => warm(normalise(pathname)),
      /** usePageReady: the incoming page will say when it is ready. */
      claimReady: (pathname) => {
        if (accepts(pathname)) state.claimed = true;
      },
      /** usePageReady: the incoming page is ready. */
      signalReady: (pathname) => {
        if (accepts(pathname)) revealSoon();
      },
      /** RouteMounted: the route committed; enough for a page without usePageReady. */
      routeMounted: (pathname) => {
        if (accepts(pathname) && !state.claimed) revealSoon();
      },
      registerCurtain: (el) => {
        state.curtain = el;
        if (el) gsap.set(el, { yPercent: 100, visibility: 'hidden' });
      },
      registerAnnouncer: (fn) => {
        state.announce = fn;
        return () => {
          if (state.announce === fn) state.announce = null;
        };
      },
      // Internal, for the location effect below.
      _phase: () => state.phase,
      _isOwn: (pathname) => {
        const own = state.ownPath !== null && normalise(pathname) === state.ownPath;
        state.ownPath = null;
        return own;
      },
      _abort: abort,
      _settle: settle,
      _fadeIn: () =>
        run(() => {
          const main = mainElement();
          if (!main) return;
          gsap.fromTo(
            main,
            { opacity: 0 },
            { opacity: 1, duration: TRANSITION_TIMING.popFade, ease: EASE.out, clearProps: 'opacity' }
          );
        }),
    };
  }, [state]);

  // Every navigation that did not come through the curtain still moves focus
  // and announces the page. The first render is the initial load: nothing.
  const previousPath = useRef(null);
  useEffect(() => {
    const previous = previousPath.current;
    previousPath.current = normalise(location.pathname);
    if (previous === null) return;
    // Ours: focus and announcement happen as the curtain lifts.
    if (api._isOwn(location.pathname)) return;
    // A fragment jump inside the page (#target) is not a new page.
    if (navigationType === 'POP' && previous === normalise(location.pathname)) return;
    // Anything else overtakes a transition in progress (back / forward).
    if (api._phase() !== 'idle') api._abort();
    if (navigationType === 'POP' && !prefersReducedMotion()) api._fadeIn();
    api._settle();
  }, [location.key]); // eslint-disable-line react-hooks/exhaustive-deps

  // Leaving the public surface mid-transition must not leave motion held.
  useEffect(
    () => () => {
      window.clearTimeout(state.capTimer);
      window.clearTimeout(state.watchdog);
      releaseReveal();
    },
    [state]
  );

  return <TransitionContext.Provider value={api}>{children}</TransitionContext.Provider>;
};

export default TransitionProvider;
