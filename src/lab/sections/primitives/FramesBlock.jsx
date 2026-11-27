/* ============================================
   Design Lab — "Primitives": phone and desktop frames (development only)
   --------------------------------------------
   The same section, alone, in two real viewports side by side: a 390 px
   phone and a 1280 px desktop scaled to fit. They are iframes of
   `/__lab?frame=primitives`, so every media query answers to the frame's
   own width. Loaded on demand (two extra copies of the app).
   ============================================ */

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../../../components/ui';
import { Block } from './LabBits';
import styles from '../PrimitivesSection.module.css';

const SRC = '/__lab?frame=primitives';
const DESKTOP = { width: 1280, height: 800 };

const DesktopFrame = () => {
  const box = useRef(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const el = box.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(([entry]) => setScale(Math.min(1, entry.contentRect.width / DESKTOP.width)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.frameDesktop}>
      <span className="ia-t-caption">Desktop · 1280 × 800 at {Math.round(scale * 100)} %</span>
      <div ref={box} className={styles.desktopViewport} style={{ height: DESKTOP.height * scale }}>
        <iframe
          title="Primitives at 1280 px"
          src={SRC}
          style={{ transform: `scale(${scale})` }}
          width={DESKTOP.width}
          height={DESKTOP.height}
        />
      </div>
    </div>
  );
};

export const FramesBlock = () => {
  const [shown, setShown] = useState(false);
  return (
    <Block
      title="Phone and desktop frames"
      note="This whole section rendered alone at 390 px and at 1280 px, side by side from a 1280 px Lab window. The frames are real viewports, so the 768 / 1024 / 1280 layouts switch inside them."
    >
      <div>
        <Button variant="secondary" size="md" aria-expanded={shown} onClick={() => setShown((s) => !s)}>
          {shown ? 'Hide the frames' : 'Show the frames'}
        </Button>
      </div>
      {shown && (
        <div className={styles.frames}>
          <div className={styles.framePhone}>
            <span className="ia-t-caption">Phone · 390 × 760</span>
            <iframe title="Primitives at 390 px" src={SRC} width={390} height={760} />
          </div>
          <DesktopFrame />
        </div>
      )}
    </Block>
  );
};
