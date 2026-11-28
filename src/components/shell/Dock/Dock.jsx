/* ============================================
   Dock — the Index Dock (primary navigation and primary CTA)
   --------------------------------------------
   A floating bar fixed to the bottom edge at every breakpoint. There is no
   fixed top bar.

   Below 1024 px — three zones, in the thumb's reach:
     Menu (opens the index overlay) · Start a project · WhatsApp
   From 1024 px — centred, width to content (≤ 960 px):
     the "IA" mark (home) · Studio · Expertise · Interior Design ·
     Portfolio · Contact · Start a project

   - Tone: copies the section beneath its vertical centre (useSurfaceTone)
     and cross-fades its colours over 240 ms.
   - It yields: while any in-page [data-primary-cta] is ≥ 60 % visible, its
     own button turns secondary (colours only), so a viewport never shows
     two primary buttons. On /contact it reads "Write to us" and scrolls to
     the enquiry form instead of opening the modal.
   - It slides out (translateY 140 %, 400 ms) only while the index overlay
     or the lead modal is open, while a text field has focus on a touch
     device (the keyboard is up — phones and tablets only), or while the
     footer's contact block is ≥ 40 % visible. Never on scroll. While out it
     is inert, so focus cannot land on something off-screen; and it stays
     put while focus is inside it.
   ============================================ */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useModal } from '../../../context/ModalContext';
import { NAV_LINKS, navCurrent } from '../../../data/navigation';
import { studio, studioWhatsAppHref } from '../../../data/siteConfig';
import Button from '../../ui/Button/Button';
import IconButton from '../../ui/IconButton/IconButton';
import Icon from '../../ui/Icon/Icon';
import Logo from '../../ui/Logo/Logo';
import TLink from '../transition/TLink';
import useSurfaceTone from '../useSurfaceTone';
import useMatchMedia from '../useMatchMedia';
import { MQ } from '../../../motion/tokens';
import { prefersReducedMotion } from '../../../motion/reducedMotion';
import styles from './Dock.module.css';

export const OVERLAY_ID = 'site-index';
export const WHATSAPP_GREETING = 'Hello IN-ARCH, I would like to discuss a project.';
const PRIMARY_THRESHOLD = 0.6;
const FOOTER_THRESHOLD = 0.4;
const TOUCH = '(hover: none), (pointer: coarse)';

const normalise = (pathname) => (pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname);

/** Re-run `callback` (rAF-coalesced) whenever the page's DOM changes. */
const useDomChanges = (callback, deps) => {
  const latest = useRef(callback);
  latest.current = callback;
  useEffect(() => {
    let frame = 0;
    const run = () => {
      frame = 0;
      latest.current();
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(run);
    };
    schedule();
    const root = document.getElementById('root') || document.body;
    const observer = typeof MutationObserver === 'function' ? new MutationObserver(schedule) : null;
    if (observer) observer.observe(root, { childList: true, subtree: true });
    return () => {
      window.cancelAnimationFrame(frame);
      if (observer) observer.disconnect();
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
};

/**
 * True while any element matching `selector` (outside the shell's floating
 * layers) is at least `threshold` visible.
 */
const useAnyVisible = (selector, threshold, pathname) => {
  const [visible, setVisible] = useState(false);
  const observerRef = useRef(null);
  const watched = useRef(new Set());
  const showing = useRef(new Set());

  useEffect(() => {
    if (typeof IntersectionObserver !== 'function') return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= threshold - 0.001) showing.current.add(entry.target);
          else showing.current.delete(entry.target);
        });
        setVisible(showing.current.size > 0);
      },
      { threshold: [0, threshold, 1] }
    );
    observerRef.current = observer;
    const watchedSet = watched.current;
    const showingSet = showing.current;
    return () => {
      observer.disconnect();
      observerRef.current = null;
      watchedSet.clear();
      showingSet.clear();
    };
  }, [threshold]);

  useDomChanges(() => {
    const observer = observerRef.current;
    if (!observer) return;
    const current = new Set(
      Array.from(document.querySelectorAll(selector)).filter((el) => !el.closest('[data-shell-float]'))
    );
    watched.current.forEach((el) => {
      if (!current.has(el)) {
        observer.unobserve(el);
        watched.current.delete(el);
        showing.current.delete(el);
      }
    });
    current.forEach((el) => {
      if (!watched.current.has(el)) {
        observer.observe(el);
        watched.current.add(el);
      }
    });
    setVisible(showing.current.size > 0);
  }, [selector, pathname]);

  return visible;
};

const isTextField = (el) => {
  if (!el || !el.matches) return false;
  if (el.isContentEditable) return true;
  if (el.matches('textarea')) return true;
  if (!el.matches('input')) return false;
  const type = (el.getAttribute('type') || 'text').toLowerCase();
  return ['text', 'email', 'tel', 'number', 'search', 'url', 'password', 'date', 'datetime-local', 'month', 'time', 'week'].includes(type);
};

/** True while a text field has focus on a touch device (the on-screen keyboard is up). */
const useKeyboardUp = () => {
  const [up, setUp] = useState(false);
  useEffect(() => {
    const touch = () => typeof window.matchMedia === 'function' && window.matchMedia(TOUCH).matches;
    const onFocusIn = (event) => setUp(touch() && isTextField(event.target));
    const onFocusOut = () => {
      // Focus moving from one field to the next must not bounce the dock.
      window.setTimeout(() => setUp(touch() && isTextField(document.activeElement)), 0);
    };
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    return () => {
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
    };
  }, []);
  return up;
};

/** The enquiry form on /contact: `#enquiry` once prompt 13 ships it; the old page's form until then. */
const enquiryTarget = () => document.getElementById('enquiry') || document.querySelector('#main-content form');

const goToEnquiry = (fallback) => {
  const target = enquiryTarget();
  if (!target) {
    fallback();
    return;
  }
  target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  const field = target.querySelector('input:not([type="hidden"]), textarea, select');
  if (field) field.focus({ preventScroll: true });
};

const Dock = ({ menuOpen = false, onMenuToggle, menuButtonRef }) => {
  const { pathname } = useLocation();
  const { openLeadModal, isModalOpen } = useModal();
  const desktop = useMatchMedia(MQ.desktop);
  const dockRef = useRef(null);
  const [focusInside, setFocusInside] = useState(false);

  // The dock's vertical centre, sampled in the left margin outside the bar
  // (x = 4 px is clear of it at every breakpoint).
  const tone = useSurfaceTone(
    useCallback(() => {
      const el = dockRef.current;
      if (!el) return null;
      const bottom = parseFloat(window.getComputedStyle(el).bottom) || 0;
      return { x: 4, y: window.innerHeight - bottom - el.offsetHeight / 2 };
    }, [])
  );

  const primaryInView = useAnyVisible('[data-primary-cta]', PRIMARY_THRESHOLD, pathname);
  const footerContact = useAnyVisible('[data-footer-contact]', FOOTER_THRESHOLD, pathname);
  const keyboardUp = useKeyboardUp();

  const hidden =
    menuOpen || isModalOpen || (!focusInside && (footerContact || (!desktop && keyboardUp)));

  // If the dock hides while it holds focus (the overlay or modal opened from
  // it), focus has already moved into that overlay; nothing else to do.
  useEffect(() => {
    const el = dockRef.current;
    if (!el) return undefined;
    // Keyboard focus only: a link clicked with a mouse keeps focus too, and
    // that must not pin the dock over the footer.
    const onIn = (event) => setFocusInside(Boolean(event.target.matches && event.target.matches(':focus-visible')));
    const onOut = (event) => {
      if (!el.contains(event.relatedTarget)) setFocusInside(false);
    };
    el.addEventListener('focusin', onIn);
    el.addEventListener('focusout', onOut);
    return () => {
      el.removeEventListener('focusin', onIn);
      el.removeEventListener('focusout', onOut);
    };
  }, []);

  const onContact = normalise(pathname) === '/contact';
  const cta = {
    label: onContact ? 'Write to us' : 'Start a project',
    icon: onContact ? 'arrow-down' : 'arrow-up-right',
    onClick: onContact ? () => goToEnquiry(() => openLeadModal('dock-cta')) : () => openLeadModal('dock-cta'),
    variant: primaryInView ? 'secondary' : 'primary',
  };

  return (
    <nav
      ref={dockRef}
      className={`ia ${styles.dock}`}
      data-tone={tone}
      data-hidden={hidden ? '' : undefined}
      data-yield={primaryInView ? '' : undefined}
      data-shell-float=""
      aria-label="Primary"
      inert={hidden ? '' : undefined}
    >
      {/* ---------- Phones and tablets ---------- */}
      <div className={styles.compact}>
        <button
          ref={menuButtonRef}
          type="button"
          className={styles.menu}
          aria-expanded={menuOpen}
          aria-controls={OVERLAY_ID}
          onClick={onMenuToggle}
        >
          <Icon name="menu" size={20} />
          <span>Menu</span>
        </button>

        <Button
          size="md"
          variant={cta.variant}
          icon={cta.icon}
          className={styles.cta}
          onClick={cta.onClick}
        >
          {cta.label}
        </Button>

        {studio.whatsapp && (
          <IconButton
            className={styles.whatsapp}
            icon="chat"
            href={studioWhatsAppHref(WHATSAPP_GREETING)}
            target="_blank"
            label="Message IN-ARCH on WhatsApp"
          />
        )}
      </div>

      {/* ---------- Desktop ---------- */}
      <div className={styles.wide}>
        <TLink
          to="/"
          className={styles.mark}
          aria-label={`${studio.name} — home`}
          aria-current={navCurrent('/', pathname) || undefined}
        >
          <Logo variant="mark" height={26} alt="" />
        </TLink>
        <span className={styles.rule} aria-hidden="true" />
        <ul className={styles.links}>
          {NAV_LINKS.filter((link) => link.to !== '/').map((link) => {
            const current = navCurrent(link.to, pathname);
            return (
              <li key={link.to}>
                <TLink to={link.to} className={styles.link} aria-current={current || undefined}>
                  <span className={styles.linkText}>{link.label}</span>
                  {current && <span className={styles.dot} aria-hidden="true" />}
                </TLink>
              </li>
            );
          })}
        </ul>
        <span className={styles.rule} aria-hidden="true" />
        <Button size="md" variant={cta.variant} icon={cta.icon} className={styles.cta} onClick={cta.onClick}>
          {cta.label}
        </Button>
      </div>
    </nav>
  );
};

export default Dock;
