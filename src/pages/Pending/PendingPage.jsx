/* ============================================
   PendingPage — the honest interim page
   --------------------------------------------
   Rendered by the routes whose pages are built by later prompts:
   /interior-design (prompt 10), /portfolio (11) and /portfolio/:slug (12).
   One light screen: an eyebrow naming the destination, "This page is being
   prepared." and two ways on (Home, Contact). SEOHead resolves these routes
   to `pages.pending`, which is noindex. Prompt 20's QA fails if any route
   still renders this page.
   ============================================ */

import React from 'react';
import { useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../../data/navigation';
import Eyebrow from '../../components/ui/Eyebrow/Eyebrow';
import Heading from '../../components/ui/Heading/Heading';
import TextLink from '../../components/ui/TextLink/TextLink';
import usePageReady from '../../components/shell/transition/usePageReady';
import styles from './PendingPage.module.css';

/** The nav entry this URL belongs to (/portfolio/<slug> → Portfolio). */
const sectionOf = (pathname) =>
  NAV_LINKS.find((link) => link.to !== '/' && (pathname === link.to || pathname.startsWith(`${link.to}/`)));

const PendingPage = () => {
  const { pathname } = useLocation();
  usePageReady();
  const section = sectionOf(pathname);

  return (
    <div className={`ia ${styles.page}`} data-tone="light" data-pending-page="">
      <div className={`ia-container ${styles.inner}`}>
        <Eyebrow>{section ? section.label : 'In preparation'}</Eyebrow>
        <Heading as="h1" size="xl" className={styles.heading}>
          This page is <em>being prepared.</em>
        </Heading>
        <div className={styles.links}>
          <TextLink to="/" arrow="arrow-right">
            Home
          </TextLink>
          <TextLink to="/contact" arrow="arrow-right">
            Contact
          </TextLink>
        </div>
      </div>
    </div>
  );
};

export default PendingPage;
