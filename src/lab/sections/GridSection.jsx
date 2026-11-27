import React, { useLayoutEffect, useRef, useState } from 'react';
import styles from '../LabPage.module.css';
import { activeBreakpoint, useViewportWidth } from '../labUtils';

// A few spans to show the grid carrying an asymmetric editorial layout.
const SPANS = [
  { label: 'span 4 / 5 / 7', className: styles.spanA },
  { label: 'span 4 / 3 / 5', className: styles.spanB },
  { label: 'span 4 / 8 / 12', className: styles.spanC },
];

const GridSection = () => {
  const width = useViewportWidth();
  const gridRef = useRef(null);
  const [info, setInfo] = useState(null);

  useLayoutEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const s = getComputedStyle(el);
    setInfo({
      columns: s.gridTemplateColumns.split(' ').length,
      gap: s.columnGap,
    });
  }, [width]);

  return (
    <>
      <p className={`ia-t-body ${styles.note}`}>
        Viewport {width} px · breakpoint {activeBreakpoint(width) || 'base'} ·{' '}
        {info ? `${info.columns} columns, ${info.gap} gap` : '…'}. Expected: 4 / 16 px below 768, 8 / 24 px from 768, 12
        / 32 px from 1024, 40 px gap from 1440. Toggle the overlay from the toolbar at the top of the page.
      </p>
      <div ref={gridRef} className={`ia-grid ${styles.gridDemo}`}>
        {SPANS.map((s) => (
          <div key={s.label} className={`${styles.gridCell} ${s.className}`}>
            <span className="ia-t-caption">{s.label}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default GridSection;
