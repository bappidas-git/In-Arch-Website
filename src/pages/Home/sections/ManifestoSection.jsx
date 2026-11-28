/* ============================================
   Home / Opening statement — "The practice"
   --------------------------------------------
   One idea set large, with a quiet image: what kind of studio this is.

   - Phones: eyebrow, statement, paragraph and link in one column; then the
     photograph, inset 20 px on the left and bleeding off the right edge.
   - Tablet: the statement across columns 1–6 of 8; the frame in 5–8 below
     it, overlapping the text block's last 48 px (beside the link, which
     sits in the first columns).
   - Desktop: the statement in 1–7, paragraph and link in 2–6 under it, the
     frame in 9–12, 96 px lower than the eyebrow so the columns never align.
     At least 90svh tall: one idea per screen.

   Motion: the statement's words go from 25 % to 100 % opacity as it rises
   through the viewport (scrubbed, opacity only); paragraph and link rise;
   the frame opens with a shutter and drifts. Reduced motion: all opaque.
   ============================================ */

import React from 'react';
import { about, homeStatement } from '../../../data/studioContent';
import Section from '../../../components/ui/Section/Section';
import Container from '../../../components/ui/Container/Container';
import Grid, { Col } from '../../../components/ui/Grid/Grid';
import Eyebrow from '../../../components/ui/Eyebrow/Eyebrow';
import Heading from '../../../components/ui/Heading/Heading';
import TextLink from '../../../components/ui/TextLink/TextLink';
import Frame from '../../../components/ui/Frame/Frame';
import Picture from '../../../components/ui/Picture/Picture';
import { useMotionScope } from '../../../motion';
import styles from './ManifestoSection.module.css';

// Rendered width per breakpoint: the frame plus the right gutter on phones;
// columns 5–8 of 8 from 768; 9–12 of 12 from 1024 (485 px at the 1680 cap).
const INTRO_SIZES = '(min-width: 1920px) 485px, (min-width: 1024px) 30vw, (min-width: 768px) 46vw, 95vw';

const ManifestoSection = () => {
  const scope = useMotionScope();

  return (
    <Section ref={scope} tone="light" className={styles.manifesto} aria-label="The practice">
      <Container>
        <Grid className={styles.grid}>
          <Col span="full" md={{ span: 6 }} lg={{ span: 7 }}>
            <Eyebrow index={1} className={styles.eyebrow}>
              The practice
            </Eyebrow>
            <Heading as="h2" size="md" className={styles.statement} data-m="words">
              {homeStatement.lead} <em>{homeStatement.accent}</em>
            </Heading>
          </Col>

          <Col span="full" md={{ span: 6 }} lg={{ start: 2, span: 5 }} className={styles.body}>
            <p className={`ia-t-body-lg ${styles.paragraph}`} data-m="rise">
              {about[0]}
            </p>
            <div data-m="rise">
              <TextLink to="/about" arrow>
                Discover the studio
              </TextLink>
            </div>
          </Col>

          <Col span="full" md={{ start: 5, span: 4 }} lg={{ start: 9, span: 4 }} className={styles.figure}>
            <Frame ratio="4/5" reveal parallax className={styles.frame}>
              <Picture image="home-intro" sizes={INTRO_SIZES} />
            </Frame>
          </Col>
        </Grid>
      </Container>
    </Section>
  );
};

export default ManifestoSection;
