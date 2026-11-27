/* ============================================
   Design Lab — "Primitives": keyboard-test strip (development only)
   --------------------------------------------
   One of each interactive primitive with its Tab-order number beside it.
   Tab through: the numbers must follow, each stop must show the 2 px ring,
   Enter / Space must activate. A radio group (ChoiceChips) is one stop —
   the arrow keys move inside it.
   ============================================ */

import React, { useRef, useState } from 'react';
import {
  Accordion,
  AccordionItem,
  Button,
  ChoiceChips,
  Chip,
  Field,
  IconButton,
  SelectInput,
  Text,
  TextInput,
  TextLink,
} from '../../../components/ui';
import { Block } from './LabBits';
import styles from '../PrimitivesSection.module.css';

const Stop = ({ n, label, wide, children }) => (
  <div className={[styles.stop, wide && styles.stripWide].filter(Boolean).join(' ')} data-stop={n}>
    <span className={styles.stopNumber} aria-hidden="true">
      {n}
    </span>
    {children}
    <span className="ia-visually-hidden">Stop {n}: {label}</span>
  </div>
);

export const KeyboardStrip = () => {
  const [focused, setFocused] = useState('');
  const [pressed, setPressed] = useState(false);
  const stripRef = useRef(null);

  const onFocus = (event) => {
    // Data attributes, not CSS-module classes: hashed names can hold '+' or '/'.
    const stop = event.target.closest('[data-stop]');
    if (stop) setFocused(stop.getAttribute('data-stop'));
  };

  return (
    <Block
      title="Keyboard-test strip"
      note="Tab from the first control: the numbers give the expected order. Every stop shows the 2 px ring at its offset; Enter and Space activate; Escape closes the demo dialog above and returns focus to its opener."
    >
      <div ref={stripRef} className={styles.strip} onFocus={onFocus}>
        <Stop n={1} label="Button">
          <Button size="md" onClick={() => setPressed((p) => !p)}>
            {pressed ? 'Pressed' : 'Press me'}
          </Button>
        </Stop>
        <Stop n={2} label="TextLink">
          <TextLink href="#lab-primitives" arrow>
            Text link
          </TextLink>
        </Stop>
        <Stop n={3} label="IconButton">
          <IconButton label="Next" icon="arrow-right" />
        </Stop>
        <Stop n={4} label="Chip">
          <Chip pressed={pressed} onClick={() => setPressed((p) => !p)}>
            Toggle
          </Chip>
        </Stop>
        <Stop n={5} label="TextInput" wide>
          <Field label="Name">
            <TextInput name="lab-kbd-name" autoComplete="off" />
          </Field>
        </Stop>
        <Stop n={6} label="SelectInput" wide>
          <Field label="Room">
            <SelectInput name="lab-kbd-room" placeholder="Choose" options={['Living room', 'Kitchen', 'Bedroom']} />
          </Field>
        </Stop>
        <Stop n={7} label="ChoiceChips, one stop" wide>
          <Field label="Size" group>
            <ChoiceChips name="lab-kbd-size" options={['Small', 'Medium', 'Large']} defaultValue="Medium" />
          </Field>
        </Stop>
        <Stop n={8} label="Accordion header" wide>
          <Accordion headingLevel="h4" openOnHash={false}>
            <AccordionItem id="lab-kbd-acc" title="A disclosure">
              <Text>Opened with Enter or Space.</Text>
            </AccordionItem>
          </Accordion>
        </Stop>
      </div>
      <p className="ia-t-caption" aria-live="polite">
        {focused ? `Focus is on stop ${focused}.` : 'Focus a control in the strip.'}
      </p>
    </Block>
  );
};
