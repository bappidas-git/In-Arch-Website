/* ============================================
   IN-ARCH Design Lab — `/__lab`, development only
   --------------------------------------------
   Registered in src/App.jsx behind `process.env.NODE_ENV === 'development'`,
   so a production build contains no Lab chunk and `/__lab` is the 404.
   Sections come from ./registry.js — later prompts append their primitives
   and assets there.

   `/__lab?frame=<id>` renders one section alone (no Lab header), for the
   phone and desktop iframes of the "Primitives" section (prompt 03).
   ============================================ */

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './LabPage.module.css';
import primitives from './sections/PrimitivesSection.module.css';
import { LAB_SECTIONS } from './registry';
import { activeBreakpoint, useViewportWidth } from './labUtils';

const OVERLAY_COLUMNS = Array.from({ length: 12 }, (_, i) => i);

// Sections that can be shown alone in a frame (they accept `embedded`).
const FRAMEABLE = ['primitives'];

const FrameView = ({ section }) => {
  const { Component, title } = section;
  return (
    <div className={`ia ${primitives.frameView}`}>
      <div className="ia-container">
        <h1 className="ia-t-label">Design Lab · {title} · frame</h1>
        <Component embedded />
      </div>
    </div>
  );
};

const LabPage = () => {
  const [showGrid, setShowGrid] = useState(false);
  const width = useViewportWidth();
  const { search } = useLocation();
  const frameId = new URLSearchParams(search).get('frame');
  const framed = FRAMEABLE.includes(frameId) && LAB_SECTIONS.find((s) => s.id === frameId);

  if (framed) return <FrameView section={framed} />;

  return (
    <div className={`ia ${styles.lab}`}>
      <header className={`ia-container ${styles.head}`}>
        <p className="ia-t-label">IN-ARCH · Design Lab · development only</p>
        <h1 className="ia-t-display-xl">
          The design system, <em className="ia-accent">live.</em>
        </h1>
        <p className="ia-t-body-lg ia-measure">
          Tokens, type, colour, grid and motion exactly as the components will use them. Resize the window to check
          every fluid value against the contract.
        </p>
        <div className={styles.toolbar}>
          <button
            type="button"
            className={styles.labButton}
            aria-pressed={showGrid}
            onClick={() => setShowGrid((v) => !v)}
          >
            Grid overlay
          </button>
          <span className="ia-t-caption" aria-live="polite">
            {width} px · breakpoint {activeBreakpoint(width) || 'base'}
          </span>
        </div>
        <nav aria-label="Lab sections" className={styles.sectionNav}>
          <ul>
            {LAB_SECTIONS.map(({ id, title }) => (
              <li key={id}>
                <a href={`#lab-${id}`}>{title}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {LAB_SECTIONS.map(({ id, title, Component }) => (
        <section key={id} id={`lab-${id}`} aria-labelledby={`lab-${id}-title`} className={`ia-section--compact ${styles.section}`}>
          <div className="ia-container">
            <h2 id={`lab-${id}-title`} className="ia-t-display-md">
              {title}
            </h2>
            <Component />
          </div>
        </section>
      ))}

      {showGrid && (
        <div className={styles.gridOverlay} aria-hidden="true" data-lab-grid-overlay="">
          <div className={`ia-container ${styles.overlayInner}`}>
            <div className={`ia-grid ${styles.overlayGrid}`}>
              {OVERLAY_COLUMNS.map((i) => (
                <span key={i} className={styles.overlayCol} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabPage;
