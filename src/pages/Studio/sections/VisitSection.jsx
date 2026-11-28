/* ============================================
   Studio / Visit and talk — how Studio ends
   --------------------------------------------
   A practical ending, not a headline band: where the studio is and how to
   reach it. Every fact comes from `studio` (src/data/siteConfig.js): the
   address as it stands (owner decision D-04), "From 10:00 AM" (D-14), the
   name-based map search (D-16), the phone and WhatsApp numbers. No email
   row: none has been supplied (D-03).

   - Phones: stacked, Talk first — it is the action.
   - From 768: two columns, Visit on the left, Talk on the right. (The
     DOM keeps Talk first, so keyboard and screen-reader order match the
     phone layout; the two groups are independent.)

   The section is named by a visually hidden h2; "Visit" and "Talk" are
   its h3s, set as labels. Its one button is secondary — the dock's
   "Start a project" stays the primary action on this page — and opens the
   enquiry sheet with `source: "studio-closing"`. The bottom padding keeps
   the last control clear of the floating dock.

   Motion: the two groups rise.
   ============================================ */

import React from 'react';
import { useModal } from '../../../context/ModalContext';
import {
  studio,
  studioAddressLines,
  studioHoursLabel,
  studioMapsHref,
  studioTelHref,
  studioWhatsAppHref,
} from '../../../data/siteConfig';
import Section from '../../../components/ui/Section/Section';
import Container from '../../../components/ui/Container/Container';
import Grid, { Col } from '../../../components/ui/Grid/Grid';
import Button from '../../../components/ui/Button/Button';
import TextLink from '../../../components/ui/TextLink/TextLink';
import VisuallyHidden from '../../../components/ui/VisuallyHidden/VisuallyHidden';
import { WHATSAPP_GREETING } from '../../../components/shell/Dock/Dock';
import { useMotionScope } from '../../../motion';
import styles from './VisitSection.module.css';

export const VISIT_TITLE_ID = 'studio-visit-title';
export const CLOSING_SOURCE = 'studio-closing';

const NEW_TAB = <VisuallyHidden> (opens in a new tab)</VisuallyHidden>;

const VisitSection = () => {
  const scope = useMotionScope();
  const { openLeadModal } = useModal();

  return (
    <Section ref={scope} tone="dark" className={styles.visit} aria-labelledby={VISIT_TITLE_ID}>
      <Container>
        <h2 id={VISIT_TITLE_ID} className="ia-visually-hidden">
          Visit and talk
        </h2>
        <Grid className={styles.grid}>
          <Col span="full" md={{ start: 5, span: 4 }} lg={{ start: 7, span: 5 }} className={styles.talk} data-m="rise">
            <h3 className={`ia-t-label ${styles.label}`}>Talk</h3>
            {studio.phone && (
              <p className={`ia-t-display-sm ${styles.big}`}>
                <TextLink href={studioTelHref}>{studio.phoneDisplay}</TextLink>
              </p>
            )}
            {studio.whatsapp && (
              <div className={styles.links}>
                <TextLink href={studioWhatsAppHref(WHATSAPP_GREETING)} target="_blank" arrow="external">
                  WhatsApp
                  {NEW_TAB}
                </TextLink>
              </div>
            )}
            <div className={styles.action}>
              <Button
                variant="secondary"
                onClick={() => openLeadModal(CLOSING_SOURCE, { context: { label: 'Studio' } })}
              >
                Talk to the studio
              </Button>
            </div>
          </Col>

          <Col span="full" md={{ start: 1, span: 4 }} lg={{ start: 1, span: 5 }} className={styles.visitCol} data-m="rise">
            <h3 className={`ia-t-label ${styles.label}`}>Visit</h3>
            <address className={`ia-t-display-sm ${styles.big} ${styles.address}`}>
              {studioAddressLines.map((line) => (
                <span key={line} className={styles.line}>
                  {line}
                </span>
              ))}
            </address>
            {studioHoursLabel && <p className={`ia-t-body ${styles.hours}`}>{studioHoursLabel}</p>}
            <div className={styles.links}>
              <TextLink href={studioMapsHref} target="_blank" arrow="external">
                Get directions
                {NEW_TAB}
              </TextLink>
            </div>
          </Col>
        </Grid>
      </Container>
    </Section>
  );
};

export default VisitSection;
