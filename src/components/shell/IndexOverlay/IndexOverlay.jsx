/* ============================================
   IndexOverlay — the full-screen site index (below 1024 px)
   --------------------------------------------
   A dark, full-viewport `nav` (aria-label "Site index") rendered through
   Portal. It rises from the bottom (yPercent 100 → 0, 500 ms
   power3.inOut), its rows then rise 24 px with a 0.08 s stagger, and it
   leaves in 350 ms. Under reduced motion it appears and disappears at once.

   - Top: the ivory wordmark. Middle: the six NAV_LINKS as numbered rows
     (number, label, descriptor), the current page marked. Then the address
     and the phone number.
   - Bottom bar, in the dock's three positions so the thumb does not
     travel: Close (where Menu was) · Start a project · WhatsApp.

   Behaviour carried over from the old MobileMenu: focus moves to the first
   link on open and Tab cycles inside; Escape closes; the page behind is
   scroll-locked; choosing a link, any route change and crossing 1024 px all
   close it (the last two are PublicLayout's); focus returns to the Menu
   button. While closed it is inert and aria-hidden.
   ============================================ */

import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useModal } from '../../../context/ModalContext';
import { NAV_LINKS, navCurrent } from '../../../data/navigation';
import { studio, studioAddressLines, studioTelHref, studioWhatsAppHref } from '../../../data/siteConfig';
import { gsap, useGSAP } from '../../../animations/gsapSetup';
import { DUR, DUR_NAMED, EASE, RISE, STAGGER } from '../../../motion/tokens';
import { prefersReducedMotion } from '../../../motion/reducedMotion';
import Portal from '../../ui/Portal/Portal';
import Logo from '../../ui/Logo/Logo';
import Button from '../../ui/Button/Button';
import IconButton from '../../ui/IconButton/IconButton';
import TextLink from '../../ui/TextLink/TextLink';
import Icon from '../../ui/Icon/Icon';
import useFocusTrap from '../../../hooks/useFocusTrap';
import useScrollLock from '../../../hooks/useScrollLock';
import TLink from '../transition/TLink';
import { OVERLAY_ID, WHATSAPP_GREETING } from '../Dock/Dock';
import styles from './IndexOverlay.module.css';

const ADDRESS = studioAddressLines.join(', ');

const IndexOverlay = ({ open = false, onClose, menuButtonRef }) => {
  const navRef = useRef(null);
  const firstLinkRef = useRef(null);
  const wasOpen = useRef(false);
  const { pathname } = useLocation();
  const { openLeadModal } = useModal();
  const { contextSafe } = useGSAP({ scope: navRef });

  useScrollLock(open);
  useFocusTrap(navRef, open, { initialFocus: firstLinkRef, returnFocus: false, onEscape: onClose });

  // Focus goes back to the Menu button. Crossing 1024 px removes that button,
  // so focus goes to the first control of the desktop dock instead (a
  // navigation then moves it on to <main>).
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      return;
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    const shown = (el) => el && el.isConnected && el.offsetParent !== null;
    const button = menuButtonRef && menuButtonRef.current;
    if (shown(button)) {
      button.focus({ preventScroll: true });
      return;
    }
    const dock = button && button.closest('nav');
    const fallback = dock && Array.from(dock.querySelectorAll('a[href], button')).find(shown);
    if (fallback) fallback.focus({ preventScroll: true });
  }, [open, menuButtonRef]);

  const animate = contextSafe((toOpen) => {
    const nav = navRef.current;
    if (!nav) return;
    const rows = nav.querySelectorAll('[data-overlay-row]');
    gsap.killTweensOf([nav, ...rows]);

    // Visibility follows `data-open` in CSS (so the focus trap, which runs
    // first, can already focus the first link); GSAP only moves it.
    if (prefersReducedMotion()) {
      gsap.set(nav, { clearProps: 'transform' });
      gsap.set(rows, { clearProps: 'opacity,transform' });
      return;
    }

    if (toOpen) {
      gsap.fromTo(nav, { yPercent: 100 }, { yPercent: 0, duration: DUR_NAMED.overlayIn, ease: EASE.mask });
      gsap.fromTo(
        rows,
        { opacity: 0, y: RISE.sm },
        {
          opacity: 1,
          y: 0,
          duration: DUR.reveal,
          ease: EASE.out,
          stagger: STAGGER.items,
          delay: DUR_NAMED.overlayIn * 0.55,
        }
      );
    } else {
      gsap.to(nav, { yPercent: 100, duration: DUR_NAMED.overlayOut, ease: EASE.mask });
    }
  });

  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      if (!open) return; // rests hidden in CSS
    }
    animate(open);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const startProject = () => {
    onClose();
    openLeadModal('dock-cta');
  };

  return (
    <Portal tone="dark">
      <nav
        id={OVERLAY_ID}
        ref={navRef}
        className={styles.overlay}
        aria-label="Site index"
        aria-hidden={open ? undefined : 'true'}
        inert={open ? undefined : ''}
        data-open={open ? '' : undefined}
        data-shell-float=""
      >
        <div className={styles.top}>
          <Logo variant="wordmark" height={24} alt={studio.fullName} />
        </div>

        <div className={styles.body}>
          <ul className={styles.rows}>
            {NAV_LINKS.map((link, index) => {
              const current = navCurrent(link.to, pathname);
              return (
                <li key={link.to} className={styles.item} data-overlay-row="">
                  <TLink
                    ref={index === 0 ? firstLinkRef : undefined}
                    to={link.to}
                    className={styles.row}
                    aria-current={current || undefined}
                    onClick={onClose}
                  >
                    <span className={`ia-t-label ${styles.num}`}>{link.num}</span>
                    <span className={styles.text}>
                      <span className={`ia-t-display-lg ${styles.label}`}>
                        {link.label}
                        {current && <span className={styles.dot} aria-hidden="true" />}
                      </span>
                      <span className={`ia-t-small ${styles.descriptor}`}>{link.descriptor}</span>
                    </span>
                  </TLink>
                </li>
              );
            })}
          </ul>

          <div className={`ia-t-small ${styles.contact}`} data-overlay-row="">
            {ADDRESS && <p className={styles.address}>{ADDRESS}</p>}
            {studio.phone && (
              <TextLink href={studioTelHref} className={styles.tel}>
                {studio.phoneDisplay}
              </TextLink>
            )}
          </div>
        </div>

        <div className={styles.bar}>
          <button type="button" className={styles.close} onClick={onClose}>
            <Icon name="close" size={20} />
            <span>Close</span>
          </button>
          <Button size="md" className={styles.cta} onClick={startProject}>
            Start a project
          </Button>
          {studio.whatsapp && (
            <IconButton
              icon="chat"
              href={studioWhatsAppHref(WHATSAPP_GREETING)}
              target="_blank"
              label="Message IN-ARCH on WhatsApp"
            />
          )}
        </div>
      </nav>
    </Portal>
  );
};

export default IndexOverlay;
