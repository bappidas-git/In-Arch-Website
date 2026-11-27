/* ============================================
   Accordion + AccordionItem — disclosure lists
   --------------------------------------------
   <Accordion defaultOpenId="e01">                      single-open
     <AccordionItem id="e01" index={1} title="Architectural Design & Consultancy">…</AccordionItem>
     …
   </Accordion>

   <Accordion multiple>                                  multi-open, all closed
   <Accordion openId={open} onToggle={(id, isOpen, next) => setOpen(next)}>   controlled

   - Each header is a real <button> inside a heading (`headingLevel`,
     default h3) with aria-expanded and aria-controls; the panel is
     role="region" labelled by its header. Enter and Space toggle (native
     button); ↑ / ↓ / Home / End move between headers.
   - Single-open by default (opening one closes the other; the open one can
     still be closed); `multiple` allows any number.
   - Controlled with `openId` (an id or null; an array with `multiple`) and
     `onToggle(id, isOpen, nextOpenId)`; uncontrolled with `defaultOpenId`.
   - Every item's `id` is its DOM id, for deep links: with `openOnHash`
     (default) the item named by location.hash opens on arrival and on
     `hashchange`. Scrolling to it stays with ScrollManager / hashScroll.
   - Opening shows the panel at once and raises its content (opacity and
     12 px, 400 ms) — no height animation. The plus turns 45° into a cross.
     Items open on arrival do not animate. Under reduced motion nothing moves.
   - `size`: the header title — sm (display-sm, default) or md (display-md).
   ============================================ */

import React, { createContext, forwardRef, useCallback, useContext, useEffect, useRef, useState } from 'react';
import cx from '../_shared/cx';
import { devWarn } from '../_shared/dev';
import { useMergedRef } from '../_shared/refs';
import Icon from '../Icon/Icon';
import { padIndex } from '../Eyebrow/Eyebrow';
import styles from './Accordion.module.css';

const AccordionContext = createContext(null);

const toList = (value) => (value === undefined || value === null ? [] : Array.isArray(value) ? value : [value]);

const ownItems = (root, selector) =>
  Array.from(root.querySelectorAll(selector)).filter((el) => el.closest('[data-accordion]') === root);

const Accordion = forwardRef(function Accordion(
  {
    multiple = false,
    openId,
    defaultOpenId,
    onToggle,
    headingLevel = 'h3',
    size = 'sm',
    openOnHash = true,
    className,
    children,
    onKeyDown,
    ...rest
  },
  forwardedRef
) {
  const root = useRef(null);
  const ref = useMergedRef(forwardedRef, root);
  const controlled = openId !== undefined;
  const [inner, setInner] = useState(() => toList(defaultOpenId));
  const [justOpened, setJustOpened] = useState(null);
  const open = controlled ? toList(openId) : inner;

  // Latest values for callbacks that outlive a render (hash listener).
  const latest = useRef({ open, multiple, controlled, onToggle });
  latest.current = { open, multiple, controlled, onToggle };

  const setOpen = useCallback((id, shouldOpen) => {
    const { open: current, multiple: many, controlled: isControlled, onToggle: notify } = latest.current;
    const isOpen = current.includes(id);
    if (isOpen === shouldOpen) return;
    let next;
    if (shouldOpen) next = many ? [...current, id] : [id];
    else next = current.filter((x) => x !== id);
    if (!isControlled) setInner(next);
    if (shouldOpen) setJustOpened(id);
    if (notify) notify(id, shouldOpen, many ? next : next[0] === undefined ? null : next[0]);
  }, []);

  const toggle = useCallback((id) => setOpen(id, !latest.current.open.includes(id)), [setOpen]);

  // Deep links: open the item named by the hash.
  useEffect(() => {
    if (!openOnHash || typeof window === 'undefined') return undefined;
    const fromHash = () => {
      const el = root.current;
      const raw = window.location.hash.slice(1);
      if (!el || !raw) return;
      let id = raw;
      try {
        id = decodeURIComponent(raw);
      } catch (e) {
        /* keep the raw hash */
      }
      const match = ownItems(el, '[data-accordion-item]').some((item) => item.getAttribute('data-accordion-item') === id);
      if (match) setOpen(id, true);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, [openOnHash, setOpen]);

  const handleKeyDown = (event) => {
    if (onKeyDown) onKeyDown(event);
    const el = root.current;
    const header = event.target.closest && event.target.closest('[data-accordion-header]');
    if (!el || !header || header.closest('[data-accordion]') !== el) return;
    const headers = ownItems(el, '[data-accordion-header]');
    const i = headers.indexOf(header);
    let next = null;
    if (event.key === 'ArrowDown') next = headers[(i + 1) % headers.length];
    else if (event.key === 'ArrowUp') next = headers[(i - 1 + headers.length) % headers.length];
    else if (event.key === 'Home') next = headers[0];
    else if (event.key === 'End') next = headers[headers.length - 1];
    if (next) {
      event.preventDefault();
      next.focus();
    }
  };

  return (
    <AccordionContext.Provider
      value={{ isOpen: (id) => open.includes(id), toggle, headingLevel, size, justOpened }}
    >
      <div ref={ref} className={cx(styles.accordion, className)} data-accordion="" onKeyDown={handleKeyDown} {...rest}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
});

export const AccordionItem = forwardRef(function AccordionItem({ id, title, index, className, children, ...rest }, ref) {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('AccordionItem must be inside an Accordion.');
  if (!id) devWarn('AccordionItem: `id` is required (DOM id, deep link and ARIA wiring).');
  const open = ctx.isOpen(id);
  const Heading = ['h2', 'h3', 'h4', 'h5'].includes(ctx.headingLevel) ? ctx.headingLevel : 'h3';
  const headerId = `${id}-header`;
  const panelId = `${id}-panel`;
  const hasIndex = index !== undefined && index !== null && index !== '';

  return (
    <div
      ref={ref}
      id={id}
      className={cx(styles.item, open && styles.open, className)}
      data-accordion-item={id}
      {...rest}
    >
      <Heading className={styles.heading}>
        <button
          type="button"
          id={headerId}
          className={cx(styles.header, hasIndex && styles.withIndex)}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => ctx.toggle(id)}
          data-accordion-header=""
        >
          {hasIndex && <span className={cx('ia-t-label', styles.index)}>{padIndex(index)}</span>}
          <span className={cx(ctx.size === 'md' ? 'ia-t-display-md' : 'ia-t-display-sm', styles.title)}>{title}</span>
          <span className={styles.toggle} aria-hidden="true">
            <Icon name="plus" size={20} className={styles.plus} />
          </span>
        </button>
      </Heading>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        className={cx(styles.panel, hasIndex && styles.indented)}
        hidden={!open}
      >
        <div className={cx(styles.content, open && ctx.justOpened === id && styles.entering)}>{children}</div>
      </div>
    </div>
  );
});

export default Accordion;
