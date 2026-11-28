/* ============================================
   Studio / 01 — About In-Arch
   --------------------------------------------
   A section for reading: the "About In-Arch" paragraphs two to five (PDF
   §2, verbatim from `studioContent.about`; the first, which names the
   practice and its principal, is said by the hero and the principal
   section). No image.

   - Phones: eyebrow, heading and prose in one column; the first paragraph
     in body-lg, the rest in body, at most 62ch.
   - Tablet: the heading across columns 1–7, the prose one column in.
   - Desktop: an editorial split — eyebrow and heading in columns 1–5,
     `position: sticky` 120 px from the top, while the prose (columns
     7–12) scrolls past; the sticky ends with the section. CSS only: no
     pinning, the page moves 1:1 with the wheel or finger.

   Motion: the heading rises line by line; each paragraph rises.
   ============================================ */

import React from 'react';
import { about } from '../../../data/studioContent';
import Section from '../../../components/ui/Section/Section';
import Container from '../../../components/ui/Container/Container';
import Grid, { Col } from '../../../components/ui/Grid/Grid';
import Eyebrow from '../../../components/ui/Eyebrow/Eyebrow';
import Heading from '../../../components/ui/Heading/Heading';
import { useMotionScope } from '../../../motion';
import styles from './AboutSection.module.css';

export const ABOUT_TITLE_ID = 'studio-about-title';

/** The "About In-Arch" paragraphs this section sets: two to five. */
export const aboutProse = () => about.slice(1, 5);

const AboutSection = () => {
  const scope = useMotionScope();
  const [lead, ...rest] = aboutProse();

  return (
    <Section ref={scope} tone="light" className={styles.about} aria-labelledby={ABOUT_TITLE_ID}>
      <Container>
        <Grid className={styles.grid}>
          <Col span="full" md={{ span: 7 }} lg={{ span: 5 }} className={styles.headCol}>
            <div className={styles.sticky}>
              <Eyebrow index={1} className={styles.eyebrow}>
                About In-Arch
              </Eyebrow>
              <Heading as="h2" size="md" lines id={ABOUT_TITLE_ID} className={styles.title}>
                Understanding people, <em>then designing for them.</em>
              </Heading>
            </div>
          </Col>

          <Col span="full" md={{ start: 2, span: 7 }} lg={{ start: 7, span: 6 }} className={styles.prose}>
            <p className={`ia-t-body-lg ${styles.lead}`} data-m="rise">
              {lead}
            </p>
            {rest.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className={`ia-t-body ${styles.paragraph}`} data-m="rise">
                {paragraph}
              </p>
            ))}
          </Col>
        </Grid>
      </Container>
    </Section>
  );
};

export default AboutSection;
