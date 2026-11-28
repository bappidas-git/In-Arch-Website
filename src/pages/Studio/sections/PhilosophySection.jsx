/* ============================================
   Studio / 02 — Design philosophy
   --------------------------------------------
   The four principles (PDF §2, titles and sentences verbatim from
   `studioContent.philosophy`), as an ordered list.

   - Phones: four blocks stacked, each with a large numeral (display-md,
     terracotta-300), its title (display-sm) and its sentence, with
     hairlines between.
   - Tablet: the same blocks, two by two.
   - Desktop: scroll-led, without pinning. The left half (columns 1–5) is
     a sticky panel showing the current principle's numeral at display-2xl
     and, beneath it, `studio-detail` in a 4:5 frame; the right half
     (columns 7–12) lists the four principles with 40vh of room each. As a
     principle crosses the middle of the viewport the panel's numeral
     cross-fades to its number (opacity only, 400 ms; under reduced motion
     it simply switches). The panel is sized so it always fits between the
     sticky offset and the dock.

   The panel's numerals repeat the list's own numbers, so they are hidden
   from assistive technology; the list is an <ol> whose visible numerals
   are decorative too. Which principle is "current" is read with an
   IntersectionObserver whose root margin is the middle line of the
   viewport — no scroll listener, no tween.

   Motion: the heading rises line by line; the blocks rise; the frame opens
   with a shutter.
   ============================================ */

import React, { useEffect, useRef, useState } from 'react';
import { philosophy } from '../../../data/studioContent';
import Section from '../../../components/ui/Section/Section';
import Container from '../../../components/ui/Container/Container';
import Grid, { Col } from '../../../components/ui/Grid/Grid';
import Eyebrow, { padIndex } from '../../../components/ui/Eyebrow/Eyebrow';
import Heading from '../../../components/ui/Heading/Heading';
import Frame from '../../../components/ui/Frame/Frame';
import Picture from '../../../components/ui/Picture/Picture';
import { useMotionScope } from '../../../motion';
import styles from './PhilosophySection.module.css';

export const PHILOSOPHY_TITLE_ID = 'studio-philosophy-title';

// Columns 1–5 of 12 from 1024 (615 px at the 1680 cap); the panel is never
// shown below 1024, so the image is never requested there.
const DETAIL_SIZES = '(min-width: 1920px) 615px, 36vw';

/** The principle whose block contains the middle line of the viewport. */
const useCurrentPrinciple = (listRef, count) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof window === 'undefined' || typeof window.IntersectionObserver !== 'function') return undefined;
    const items = Array.from(list.children);
    // A zero-height band across the middle of the viewport: an item
    // "intersects" exactly while it is crossing that line.
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = items.indexOf(entry.target);
          if (index >= 0) setCurrent(index);
        });
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [listRef, count]);

  return current;
};

const PhilosophySection = () => {
  const scope = useMotionScope();
  const listRef = useRef(null);
  const current = useCurrentPrinciple(listRef, philosophy.length);

  return (
    <Section ref={scope} tone="dark" className={styles.philosophy} aria-labelledby={PHILOSOPHY_TITLE_ID}>
      <Container>
        <Grid className={styles.grid}>
          <Col span="full" md={{ span: 7 }} lg={{ span: 8 }} className={styles.head}>
            <Eyebrow index={2} className={styles.eyebrow}>
              Design philosophy
            </Eyebrow>
            <Heading as="h2" size="lg" lines id={PHILOSOPHY_TITLE_ID} className={styles.title}>
              Four principles, <em>one approach.</em>
            </Heading>
          </Col>

          <Col span="full" lg={{ span: 5 }} className={styles.panelCol}>
            <div className={styles.panel}>
              <div className={styles.numerals} aria-hidden="true">
                {philosophy.map((principle, i) => (
                  <span
                    key={principle.id}
                    className={`ia-t-display-2xl ${styles.numeral}`}
                    data-current={i === current ? '' : undefined}
                  >
                    {padIndex(i + 1)}
                  </span>
                ))}
              </div>
              <Frame ratio="4/5" reveal className={styles.frame}>
                <Picture image="studio-detail" sizes={DETAIL_SIZES} />
              </Frame>
            </div>
          </Col>

          <Col span="full" lg={{ start: 7, span: 6 }} className={styles.listCol}>
            <ol ref={listRef} className={styles.list}>
              {philosophy.map((principle, i) => (
                <li key={principle.id} className={styles.item} data-m="rise">
                  <span className={`ia-t-display-md ${styles.index}`} aria-hidden="true">
                    {padIndex(i + 1)}
                  </span>
                  <h3 className={`ia-t-display-sm ${styles.itemTitle}`}>{principle.title}</h3>
                  <p className={`ia-t-body ${styles.text}`}>{principle.text}</p>
                </li>
              ))}
            </ol>
          </Col>
        </Grid>
      </Container>
    </Section>
  );
};

export default PhilosophySection;
