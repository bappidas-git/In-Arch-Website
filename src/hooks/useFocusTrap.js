/* ============================================
   useFocusTrap — keep keyboard focus inside an open overlay
   --------------------------------------------
   const ref = useRef(null);
   useFocusTrap(ref, isOpen, { initialFocus: closeRef, onEscape: close });
   <div ref={ref} role="dialog" aria-modal="true">…</div>

   While `active`:
   - focus moves in: to `initialFocus` (a ref or a selector), else the first
     element marked [data-autofocus], else the first focusable element,
     else the container itself (given tabindex="-1");
   - Tab from the last focusable element goes to the first and Shift+Tab
     from the first to the last; focus that lands outside (a click on the
     page behind, an overlay that lost focus) is brought back in;
   - `onEscape`, if given, is called on Escape.
   When it turns inactive or unmounts, focus returns to whatever had it when
   the trap opened — if that element is still in the document and visible
   (`returnFocus: false` skips this). The return uses preventScroll, so it
   never fights the scroll lock putting the page back.

   Listeners live on `document` only while the trap is active and are
   removed with it; nothing is registered at module scope.
   ============================================ */

import { useEffect, useRef } from 'react';

const FOCUSABLE = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const isVisible = (el) => {
  if (!el || !el.isConnected) return false;
  if (typeof el.checkVisibility === 'function') {
    return el.checkVisibility({ visibilityProperty: true, checkVisibilityCSS: true });
  }
  if (el.closest('[hidden], [inert]')) return false;
  const style = window.getComputedStyle(el);
  return style.display !== 'none' && style.visibility !== 'hidden';
};

/** Focusable, visible elements inside `container`, in DOM order. */
export const focusableIn = (container) =>
  container
    ? Array.from(container.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.tabIndex >= 0 && !el.closest('[inert]') && isVisible(el)
      )
    : [];

const resolveInitial = (container, initialFocus) => {
  if (initialFocus) {
    if (typeof initialFocus === 'string') return container.querySelector(initialFocus);
    if (initialFocus.current) return initialFocus.current;
  }
  return container.querySelector('[data-autofocus]') || focusableIn(container)[0] || null;
};

export default function useFocusTrap(ref, active, options = {}) {
  const { initialFocus, returnFocus = true, onEscape } = options;
  const latest = useRef({ initialFocus, returnFocus, onEscape });
  latest.current = { initialFocus, returnFocus, onEscape };

  useEffect(() => {
    const container = ref.current;
    if (!active || !container || typeof document === 'undefined') return undefined;

    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const focusFirst = () => {
      const target = resolveInitial(container, latest.current.initialFocus);
      if (target) {
        target.focus({ preventScroll: true });
        return;
      }
      if (!container.hasAttribute('tabindex')) container.setAttribute('tabindex', '-1');
      container.focus({ preventScroll: true });
    };
    if (!container.contains(document.activeElement)) focusFirst();

    const onKeyDown = (event) => {
      if (event.key === 'Escape' && latest.current.onEscape) {
        event.stopPropagation();
        latest.current.onEscape(event);
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusableIn(container);
      if (!items.length) {
        event.preventDefault();
        container.focus({ preventScroll: true });
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      const inside = container.contains(current);
      if (event.shiftKey && (current === first || !inside || current === container)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (current === last || !inside)) {
        event.preventDefault();
        first.focus();
      }
    };

    const onFocusIn = (event) => {
      if (!container.contains(event.target)) focusFirst();
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('focusin', onFocusIn);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('focusin', onFocusIn);
      if (latest.current.returnFocus && opener && isVisible(opener)) {
        opener.focus({ preventScroll: true });
      }
    };
  }, [ref, active]);
}
