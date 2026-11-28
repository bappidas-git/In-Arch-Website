/* ============================================
   StudioPage — `/about` (the Studio page)
   --------------------------------------------
   Who IN-ARCH is, how it thinks and who leads it — the site's main trust
   page, built from the client's own words (`details of in-arch.pdf` §2–§3,
   through src/data/). Where Home is image-first, this page is word-first:
   it opens with type, reads in sticky editorial columns and ends with
   practical details rather than a headline.

     light  StudioHero            "Design with purpose." + one wide band
     light  AboutSection          the practice, in its own words
     dark   PhilosophySection     the four principles
     sand   VisionMissionSection  the vision, then the five mission points
     light  PrincipalSection      Ar. Mohammad Hassanuddin (#principal)
     dark   VisitSection          Visit / Talk — how Studio ends

   The page is ready for the transition as soon as it has mounted: its
   first screen is type, and the band's photograph opens with a shutter
   after the curtain has lifted.
   ============================================ */

import React from 'react';
import usePageReady from '../../components/shell/transition/usePageReady';
import StudioHero from './sections/StudioHero';
import AboutSection from './sections/AboutSection';
import PhilosophySection from './sections/PhilosophySection';
import VisionMissionSection from './sections/VisionMissionSection';
import PrincipalSection from './sections/PrincipalSection';
import VisitSection from './sections/VisitSection';
import styles from './StudioPage.module.css';

const StudioPage = () => {
  usePageReady();

  return (
    <div className={`ia ${styles.page}`}>
      <StudioHero />
      <AboutSection />
      <PhilosophySection />
      <VisionMissionSection />
      <PrincipalSection />
      <VisitSection />
    </div>
  );
};

export default StudioPage;
