/* ============================================
   Home / Hero — "Threshold"
   --------------------------------------------
   One full-screen photograph of the studio's own work (a living hall's
   backlit feature wall), the brand line, and one action.

   - Phones: the 4:5 crop (`home-hero-tall`) covers the screen; all copy is
     anchored to the bottom in one column, above the dock. Only the ghost
     button is in the hero: the dock's "Start a project" sits directly
     beneath it and is the primary action there.
   - From 768: the 16:9 crop (`home-hero-wide`); both buttons side by side;
     the meta becomes a row under a hairline.
   - From 1024: on the 12-column grid — the h1 across columns 1–9, the lede
     and the buttons in 1–5, the meta a right-aligned stack in 10–12,
     bottom-aligned with the buttons. Nothing is centred.

   The photograph is bright (white ceiling, white stone floor), so a veil is
   anchored to the copy block itself: wherever the copy sits, at any
   viewport height, the forest scrim behind it is dense enough for ivory
   text at 4.5:1 on its worst pixel. A second, lighter veil at the top
   carries the masthead.

   Motion (src/motion): on load the photograph settles 1.08 → 1 (1.6 s);
   the h1 lines rise through their masks (1.0 s expo, 0.15 s delay); the
   eyebrow, lede, buttons and meta rise 24 px, staggered, once the first
   line has landed. On scroll the photograph drifts (7 %, 4 on phones).
   Under reduced motion everything is simply there.
   ============================================ */

import React, { useRef } from 'react';
import { useModal } from '../../../context/ModalContext';
import { studio } from '../../../data/siteConfig';
import { heroDisciplines, heroLine } from '../../../data/studioContent';
import Section from '../../../components/ui/Section/Section';
import Container from '../../../components/ui/Container/Container';
import Grid, { Col } from '../../../components/ui/Grid/Grid';
import Eyebrow from '../../../components/ui/Eyebrow/Eyebrow';
import Heading from '../../../components/ui/Heading/Heading';
import Lede from '../../../components/ui/Lede/Lede';
import Button from '../../../components/ui/Button/Button';
import Picture from '../../../components/ui/Picture/Picture';
import { useIsoLayoutEffect } from '../../../components/ui/_shared/refs';
import { useMotionScope } from '../../../motion';
import styles from './HeroSection.module.css';

export const HERO_TITLE_ID = 'home-hero-title';

/** The art-directed crop below 768 px; keep in sync with public/index.html. */
const ART = [{ media: '(max-width: 767px)', image: 'home-hero-tall' }];

// The h1 lines start at 0.15 s and run 1.0 s on expo.out, which has covered
// 97 % of its travel 0.5 s in: that is when the first line has landed.
const LINES_DELAY = '0.15';
const AFTER_FIRST_LINE = '0.65';

/**
 * The tagline as display lines, one sentence per line, in sentence case:
 * "Designing Spaces. Shaping Experiences." → ['Designing spaces.', 'Shaping experiences.']
 * Only Title-cased words after the first are lowered, so acronyms survive.
 */
export const taglineLines = (tagline = '') =>
  (tagline.match(/[^.!?]+[.!?]*/g) || [])
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .map((sentence) =>
      sentence
        .split(/\s+/)
        .map((word, i) => (i > 0 && /^[A-Z][a-z]+[.,!?]*$/.test(word) ? word.toLowerCase() : word))
        .join(' ')
    );

const HeroSection = ({ onReady }) => {
  const scope = useMotionScope();
  const pictureRef = useRef(null);
  const { openLeadModal } = useModal();

  const [first, ...rest] = taglineLines(studio.tagline);
  const accent = rest.join(' ');
  const place = [studio.address.city, studio.address.region].filter(Boolean).join(', ');

  // A cached (or preloaded) photograph may be complete before React can
  // hear its load event: report it straight away.
  useIsoLayoutEffect(() => {
    const img = pictureRef.current && pictureRef.current.querySelector('img');
    if (img && img.complete && onReady) onReady();
  }, [onReady]);

  const rise = { 'data-m': 'rise', 'data-m-now': '', 'data-m-rise': '24', 'data-m-delay': AFTER_FIRST_LINE };

  return (
    <Section ref={scope} tone="dark" rhythm="none" className={styles.hero} aria-labelledby={HERO_TITLE_ID}>
      <div className={styles.media} data-m-parallax="7">
        <div className={styles.drift} data-m-media="">
          <div className={styles.settle} data-m="settle" data-m-now="">
            <Picture
              ref={pictureRef}
              image="home-hero-wide"
              art={ART}
              sizes="100vw"
              priority
              className={styles.picture}
              imgClassName={styles.img}
              onLoad={onReady}
              onError={onReady}
            />
          </div>
        </div>
        <div className={styles.veil} aria-hidden="true" />
      </div>

      <Container className={styles.copy}>
        <Grid className={styles.grid}>
          <Col span="full" md={{ span: 6 }} lg={{ span: 9 }}>
            <Eyebrow className={styles.eyebrow} {...rise}>
              Architecture &amp; interior design — {studio.address.city}
            </Eyebrow>
            <Heading
              as="h1"
              size="2xl"
              lines
              id={HERO_TITLE_ID}
              className={styles.title}
              data-m-now=""
              data-m-delay={LINES_DELAY}
            >
              {first}
              {accent && (
                <>
                  {' '}
                  <br />
                  <em>{accent}</em>
                </>
              )}
            </Heading>
          </Col>

          <Col span="full" md={{ span: 6 }} lg={{ span: 5 }} className={styles.body}>
            <Lede className={styles.lede} {...rise}>
              {heroLine}
            </Lede>
            <div className={styles.actions} {...rise}>
              <Button
                className={styles.primaryAction}
                data-primary-cta=""
                onClick={() => openLeadModal('home-hero', { context: { label: 'Home — hero' } })}
              >
                Start a project
              </Button>
              <Button variant="ghost" to="/portfolio">
                View selected work
              </Button>
            </div>
          </Col>

          <Col span="full" lg={{ start: 10, span: 3 }} align="end" className={styles.metaCol}>
            <ul className={styles.meta} {...rise}>
              <li className={styles.metaItem}>
                Led by {studio.principal.name}
                <span className={styles.wide}>, {studio.principal.title}</span>
              </li>
              {place && <li className={styles.metaItem}>{place}</li>}
              <li className={`${styles.metaItem} ${styles.wide}`}>
                <ul className={styles.disciplines}>
                  {heroDisciplines.map((word) => (
                    <li key={word}>{word}</li>
                  ))}
                </ul>
              </li>
            </ul>
          </Col>
        </Grid>
      </Container>
    </Section>
  );
};

export default HeroSection;
