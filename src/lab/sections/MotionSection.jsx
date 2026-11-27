import React, { useState } from 'react';
import styles from '../LabPage.module.css';
import { useMotionScope, useReducedMotion } from '../../motion';

// Each demo mounts its own scope; "Replay" remounts it (new key), which
// reverts the old scope and plays the effect again.
const Stage = ({ children }) => {
  const ref = useMotionScope();
  return (
    <div ref={ref} className={styles.demoStage}>
      {children}
    </div>
  );
};

const Demo = ({ title, attr, children }) => {
  const [run, setRun] = useState(0);
  return (
    <div className={styles.demo}>
      <div className={styles.demoHead}>
        <h3 className="ia-t-label">
          {title} <code className={styles.demoAttr}>{attr}</code>
        </h3>
        <button type="button" className={styles.labButton} onClick={() => setRun((r) => r + 1)}>
          Replay<span className="ia-visually-hidden"> {title}</span>
        </button>
      </div>
      <Stage key={run}>{children}</Stage>
    </div>
  );
};

const FakeImage = ({ tall }) => (
  <div data-m-media="" className={`${styles.fakeImage} ${tall ? styles.fakeImageTall : ''}`} aria-hidden="true" />
);

const MotionSection = () => {
  const reduced = useReducedMotion();
  return (
    <>
      <p className={`ia-t-body ${styles.note}`} role="status">
        {reduced
          ? 'Reduced motion is on: every demo is shown in its final state and Replay changes nothing.'
          : 'Each demo plays once when it scrolls into view (top 85%). Replay remounts it.'}
      </p>
      <div className={styles.demoGrid}>
        <Demo title="Rise" attr='data-m="rise"'>
          <p className="ia-t-body-lg" data-m="rise">First line of copy rises 24 px (40 px from 1024).</p>
          <p className="ia-t-body-lg" data-m="rise">Batched with its neighbours, 0.08 s apart.</p>
          <p className="ia-t-body-lg" data-m="rise">Then the third.</p>
        </Demo>

        <Demo title="Lines" attr='data-m="lines"'>
          {/* `lines` belongs on headings: SplitText names the element with
              aria-label, which a plain <p> may not carry. */}
          <h4 className="ia-t-display-lg" data-m="lines">
            Designing spaces, <em className="ia-accent">shaping</em> experiences.
          </h4>
        </Demo>

        <Demo title="Shutter" attr='data-m="shutter"'>
          <div className={styles.frame} data-m="shutter">
            <FakeImage />
            <div className={styles.cover} data-m-cover="" aria-hidden="true" />
          </div>
        </Demo>

        <Demo title="Rule" attr='data-m="rule"'>
          <div className={styles.rule} data-m="rule" aria-hidden="true" />
          <p className="ia-t-small">A hairline draws from the left in 0.9 s.</p>
        </Demo>

        <Demo title="Fade" attr='data-m="fade"'>
          <p className="ia-t-display-sm" data-m="fade">Opacity only, 0.7 s.</p>
        </Demo>

        <Demo title="Parallax" attr='data-m-parallax="7"'>
          <div className={styles.frame} data-m-parallax="7">
            <FakeImage tall />
          </div>
          <p className="ia-t-small">±7 % while the frame crosses the viewport (±4 % below 1024 px). Scroll to see it.</p>
        </Demo>

        <Demo title="On mount, delayed" attr={'data-m-now data-m-delay="0.3"'}>
          <p className="ia-t-display-sm" data-m="rise" data-m-now="" data-m-delay="0.3">
            Plays on mount after 0.3 s, as a hero would.
          </p>
        </Demo>
      </div>
    </>
  );
};

export default MotionSection;
