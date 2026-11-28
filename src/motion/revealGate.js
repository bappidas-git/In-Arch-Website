/* ============================================
   revealGate — "hero motion waits for the page curtain"
   --------------------------------------------
   The page transition (src/components/shell/transition/TransitionProvider)
   mounts the incoming page UNDER the curtain. Hero animations marked
   `data-m-now` must not play there, unseen: they start as the curtain
   leaves. So:

   - the provider calls `holdReveal()` before it covers the page and
     `releaseReveal()` the moment the curtain starts to lift (or at once
     when a navigation has no curtain);
   - useMotionScope creates its `data-m-now` tweens paused while the gate is
     held and restarts them through `onReveal()`.

   Outside a transition (first load, back / forward, reduced motion) the
   gate is open and `onReveal` runs its callback immediately.
   ============================================ */

let held = false;
const waiting = new Set();

/** Close the gate: `data-m-now` motion created from now on waits. */
export const holdReveal = () => {
  held = true;
};

/** Open the gate and start everything that was waiting. */
export const releaseReveal = () => {
  held = false;
  const callbacks = Array.from(waiting);
  waiting.clear();
  callbacks.forEach((fn) => fn());
};

/** True while a transition is holding hero motion back. */
export const isRevealHeld = () => held;

/**
 * Run `fn` when the page is revealed — now, if it already is.
 * @returns {Function} cancel (use as cleanup)
 */
export const onReveal = (fn) => {
  if (!held) {
    fn();
    return () => {};
  }
  waiting.add(fn);
  return () => waiting.delete(fn);
};
