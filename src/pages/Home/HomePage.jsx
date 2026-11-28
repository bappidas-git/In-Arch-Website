/* ============================================
   HomePage — `/`
   --------------------------------------------
   Eight bands in one `ia` root, each a Section with its own tone, no two
   neighbours alike and no two with the same layout:

     dark   HeroSection           the studio's own work, full screen (06)
     light  ManifestoSection      the opening statement (06)
     sand   SelectedWorkSection   three projects (07)
     dark   StatementSection      the belief, one sentence (07)
     light  ServicesIndexSection  the seven services as a ledger (07)
     sand   HowWeWorkSection      the process in four phases (07)
     light  PrincipalSection      who leads the work (07)
     dark   ClosingSection        the invitation — how Home ends (07)

   The page tells the transition it is ready once the hero photograph has
   loaded (the provider never waits longer than 1200 ms), so the curtain
   lifts onto a finished first screen.
   ============================================ */

import React, { useCallback, useState } from 'react';
import usePageReady from '../../components/shell/transition/usePageReady';
import HeroSection from './sections/HeroSection';
import ManifestoSection from './sections/ManifestoSection';
import SelectedWorkSection from './sections/SelectedWorkSection';
import StatementSection from './sections/StatementSection';
import ServicesIndexSection from './sections/ServicesIndexSection';
import HowWeWorkSection from './sections/HowWeWorkSection';
import PrincipalSection from './sections/PrincipalSection';
import ClosingSection from './sections/ClosingSection';

const HomePage = () => {
  const [heroReady, setHeroReady] = useState(false);
  const onHeroReady = useCallback(() => setHeroReady(true), []);
  usePageReady(heroReady);

  return (
    <div className="ia">
      <HeroSection onReady={onHeroReady} />
      <ManifestoSection />
      <SelectedWorkSection />
      <StatementSection />
      <ServicesIndexSection />
      <HowWeWorkSection />
      <PrincipalSection />
      <ClosingSection />
    </div>
  );
};

export default HomePage;
