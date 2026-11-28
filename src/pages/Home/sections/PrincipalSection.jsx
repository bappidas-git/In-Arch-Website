/* ============================================
   Home / Who leads the work — the principal
   --------------------------------------------
   The page's trust signal, built only from supplied facts: the principal's
   name and role (`studio.principal`) and three credential lines
   (`studioContent.homeCredentials`, PDF §3). No portrait, quotation,
   registration number or years of experience — none was supplied (owner
   decision D-11). The layout is typographic.

   - Phones: eyebrow, name, role, the facts and the link, stacked.
   - Desktop: the name across columns 1–7, the facts and the link in 8–12,
     the first rule level with the top of the name.

   Motion: the name rises line by line; the facts and the link rise.
   ============================================ */

import React from 'react';
import { studio } from '../../../data/siteConfig';
import { homeCredentials } from '../../../data/studioContent';
import Section from '../../../components/ui/Section/Section';
import Container from '../../../components/ui/Container/Container';
import Grid, { Col } from '../../../components/ui/Grid/Grid';
import Eyebrow from '../../../components/ui/Eyebrow/Eyebrow';
import Heading from '../../../components/ui/Heading/Heading';
import FactList from '../../../components/ui/FactList/FactList';
import TextLink from '../../../components/ui/TextLink/TextLink';
import { useMotionScope } from '../../../motion';
import styles from './PrincipalSection.module.css';

export const PRINCIPAL_TITLE_ID = 'home-principal-title';

/** "Ar. Mohammad Hassanuddin" → { lead: 'Ar. Mohammad', accent: 'Hassanuddin.' } */
export const nameParts = (name = '') => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length < 2) return { lead: '', accent: words.length ? `${words[0]}.` : '' };
  const last = words[words.length - 1];
  return { lead: words.slice(0, -1).join(' '), accent: /[.!?]$/.test(last) ? last : `${last}.` };
};

const PrincipalSection = () => {
  const scope = useMotionScope();
  const { lead, accent } = nameParts(studio.principal.name);

  return (
    <Section ref={scope} tone="light" className={styles.principal} aria-labelledby={PRINCIPAL_TITLE_ID}>
      <Container>
        <Grid className={styles.grid}>
          <Col span="full" md={{ span: 7 }} lg={{ span: 7 }} className={styles.nameCol}>
            <Eyebrow index={5} className={styles.eyebrow}>
              Who leads the work
            </Eyebrow>
            <Heading as="h2" size="lg" lines id={PRINCIPAL_TITLE_ID} className={styles.name}>
              {lead && (
                <>
                  {lead}{' '}
                </>
              )}
              <em>{accent}</em>
            </Heading>
            <p className={`ia-t-label ${styles.role}`} data-m="rise">
              {studio.principal.role}
            </p>
          </Col>

          <Col span="full" md={{ start: 2, span: 7 }} lg={{ start: 8, span: 5 }} align="start" className={styles.factsCol}>
            <div data-m="rise">
              <FactList items={homeCredentials} className={styles.facts} />
            </div>
            <div className={styles.more} data-m="rise">
              <TextLink to="/about#principal" arrow>
                About the principal
              </TextLink>
            </div>
          </Col>
        </Grid>
      </Container>
    </Section>
  );
};

export default PrincipalSection;
