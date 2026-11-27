/* ============================================
   Design Lab — "Primitives": content (development only)
   ============================================ */

import React, { useMemo, useState } from 'react';
import {
  Accordion,
  AccordionItem,
  Chip,
  FactList,
  ProjectTile,
  Rule,
  ScrollMarquee,
  Skeleton,
  Text,
  VisuallyHidden,
} from '../../../components/ui';
import { projects, getCategory, categories } from '../../../data/projects';
import { services, serviceGroups } from '../../../data/services';
import { faqs } from '../../../data/faqs';
import { studio, studioAddressLines, studioHoursLabel } from '../../../data/siteConfig';
import { Block, TonePanel } from './LabBits';
import styles from '../PrimitivesSection.module.css';

const TILE_SIZES = '(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw';

const Tiles = () => {
  const [filter, setFilter] = useState('all');
  const present = useMemo(
    () => categories.filter((c) => projects.some((p) => p.category === c.id)).map((c) => ({ ...c, count: projects.filter((p) => p.category === c.id).length })),
    []
  );
  const shown = projects
    .map((p, i) => ({ ...p, index: i + 1 }))
    .filter((p) => filter === 'all' || p.category === filter);

  return (
    <>
      <div className={styles.chipRow} role="group" aria-label="Filter the demo tiles">
        <Chip pressed={filter === 'all'} count={projects.length} onClick={() => setFilter('all')}>
          All
        </Chip>
        {present.map((c) => (
          <Chip key={c.id} pressed={filter === c.id} count={c.count} onClick={() => setFilter(c.id)}>
            {c.title}
          </Chip>
        ))}
      </div>
      <div className={styles.tileRow}>
        {shown.map((p, i) => (
          <ProjectTile
            key={p.slug}
            href={`#lab-primitives`}
            image={i % 3 === 1 ? p.cover.wide : p.cover.tall}
            ratio={i % 3 === 1 ? '3/2' : '4/5'}
            index={p.index}
            category={getCategory(p.category).title}
            title={p.title}
            sizes={TILE_SIZES}
            headingLevel="h4"
          />
        ))}
      </div>
    </>
  );
};

export const ContentBlock = () => {
  const sample = projects[0];
  return (
    <>
      <Block
        title="ProjectTile and Chip"
        note="Real image keys and project data. Everything is visible at rest; hover or focus zooms the image to 1.04 over 700 ms, swaps the arrow and underlines the title. The chips are toggles (aria-pressed) with counts; only categories that hold a project appear."
      >
        <Tiles />
      </Block>

      <Block title="ProjectTile on dark" note="Same tile, dark tone: meta in mist, accent index in terracotta-300.">
        <TonePanel tone="dark">
          <div className={styles.tileRow}>
            {projects.slice(3, 5).map((p, i) => (
              <ProjectTile
                key={p.slug}
                href="#lab-primitives"
                image={p.cover.tall}
                index={i + 4}
                category={getCategory(p.category).title}
                title={p.title}
                sizes={TILE_SIZES}
                headingLevel="h4"
              />
            ))}
          </div>
        </TonePanel>
      </Block>

      <Block
        title="Accordion — single-open, numbered"
        note="Real buttons in headings, aria-expanded / aria-controls, region panels. Enter and Space toggle; ↑ ↓ Home End move between headers. The first item is open on arrival and does not animate; items opened later raise their content 12 px over 400 ms."
      >
        <Accordion defaultOpenId={`lab-${services[0].id}`} headingLevel="h4">
          {services.map((s, i) => (
            <AccordionItem key={s.id} id={`lab-${s.id}`} index={i + 1} title={s.title}>
              <Text size="lg">{s.description}</Text>
            </AccordionItem>
          ))}
        </Accordion>
      </Block>

      <Block title="Accordion — multi-open, on sand" note="All closed on arrival; any number can be open.">
        <TonePanel tone="sand">
          <Accordion multiple headingLevel="h5">
            {faqs.slice(0, 4).map((f) => (
              <AccordionItem key={f.id} id={`lab-${f.id}`} title={f.question}>
                <Text>{f.answer}</Text>
              </AccordionItem>
            ))}
          </Accordion>
        </TonePanel>
      </Block>

      <Block
        title="FactList"
        note="Pairs with an empty value are not rendered — the project below has no location, area, year or client, so those four rows are simply absent. Arrays become lines."
      >
        <div className={styles.toneGrid}>
          <TonePanel tone="light" title="A project">
            <FactList
              items={[
                { label: 'Category', value: getCategory(sample.category).title },
                { label: 'Project type', value: sample.type },
                { label: 'Scope', value: sample.scope },
                { label: 'Design focus', value: sample.focus },
                { label: 'Location', value: sample.location },
                { label: 'Area', value: sample.area },
                { label: 'Year', value: sample.year },
                { label: 'Client', value: sample.client },
              ]}
            />
          </TonePanel>
          <TonePanel tone="dark" title="The studio">
            <FactList
              layout="row"
              items={[
                { label: 'Studio', value: studio.fullName },
                { label: 'Principal architect', value: studio.principal.name },
                { label: 'Address', value: studioAddressLines },
                { label: 'Hours', value: studioHoursLabel },
                { label: 'Email', value: studio.email },
              ]}
            />
          </TonePanel>
        </div>
      </Block>

      <Block title="Rule, Skeleton, VisuallyHidden" note="Rules draw from the left inside a motion scope. Skeletons are static blocks — no shimmer.">
        <Rule />
        <Rule strong />
        <div className={styles.skeletonDemo}>
          <Skeleton ratio="16/9" />
          <Skeleton width="80%" height="1.25rem" />
          <Skeleton width="55%" height="1.25rem" />
        </div>
        <Text muted>
          The next sentence is for screen readers only:
          <VisuallyHidden> this text is visually hidden but read aloud.</VisuallyHidden>
        </Text>
      </Block>

      <Block
        title="ScrollMarquee"
        note="Moves only as the page scrolls (a scrubbed transform), never on a timer, so it needs no pause control. The repeated copy is aria-hidden; under reduced motion the row is still."
      >
        <div className={styles.marqueeBand}>
          <ScrollMarquee items={serviceGroups.map((g) => g.label)} size="xl" copies={3} />
        </div>
        <div className={styles.marqueeBand} data-tone="dark">
          <ScrollMarquee items={serviceGroups.map((g) => g.label)} size="lg" direction="right" copies={3} decorative />
        </div>
      </Block>
    </>
  );
};
