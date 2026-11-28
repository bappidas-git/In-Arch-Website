/* ============================================
   useMotionScope — the one motion hook for every IN-ARCH section
   --------------------------------------------
   const ref = useMotionScope();
   <section ref={ref}>
     <h2 data-m="lines">…</h2>
     <p data-m="rise" data-m-delay="0.1">…</p>
     <figure data-m="shutter" data-m-parallax="7">
       <div data-m-cover />  <img … />
     </figure>
     <hr data-m="rule" />
   </section>

   | attribute            | effect                                                    |
   |----------------------|-----------------------------------------------------------|
   | data-m="rise"        | opacity 0→1, y 24 / 40 px → 0, 0.7 s power3.out; batched  |
   |                      | with ScrollTrigger.batch, staggered 0.08 s                |
   | data-m="lines"       | SplitText lines in masks, yPercent 110 → 0, 1.0 s         |
   |                      | expo.out, stagger 0.08 s; re-splits on font load / resize |
   | data-m="shutter"     | [data-m-cover] child yPercent 0 → −101, 1.0 s             |
   |                      | power3.inOut; the image scales 1.12 → 1, 1.4 s power3.out |
   | data-m="rule"        | scaleX 0 → 1 from the left, 0.9 s power3.inOut            |
   | data-m="fade"        | opacity 0 → 1, 0.7 s                                      |
   | data-m="settle"      | scale 1.08 → 1, 1.6 s power3.out (the Home hero image;    |
   |                      | use with data-m-now)                                      |
   | data-m="words"       | SplitText words, opacity 0.25 → 1, scrubbed while the     |
   |                      | element's top travels from 80 % to 35 % of the viewport;  |
   |                      | once all are opaque they stay so (headings only)          |
   | data-m-parallax="7"  | the frame's inner image drifts ±7 % (yPercent, scrub 0.6) |
   |                      | while the frame crosses the viewport; ±4 % below 1024 px  |
   | data-m-delay="0.1"   | extra delay in seconds                                    |
   | data-m-rise="24"     | a "rise" travels this many px at every width instead of   |
   |                      | 24 / 40                                                   |
   | data-m-now           | play on mount instead of on scroll (heroes); during a     |
   |                      | page transition, as the curtain leaves (revealGate.js)    |

   Rules
   - Every hidden starting state is set here, by GSAP, never by CSS: if
     JavaScript fails the content is simply visible. A shutter cover must
     therefore rest OFF the image in CSS (e.g. `transform: translateY(-101%)`
     or `opacity: 0`); this hook moves it over the image before revealing.
   - `data-m="lines"` and `data-m="words"` belong on headings (h1–h6). SplitText's `aria: 'auto'`
     keeps the text readable as one string by putting an aria-label on the
     split element, and ARIA does not allow a label on a <p> or <span>.
   - The "image" of a shutter / parallax frame is its `[data-m-media]`
     descendant, else its <picture>, else its first <img> / <video> / <canvas>.
   - Under prefers-reduced-motion: reduce the hook does nothing at all.
   - Everything is created inside one useGSAP scope (built on
     gsap.matchMedia()), so it is all reverted on unmount and rebuilt when
     the 1024 px breakpoint or the motion preference changes. Callbacks that
     fire later (ScrollTrigger.batch) are wrapped with the context's add(),
     so even their tweens belong to the scope.
   - Scopes may nest: an element is wired only by its nearest scope root.
   ============================================ */

import { useRef } from 'react';
import { SplitText } from 'gsap/SplitText';
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  scheduleRefresh,
} from '../animations/gsapSetup';
import {
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
import { isRevealHeld, onReveal } from './revealGate';

// gsapSetup.js stays the place ScrollTrigger and useGSAP are registered;
// SplitText is only needed by this hook, so it is registered here, once.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(SplitText);
}

const SCOPE_ATTR = 'data-m-scope';

const toNumber = (value, fallback = 0) => {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
};

const delayOf = (el) => toNumber(el.getAttribute('data-m-delay'));
const riseOf = (el, desktop) =>
  el.hasAttribute('data-m-rise') ? toNumber(el.getAttribute('data-m-rise'), RISE.sm) : desktop ? RISE.lg : RISE.sm;
const playsNow = (el) => el.hasAttribute('data-m-now');

const mediaOf = (frame) =>
  frame.querySelector('[data-m-media]') ||
  frame.querySelector('picture') ||
  frame.querySelector('img, video, canvas');

/**
 * @param {Object}  [options]
 * @param {Array}   [options.dependencies=[]] re-wire the scope when these change
 * @param {string}  [options.start='top 85%'] ScrollTrigger start for reveals
 * @param {boolean} [options.disabled=false]  skip all motion (content stays as authored)
 * @returns {React.RefObject} attach to the section root
 */
export default function useMotionScope(options = {}) {
  const { dependencies = [], start = START, disabled = false } = options;
  const ref = useRef(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || disabled) return undefined;

      root.setAttribute(SCOPE_ATTR, '');

      // Elements this scope owns: inside (or on) the root and not inside a
      // nested scope. Child layout effects run first, so nested roots are
      // already marked when this runs.
      const owned = (selector) => {
        const found = Array.from(root.querySelectorAll(selector));
        if (root.matches(selector)) found.unshift(root);
        return found.filter((el) => el.closest(`[${SCOPE_ATTR}]`) === root);
      };

      const mm = gsap.matchMedia();

      // `all` always matches, so the setup runs at every width; GSAP only
      // calls the function while at least one condition is true.
      mm.add(
        { all: 'all', desktop: MQ.desktop, reduce: MQ.reduce },
        (context) => {
          const { desktop, reduce } = context.conditions;
          if (reduce) return;

          const trigger = (el) =>
            playsNow(el) ? undefined : { trigger: el, start, once: true };

          // `data-m-now` motion created under the page curtain waits for it to
          // lift: the tween is built (so its hidden start state applies) but
          // paused, and restarted — delay included — on release. Keyed by
          // element so a re-split headline replaces its own earlier tween.
          const waiting = new Map();
          let cancelReveal = null;
          const gateNow = (el, tween) => {
            if (!playsNow(el) || !isRevealHeld()) return tween;
            tween.pause();
            waiting.set(el, tween);
            if (!cancelReveal) {
              cancelReveal = onReveal(
                context.add('iaRevealNow', () => {
                  cancelReveal = null;
                  waiting.forEach((t) => t.restart(true));
                  waiting.clear();
                })
              );
            }
            return tween;
          };

          /* ---- rise ---- */
          const riseEls = owned('[data-m="rise"]');
          if (riseEls.length) {
            gsap.set(riseEls, { opacity: 0, y: (i, el) => riseOf(el, desktop) });

            const reveal = (els) =>
              els.forEach((el, i) =>
                gateNow(
                  el,
                  gsap.to(el, {
                    opacity: 1,
                    y: 0,
                    duration: DUR.reveal,
                    ease: EASE.out,
                    delay: i * STAGGER.items + delayOf(el),
                    overwrite: 'auto',
                  })
                )
              );

            reveal(riseEls.filter(playsNow));

            const onScroll = riseEls.filter((el) => !playsNow(el));
            if (onScroll.length) {
              ScrollTrigger.batch(onScroll, {
                start,
                once: true,
                // Fires later, outside this synchronous setup: add() makes
                // it context-safe so its tweens are reverted with the scope.
                onEnter: context.add('iaRiseEnter', (batch) => reveal(batch)),
              });
            }
          }

          /* ---- lines ---- */
          owned('[data-m="lines"]').forEach((el) => {
            SplitText.create(el, {
              type: 'lines',
              mask: 'lines',
              autoSplit: true,
              aria: 'auto',
              // Returning the tween lets SplitText revert it and carry its
              // progress over when it re-splits (fonts loaded, width change),
              // so a finished headline does not replay on resize.
              onSplit: (self) =>
                gateNow(
                  el,
                  gsap.from(self.lines, {
                    yPercent: 110,
                    duration: DUR.hero,
                    ease: EASE.lines,
                    stagger: STAGGER.lines,
                    delay: delayOf(el),
                    scrollTrigger: trigger(el),
                  })
                ),
            });
          });

          /* ---- words (scrubbed) ---- */
          owned('[data-m="words"]').forEach((el) => {
            // Word boxes do not change with the width, so no autoSplit; the
            // split is reverted with the scope like every tween.
            const split = SplitText.create(el, { type: 'words', aria: 'auto' });
            gsap.fromTo(
              split.words,
              { opacity: WORDS.from },
              {
                opacity: 1,
                ease: EASE.scrub,
                stagger: WORDS.stagger,
                // Scrubbed on the way down; `once` retires the trigger when
                // every word is opaque, so the statement never fades again
                // while someone scrolls back up to re-read it.
                scrollTrigger: { trigger: el, start: WORDS.start, end: WORDS.end, scrub: true, once: true },
              }
            );
          });

          /* ---- settle ---- */
          owned('[data-m="settle"]').forEach((el) => {
            gateNow(
              el,
              gsap.fromTo(
                el,
                { scale: SETTLE.from },
                {
                  scale: 1,
                  duration: DUR_NAMED.heroSettle,
                  ease: EASE.out,
                  delay: delayOf(el),
                  scrollTrigger: trigger(el),
                }
              )
            );
          });

          /* ---- shutter ---- */
          owned('[data-m="shutter"]').forEach((frame) => {
            const cover = frame.querySelector('[data-m-cover]');
            const media = mediaOf(frame);
            if (!cover && !media) return;
            const tl = gateNow(
              frame,
              gsap.timeline({
                delay: delayOf(frame),
                scrollTrigger: trigger(frame),
              })
            );
            if (cover) {
              tl.fromTo(
                cover,
                { y: 0, yPercent: 0, opacity: 1 },
                { yPercent: -101, duration: DUR.hero, ease: EASE.mask },
                0
              );
            }
            if (media) {
              tl.fromTo(
                media,
                { scale: 1.12 },
                { scale: 1, duration: DUR_NAMED.shutterImage, ease: EASE.out },
                0
              );
            }
          });

          /* ---- rule ---- */
          owned('[data-m="rule"]').forEach((el) => {
            gateNow(el, gsap.fromTo(
              el,
              { scaleX: 0, transformOrigin: '0% 50%' },
              {
                scaleX: 1,
                duration: DUR_NAMED.rule,
                ease: EASE.mask,
                delay: delayOf(el),
                scrollTrigger: trigger(el),
              }
            ));
          });

          /* ---- fade ---- */
          owned('[data-m="fade"]').forEach((el) => {
            gateNow(
              el,
              gsap.fromTo(
                el,
                { opacity: 0 },
                {
                  opacity: 1,
                  duration: DUR.reveal,
                  ease: EASE.out,
                  delay: delayOf(el),
                  scrollTrigger: trigger(el),
                }
              )
            );
          });

          /* ---- parallax ---- */
          owned('[data-m-parallax]').forEach((frame) => {
            const media = mediaOf(frame);
            if (!media) return;
            const cap = desktop ? PARALLAX.capLg : PARALLAX.capSm;
            const amount = Math.min(
              Math.abs(toNumber(frame.getAttribute('data-m-parallax'), cap)),
              cap
            );
            if (!amount) return;
            gsap.fromTo(
              media,
              { yPercent: -amount },
              {
                yPercent: amount,
                ease: EASE.scrub,
                scrollTrigger: {
                  trigger: frame,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: PARALLAX.scrub,
                },
              }
            );
          });

          // One coalesced re-measure once the whole tree has committed.
          scheduleRefresh();

          return () => {
            if (cancelReveal) cancelReveal();
          };
        }
      );

      return () => {
        mm.revert();
        root.removeAttribute(SCOPE_ATTR);
      };
    },
    { scope: ref, dependencies: [start, disabled, ...dependencies], revertOnUpdate: true }
  );

  return ref;
}
