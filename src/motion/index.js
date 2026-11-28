/* ============================================
   IN-ARCH motion — public entry
   --------------------------------------------
   import { useMotionScope, DUR, EASE } from '../motion';

   GSAP and its plugins are registered once, in src/animations/gsapSetup.js
   (ScrollTrigger, useGSAP) and src/motion/useMotionScope.js (SplitText).
   Never create a tween or ScrollTrigger outside a useGSAP scope.
   ============================================ */

export { default as useMotionScope } from './useMotionScope';
export { useReducedMotion, prefersReducedMotion } from './reducedMotion';
export { holdReveal, releaseReveal, isRevealHeld, onReveal } from './revealGate';
export {
  DUR,
  DUR_NAMED,
  EASE,
  RISE,
  STAGGER,
  START,
  PARALLAX,
  SETTLE,
  WORDS,
  MQ,
} from './tokens';
