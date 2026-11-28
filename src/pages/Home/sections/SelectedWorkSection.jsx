/* ============================================
   Home / Selected work — "Spaces we have designed."
   --------------------------------------------
   Three projects from src/data/projects.js, deliberately not the hero's
   (the hero shows ph08; these covers are ph14, ph02 and ph09). Each tile
   links to its case study and shows its portfolio number, its category
   and its title — no location, year, area or client.

   - Phones: a horizontal row the finger scrolls natively, snapping one
     tile at a time (tiles 78vw, 4:5; the first on the 20 px gutter, the
     next peeking in). Underneath, a "1 / 3" counter (announced politely)
     and previous / next buttons, so nothing depends on dragging. The row
     only ever scrolls sideways: vertical page scrolling passes through.
   - Tablet: the same row, 44vw tiles.
   - Desktop (≥ 1024): no row. Three tiles on the 12-column grid, none
     aligned: A in columns 1–5 (4:5); B in 7–12 (3:2), 128 px lower; C in
     3–8 (3:2), 96 px below A's bottom edge. "View all work" right-aligned.

   Motion: the tiles open with a shutter; their captions rise.
   ============================================ */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getCategory, getProject, projects } from '../../../data/projects';
import Section from '../../../components/ui/Section/Section';
import Container from '../../../components/ui/Container/Container';
import Eyebrow from '../../../components/ui/Eyebrow/Eyebrow';
import Heading from '../../../components/ui/Heading/Heading';
import ProjectTile from '../../../components/ui/ProjectTile/ProjectTile';
import IconButton from '../../../components/ui/IconButton/IconButton';
import TextLink from '../../../components/ui/TextLink/TextLink';
import VisuallyHidden from '../../../components/ui/VisuallyHidden/VisuallyHidden';
import { devWarn } from '../../../components/ui/_shared/dev';
import { useMotionScope } from '../../../motion';
import { prefersReducedMotion } from '../../../motion/reducedMotion';
import styles from './SelectedWorkSection.module.css';

export const WORK_TITLE_ID = 'home-work-title';
const ROW_ID = 'home-work-row';

/** The three projects shown here, in order (A, B, C). */
export const FEATURED_SLUGS = ['arched-niche-living-room', 'black-and-veined-stone-kitchen', 'prayer-units'];

// Rendered widths: 78vw / 44vw in the row; on desktop A is 5 of 12 columns
// (≈ 37vw, 615 px at the 1680 cap), B and C 6 of 12 (≈ 45vw, 747 px).
const SIZES_A = '(min-width: 1920px) 615px, (min-width: 1024px) 37vw, (min-width: 768px) 44vw, 78vw';
const SIZES_BC = '(min-width: 1920px) 747px, (min-width: 1024px) 45vw, (min-width: 768px) 44vw, 78vw';
const DESKTOP = '(min-width: 1024px)';

/** The tiles: data for each featured slug that exists, with its portfolio number. */
export const featuredTiles = (slugs = FEATURED_SLUGS) =>
  slugs
    .map((slug) => {
      const project = getProject(slug);
      if (!project) {
        devWarn(`SelectedWorkSection: no project "${slug}" in src/data/projects.js.`);
        return null;
      }
      const category = getCategory(project.category);
      return {
        slug: project.slug,
        to: `/portfolio/${project.slug}`,
        title: project.title,
        category: category ? category.title : '',
        index: projects.indexOf(project) + 1,
        cover: project.cover,
      };
    })
    .filter(Boolean);

/**
 * The row's scroll position for each tile: its offset from the first
 * tile, never past the end. The row's trailing spacer lets every tile —
 * the last one too — come to rest on the gutter, so each step is exactly
 * one tile.
 */
const snapTargets = (row) => {
  const items = Array.from(row.querySelectorAll('[data-work-item]'));
  if (!items.length) return [];
  const origin = items[0].offsetLeft;
  const max = Math.max(0, row.scrollWidth - row.clientWidth);
  return items.map((item) => Math.min(item.offsetLeft - origin, max));
};

const nearest = (targets, x) =>
  targets.reduce((best, t, i) => (Math.abs(t - x) < Math.abs(targets[best] - x) ? i : best), 0);

const SelectedWorkSection = () => {
  const scope = useMotionScope();
  const rowRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const tiles = featuredTiles();
  const last = tiles.length - 1;

  // The counter follows the row however it was moved: finger, buttons,
  // keyboard focus or a resize.
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      setCurrent(nearest(snapTargets(row), row.scrollLeft));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    row.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      row.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const go = useCallback(
    (step) => {
      const row = rowRef.current;
      if (!row) return;
      const targets = snapTargets(row);
      const next = Math.max(0, Math.min(targets.length - 1, current + step));
      if (next === current) return;
      row.scrollTo({ left: targets[next], behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      setCurrent(next);
    },
    [current]
  );

  return (
    <Section ref={scope} tone="sand" className={styles.work} aria-labelledby={WORK_TITLE_ID}>
      <Container>
        <header className={styles.header}>
          <Eyebrow index={2} className={styles.eyebrow}>
            Selected work
          </Eyebrow>
          <Heading as="h2" size="lg" lines id={WORK_TITLE_ID}>
            Spaces we have <em>designed.</em>
          </Heading>
        </header>

        <ul className={styles.row} id={ROW_ID} ref={rowRef}>
          {tiles.map((tile, i) => {
            const wide = i > 0;
            return (
              <li key={tile.slug} className={styles.item} data-work-item="">
                <ProjectTile
                  to={tile.to}
                  image={tile.cover.tall}
                  art={wide ? [{ media: DESKTOP, image: tile.cover.wide }] : undefined}
                  ratio="4/5"
                  ratioLg={wide ? '3/2' : undefined}
                  sizes={wide ? SIZES_BC : SIZES_A}
                  index={tile.index}
                  category={tile.category}
                  title={tile.title}
                  reveal
                  rise
                />
              </li>
            );
          })}
        </ul>

        {tiles.length > 1 && (
          <div className={styles.controls}>
            <p className={`ia-t-label ${styles.counter}`} aria-live="polite" aria-atomic="true">
              <span aria-hidden="true">
                <span className={styles.counterNow}>{current + 1}</span> / {tiles.length}
              </span>
              <VisuallyHidden>
                Project {current + 1} of {tiles.length}
              </VisuallyHidden>
            </p>
            <div className={styles.buttons}>
              <IconButton
                label="Previous project"
                icon="arrow-left"
                aria-controls={ROW_ID}
                aria-disabled={current === 0 ? 'true' : undefined}
                onClick={() => go(-1)}
              />
              <IconButton
                label="Next project"
                icon="arrow-right"
                aria-controls={ROW_ID}
                aria-disabled={current === last ? 'true' : undefined}
                onClick={() => go(1)}
              />
            </div>
          </div>
        )}

        <div className={styles.more} data-m="rise">
          <TextLink to="/portfolio" arrow>
            View all work
          </TextLink>
        </div>
      </Container>
    </Section>
  );
};

export default SelectedWorkSection;
