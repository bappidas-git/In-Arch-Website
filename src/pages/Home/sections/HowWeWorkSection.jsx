/* ============================================
   Home / How we work — four phases
   --------------------------------------------
   The seven steps of PDF §7, grouped into the four `phases` of
   src/data/process.js — Understand, Imagine, Detail, Deliver — without
   changing what they say: each phase shows its numeral, its name, the
   titles of the steps it groups ("Initial Consultation · Site Study &
   Analysis") and the icon of its first step at 40 px.

   - Phones: a vertical list, large numerals (display-md) on the left,
     hairlines between the phases.
   - Tablet: two by two, the second column 24 px lower.
   - Desktop: four columns separated by hairlines, each one's content
     starting 24 px lower than the previous one's.

   Ends with a link to the full process on /expertise.

   Motion: the phases rise (batched, 0.08 s apart).
   ============================================ */

import React from 'react';
import { phases, processSteps, stepsOfPhase } from '../../../data/process';
import Section from '../../../components/ui/Section/Section';
import Container from '../../../components/ui/Container/Container';
import Eyebrow from '../../../components/ui/Eyebrow/Eyebrow';
import Heading from '../../../components/ui/Heading/Heading';
import TextLink from '../../../components/ui/TextLink/TextLink';
import LineIcon from '../../../components/ui/LineIcon/LineIcon';
import { padIndex } from '../../../components/ui/Eyebrow/Eyebrow';
import { useMotionScope } from '../../../motion';
import styles from './HowWeWorkSection.module.css';

export const PROCESS_TITLE_ID = 'home-process-title';

/** Each phase with its numeral, its steps' titles and its first step's icon. */
export const phaseRows = () =>
  phases.map((phase, i) => {
    const steps = stepsOfPhase(phase.id);
    return {
      id: phase.id,
      numeral: padIndex(i + 1),
      title: phase.title,
      steps: steps.map((step) => step.title),
      icon: steps.length ? steps[0].icon : null,
    };
  });

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

const HowWeWorkSection = () => {
  const scope = useMotionScope();
  const rows = phaseRows();
  const count = NUMBER_WORDS[processSteps.length] || String(processSteps.length);

  return (
    <Section ref={scope} tone="sand" className={styles.process} aria-labelledby={PROCESS_TITLE_ID}>
      <Container>
        <header className={styles.header}>
          <Eyebrow index={4} className={styles.eyebrow}>
            How we work
          </Eyebrow>
          <Heading as="h2" size="lg" lines id={PROCESS_TITLE_ID} className={styles.title}>
            A collaborative, <em>detail-oriented</em> process.
          </Heading>
        </header>

        <ol className={styles.phases}>
          {rows.map((row) => (
            <li key={row.id} className={styles.phase} data-m="rise">
              <span className={`ia-t-display-md ${styles.numeral}`} aria-hidden="true">
                {row.numeral}
              </span>
              <div className={styles.body}>
                {row.icon && <LineIcon name={row.icon} size={40} className={styles.icon} />}
                <h3 className={`ia-t-display-sm ${styles.name}`}>{row.title}</h3>
                <p className={`ia-t-small ${styles.steps}`}>
                  {row.steps.map((step, i) => (
                    <React.Fragment key={step}>
                      {i > 0 && ' · '}
                      <span className={styles.step}>{step}</span>
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className={styles.more} data-m="rise">
          <TextLink to="/expertise#process" arrow>
            See the full {count}-step process
          </TextLink>
        </div>
      </Container>
    </Section>
  );
};

export default HowWeWorkSection;
