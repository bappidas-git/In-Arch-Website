/* ============================================
   Design Lab — "Primitives": shared scaffolding (development only)
   ============================================ */

import React from 'react';
import { Heading, Text } from '../../../components/ui';
import { TONES } from '../../../components/ui/_shared/tone';
import styles from '../PrimitivesSection.module.css';

export { TONES };

/** Forced interaction states (see src/lab/forceStates.js). */
export const FORCE = {
  rest: {},
  hover: { 'data-force-hover': '' },
  focus: { 'data-force-focus': '' },
  active: { 'data-force-active': '' },
};

export const Block = ({ title, note, children }) => (
  <div className={styles.block}>
    <div className={styles.blockHead}>
      <Heading as="h3" size="sm">
        {title}
      </Heading>
      {note && (
        <Text size="md" muted className={styles.note}>
          {note}
        </Text>
      )}
    </div>
    {children}
  </div>
);

export const TonePanel = ({ tone, title, children, className }) => (
  <div data-tone={tone} className={[styles.tonePanel, className].filter(Boolean).join(' ')}>
    <h4 className={`ia-t-label ${styles.panelTitle}`}>{title || `On ${tone}`}</h4>
    {children}
  </div>
);

export const Cell = ({ caption, children }) => (
  <li className={styles.cell}>
    <span className={`ia-t-caption ${styles.cellCaption}`}>{caption}</span>
    {children}
  </li>
);

/** One row of a state matrix: a label and its cells. */
export const Row = ({ label, children }) => (
  <div className={styles.row}>
    <p className={`ia-t-label ${styles.rowLabel}`}>{label}</p>
    <ul className={styles.cells}>{children}</ul>
  </div>
);
