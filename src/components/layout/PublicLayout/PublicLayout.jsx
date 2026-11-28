/* ============================================
   PublicLayout — the IN-ARCH shell (prompt 04)
   --------------------------------------------
   Every public route renders inside this layout, which stays mounted
   across navigations. DOM order:

     skip link → Masthead (<header>) → Dock (<nav aria-label="Primary">)
     → IndexOverlay (portal) → <main id="main-content" tabindex="-1">
     → Footer → Curtain → RouteAnnouncer

   The `ia` scope is NOT on this wrapper or on <main> yet: each shell
   component carries it on its own root, and each rebuilt page on its own
   root, so the old page bodies keep inheriting the legacy typography until
   their prompts replace them. Prompt 14 hoists the class here.

   This layout owns the index overlay's open state: the Menu button toggles
   it, any route change closes it, and crossing 1024 px closes it so the
   scroll lock can never outlive the overlay. It also keeps the browser
   toolbar colour (theme-color) at forest on the public surface.

   The routed page is keyed by its pathname, so a navigation between two
   URLs of one route (/portfolio/a → /portfolio/b) mounts a fresh page — the
   page transition waits for that page, not the previous one.
   ============================================ */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Masthead from '../../shell/Masthead/Masthead';
import Dock from '../../shell/Dock/Dock';
import IndexOverlay from '../../shell/IndexOverlay/IndexOverlay';
import Footer from '../../shell/Footer/Footer';
import Curtain from '../../shell/Curtain/Curtain';
import RouteAnnouncer from '../../shell/RouteAnnouncer/RouteAnnouncer';
import { MQ } from '../../../motion/tokens';
import styles from './PublicLayout.module.css';

export const PUBLIC_THEME_COLOR = '#161E19';

// The skip link moves focus itself: a fragment jump would change the URL,
// which the router reports as a back / forward (POP) navigation.
const skipToMain = (event) => {
  const main = document.getElementById('main-content');
  if (!main) return;
  event.preventDefault();
  main.focus({ preventScroll: true });
  main.scrollIntoView({ block: 'start' });
};

const PublicLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const menuButtonRef = useRef(null);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen((open) => !open), []);

  // Any navigation closes the overlay (a click on the current route too).
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.key]);

  // The dock carries the links from 1024 px — the overlay must not survive it
  // (rotating a tablet to landscape, resizing a window).
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mql = window.matchMedia(MQ.desktop);
    const handleChange = (event) => {
      if (event.matches) setIsMenuOpen(false);
    };
    handleChange(mql);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  // The shell owns the toolbar colour on public routes (ThemeContext skips
  // its write here). Re-asserted on mount, e.g. after coming back from /admin.
  useEffect(() => {
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
      meta.setAttribute('content', PUBLIC_THEME_COLOR);
    });
  }, []);

  return (
    <div className={styles.shell}>
      <a href="#main-content" className={`ia ${styles.skip}`} onClick={skipToMain}>
        Skip to main content
      </a>

      <Masthead />
      <Dock menuOpen={isMenuOpen} onMenuToggle={toggleMenu} menuButtonRef={menuButtonRef} />
      <IndexOverlay open={isMenuOpen} onClose={closeMenu} menuButtonRef={menuButtonRef} />

      <main id="main-content" className={styles.main} tabIndex={-1}>
        <Outlet key={location.pathname} />
      </main>

      <Footer />
      <Curtain />
      <RouteAnnouncer />
    </div>
  );
};

export default PublicLayout;
