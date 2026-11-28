/* ============================================
   revealGate — hero motion waits for the page curtain
   ============================================ */

import { holdReveal, releaseReveal, isRevealHeld, onReveal } from '../revealGate';

afterEach(() => releaseReveal());

test('open gate: runs at once', () => {
  const fn = jest.fn();
  onReveal(fn);
  expect(fn).toHaveBeenCalledTimes(1);
});

test('held gate: waits for release, once', () => {
  holdReveal();
  expect(isRevealHeld()).toBe(true);
  const fn = jest.fn();
  onReveal(fn);
  expect(fn).not.toHaveBeenCalled();
  releaseReveal();
  expect(fn).toHaveBeenCalledTimes(1);
  releaseReveal();
  expect(fn).toHaveBeenCalledTimes(1);
});

test('a cancelled waiter never runs', () => {
  holdReveal();
  const fn = jest.fn();
  const cancel = onReveal(fn);
  cancel();
  releaseReveal();
  expect(fn).not.toHaveBeenCalled();
});
