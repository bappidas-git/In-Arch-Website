import React, { useLayoutEffect, useRef, useState } from 'react';
import styles from '../LabPage.module.css';
import { useViewportWidth } from '../labUtils';

const PARAGRAPH =
  'IN-ARCH designs homes, interiors and buildings in Patna with a quiet, careful hand. Every project starts with a conversation about how you live, the light you want and the budget you hold; drawings, materials and site visits follow, step by step, until the keys are handed over.';

// Each case renders the paragraph twice, once in the web font and once in
// its metric-matched fallback alone, at the same width.
const CASES = [
  { id: 'serif-16', label: 'Fraunces 16 px / 400', web: 'Fraunces', fallback: 'Fraunces Fallback', size: 16, weight: 400, lh: 1.65 },
  { id: 'serif-48', label: 'Fraunces 48 px / 300', web: 'Fraunces', fallback: 'Fraunces Fallback', size: 48, weight: 300, lh: 1.02, tracking: '-0.02em', short: true },
  { id: 'serif-48i', label: 'Fraunces italic 48 px / 300', web: 'Fraunces', fallback: 'Fraunces Fallback', size: 48, weight: 300, lh: 1.02, tracking: '-0.02em', italic: true, short: true },
  { id: 'sans-16', label: 'Manrope 16 px / 400', web: 'Manrope', fallback: 'Manrope Fallback', size: 16, weight: 400, lh: 1.65 },
  { id: 'sans-48', label: 'Manrope 48 px / 400', web: 'Manrope', fallback: 'Manrope Fallback', size: 48, weight: 400, lh: 1.65, short: true },
];

const lineCount = (el) => {
  const range = document.createRange();
  range.selectNodeContents(el);
  return new Set(Array.from(range.getClientRects(), (r) => Math.round(r.top))).size;
};

const faceStatus = async () => {
  if (!document.fonts) return [];
  const faces = Array.from(document.fonts).filter((f) => /Fraunces|Manrope/.test(f.family));
  return Promise.all(
    faces.map((f) =>
      f
        .load()
        .then(() => 'loaded')
        .catch(() => 'not available on this device')
        .then((status) => ({ family: f.family.replace(/"/g, ''), style: f.style, weight: f.weight, status }))
    )
  );
};

const FontsSection = () => {
  const width = useViewportWidth();
  const refs = useRef({});
  const [results, setResults] = useState({});
  const [faces, setFaces] = useState([]);

  useLayoutEffect(() => {
    let cancelled = false;
    const measure = () => {
      const next = {};
      CASES.forEach((c) => {
        const a = refs.current[`${c.id}-web`];
        const b = refs.current[`${c.id}-fb`];
        if (!a || !b) return;
        next[c.id] = {
          web: { h: a.getBoundingClientRect().height, lines: lineCount(a) },
          fb: { h: b.getBoundingClientRect().height, lines: lineCount(b) },
        };
      });
      if (!cancelled) setResults(next);
    };
    faceStatus().then((list) => {
      if (cancelled) return;
      setFaces(list);
      measure();
    });
    measure();
    return () => {
      cancelled = true;
    };
  }, [width]);

  return (
    <>
      <p className={`ia-t-body ${styles.note}`}>
        The web fonts load from <code>/fonts/</code> (three WOFF2 files). Each fallback face uses a locally installed
        Georgia or Arial, scaled and re-spaced so the same paragraph breaks on the same lines; the heights below must
        match within 1 px. Where the device has no Georgia or Arial the fallback face is unavailable and the comparison
        does not apply.
      </p>

      <ul className={styles.faceList} aria-label="Font faces">
        {faces.map((f) => (
          <li key={`${f.family}-${f.style}-${f.weight}`} className="ia-t-caption">
            {f.family} · {f.style} · {f.weight} — {f.status}
          </li>
        ))}
      </ul>

      <p className={`ia-t-body ${styles.note}`}>
        Rupee sign: <span>₹ 10–25 lakh (Manrope stack)</span> ·{' '}
        <span className="ia-t-display-sm">₹ 50 lakh (Fraunces stack)</span>. Neither web font contains U+20B9; the glyph
        comes from the next face in the stack.
      </p>

      <div className={styles.fontCases}>
        {CASES.map((c) => {
          const r = results[c.id];
          const same = r && Math.abs(r.web.h - r.fb.h) <= 1 && r.web.lines === r.fb.lines;
          const fallbackLoaded = faces.some((f) => f.family === c.fallback && f.status === 'loaded');
          const verdict = !r ? '' : !fallbackLoaded ? 'n/a: fallback face not installed here' : same ? 'match' : 'DIFFERENT';
          const style = (family) => ({
            fontFamily: `"${family}"`,
            fontSize: `${c.size}px`,
            fontWeight: c.weight,
            lineHeight: c.lh,
            letterSpacing: c.tracking || 'normal',
            fontStyle: c.italic ? 'italic' : 'normal',
          });
          const text = c.short ? PARAGRAPH.slice(0, 150) : PARAGRAPH;
          return (
            <div key={c.id} className={styles.fontCase}>
              <h3 className="ia-t-label">{c.label}</h3>
              <p className="ia-t-caption">
                web {r ? `${r.web.lines} lines, ${r.web.h.toFixed(1)} px` : '…'} · fallback{' '}
                {r ? `${r.fb.lines} lines, ${r.fb.h.toFixed(1)} px` : '…'} · {verdict}
              </p>
              <div className={styles.fontPair}>
                <p ref={(el) => (refs.current[`${c.id}-web`] = el)} style={style(c.web)}>
                  {text}
                </p>
                <p ref={(el) => (refs.current[`${c.id}-fb`] = el)} style={style(c.fallback)} aria-hidden="true">
                  {text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default FontsSection;
