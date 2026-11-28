/* ============================================
   ProjectTile — one project, one link
   --------------------------------------------
   <ProjectTile
     to="/portfolio/arched-niche-living-room"
     image="pr-arches-cover-tall"
     ratio="4/5"
     index={2}
     category="Interior Design"
     title="Living Room with Arched Niches"
     sizes="(min-width: 1024px) 33vw, (min-width: 768px) 44vw, 78vw"
   />

   One link wraps a Frame (4/5 or 3/2), a meta row (index and category in
   `.ia-t-label`), the title in `.ia-t-display-sm` and an arrow. Everything
   is visible at rest — no hover-only caption. Hover (fine pointers) and
   focus-visible: the image scales to 1.04 over 700 ms, the arrow swaps and
   the title gets the TextLink underline. Press: the tile settles to 0.99.

   The photograph is decorative by default (alt=""): the title names the
   link, and a long alt text would be read before it. `headingLevel` sets
   the title's element (default h3). `reveal` passes the shutter to the
   Frame. The ref and unknown props go to the link.

   Responsive tiles: `ratioLg` gives the frame another ratio from 1024 px,
   and `art` ([{ media, image }], as on Picture) supplies the matching
   crop, e.g. a 4:5 tile that becomes 3:2 on desktop:
     ratio="4/5" ratioLg="3/2" image={cover.tall}
     art={[{ media: '(min-width: 1024px)', image: cover.wide }]}
   `rise` marks the caption (meta row and title row) data-m="rise", so it
   rises under the shutter inside a useMotionScope section.
   ============================================ */

import React, { forwardRef } from 'react';
import cx from '../_shared/cx';
import ArrowSwap from '../_shared/ArrowSwap';
import { useLinkComponent } from '../LinkProvider/LinkProvider';
import Frame from '../Frame/Frame';
import Picture from '../Picture/Picture';
import { padIndex } from '../Eyebrow/Eyebrow';
import styles from './ProjectTile.module.css';

const ProjectTile = forwardRef(function ProjectTile(
  {
    to,
    href,
    image,
    ratio = '4/5',
    ratioLg,
    art,
    index,
    category,
    title,
    sizes,
    alt = '',
    priority = false,
    reveal = false,
    rise = false,
    headingLevel = 'h3',
    className,
    ...rest
  },
  ref
) {
  const LinkComponent = useLinkComponent();
  const Tag = to !== undefined ? LinkComponent : 'a';
  const target = to !== undefined ? { to } : { href };
  const Title = ['h2', 'h3', 'h4'].includes(headingLevel) ? headingLevel : 'h3';
  const hasIndex = index !== undefined && index !== null && index !== '';
  const riseAttr = rise ? { 'data-m': 'rise' } : null;

  return (
    <Tag ref={ref} className={cx(styles.tile, className)} data-ia-swap="" {...target} {...rest}>
      <Frame ratio={ratio} ratioLg={ratioLg} reveal={reveal} className={styles.frame}>
        <Picture image={image} art={art} sizes={sizes} alt={alt} priority={priority} />
      </Frame>
      {(hasIndex || category) && (
        <span className={cx('ia-t-label', styles.meta)} {...riseAttr}>
          {hasIndex && <span className={styles.index}>{padIndex(index)}</span>}
          {category && <span>{category}</span>}
        </span>
      )}
      <span className={styles.titleRow} {...riseAttr}>
        <Title className={cx('ia-t-display-sm', styles.title)}>
          <span className={styles.titleText}>{title}</span>
        </Title>
        <ArrowSwap name="arrow-up-right" size={20} className={styles.arrow} />
      </span>
    </Tag>
  );
});

export default ProjectTile;
