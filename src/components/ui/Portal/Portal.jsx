/* ============================================
   Portal — overlays rendered at the end of <body>
   --------------------------------------------
   <Portal tone="dark">
     <div role="dialog" aria-modal="true" aria-labelledby="…">…</div>
   </Portal>

   Renders its children into a <div class="ia" data-tone="…"> appended to
   document.body, so the tokens, the tone variables and the scoped base
   layer apply to overlays (the index overlay, the lead sheet, the
   lightbox). React context (router, modal, LinkProvider) flows through as
   usual.

   Timing, which the overlay hooks rely on:
   - the container is created with its class and tone already set, and the
     children render into it in the SAME commit as the Portal, so a ref to
     the dialog is filled when the parent's effects run;
   - the container is attached to <body> in a layout effect, i.e. before any
     passive effect (useFocusTrap, useScrollLock) runs, and removed on
     unmount. Tone lookups (Logo) work even before attachment, because the
     container itself carries data-tone.

   | prop      | default | effect                              |
   |-----------|---------|-------------------------------------|
   | tone      | light   | data-tone on the container          |
   | className |         | extra classes on the container      |
   ============================================ */

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useIsoLayoutEffect } from '../_shared/refs';

const scopeClass = (className) => ['ia', className].filter(Boolean).join(' ');

const Portal = ({ tone = 'light', className, children }) => {
  const [container] = useState(() => {
    if (typeof document === 'undefined') return null;
    const el = document.createElement('div');
    el.setAttribute('data-ia-portal', '');
    el.className = scopeClass(className);
    el.setAttribute('data-tone', tone);
    return el;
  });

  useIsoLayoutEffect(() => {
    if (!container) return undefined;
    document.body.appendChild(container);
    return () => container.remove();
  }, [container]);

  useIsoLayoutEffect(() => {
    if (!container) return;
    container.className = scopeClass(className);
    container.setAttribute('data-tone', tone);
  }, [container, tone, className]);

  if (!container) return null;
  return createPortal(children, container);
};

export default Portal;
