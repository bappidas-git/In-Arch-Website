/* ============================================
   Studio / Hero — "Design with purpose."
   --------------------------------------------
   A typographic opening on ivory, then one wide photographic band. The
   headline is the first principle of the studio's design philosophy
   (PDF §2), in sentence case.

   - Phones: the copy starts 120 px from the top (clear of the masthead),
     left-aligned in one column; 48 px below it the band bleeds edge to
     edge in the 4:3 crop (`studio-band-tall`).
   - From 768: the 21:9 crop (`studio-band-wide`), 64 px below the copy.
   - From 1024: the h1 across columns 1–8, the lede in columns 8–12,
     bottom-aligned with the h1's last line; the band 96 px below.

   Motion: the eyebrow rises, the h1 rises line by line (data-m-now, so
   after a page transition it waits for the curtain), the lede rises, and
   the band's shutter opens. On the first screen — portrait phones,
   tablets, desktops — the band opens with the page, after the lede; where
   the band starts below the fold (a landscape phone) it opens as it
   scrolls in. The photograph drifts while it crosses the viewport.
   Reduced motion: everything is simply there.
   ============================================ */

import React, { useRef } from 'react';
import { studio } from '../../../data/siteConfig';
import Section from '../../../components/ui/Section/Section';
import Container from '../../../components/ui/Container/Container';
import Grid, { Col } from '../../../components/ui/Grid/Grid';
import Eyebrow from '../../../components/ui/Eyebrow/Eyebrow';
import Heading from '../../../components/ui/Heading/Heading';
import Lede from '../../../components/ui/Lede/Lede';
import Frame from '../../../components/ui/Frame/Frame';
import Picture from '../../../components/ui/Picture/Picture';
import { useIsoLayoutEffect } from '../../../components/ui/_shared/refs';
import { useMotionScope } from '../../../motion';
import styles from './StudioHero.module.css';

export const HERO_TITLE_ID = 'studio-hero-title';

/** The 4:3 crop below 768 px; the 21:9 crop from there up. */
const ART = [{ media: '(max-width: 767px)', image: 'studio-band-tall' }];

/** "Patna, Bihar" — the place the lede names, from `studio.address`. */
export const studioPlace = () => [studio.address.city, studio.address.region].filter(Boolean).join(', ');

/** The lede, with the place read from `studio` (never typed here). */
export const heroLede = (place = studioPlace()) =>
  `An architecture and interior design practice${place ? ` in ${place},` : ''} focused on spaces that are functional, visually appealing and thoughtfully planned.`;

const StudioHero = () => {
  const bandRef = useRef(null);

  // Declared before the motion scope, so it runs first: a band that is on
  // the first screen opens with the page (`data-m-now`, held under the page
  // curtain until it lifts); one below the fold keeps its scroll trigger.
  useIsoLayoutEffect(() => {
    const band = bandRef.current;
    if (!band || typeof window === 'undefined') return;
    if (band.getBoundingClientRect().top < window.innerHeight) band.setAttribute('data-m-now', '');
  }, []);

  const scope = useMotionScope();

  return (
    <Section ref={scope} tone="light" rhythm="none" className={styles.hero} aria-labelledby={HERO_TITLE_ID}>
      <Container>
        <Grid className={styles.grid}>
          <Col span="full" md={{ span: 7 }} lg={{ start: 1, span: 8 }} className={styles.titleCol}>
            <Eyebrow className={styles.eyebrow} data-m="rise" data-m-now="">
              The studio
            </Eyebrow>
            <Heading
              as="h1"
              size="xl"
              lines
              id={HERO_TITLE_ID}
              className={styles.title}
              data-m-now=""
              data-m-delay="0.1"
            >
              Design with <br />
              <em>purpose.</em>
            </Heading>
          </Col>

          <Col span="full" md={{ span: 6 }} lg={{ start: 8, span: 5 }} align="end" className={styles.ledeCol}>
            <Lede className={styles.lede} data-m="rise" data-m-now="" data-m-delay="0.45">
              {heroLede()}
            </Lede>
          </Col>
        </Grid>
      </Container>

      <Frame
        ref={bandRef}
        ratio="4/3"
        ratioMd="21/9"
        reveal
        parallax
        className={styles.band}
        data-m-delay="0.55"
      >
        <Picture image="studio-band-wide" art={ART} sizes="100vw" priority />
      </Frame>
    </Section>
  );
};

export default StudioHero;
