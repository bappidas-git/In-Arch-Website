/* ============================================
   Footer — IN-ARCH
   --------------------------------------------
   Dark, compact rhythm. Its bottom padding clears the dock (WCAG 2.2
   "Focus Not Obscured"), so the last line is never hidden behind it.

   - Opening line: the ivory lockup and `studio.blurb`, with one quiet
     action beside it ("Have a project in mind?" → the lead modal, source
     `footer-cta`). No large CTA band: pages end in their own way.
   - Four groups — stacked on phones, two columns from 768, four across from
     1024: Explore (NAV_LINKS) · Services (the seven, each to
     /expertise#e0N) · Visit (address, hours, directions) · Talk (phone,
     WhatsApp, and email only once it is supplied, D-03).
   - Legal row: copyright, the developer credit (D-15), any credit a licence
     requires (src/data/credits.js; none today, D-13) and "Back to top".

   Every fact comes from src/data/; an empty value renders nothing. The Talk
   group carries [data-footer-contact]: while it is ≥ 40 % visible the dock
   slides out, because this block already offers the same actions.
   ============================================ */

import React from 'react';
import { useModal } from '../../../context/ModalContext';
import { NAV_LINKS } from '../../../data/navigation';
import { services } from '../../../data/services';
import { footerCredits } from '../../../data/credits';
import {
  siteConfig,
  studio,
  studioAddressLines,
  studioHoursLabel,
  studioMailHref,
  studioMapsHref,
  studioTelHref,
  studioWhatsAppHref,
} from '../../../data/siteConfig';
import { prefersReducedMotion } from '../../../motion/reducedMotion';
import Logo from '../../ui/Logo/Logo';
import TextLink from '../../ui/TextLink/TextLink';
import IconButton from '../../ui/IconButton/IconButton';
import VisuallyHidden from '../../ui/VisuallyHidden/VisuallyHidden';
import useMatchMedia from '../useMatchMedia';
import styles from './Footer.module.css';

const NEW_TAB = ' (opens in a new tab)';

const backToTop = () => {
  window.scrollTo({ top: 0, left: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  // Keyboard users go back to the top too: the first control after the
  // skip link is the masthead's home link.
  const home = document.querySelector('header a[href="/"]');
  if (home) home.focus({ preventScroll: true });
};

const Group = ({ id, title, children, ...rest }) => (
  <section className={styles.group} aria-labelledby={id} {...rest}>
    <h2 id={id} className={`ia-t-label ${styles.heading}`}>
      {title}
    </h2>
    {children}
  </section>
);

const Footer = () => {
  const { openLeadModal } = useModal();
  const tablet = useMatchMedia('(min-width: 768px)');
  const year = new Date().getFullYear();
  const credits = footerCredits.filter((credit) => credit && credit.href && credit.label);

  return (
    <footer className={`ia ${styles.footer}`} data-tone="dark">
      <div className="ia-container">
        {/* ---------- Opening line ---------- */}
        <div className={styles.opening}>
          <div className={styles.brand}>
            <Logo variant="lockup" height={tablet ? 56 : 44} alt={studio.fullName} loading="lazy" />
            {studio.blurb && <p className={`ia-t-body-lg ${styles.blurb}`}>{studio.blurb}</p>}
          </div>
          <p className={styles.invite}>
            <span className={styles.inviteText}>Have a project in mind?</span>
            <TextLink arrow accent onClick={() => openLeadModal('footer-cta')}>
              Start a project
            </TextLink>
          </p>
        </div>

        {/* ---------- Four groups ---------- */}
        <div className={`ia-grid ${styles.groups}`}>
          <Group id="footer-explore" title="Explore">
            <nav aria-label="Footer">
              <ul className={styles.list}>
                {NAV_LINKS.map((link) => (
                  <li key={link.to}>
                    <TextLink to={link.to}>{link.label}</TextLink>
                  </li>
                ))}
              </ul>
            </nav>
          </Group>

          <Group id="footer-services" title="Services">
            <ul className={styles.list}>
              {services.map((service) => (
                <li key={service.id}>
                  <TextLink to={`/expertise#${service.id}`}>{service.title}</TextLink>
                </li>
              ))}
            </ul>
          </Group>

          <Group id="footer-visit" title="Visit">
            {studioAddressLines.length > 0 && (
              <address className={styles.address}>
                {studioAddressLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
            )}
            {studioHoursLabel && <p className={styles.hours}>{studioHoursLabel}</p>}
            <TextLink href={studioMapsHref} target="_blank" arrow>
              Get directions
              <VisuallyHidden>{NEW_TAB}</VisuallyHidden>
            </TextLink>
          </Group>

          <Group id="footer-talk" title="Talk" data-footer-contact="">
            <ul className={styles.list}>
              {studio.phone && (
                <li>
                  <TextLink href={studioTelHref}>
                    <VisuallyHidden>Call </VisuallyHidden>
                    {studio.phoneDisplay}
                  </TextLink>
                </li>
              )}
              {studio.whatsapp && (
                <li>
                  <TextLink href={studioWhatsAppHref()} target="_blank">
                    WhatsApp
                    <VisuallyHidden>{NEW_TAB}</VisuallyHidden>
                  </TextLink>
                </li>
              )}
              {studioMailHref && (
                <li data-footer-email="">
                  <TextLink href={studioMailHref}>{studio.email}</TextLink>
                </li>
              )}
            </ul>
          </Group>
        </div>

        {/* ---------- Legal row ---------- */}
        <div className={`ia-t-caption ${styles.legal}`}>
          <p className={styles.copyright}>
            &copy; {year} {studio.fullName}. All rights reserved.
          </p>
          {siteConfig.developer && siteConfig.developer.url && (
            <p className={styles.credit}>
              Designed &amp; Developed by{' '}
              <TextLink href={siteConfig.developer.url} target="_blank" className={styles.inline}>
                {siteConfig.developer.name}
                <VisuallyHidden>{NEW_TAB}</VisuallyHidden>
              </TextLink>
            </p>
          )}
          {credits.map((credit) => (
            <p key={credit.href} className={styles.credit}>
              <TextLink href={credit.href} target="_blank" className={styles.inline}>
                {credit.label}
                <VisuallyHidden>{NEW_TAB}</VisuallyHidden>
              </TextLink>
            </p>
          ))}
          <IconButton className={styles.top} icon="arrow-up" label="Back to top" onClick={backToTop} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
