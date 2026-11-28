/* ============================================
   RouteAnnouncer — says where a navigation arrived
   --------------------------------------------
   A visually hidden polite live region. After every client-side navigation
   TransitionProvider calls the function registered here; it empties the
   region, then (100 ms later, once SEOHead has written the new title)
   fills it with `document.title`, so even a repeat of the same title is
   read out. Nothing is announced on the first load.
   ============================================ */

import React, { useEffect, useState } from 'react';
import { useTransition } from '../transition/TransitionProvider';
import styles from './RouteAnnouncer.module.css';

const DELAY_MS = 100;

const RouteAnnouncer = () => {
  const transition = useTransition();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!transition) return undefined;
    let timer = 0;
    const unregister = transition.registerAnnouncer(() => {
      window.clearTimeout(timer);
      setMessage('');
      timer = window.setTimeout(() => setMessage(document.title), DELAY_MS);
    });
    return () => {
      window.clearTimeout(timer);
      unregister();
    };
  }, [transition]);

  return (
    <div className={`ia-visually-hidden ${styles.announcer}`} aria-live="polite" aria-atomic="true" data-route-announcer="">
      {message}
    </div>
  );
};

export default RouteAnnouncer;
