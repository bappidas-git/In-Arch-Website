/* ============================================
   Studio / 03 — Vision and mission
   --------------------------------------------
   The vision sentence (PDF §2, verbatim from `studioContent.vision`) set
   as the section's h2, then — after a hairline — the five mission points
   (verbatim from `studioContent.mission`) as an ordered list, 01–05.

   - Phones: one column.
   - Desktop: the vision across columns 1–9; the mission points in two
     columns from 1024 (three, then two), read top to bottom.

   The headline's one italic phrase is the vision's own last clause; the
   words are unchanged. The section is named "Vision and mission" (its h2
   is a 26-word sentence, too long for a landmark name).

   Motion: the vision rises line by line; the hairline draws from the
   left; the label and the points rise.
   ============================================ */

import React from 'react';
import { mission, vision } from '../../../data/studioContent';
import Section from '../../../components/ui/Section/Section';
import Container from '../../../components/ui/Container/Container';
import Grid, { Col } from '../../../components/ui/Grid/Grid';
import Eyebrow, { padIndex } from '../../../components/ui/Eyebrow/Eyebrow';
import Heading from '../../../components/ui/Heading/Heading';
import Rule from '../../../components/ui/Rule/Rule';
import { useMotionScope } from '../../../motion';
import styles from './VisionMissionSection.module.css';

export const MISSION_LABEL_ID = 'studio-mission-label';

// The clause the vision's accent starts at: its last phrase.
const ACCENT_FROM = 'meaningful built environments';

/**
 * The vision split for its one italic phrase, words unchanged:
 * { lead: 'To establish … the ability to create', accent: 'meaningful built environments.' }
 * Falls back to no accent if the sentence ever changes.
 */
export const visionParts = (sentence = vision) => {
  const at = sentence.lastIndexOf(ACCENT_FROM);
  if (at <= 0) return { lead: sentence, accent: '' };
  return { lead: sentence.slice(0, at).trimEnd(), accent: sentence.slice(at) };
};

const VisionMissionSection = () => {
  const scope = useMotionScope();
  const { lead, accent } = visionParts();

  return (
    <Section ref={scope} tone="sand" className={styles.vision} aria-label="Vision and mission">
      <Container>
        <Grid className={styles.grid}>
          <Col span="full" md={{ span: 7 }} lg={{ span: 9 }}>
            <Eyebrow index={3} className={styles.eyebrow}>
              Vision
            </Eyebrow>
            <Heading as="h2" size="md" lines className={styles.statement}>
              {lead}
              {accent && (
                <>
                  {' '}
                  <em>{accent}</em>
                </>
              )}
            </Heading>
          </Col>

          <Col span="full" className={styles.missionCol}>
            <Rule className={styles.rule} aria-hidden="true" />
            <h3 id={MISSION_LABEL_ID} className={`ia-t-label ${styles.label}`} data-m="rise">
              Mission
            </h3>
            <ol className={styles.list} aria-labelledby={MISSION_LABEL_ID}>
              {mission.map((point, i) => (
                <li key={point} className={styles.point} data-m="rise">
                  <span className={`ia-t-label ${styles.index}`} aria-hidden="true">
                    {padIndex(i + 1)}
                  </span>
                  <p className={`ia-t-body-lg ${styles.text}`}>{point}</p>
                </li>
              ))}
            </ol>
          </Col>
        </Grid>
      </Container>
    </Section>
  );
};

export default VisionMissionSection;
