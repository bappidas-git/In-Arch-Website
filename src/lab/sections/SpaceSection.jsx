import React from 'react';
import styles from '../LabPage.module.css';

export const SPACE_STEPS = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48];

const LAYOUT_TOKENS = [
  ['--ia-section-y', 'section rhythm'],
  ['--ia-section-y-sm', 'compact rhythm'],
  ['--ia-gutter', 'page gutter'],
  ['--ia-max', 'content max-width'],
  ['--ia-dock-clearance', 'dock clearance'],
];

const SpaceSection = () => (
  <>
    <ul className={styles.spaceList}>
      {SPACE_STEPS.map((n) => (
        <li key={n} className={styles.spaceRow}>
          <code className="ia-t-caption">--ia-space-{n}</code>
          <span className="ia-t-caption">{n * 4} px</span>
          <span className={styles.spaceBar} style={{ width: `var(--ia-space-${n})` }} aria-hidden="true" />
        </li>
      ))}
    </ul>
    <ul className={styles.spaceList}>
      {LAYOUT_TOKENS.map(([name, label]) => (
        <li key={name} className={styles.spaceRow}>
          <code className="ia-t-caption">{name}</code>
          <span className="ia-t-caption">{label}</span>
          <span className={styles.spaceBar} style={{ width: `min(100%, var(${name}))` }} aria-hidden="true" />
        </li>
      ))}
    </ul>
  </>
);

export default SpaceSection;
