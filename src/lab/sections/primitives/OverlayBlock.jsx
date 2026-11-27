/* ============================================
   Design Lab — "Primitives": overlay utilities (development only)
   --------------------------------------------
   Portal + useFocusTrap + useScrollLock, assembled the way the index
   overlay (04), the lead sheet (05) and the lightbox (12) will use them.
   ============================================ */

import React, { useId, useRef, useState } from 'react';
import { Button, Field, Heading, IconButton, Portal, Text, TextInput, TextLink } from '../../../components/ui';
import useFocusTrap from '../../../hooks/useFocusTrap';
import useScrollLock from '../../../hooks/useScrollLock';
import { Block } from './LabBits';
import styles from '../PrimitivesSection.module.css';

const DemoDialog = ({ onClose }) => {
  const ref = useRef(null);
  const titleId = useId();
  useFocusTrap(ref, true, { onEscape: onClose });
  useScrollLock(true);

  return (
    <Portal tone="light">
      <div
        className={styles.backdrop}
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={titleId} className={styles.dialog}>
          <div className={styles.dialogHead}>
            <Heading as="h2" size="sm" id={titleId}>
              A dialog in a Portal
            </Heading>
            <IconButton label="Close" icon="close" onClick={onClose} />
          </div>
          <Text muted>
            Focus moved in; Tab and Shift+Tab cycle inside; Escape, the close button or the backdrop close it and focus
            returns to the button that opened it. The page behind is locked at its scroll offset.
          </Text>
          <Field label="Try typing here" optional>
            <TextInput name="lab-dialog-field" autoComplete="off" />
          </Field>
          <div className={styles.formActions}>
            <Button onClick={onClose} size="md">
              Done
            </Button>
            <TextLink onClick={onClose}>Cancel</TextLink>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export const OverlayBlock = () => {
  const [open, setOpen] = useState(false);
  return (
    <Block
      title="Portal, useFocusTrap, useScrollLock"
      note="The overlay renders into <body> inside <div class='ia' data-tone>, so tokens and the base layer apply. The scroll lock is the lead modal's own technique, extracted: body fixed at the offset, restored only if the route is unchanged, ScrollTrigger refreshed on both edges."
    >
      <div>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Open a demo dialog
        </Button>
      </div>
      {open && <DemoDialog onClose={() => setOpen(false)} />}
    </Block>
  );
};
