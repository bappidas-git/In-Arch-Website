/* ============================================
   Home / What we do — the services ledger
   --------------------------------------------
   The seven services of src/data/services.js as a ledger: one row each —
   number, title, tagline, arrow — and each row one link into its item on
   /expertise (`#e01` … `#e07`, from the data).

   - Phones: the number beside the title's first line, the tagline under
     the title, the arrow on the right; rows at least 72 px tall with
     hairlines between them.
   - Desktop: the ledger in columns 1–9; titles at display-md; from
     1280 px the tagline moves beside the title.
   - Desktop enhancement only: on a fine pointer from 1024 px, hovering or
     focusing a row cross-fades that service's icon (160 px) into a fixed
     slot in columns 10–12. The slot is reserved, so nothing moves; on
     touch it is never rendered (and its icons are never fetched).

   After the ledger, one line points to the dedicated Interior Design page.

   Motion: rows rise (batched, 0.08 s apart). Hover / focus moves the title
   8 px right and swaps the arrow; under reduced motion only the arrow's
   colour changes.
   ============================================ */

import React, { useState } from 'react';
import { services } from '../../../data/services';
import { NAV_LINKS } from '../../../data/navigation';
import Section from '../../../components/ui/Section/Section';
import Container from '../../../components/ui/Container/Container';
import Grid, { Col } from '../../../components/ui/Grid/Grid';
import Eyebrow from '../../../components/ui/Eyebrow/Eyebrow';
import Heading from '../../../components/ui/Heading/Heading';
import Lede from '../../../components/ui/Lede/Lede';
import TextLink from '../../../components/ui/TextLink/TextLink';
import LineIcon from '../../../components/ui/LineIcon/LineIcon';
import { useLinkComponent } from '../../../components/ui/LinkProvider/LinkProvider';
import ArrowSwap from '../../../components/ui/_shared/ArrowSwap';
import useMatchMedia from '../../../components/shell/useMatchMedia';
import { useMotionScope } from '../../../motion';
import styles from './ServicesIndexSection.module.css';

export const SERVICES_TITLE_ID = 'home-services-title';

/** The hover preview exists only here: a desktop width with a fine, hovering pointer. */
export const PREVIEW_QUERY = '(min-width: 1024px) and (hover: hover) and (pointer: fine)';

/** `/expertise#e0N` for a service — the id comes from the data, never typed. */
export const serviceHref = (service) => `/expertise#${service.id}`;

const interiorPage = NAV_LINKS.find((link) => link.to === '/interior-design');

const ServicesIndexSection = () => {
  const scope = useMotionScope();
  const Link = useLinkComponent();
  const preview = useMatchMedia(PREVIEW_QUERY);
  const [active, setActive] = useState(null);

  const show = (id) => () => setActive(id);
  const onLedgerBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setActive(null);
  };

  return (
    <Section ref={scope} tone="light" className={styles.services} aria-labelledby={SERVICES_TITLE_ID}>
      <Container>
        <Grid className={styles.grid}>
          <Col span="full" md={{ span: 7 }} lg={{ span: 8 }} className={styles.header}>
            <Eyebrow index={3} className={styles.eyebrow}>
              What we do
            </Eyebrow>
            <Heading as="h2" size="lg" lines id={SERVICES_TITLE_ID}>
              From concept to <em>completion.</em>
            </Heading>
            <Lede className={styles.lede} data-m="rise">
              Seven services, each set out in full on the Expertise page.
            </Lede>
          </Col>

          <Col span="full" lg={{ span: 9 }}>
            <ol
              className={styles.ledger}
              onMouseLeave={() => setActive(null)}
              onBlur={onLedgerBlur}
            >
              {services.map((service) => (
                <li key={service.id} className={styles.item} data-m="rise">
                  <Link
                    to={serviceHref(service)}
                    className={styles.row}
                    data-ia-swap=""
                    onPointerEnter={show(service.id)}
                    onFocus={show(service.id)}
                  >
                    <span className={`ia-t-label ${styles.num}`}>{service.num}</span>
                    <span className={styles.text}>
                      <h3 className={`ia-t-display-sm ${styles.title}`}>{service.title}</h3>
                      <span className={`ia-t-small ${styles.tagline}`}>{service.tagline}</span>
                    </span>
                    <ArrowSwap name="arrow-up-right" size={20} className={styles.arrow} />
                  </Link>
                </li>
              ))}
            </ol>
          </Col>

          <Col span="full" lg={{ start: 10, span: 3 }} className={styles.slotCol} aria-hidden="true">
            {preview && (
              <div className={styles.slot}>
                {services.map((service) => (
                  <LineIcon
                    key={service.id}
                    name={service.icon}
                    size={160}
                    className={styles.preview}
                    data-active={active === service.id ? '' : undefined}
                  />
                ))}
              </div>
            )}
          </Col>

          {interiorPage && (
            <Col span="full" lg={{ span: 9 }} className={styles.pointer} data-m="rise">
              <p className={`ia-t-body ${styles.pointerText}`}>Interiors have a page of their own.</p>
              <TextLink to={interiorPage.to} arrow>
                {interiorPage.label}
              </TextLink>
            </Col>
          )}
        </Grid>
      </Container>
    </Section>
  );
};

export default ServicesIndexSection;
