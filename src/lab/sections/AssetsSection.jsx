/* ============================================
   Design Lab — "Assets & content" (prompt 02)
   --------------------------------------------
   Everything prompt 02 produced, in one place, so it can be looked at
   before any page uses it:
   - the six brand files at 24 / 32 / 44 / 96 px tall with their clear space;
   - every photograph key through a plain <picture>, at its real ratio,
     with its alt text, crop and byte sizes;
   - the six texture swatches;
   - the icons at 24 / 32 / 48 px on every tone;
   - the animated icons (played once at half visibility; static under
     reduced motion), with a replay button;
   - the four illustrations;
   - a plain dump of the copy (AssetsContent.jsx) for proof-reading.
   ============================================ */

import React, { useEffect, useRef, useState } from 'react';
import lab from '../LabPage.module.css';
import styles from './AssetsSection.module.css';
import { studio } from '../../data/siteConfig';
import { services } from '../../data/services';
import { processSteps, statusIcons } from '../../data/process';
import { materials } from '../../data/interiors';
import { IMAGE_KEYS, image, srcSet } from '../../data/images';
import report from '../imageReport.json';
import { useReducedMotion } from '../../motion';
import AssetsContent from './AssetsContent';

const TONES = ['light', 'sand', 'paper', 'dark'];
const LOGO_HEIGHTS = [24, 32, 44, 96];

// Clear space = cap height of the "I". The lockup's wordmark band is 533 of
// its 882 px; the wordmark and the monogram are all cap height.
const BRAND_ROLES = [
  { id: 'lockup', label: 'Full lockup', light: studio.logos.lockupOnLight, dark: studio.logos.lockupOnDark, cap: 533 / 882 },
  { id: 'wordmark', label: 'Wordmark', light: studio.logos.wordmarkOnLight, dark: studio.logos.wordmarkOnDark, cap: 1 },
  { id: 'mark', label: 'Monogram', light: studio.logos.markOnLight, dark: studio.logos.markOnDark, cap: 1 },
];

const ICONS = [...processSteps.map((s) => s.icon), ...services.map((s) => s.icon), statusIcons.done.icon];
const LOTTIES = [...processSteps.map((s) => s.lottie), statusIcons.done.lottie];
const ICON_SIZES = [24, 32, 48];

const ILLUSTRATIONS = [
  { file: 'not-found', width: 860, height: 571, alt: 'Illustration for a page that cannot be found: the numerals 404 drawn in a landscape' },
  { file: 'enquiry-sent', width: 670, height: 800, alt: 'Illustration for a sent enquiry: a paper plane trailing a dotted line, with a tick' },
  { file: 'nothing-here', width: 648, height: 632, alt: 'Illustration for an empty result: two blank clipboards' },
  { file: 'something-broke', width: 800, height: 430, alt: 'Illustration for an error: a server and a screen showing a warning sign' },
];

const kb = (bytes) => `${(bytes / 1024).toFixed(1)}`;

// ---------- inline SVG (icons must be inline to follow currentColor) ----------
const svgCache = new Map();
const loadSvg = (url) => {
  if (!svgCache.has(url)) {
    svgCache.set(
      url,
      fetch(url).then((r) => {
        if (!r.ok) throw new Error(`${url}: ${r.status}`);
        return r.text();
      })
    );
  }
  return svgCache.get(url);
};

const InlineIcon = ({ name, size }) => {
  const [svg, setSvg] = useState('');
  useEffect(() => {
    let live = true;
    loadSvg(`/images/inarch/icons/${name}.svg`)
      .then((text) => live && setSvg(text))
      .catch(() => live && setSvg(''));
    return () => {
      live = false;
    };
  }, [name]);
  return (
    <span
      className={styles.icon}
      style={{ width: size, height: size }}
      aria-hidden="true"
      // Our own generated file (scripts/build-icons.js), same origin.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

// ---------- Lottie: once at half visibility; static under reduced motion ----------
const LottieIcon = ({ name, size }) => {
  const host = useRef(null);
  const reduced = useReducedMotion();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (reduced || !host.current) return undefined;
    let anim = null;
    let observer = null;
    let cancelled = false;
    import('lottie-web/build/player/lottie_light')
      .then(({ default: lottie }) => {
        if (cancelled || !host.current) return;
        anim = lottie.loadAnimation({
          container: host.current,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          path: `/images/inarch/lottie/${name}.json`,
        });
        anim.addEventListener('data_failed', () => setFailed(true));
        anim.addEventListener('DOMLoaded', () => {
          if (cancelled) return;
          observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.intersectionRatio >= 0.5) {
                anim.goToAndPlay(0, true);
                observer.disconnect();
              }
            },
            { threshold: [0.5] }
          );
          observer.observe(host.current);
        });
      })
      .catch(() => setFailed(true));
    return () => {
      cancelled = true;
      if (observer) observer.disconnect();
      if (anim) anim.destroy();
    };
  }, [name, reduced]);

  if (reduced || failed) return <InlineIcon name={name} size={size} />;
  return <span ref={host} className={styles.lottie} style={{ width: size, height: size }} aria-hidden="true" />;
};

const LottieCard = ({ name }) => {
  const [run, setRun] = useState(0);
  const reduced = useReducedMotion();
  return (
    <li className={styles.lottieCard}>
      <LottieIcon key={run} name={name} size={64} />
      <span className="ia-t-caption">
        <code>{name}</code>
      </span>
      <button type="button" className={lab.labButton} onClick={() => setRun((r) => r + 1)} disabled={reduced}>
        Replay<span className="ia-visually-hidden"> {name}</span>
      </button>
    </li>
  );
};

// ---------- blocks ----------
const BrandFiles = () => (
  <div className={styles.block}>
    <h3 className="ia-t-display-sm">Brand files</h3>
    <p className={`ia-t-body ${lab.note}`}>
      Espresso files on ivory, sand and paper; ivory files on forest. The dashed box is the clear space (the cap height
      of the “I”). Below 44 px the descriptor line is illegible: use the wordmark there, the full lockup from 44 px.
    </p>
    <div className={styles.toneStack}>
      {TONES.map((tone) => {
        const dark = tone === 'dark';
        return (
          <div key={tone} data-tone={tone} className={styles.tonePanel}>
            <h4 className="ia-t-label">
              On {tone} · {dark ? 'ivory ink' : 'espresso ink'}
            </h4>
            {BRAND_ROLES.map((role) => {
              const file = dark ? role.dark : role.light;
              const ratio = file.width / file.height;
              return (
                <div
                  key={role.id}
                  className={styles.scrollRow}
                  role="region"
                  aria-label={`${role.label} on ${tone}, 24 to 96 px tall`}
                  tabIndex={0}
                >
                  <ul className={styles.logoRow}>
                    {LOGO_HEIGHTS.map((h) => {
                      const cap = Math.round(h * role.cap);
                      const wrong = role.id === 'lockup' && h < 44;
                      return (
                        <li key={h} className={styles.logoItem}>
                          <span className={styles.clear} style={{ padding: cap }}>
                            <img
                              src={file.src}
                              srcSet={file.variants ? file.variants.map((v) => `${v.src} ${v.width}w`).join(', ') : undefined}
                              sizes={file.variants ? `${Math.ceil(h * ratio)}px` : undefined}
                              width={file.width}
                              height={file.height}
                              alt={studio.name}
                              style={{ height: h, width: 'auto' }}
                            />
                          </span>
                          <span className="ia-t-caption">
                            {role.label} · {h} px{wrong ? ' · use the wordmark' : ''}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
            <p className="ia-t-caption">
              {BRAND_ROLES.map((r) => (dark ? r.dark : r.light))
                .map((f) => `${f.src.split('/').pop()} (${f.width} × ${f.height})`)
                .join(' · ')}
            </p>
          </div>
        );
      })}
    </div>
  </div>
);

const BytesTable = ({ entry }) => {
  const files = (report[entry.key] && report[entry.key].files) || {};
  const widths = entry.sources.jpg.map((s) => s.w);
  const size = (w, ext) => {
    const name = Object.keys(files).find((n) => n.endsWith(`-${w}.${ext}`));
    return name ? kb(files[name]) : '—';
  };
  return (
    <table className={styles.bytes}>
      <caption className="ia-visually-hidden">File sizes of {entry.key} in KB</caption>
      <thead>
        <tr>
          <th scope="col">KB</th>
          <th scope="col">AVIF</th>
          <th scope="col">WebP</th>
          <th scope="col">JPEG</th>
        </tr>
      </thead>
      <tbody>
        {widths.map((w) => (
          <tr key={w}>
            <th scope="row">{w}</th>
            <td>{size(w, 'avif')}</td>
            <td>{size(w, 'webp')}</td>
            <td>{size(w, 'jpg')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const Photo = ({ entry, sizes }) => (
  <picture>
    <source type="image/avif" srcSet={srcSet(entry, 'avif')} sizes={sizes} />
    <source type="image/webp" srcSet={srcSet(entry, 'webp')} sizes={sizes} />
    <img
      className={styles.photo}
      src={entry.sources.jpg[0].src}
      srcSet={srcSet(entry, 'jpg')}
      sizes={sizes}
      width={entry.width}
      height={entry.height}
      alt={entry.alt}
      loading="lazy"
      decoding="async"
      style={{ backgroundImage: `url(${entry.placeholder})` }}
    />
  </picture>
);

const Photographs = () => {
  const keys = IMAGE_KEYS.filter((k) => !k.startsWith('sw-'));
  return (
    <div className={styles.block}>
      <h3 className="ia-t-display-sm">Photographs</h3>
      <p className={`ia-t-body ${lab.note}`}>
        {keys.length} keys from the client’s 13 photographs, each through a plain <code>&lt;picture&gt;</code> (AVIF,
        WebP, JPEG) at its real ratio, over its blurred placeholder. Check every frame at 390 and 1440 px: no person,
        no reflection of the photographer, no debris, no loose cable, no carton.
      </p>
      <ul className={styles.photoGrid}>
        {keys.map((key) => {
          const entry = image(key);
          const rep = report[key] || {};
          return (
            <li key={key}>
              <figure className={styles.figure}>
                <Photo entry={entry} sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw" />
                <figcaption className={styles.caption}>
                  <span className="ia-t-label">
                    <code>{key}</code>
                  </span>
                  <span className="ia-t-caption">
                    {entry.width} × {entry.height} · ratio {entry.ratio} · {rep.source} {rep.file} · crop{' '}
                    {(rep.cropPercent || []).join(', ')} %
                  </span>
                  <span className="ia-t-small">{entry.alt}</span>
                  <BytesTable entry={entry} />
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const Swatches = () => (
  <div className={styles.block}>
    <h3 className="ia-t-display-sm">Texture swatches</h3>
    <ul className={styles.swatchGrid}>
      {materials.map((m) => {
        const entry = image(m.image);
        return (
          <li key={m.id}>
            <figure className={styles.figure}>
              <Photo entry={entry} sizes="(min-width: 1024px) 15vw, (min-width: 768px) 30vw, 45vw" />
              <figcaption className={styles.caption}>
                <span className="ia-t-small">{m.label}</span>
                <span className="ia-t-caption">
                  <code>{m.image}</code> · {entry.sources.jpg.map((s) => s.w).join(' / ')} px
                </span>
              </figcaption>
            </figure>
          </li>
        );
      })}
    </ul>
  </div>
);

const Icons = () => (
  <div className={styles.block}>
    <h3 className="ia-t-display-sm">Icons</h3>
    <p className={`ia-t-body ${lab.note}`}>
      Drawn in-house (Icons8 was unreachable from the build session): one 1.5 px line at every size, strokes in{' '}
      <code>currentColor</code>, the accent in <code>--ia-accent-display</code>. Shown at 24, 32 and 48 px on each tone.
    </p>
    <div className={styles.toneGrid}>
      {TONES.map((tone) => (
        <div key={tone} data-tone={tone} className={styles.tonePanel}>
          <h4 className="ia-t-label">On {tone}</h4>
          <ul className={styles.iconList}>
            {ICONS.map((name) => (
              <li key={name} className={styles.iconRow}>
                <span className={styles.iconSizes}>
                  {ICON_SIZES.map((s) => (
                    <InlineIcon key={s} name={name} size={s} />
                  ))}
                </span>
                <span className="ia-t-caption">
                  <code>{name}</code>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

const Animated = () => {
  const reduced = useReducedMotion();
  return (
    <div className={styles.block}>
      <h3 className="ia-t-display-sm">Animated icons</h3>
      <p className={`ia-t-body ${lab.note}`} role="status">
        {reduced
          ? 'Reduced motion is on: each animated icon is replaced by its static SVG.'
          : 'Each draws once when at least half of it is visible, and stops. Replay reloads it.'}
      </p>
      <div className={styles.toneGrid}>
        {['light', 'dark'].map((tone) => (
          <div key={tone} data-tone={tone} className={styles.tonePanel}>
            <h4 className="ia-t-label">On {tone}</h4>
            <ul className={styles.lottieGrid}>
              {LOTTIES.map((name) => (
                <LottieCard key={name} name={name} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

const Illustrations = () => (
  <div className={styles.block}>
    <h3 className="ia-t-display-sm">Illustrations</h3>
    <p className={`ia-t-body ${lab.note}`}>unDraw, recoloured to espresso, terracotta, sand, stone and paper.</p>
    <ul className={styles.illustrationGrid}>
      {ILLUSTRATIONS.map((ill) => (
        <li key={ill.file} data-tone="light" className={styles.tonePanel}>
          <figure className={styles.figure}>
            <img
              className={styles.illustration}
              src={`/images/inarch/illustrations/${ill.file}.svg`}
              alt={ill.alt}
              width={ill.width}
              height={ill.height}
              loading="lazy"
            />
            <figcaption className="ia-t-caption">
              <code>{ill.file}.svg</code>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  </div>
);

const AssetsSection = () => (
  <>
    <p className={`ia-t-body ${lab.note}`}>
      Produced by prompt 02: brand files, photograph derivatives, icons, animated icons, illustrations, and the copy in{' '}
      <code>src/data/</code>. Nothing here is used by a live page yet.
    </p>
    <BrandFiles />
    <Photographs />
    <Swatches />
    <Icons />
    <Animated />
    <Illustrations />
    <AssetsContent />
  </>
);

export default AssetsSection;
