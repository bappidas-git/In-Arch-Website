/* ============================================
   Design Lab — "Primitives": media and brand (development only)
   ============================================ */

import React from 'react';
import {
  Figure,
  Frame,
  Illustration,
  LineIcon,
  Logo,
  LottieIcon,
  Picture,
} from '../../../components/ui';
import { ALT } from '../../../data/images';
import { processSteps } from '../../../data/process';
import { services } from '../../../data/services';
import { Block, TONES, TonePanel } from './LabBits';
import styles from '../PrimitivesSection.module.css';

const THIRD = '(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw';

const FRAMES = [
  { ratio: '4/5', image: 'home-intro', reveal: true, caption: '4/5 · reveal (shutter)' },
  { ratio: '3/2', image: 'pr-graphite-cover-wide', reveal: true, parallax: true, caption: '3/2 · reveal + parallax' },
  { ratio: '1/1', image: 'sw-fluted', caption: '1/1 · a swatch' },
  { ratio: '16/9', image: 'studio-band-wide', parallax: true, caption: '16/9 · parallax' },
  { ratio: '4/5', image: 'interiors-hero-tall', arch: true, caption: '4/5 · arch (Interior Design page only)' },
  { ratio: '21/9', image: 'home-hero-wide', caption: '21/9', wide: true },
];

export const MediaBlock = () => (
  <>
    <Block
      title="Logo"
      note="The file follows the nearest tone: espresso ink on light, sand and paper, ivory ink on dark. The full lockup from 44 px tall, the wordmark below that, the monogram for the dock."
    >
      <div className={styles.toneGrid}>
        {TONES.map((tone) => (
          <TonePanel key={tone} tone={tone}>
            <div className={styles.logoRow}>
              <Logo variant="lockup" height={48} />
              <Logo variant="wordmark" height={26} alt="" />
              <Logo variant="mark" height={26} alt="" />
            </div>
          </TonePanel>
        ))}
      </div>
    </Block>

    <Block
      title="Picture — art direction"
      note="One <picture>: below 768 px the 4:5 crop (home-hero-tall), from 768 px the 16:9 crop (home-hero-wide); AVIF, WebP and JPEG for each, over the blurred placeholder. Resize the window to see the swap."
    >
      <Picture
        image="home-hero-wide"
        art={[{ media: '(max-width: 767px)', image: 'home-hero-tall' }]}
        sizes="(min-width: 1680px) 1600px, 100vw"
      />
    </Block>

    <Block
      title="Frame and Figure"
      note="Inside this section's motion scope: covers slide away as each frame enters, the image settles from 1.12; parallax images are rendered 14 % taller and drift at most 6 % of their height, so no edge shows. Under reduced motion they are simply there."
    >
      <div className={styles.frameGrid}>
        {FRAMES.map((f) => (
          <Figure key={`${f.image}-${f.ratio}`} caption={f.caption} className={f.wide ? styles.wide : undefined}>
            <Frame ratio={f.ratio} reveal={f.reveal} parallax={f.parallax} arch={f.arch}>
              <Picture image={f.image} sizes={f.wide ? '(min-width: 1680px) 1600px, 100vw' : THIRD} alt={ALT[f.image]} />
            </Frame>
          </Figure>
        ))}
      </div>
    </Block>

    <Block
      title="LottieIcon and LineIcon"
      note="LottieIcon loads its player and JSON only near the viewport, plays once at half visibility and keeps the static icon before load, on error and under reduced motion. LineIcon is the static content icon. Both follow the tone."
    >
      <div className={styles.toneGrid}>
        {['light', 'dark'].map((tone) => (
          <TonePanel key={tone} tone={tone}>
            <div className={styles.logoRow}>
              {processSteps.slice(0, 4).map((step) => (
                <LottieIcon key={step.id} name={step.lottie} icon={step.icon} size={48} />
              ))}
            </div>
            <div className={styles.logoRow} style={{ marginTop: 'var(--ia-space-6)' }}>
              {services.slice(0, 4).map((s) => (
                <LineIcon key={s.id} name={s.icon} size={32} />
              ))}
            </div>
          </TonePanel>
        ))}
      </div>
    </Block>

    <Block
      title="Illustration"
      note="Four unDraw drawings, each with a title (its alt text) or the decorative flag. Coloured for light surfaces."
    >
      <div data-tone="paper" className={styles.tonePanel}>
        <div className={styles.illustrations}>
          <Illustration name="not-found" size={220} title="The numerals 404 drawn in a landscape" />
          <Illustration name="enquiry-sent" size={140} title="A paper plane trailing a dotted line, with a tick" />
          <Illustration name="nothing-here" size={160} title="Two blank clipboards" />
          <Illustration name="something-broke" size={220} decorative />
        </div>
      </div>
    </Block>
  </>
);
