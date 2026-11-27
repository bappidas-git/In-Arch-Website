/* ============================================
   Design Lab — "Primitives": the wipe & swap family (development only)
   --------------------------------------------
   Every action primitive in every state, on all four tones, plus the ghost
   variants over a photograph. Hover / focus-visible / active are forced
   with data-force-* (src/lab/forceStates.js); everything stays live too.
   ============================================ */

import React from 'react';
import { Button, Chip, IconButton, Icon, ICON_NAMES, Picture, TextLink } from '../../../components/ui';
import { Block, Cell, FORCE, Row, TONES, TonePanel } from './LabBits';
import styles from '../PrimitivesSection.module.css';

const INTERACTIVE = ['rest', 'hover', 'focus', 'active'];
const CAPTION = { rest: 'rest', hover: 'hover', focus: 'focus-visible', active: 'active (press)' };

const ButtonRow = ({ label, variant, size }) => (
  <Row label={label}>
    {INTERACTIVE.map((s) => (
      <Cell key={s} caption={CAPTION[s]}>
        <Button variant={variant} size={size} {...FORCE[s]}>
          Start a project
        </Button>
      </Cell>
    ))}
    <Cell caption="disabled">
      <Button variant={variant} size={size} disabled>
        Start a project
      </Button>
    </Cell>
    <Cell caption="aria-disabled (focusable)">
      <Button variant={variant} size={size} aria-disabled="true">
        Start a project
      </Button>
    </Cell>
    <Cell caption="loading">
      <Button variant={variant} size={size} loading loadingLabel="Sending…">
        Start a project
      </Button>
    </Cell>
  </Row>
);

const LinkRow = () => (
  <Row label="TextLink — arrow · accent">
    {INTERACTIVE.map((s) => (
      <Cell key={s} caption={CAPTION[s]}>
        <TextLink href="#lab-primitives" arrow {...FORCE[s]}>
          About the studio
        </TextLink>
      </Cell>
    ))}
    <Cell caption="accent, no arrow">
      <TextLink href="#lab-primitives" accent>
        Read more
      </TextLink>
    </Cell>
    <Cell caption="disabled">
      <TextLink href="#lab-primitives" arrow disabled>
        About the studio
      </TextLink>
    </Cell>
  </Row>
);

const IconButtonRow = ({ ghost = false }) => (
  <Row label={ghost ? 'IconButton — ghost' : 'IconButton — arrow-right · phone'}>
    {INTERACTIVE.map((s) => (
      <Cell key={s} caption={CAPTION[s]}>
        <IconButton label="Next" icon="arrow-right" variant={ghost ? 'ghost' : 'default'} {...FORCE[s]} />
      </Cell>
    ))}
    {!ghost && (
      <Cell caption="non-arrow glyph">
        <IconButton label="Call the studio" icon="phone" />
      </Cell>
    )}
    <Cell caption="disabled">
      <IconButton label="Previous" icon="arrow-left" variant={ghost ? 'ghost' : 'default'} disabled />
    </Cell>
  </Row>
);

const ChipRow = () => (
  <Row label="Chip — toggle with count">
    {INTERACTIVE.map((s) => (
      <Cell key={s} caption={CAPTION[s]}>
        <Chip pressed={false} count={4} {...FORCE[s]}>
          Interior Design
        </Chip>
      </Cell>
    ))}
    <Cell caption="pressed">
      <Chip pressed count={7}>
        All
      </Chip>
    </Cell>
    <Cell caption="disabled">
      <Chip pressed={false} disabled>
        Landscape
      </Chip>
    </Cell>
  </Row>
);

const GhostRow = () => (
  <Row label="Button — ghost">
    {INTERACTIVE.map((s) => (
      <Cell key={s} caption={CAPTION[s]}>
        <Button variant="ghost" {...FORCE[s]}>
          View selected work
        </Button>
      </Cell>
    ))}
    <Cell caption="disabled">
      <Button variant="ghost" disabled>
        View selected work
      </Button>
    </Cell>
  </Row>
);

export const ActionsBlock = () => (
  <Block
    title="Actions — wipe & swap"
    note="Columns force each state (hover and press are copies of the components' own rules, applied by attribute); every control is also live — hover, tab to and press any of them. On a touch screen only the press state exists. Under reduced motion the wipe and swap collapse to a colour change."
  >
    <div className={styles.toneStack}>
      {TONES.map((tone) => (
        <TonePanel key={tone} tone={tone}>
          <div className={styles.matrix}>
            <ButtonRow label="Button — primary · lg" variant="primary" size="lg" />
            <ButtonRow label="Button — secondary · lg" variant="secondary" size="lg" />
            <ButtonRow label="Button — primary · md" variant="primary" size="md" />
            <ButtonRow label="Button — secondary · md" variant="secondary" size="md" />
            <LinkRow />
            <IconButtonRow />
            <ChipRow />
          </div>
        </TonePanel>
      ))}
      <div className={styles.photoPanel} data-tone="dark">
        <div className={styles.photoBack} aria-hidden="true">
          <Picture image="studio-band-wide" sizes="(min-width: 1680px) 1600px, 100vw" alt="" />
        </div>
        <div className={styles.photoContent}>
          <h4 className={`ia-t-label ${styles.panelTitle}`}>Over a photograph · ghost variants</h4>
          <div className={styles.matrix}>
            <GhostRow />
            <IconButtonRow ghost />
          </div>
        </div>
      </div>
    </div>
  </Block>
);

export const MagneticBlock = () => (
  <Block
    title="Magnetic"
    note="lg buttons only: with a fine pointer the button follows it by at most 6 px and springs back in 400 ms. Never on touch, never under reduced motion."
  >
    <div className={styles.cells}>
      <Button magnetic>Start a project</Button>
      <Button magnetic variant="secondary">
        View selected work
      </Button>
    </div>
  </Block>
);

export const IconsBlock = () => (
  <Block
    title="Icon — the UI sprite"
    note="24 px grid, 1.5 px round stroke in currentColor at every size (non-scaling stroke). WhatsApp uses the generic chat glyph beside the word; its logo is never redrawn."
  >
    <div className={styles.toneGrid}>
      {TONES.map((tone) => (
        <TonePanel key={tone} tone={tone}>
          <ul className={styles.iconList}>
            {ICON_NAMES.map((name) => (
              <li key={name} className={styles.iconItem}>
                <span className={styles.iconSizes}>
                  <Icon name={name} size={16} />
                  <Icon name={name} size={20} />
                  <Icon name={name} size={24} />
                </span>
                <code className="ia-t-caption">{name}</code>
              </li>
            ))}
          </ul>
        </TonePanel>
      ))}
    </div>
  </Block>
);
