/* ============================================
   Home / The invitation — how Home ends
   --------------------------------------------
   The PDF's closing call to action (§10 E): "Have a project in mind?" and
   its line, one primary button into the lead modal (`home-closing`), and a
   quiet row of WhatsApp and call links. Home is the only page that ends
   with a headline and a button.

   - Phones: the copy sits at the bottom left of a band at least 70svh tall,
     clear of the dock.
   - Desktop: the copy in columns 1–8.

   While the button is ≥ 60 % visible the dock steps down to its secondary
   style (`data-primary-cta`).

   Motion: the headline rises line by line; the line, the button and the
   links rise.
   ============================================ */

import React from 'react';
import { useModal } from '../../../context/ModalContext';
import { studio, studioTelHref, studioWhatsAppHref } from '../../../data/siteConfig';
import { closingCta, homeClosing } from '../../../data/studioContent';
import Section from '../../../components/ui/Section/Section';
import Container from '../../../components/ui/Container/Container';
import Grid, { Col } from '../../../components/ui/Grid/Grid';
import Heading from '../../../components/ui/Heading/Heading';
import Lede from '../../../components/ui/Lede/Lede';
import Button from '../../../components/ui/Button/Button';
import TextLink from '../../../components/ui/TextLink/TextLink';
import { WHATSAPP_GREETING } from '../../../components/shell/Dock/Dock';
import { useMotionScope } from '../../../motion';
import styles from './ClosingSection.module.css';

export const CLOSING_TITLE_ID = 'home-closing-title';

const ClosingSection = () => {
  const scope = useMotionScope();
  const { openLeadModal } = useModal();

  return (
    <Section ref={scope} tone="dark" className={styles.closing} aria-labelledby={CLOSING_TITLE_ID}>
      <Container className={styles.inner}>
        <Grid>
          <Col span="full" md={{ span: 7 }} lg={{ span: 8 }}>
            <Heading as="h2" size="xl" lines id={CLOSING_TITLE_ID} className={styles.title}>
              {homeClosing.lead} <em>{homeClosing.accent}</em>
            </Heading>
            <Lede className={styles.lede} data-m="rise">
              {closingCta.text}
            </Lede>
            <div className={styles.action} data-m="rise">
              <Button
                size="lg"
                data-primary-cta=""
                onClick={() => openLeadModal('home-closing', { context: { label: 'Home — closing' } })}
              >
                Start a conversation
              </Button>
            </div>
            <ul className={styles.links} data-m="rise">
              {studio.whatsapp && (
                <li>
                  <TextLink href={studioWhatsAppHref(WHATSAPP_GREETING)} target="_blank" arrow="external">
                    WhatsApp
                  </TextLink>
                </li>
              )}
              {studio.phone && (
                <li>
                  <TextLink href={studioTelHref}>Call {studio.phoneDisplay}</TextLink>
                </li>
              )}
            </ul>
          </Col>
        </Grid>
      </Container>
    </Section>
  );
};

export default ClosingSection;
