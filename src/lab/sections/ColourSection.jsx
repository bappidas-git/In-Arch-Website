import React, { useLayoutEffect, useRef, useState } from 'react';
import styles from '../LabPage.module.css';
import { contrast, readToken, toHex } from '../labUtils';

export const COLOUR_TOKENS = [
  { group: 'Light surfaces', names: ['--ia-ivory', '--ia-paper', '--ia-sand', '--ia-stone'] },
  { group: 'Dark surfaces', names: ['--ia-forest', '--ia-forest-2', '--ia-forest-3'] },
  { group: 'Ink', names: ['--ia-espresso', '--ia-ink-2', '--ia-ink-3', '--ia-mist', '--ia-mist-2'] },
  { group: 'Accent', names: ['--ia-terracotta-700', '--ia-terracotta-500', '--ia-terracotta-300'] },
  { group: 'Lines', names: ['--ia-hairline', '--ia-border', '--ia-hairline-dark', '--ia-border-dark'] },
  { group: 'Feedback', names: ['--ia-success', '--ia-success-dark', '--ia-error', '--ia-error-dark'] },
];

const TONES = ['light', 'sand', 'paper', 'dark'];

// What each tone promises: the pair, the claim, and how it is shown.
const pairsFor = (tone) => {
  const dark = tone === 'dark';
  return [
    { id: 'fg', varName: '--ia-fg', label: 'Text (--ia-fg)', min: 4.5 },
    { id: 'fg2', varName: '--ia-fg-2', label: 'Secondary text (--ia-fg-2)', min: 4.5 },
    { id: 'fg3', varName: '--ia-fg-3', label: 'Tertiary text (--ia-fg-3)', min: 4.5 },
    { id: 'accent', varName: '--ia-accent', label: 'Accent, small text and links (--ia-accent)', min: 4.5 },
    { id: 'display', varName: '--ia-accent-display', label: 'Accent display ≥ 24 px', min: 3, large: true },
    { id: 'success', varName: dark ? '--ia-success-dark' : '--ia-success', label: 'Success message', min: 4.5 },
    { id: 'error', varName: dark ? '--ia-error-dark' : '--ia-error', label: 'Error message', min: 4.5 },
    { id: 'border', varName: '--ia-line-strong', label: 'Control border (non-text)', min: 3, border: true },
    { id: 'focus', varName: '--ia-focus', label: 'Focus ring (non-text)', min: 3, border: true },
  ];
};

const fmt = (n) => (Number.isFinite(n) ? `${n.toFixed(2)}:1` : '…');

const TonePanel = ({ tone }) => {
  const panelRef = useRef(null);
  const [measured, setMeasured] = useState({ pairs: {}, swatches: {} });
  const pairs = pairsFor(tone);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const cs = getComputedStyle(panel);
    const bg = cs.backgroundColor;
    const fg = cs.color;
    const next = { bg: toHex(bg), fg: toHex(fg), pairs: {}, swatches: {} };
    panel.querySelectorAll('[data-pair]').forEach((el) => {
      const s = getComputedStyle(el);
      const colour = el.hasAttribute('data-border') ? s.borderTopColor : s.color;
      next.pairs[el.getAttribute('data-pair')] = { hex: toHex(colour), ratio: contrast(colour, bg) };
    });
    COLOUR_TOKENS.forEach(({ names }) =>
      names.forEach((name) => {
        const value = readToken(name);
        next.swatches[name] = { hex: toHex(value), vsFg: contrast(value, fg), vsBg: contrast(value, bg) };
      })
    );
    setMeasured(next);
  }, [tone]);

  return (
    <div ref={panelRef} data-tone={tone} className={styles.tonePanel}>
      <h3 className={`ia-t-display-sm ${styles.toneTitle}`}>
        {tone} <span className="ia-t-caption">bg {measured.bg || '…'} · fg {measured.fg || '…'}</span>
      </h3>

      <ul className={styles.pairList} aria-label={`Text and control pairs on the ${tone} tone`}>
        {pairs.map((p) => {
          const m = measured.pairs[p.id];
          const pass = m && m.ratio >= p.min;
          return (
            <li key={p.id} className={styles.pairRow}>
              {p.border ? (
                <span
                  data-pair={p.id}
                  data-border=""
                  className={styles.pairBorder}
                  style={{ borderColor: `var(${p.varName})` }}
                  aria-hidden="true"
                />
              ) : (
                <span
                  data-pair={p.id}
                  className={p.large ? 'ia-t-display-md' : 'ia-t-body'}
                  style={{ color: `var(${p.varName})` }}
                >
                  {p.large ? 'Aa — display' : 'The quick brown fox'}
                </span>
              )}
              <span className="ia-t-small">
                {p.label} · {m ? m.hex : '…'} · {m ? fmt(m.ratio) : '…'} (needs {p.min}:1){' '}
                <strong>{m ? (pass ? 'pass' : 'FAIL') : ''}</strong>
              </span>
            </li>
          );
        })}
      </ul>

      {COLOUR_TOKENS.map(({ group, names }) => (
        <div key={group} className={styles.swatchGroup}>
          <p className="ia-t-label">{group}</p>
          <ul className={styles.swatches}>
            {names.map((name) => {
              const m = measured.swatches[name];
              return (
                <li key={name} className={styles.swatch}>
                  <span className={styles.chip} style={{ background: `var(${name})` }} aria-hidden="true" />
                  <span className="ia-t-caption">
                    <code>{name}</code>
                    <br />
                    {m ? m.hex : '…'} · vs fg {m ? fmt(m.vsFg) : '…'} · vs bg {m ? fmt(m.vsBg) : '…'}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

const ColourSection = () => (
  <>
    <p className={`ia-t-body ${styles.note}`}>
      Each tone sets the nine tone variables. Ratios are measured live from the computed colours (WCAG 2): text needs
      4.5:1, display text from 24 px and control boundaries need 3:1. Swatch ratios are informational.
    </p>
    <div className={styles.toneGrid}>
      {TONES.map((tone) => (
        <TonePanel key={tone} tone={tone} />
      ))}
    </div>
  </>
);

export default ColourSection;
