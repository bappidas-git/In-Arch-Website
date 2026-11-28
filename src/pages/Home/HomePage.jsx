/* ============================================
   HomePage — `/`
   --------------------------------------------
   The IN-ARCH opening (prompt 06): the hero, "Threshold", and the opening
   statement, "The practice", inside the `ia` scope.

   Below it, in a sibling wrapper WITHOUT the `ia` class, the four remaining
   old sections render exactly as before, inside the old font-size /
   line-height reset they rely on. Prompt 07 replaces them; the visible
   seam between the two is expected until then.

   The page tells the transition it is ready once the hero photograph has
   loaded (the provider never waits longer than 1200 ms), so the curtain
   lifts onto a finished first screen.
   ============================================ */

import React, { useCallback, useState } from 'react';
import usePageReady from '../../components/shell/transition/usePageReady';
import HeroSection from './sections/HeroSection';
import ManifestoSection from './sections/ManifestoSection';
import BeliefSection from './sections/BeliefSection';
import ExpertiseIndexSection from './sections/ExpertiseIndexSection';
import WhoWeServeSection from './sections/WhoWeServeSection';
import ClosingCtaSection from './sections/ClosingCtaSection';
import styles from './HomePage.module.css';

const HomePage = () => {
  const [heroReady, setHeroReady] = useState(false);
  const onHeroReady = useCallback(() => setHeroReady(true), []);
  usePageReady(heroReady);

  return (
    <>
      <div className="ia">
        <HeroSection onReady={onHeroReady} />
        <ManifestoSection />
      </div>
      <div className={styles.page}>
        <BeliefSection />
        <ExpertiseIndexSection />
        <WhoWeServeSection />
        <ClosingCtaSection />
      </div>
    </>
  );
};

export default HomePage;
