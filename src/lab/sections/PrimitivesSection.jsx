/* ============================================
   Design Lab — "Primitives" (prompt 03)
   --------------------------------------------
   Every primitive of src/components/ui/ in every state on all four tones:
   - phone + desktop frames of this section (on demand);
   - layout and type; the wipe & swap family as a state matrix (rest,
     hover, focus-visible, active, disabled, loading) plus the ghost
     variants over a photograph and the magnetic button; the icon sprite;
   - fields in every state, a live-validating form, notices;
   - logo, picture with art direction, frames and figures, animated and
     static icons, illustrations;
   - project tiles from real image keys, chips, both accordions, fact
     lists, rules, skeletons, the scroll marquee;
   - a Portal dialog with focus trap and scroll lock;
   - a keyboard-test strip with Tab-order numbers.

   The section is one motion scope, so Frame reveal / parallax, Rule and
   Heading `lines` run here exactly as on a page. Hover / focus / press are
   forced for display by src/lab/forceStates.js (development only).
   `embedded` drops the frames block (the frames themselves render it).
   ============================================ */

import React, { useEffect } from 'react';
import { useMotionScope } from '../../motion';
import { watchForcedStates } from '../forceStates';
import { Text } from '../../components/ui';
import { FramesBlock } from './primitives/FramesBlock';
import { LayoutTypeBlock } from './primitives/LayoutTypeBlock';
import { ActionsBlock, IconsBlock, MagneticBlock } from './primitives/ActionsBlock';
import { FormsBlock } from './primitives/FormsBlock';
import { MediaBlock } from './primitives/MediaBlock';
import { ContentBlock } from './primitives/ContentBlock';
import { OverlayBlock } from './primitives/OverlayBlock';
import { KeyboardStrip } from './primitives/KeyboardStrip';
import styles from './PrimitivesSection.module.css';

const PrimitivesSection = ({ embedded = false }) => {
  const scope = useMotionScope();
  useEffect(() => watchForcedStates(), []);

  return (
    <div ref={scope} className={styles.primitives}>
      <Text muted className={styles.note}>
        The kit in <code>src/components/ui/</code> (prompt 03). Nothing on a live page uses it yet. Every primitive
        reads only the tone variables, so the same component is shown on light, sand, paper and dark.
      </Text>
      {!embedded && <FramesBlock />}
      <LayoutTypeBlock />
      <ActionsBlock />
      <MagneticBlock />
      <IconsBlock />
      <FormsBlock />
      <MediaBlock />
      <ContentBlock />
      <OverlayBlock />
      <KeyboardStrip />
    </div>
  );
};

export default PrimitivesSection;
