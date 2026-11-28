/* ============================================
   Curtain — the page-transition cover
   --------------------------------------------
   A fixed forest panel with the ivory "IA" mark (40 px) centred, above
   everything (--ia-z-curtain). It rests hidden; TransitionProvider moves it
   (yPercent 100 → 0 to cover, 0 → −100 to lift) and hides it again. It is
   decorative to assistive technology: the RouteAnnouncer says where the
   visitor has arrived. Under reduced motion it never appears.
   ============================================ */

import React from 'react';
import { useTransition } from '../transition/TransitionProvider';
import Logo from '../../ui/Logo/Logo';
import styles from './Curtain.module.css';

const Curtain = () => {
  const transition = useTransition();

  return (
    <div
      ref={transition ? transition.registerCurtain : undefined}
      className={`ia ${styles.curtain}`}
      data-tone="dark"
      data-shell-float=""
      aria-hidden="true"
    >
      <Logo variant="mark" height={40} alt="" className={styles.mark} />
    </div>
  );
};

export default Curtain;
