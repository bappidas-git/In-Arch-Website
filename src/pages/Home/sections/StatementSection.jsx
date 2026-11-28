/* ============================================
   Home / The belief — "Every space tells a story."
   --------------------------------------------
   One sentence, alone, on forest: the PDF's home-page line
   (studioContent.homeBelief). Beneath it a 48 px hairline and the three
   kinds of work in a mist label. No image, no button, no graphic.

   - Phones: left-aligned, vertically centred in a band at least 80svh tall.
   - Desktop: the sentence starts at column 2 and runs to column 11.

   Motion: the sentence rises line by line through its masks; the hairline
   draws from the left; the label rises.
   ============================================ */

import React from 'react';
import { homeBelief } from '../../../data/studioContent';
import Section from '../../../components/ui/Section/Section';
import Container from '../../../components/ui/Container/Container';
import Grid, { Col } from '../../../components/ui/Grid/Grid';
import Heading from '../../../components/ui/Heading/Heading';
import Rule from '../../../components/ui/Rule/Rule';
import { useMotionScope } from '../../../motion';
import styles from './StatementSection.module.css';

export const BELIEF_TITLE_ID = 'home-belief-title';

const StatementSection = () => {
  const scope = useMotionScope();

  return (
    <Section ref={scope} tone="dark" className={styles.belief} aria-labelledby={BELIEF_TITLE_ID}>
      <Container className={styles.inner}>
        <Grid>
          <Col span="full" lg={{ start: 2, span: 10 }}>
            <Heading as="h2" size="xl" lines id={BELIEF_TITLE_ID} className={styles.title}>
              {homeBelief.lead} <em>{homeBelief.accent}</em>
            </Heading>
            <Rule strong aria-hidden="true" className={styles.rule} />
            <p className={`ia-t-label ${styles.scope}`} data-m="rise">
              {homeBelief.scope.join(' · ')}
            </p>
          </Col>
        </Grid>
      </Container>
    </Section>
  );
};

export default StatementSection;
