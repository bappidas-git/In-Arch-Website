import React, { useLayoutEffect, useRef, useState } from 'react';
import styles from '../LabPage.module.css';
import { clampPx, useViewportWidth } from '../labUtils';

// [min rem, intercept rem, slope vw, max rem] — the clamp() of each token.
export const TYPE_STEPS = [
  { cls: 'ia-t-display-2xl', clamp: [2.75, 1.2, 7.2, 8.5], text: 'Quiet rooms, ', accent: 'well made.' },
  { cls: 'ia-t-display-xl', clamp: [2.5, 1.35, 5.2, 6.5], text: 'Designing spaces, ', accent: 'shaping experiences.' },
  { cls: 'ia-t-display-lg', clamp: [2, 1.3, 3.2, 4.5], text: 'Architecture and ', accent: 'interiors.' },
  { cls: 'ia-t-display-md', clamp: [1.625, 1.25, 1.7, 2.75], text: 'From the first sketch ', accent: 'to the keys.' },
  { cls: 'ia-t-display-sm', clamp: [1.375, 1.2, 0.8, 1.875], text: 'Seven steps, one studio, one point of contact.' },
  { cls: 'ia-t-body-lg', clamp: [1.0625, 0.98, 0.38, 1.3125], text: 'Every project starts with a conversation about how you live, the light you want and the budget you hold.' },
  { cls: 'ia-t-body', clamp: [1, 0.97, 0.14, 1.0625], text: 'Drawings, materials and site visits follow, step by step, until the keys are handed over. Budget from ₹10 lakh.' },
  { cls: 'ia-t-small', clamp: [0.875, 0.875, 0, 0.875], text: 'Small — supporting copy, metadata and form hints.' },
  { cls: 'ia-t-caption', clamp: [0.8125, 0.8125, 0, 0.8125], text: 'Caption — image credits and legal lines.' },
  { cls: 'ia-t-label', clamp: [0.75, 0.75, 0, 0.75], text: '01 — The practice' },
];

// The design contract's table (px), for an exact check at the QA widths.
export const TYPE_TABLE = {
  360: [45.1, 40.3, 32.3, 26.1, 22.1, 17, 16],
  390: [47.3, 41.9, 33.3, 26.6, 22.3, 17.2, 16.1],
  768: [74.5, 61.5, 45.4, 33.1, 25.3, 18.6, 16.6],
  1024: [92.9, 74.8, 53.6, 37.4, 27.4, 19.6, 17],
  1280: [111.4, 88.2, 61.8, 41.8, 29.4, 20.5, 17],
  1440: [122.9, 96.5, 66.9, 44, 30, 21, 17],
  1920: [136, 104, 72, 44, 30, 21, 17],
};

const TypeSection = () => {
  const width = useViewportWidth();
  const refs = useRef([]);
  const [rows, setRows] = useState([]);

  useLayoutEffect(() => {
    const measure = () =>
      setRows(
        refs.current.map((el) => {
          if (!el) return null;
          const s = getComputedStyle(el);
          return {
            size: parseFloat(s.fontSize),
            weight: s.fontWeight,
            lineHeight: (parseFloat(s.lineHeight) / parseFloat(s.fontSize)).toFixed(2),
            family: s.fontFamily.split(',')[0].replace(/"/g, ''),
          };
        })
      );
    measure();
    // Font swap changes nothing measured here, but re-read once fonts settle.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  }, [width]);

  const table = TYPE_TABLE[width];

  return (
    <>
      <p className={`ia-t-body ${styles.note}`}>
        Live computed size against the token formula at the current viewport ({width} px). At a QA width (360, 390,
        768, 1024, 1280, 1440, 1920) the contract table value is shown too; every step must be within 0.5 px.
      </p>
      <ol className={styles.typeList}>
        {TYPE_STEPS.map((step, i) => {
          const expected = clampPx(step.clamp, width);
          const row = rows[i];
          const tableValue = table && table[i] !== undefined ? table[i] : null;
          const delta = row ? row.size - expected : NaN;
          const ok = Math.abs(delta) <= 0.5 && (tableValue === null || Math.abs(row.size - tableValue) <= 0.5);
          return (
            <li key={step.cls} className={styles.typeRow}>
              <p className={`ia-t-caption ${styles.typeMeta}`}>
                .{step.cls} · {row ? `${row.size.toFixed(2)} px` : '…'} · formula {expected.toFixed(2)} px
                {tableValue !== null ? ` · table ${tableValue} px` : ''} · {row ? `wght ${row.weight}` : ''} · lh{' '}
                {row ? row.lineHeight : ''} · {row ? row.family : ''} · {row ? (ok ? 'ok' : 'OFF') : ''}
              </p>
              <p ref={(el) => (refs.current[i] = el)} className={step.cls}>
                {step.text}
                {step.accent ? <em className="ia-accent">{step.accent}</em> : null}
              </p>
            </li>
          );
        })}
      </ol>
    </>
  );
};

export default TypeSection;
