/* ============================================
   LeadModal — the global enquiry sheet (prompt 05)
   --------------------------------------------
   <LeadModal isOpen onClose source="dock-cta" serviceInterest="Interior Design"
              context={{ label: 'Portfolio — Graphite Gloss Kitchen' }} />

   Rendered once (App.jsx, LeadModalWrapper) and opened by every CTA through
   `openLeadModal(source, { service_interest, context })`.

   - Through Portal (paper tone); role="dialog", aria-modal, labelled by its
     heading. Backdrop rgba(22,30,25,.55), fading in 240 ms.
   - Below 768 px a bottom sheet: full width, min(92svh, content) tall, its
     own scroll (overscroll contained), header pinned above it. It rises
     from the bottom (yPercent 100 → 0, 500 ms power3.inOut) and leaves in
     350 ms. From 768 px a right-hand panel (520 px; 560 from 1280), full
     height, sliding in from the right (xPercent). Reduced motion: it simply
     appears and disappears.
   - When the on-screen keyboard covers the bottom of the viewport (the
     visual viewport shrinks), the sheet sits on top of it, so the focused
     field and the submit button stay reachable.
   - Header: eyebrow "Start a project", heading "Tell us about your space."
     and, when the CTA passed one, a quiet context line.
   - Body: the one UnifiedLeadForm, compact.

   Kept from the previous modal: Escape, the close button and a backdrop
   click close it; focus is trapped inside and returned to the opener; the
   page behind is scroll-locked at its offset and put back (only if the
   route is unchanged), with scheduleRefresh() on both edges (useScrollLock);
   any route change closes it (ModalContext). New: on open, focus goes to
   the heading (tabindex -1), not into a field, so a phone keyboard does not
   jump up uninvited.
   ============================================ */

import React, { useEffect, useId, useRef, useState } from 'react';
import UnifiedLeadForm from '../UnifiedLeadForm/UnifiedLeadForm';
import Portal from '../../ui/Portal/Portal';
import Eyebrow from '../../ui/Eyebrow/Eyebrow';
import Heading from '../../ui/Heading/Heading';
import IconButton from '../../ui/IconButton/IconButton';
import { useIsoLayoutEffect } from '../../ui/_shared/refs';
import useFocusTrap from '../../../hooks/useFocusTrap';
import useScrollLock from '../../../hooks/useScrollLock';
import { gsap, useGSAP } from '../../../animations/gsapSetup';
import { DUR, DUR_NAMED, EASE } from '../../../motion/tokens';
import { prefersReducedMotion } from '../../../motion/reducedMotion';
import { isServiceOption } from '../../../data/enquiry';
import styles from './LeadModal.module.css';

const WIDE = '(min-width: 768px)';

const isWide = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(WIDE).matches;

/** Px of the layout viewport hidden under an on-screen keyboard (0 when zoomed). */
const keyboardInset = () => {
  const vv = typeof window !== 'undefined' ? window.visualViewport : null;
  if (!vv || (vv.scale && vv.scale > 1.05)) return 0;
  return Math.max(0, Math.round(window.innerHeight - (vv.height + vv.offsetTop)));
};

const LeadModal = ({ isOpen, onClose, source = 'general', serviceInterest = '', context }) => {
  // Stays rendered while the exit plays; each opening mounts a fresh form.
  const [present, setPresent] = useState(isOpen);
  const [session, setSession] = useState(isOpen ? 1 : 0);
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setPresent(true);
      setSession((n) => n + 1);
    }
  }

  const rootRef = useRef(null);
  const sheetRef = useRef(null);
  const backdropRef = useRef(null);
  const headingRef = useRef(null);
  const leaving = useRef(false);
  const headingId = `lead-modal-title-${useId().replace(/:/g, '')}`;

  useScrollLock(isOpen);
  useFocusTrap(sheetRef, isOpen, { initialFocus: headingRef, onEscape: onClose });

  const { contextSafe } = useGSAP({ scope: rootRef });

  const animate = contextSafe((toOpen) => {
    const sheet = sheetRef.current;
    const backdrop = backdropRef.current;
    if (!sheet || !backdrop) return;
    gsap.killTweensOf([sheet, backdrop]);
    const axis = isWide() ? 'xPercent' : 'yPercent';
    const other = axis === 'xPercent' ? 'yPercent' : 'xPercent';

    if (prefersReducedMotion()) {
      gsap.set([sheet, backdrop], { clearProps: 'transform,opacity' });
      leaving.current = false;
      if (!toOpen) setPresent(false);
      return;
    }

    if (toOpen) {
      const resume = leaving.current;
      leaving.current = false;
      gsap.set(sheet, { [other]: 0 });
      if (resume) {
        gsap.to(sheet, { [axis]: 0, duration: DUR_NAMED.overlayIn, ease: EASE.mask, clearProps: 'transform' });
        gsap.to(backdrop, { opacity: 1, duration: DUR.hover, ease: EASE.out, clearProps: 'opacity' });
      } else {
        gsap.fromTo(
          sheet,
          { [axis]: 100 },
          { [axis]: 0, duration: DUR_NAMED.overlayIn, ease: EASE.mask, clearProps: 'transform' }
        );
        gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: DUR.hover, ease: EASE.out, clearProps: 'opacity' });
      }
    } else {
      leaving.current = true;
      gsap.to(backdrop, { opacity: 0, duration: DUR_NAMED.overlayOut, ease: EASE.out });
      gsap.to(sheet, {
        [axis]: 100,
        duration: DUR_NAMED.overlayOut,
        ease: EASE.mask,
        onComplete: () => {
          leaving.current = false;
          setPresent(false);
        },
      });
    }
  });

  // Before paint, so the sheet never flashes in its resting place.
  useIsoLayoutEffect(() => {
    if (!present) return;
    animate(isOpen);
  }, [isOpen, present]); // eslint-disable-line react-hooks/exhaustive-deps

  // The on-screen keyboard: lift the sheet above it.
  useEffect(() => {
    const sheet = sheetRef.current;
    const vv = typeof window !== 'undefined' ? window.visualViewport : null;
    if (!isOpen || !sheet || !vv) return undefined;
    const update = () => sheet.style.setProperty('--ia-kb', `${keyboardInset()}px`);
    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
      sheet.style.removeProperty('--ia-kb');
    };
  }, [isOpen]);

  if (!present) return null;

  const service = isServiceOption(serviceInterest) ? serviceInterest : '';
  const label = context && typeof context.label === 'string' ? context.label.trim() : '';

  return (
    <Portal tone="paper">
      <div ref={rootRef} className={styles.root} data-open={isOpen ? '' : undefined} data-shell-float="">
        <div ref={backdropRef} className={styles.backdrop} onClick={onClose} aria-hidden="true" />
        <div
          ref={sheetRef}
          className={styles.sheet}
          role="dialog"
          aria-modal="true"
          aria-labelledby={headingId}
        >
          <header className={styles.header}>
            <div className={styles.titles}>
              <Eyebrow className={styles.eyebrow}>Start a project</Eyebrow>
              <Heading as="h2" size="sm" id={headingId} ref={headingRef} tabIndex={-1} className={styles.heading}>
                Tell us about your space.
              </Heading>
              {(service || label) && (
                <p className={`ia-t-small ${styles.context}`}>
                  {service && <span>Enquiring about: {service}</span>}
                  {service && label && <span aria-hidden="true"> · </span>}
                  {label && <span>From: {label}</span>}
                </p>
              )}
            </div>
            <IconButton icon="close" label="Close" onClick={onClose} className={styles.close} />
          </header>

          <div className={styles.body}>
            <UnifiedLeadForm
              key={session}
              variant="compact"
              source={source}
              formId={`modal-${source}`}
              prefill={{ service_interest: serviceInterest }}
              context={context}
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default LeadModal;
