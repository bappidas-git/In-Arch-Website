/* ============================================
   Design Lab — "Primitives": layout and type (development only)
   ============================================ */

import React from 'react';
import { Col, Eyebrow, Grid, Heading, Lede, Stack, Text } from '../../../components/ui';
import { studio } from '../../../data/siteConfig';
import { Block, TONES, TonePanel } from './LabBits';
import styles from '../PrimitivesSection.module.css';

const SIZES = ['2xl', 'xl', 'lg', 'md', 'sm'];

export const LayoutTypeBlock = () => (
  <>
    <Block
      title="Grid and Col — placement in markup"
      note="Col writes its placement per breakpoint as custom properties (base, md 768, lg 1024, xl 1280); each level inherits from the one below. Turn on the grid overlay above and resize."
    >
      <Grid className={styles.gridDemo}>
        <Col span="full" md={{ span: 5 }} lg={{ start: 1, span: 7 }}>
          <div className={`ia-t-caption ${styles.gridCell}`}>span full · md 5 · lg 1–7</div>
        </Col>
        <Col span="full" md={{ span: 3 }} lg={{ start: 9, span: 4 }} align="end">
          <div className={`ia-t-caption ${styles.gridCell}`}>full · md 3 · lg 9–12, align end</div>
        </Col>
        <Col span={3} start={2} md={{ start: 3, span: 6 }} lg={{ start: 4, span: 6 }} xl={{ start: 5, span: 4 }}>
          <div className={`ia-t-caption ${styles.gridCell}`}>2–4 · md 3–8 · lg 4–9 · xl 5–8</div>
        </Col>
      </Grid>
    </Block>

    <Block
      title="Eyebrow, Heading, Lede, Text, Stack"
      note="One italic accent phrase per headline, passed as <em>. In development Heading warns about a second <em>, and about an accent below 24 px on a light tone."
    >
      <div className={styles.toneGrid}>
        {TONES.map((tone) => (
          <TonePanel key={tone} tone={tone}>
            <Stack gap={5}>
              <Eyebrow index={1}>The practice</Eyebrow>
              <Heading as="h4" size="lg">
                Spaces shaped around <em>the way you live.</em>
              </Heading>
              <Lede>{studio.blurb}</Lede>
              <Text>Body text in Manrope, 16 to 17 px, line-height 1.65, measured to 68 characters at most.</Text>
              <Text size="sm" muted>
                Small and muted: --ia-fg-2.
              </Text>
              <Text size="caption" muted>
                Caption, 13 px.
              </Text>
              <Eyebrow>Without a number</Eyebrow>
            </Stack>
          </TonePanel>
        ))}
      </div>
      <div className={styles.typeList}>
        {SIZES.map((size) => (
          <div key={size} className={styles.typeRow}>
            <span className="ia-t-label">Heading size="{size}"</span>
            <Heading as="h4" size={size} lines={size === 'xl'}>
              {size === 'sm' ? 'Designing spaces, shaping experiences.' : (
                <>
                  Designing spaces, <em>shaping experiences.</em>
                </>
              )}
            </Heading>
          </div>
        ))}
      </div>
    </Block>
  </>
);
