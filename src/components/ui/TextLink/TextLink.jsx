/* ============================================
   TextLink — the quiet link
   --------------------------------------------
   <TextLink to="/about" arrow>About the studio</TextLink>
   <TextLink href={studioTelHref} accent>+91 72928 31128</TextLink>
   <TextLink onClick={close}>Close</TextLink>          (renders a <button>)

   Rest: the text with a 1 px underline at 35 % opacity, optional trailing
   arrow. Hover (fine pointers) and focus-visible: a full-opacity underline
   in --ia-accent draws from the left (scaleX) and the arrow nudges 3 px in
   its own direction. Press: opacity 0.7. Focus ring 2 px at 2 px offset.

   | prop     | values                                          | default |
   |----------|-------------------------------------------------|---------|
   | to/href  | internal (LinkProvider) / plain link; neither → <button> |  |
   | arrow    | true (arrow-up-right) or an Icon name           | false   |
   | accent   | text in --ia-accent instead of the current colour | false |
   | disabled / aria-disabled | as Button                       |         |

   The hit area is at least 44 × 44 px (inline-flex, min-height 44 px), so a
   TextLink stands on its own line or in a row of actions, not inside a
   sentence.
   ============================================ */

import React, { forwardRef } from 'react';
import cx from '../_shared/cx';
import { useAction } from '../_shared/action';
import Icon, { swapVector } from '../Icon/Icon';
import styles from './TextLink.module.css';

const TextLink = forwardRef(function TextLink(
  {
    to,
    href,
    type,
    target,
    rel,
    arrow = false,
    accent = false,
    disabled = false,
    onClick,
    className,
    children,
    'aria-disabled': ariaDisabled,
    ...rest
  },
  ref
) {
  const { Tag, props, inactive } = useAction({ to, href, type, disabled, onClick, target, rel, ariaDisabled });
  const arrowName = arrow === true ? 'arrow-up-right' : arrow || null;
  const vector = arrowName ? swapVector(arrowName) || [0, 0] : null;

  return (
    <Tag
      ref={ref}
      className={cx(styles.link, accent && styles.accent, inactive ? styles.inactive : styles.enabled, className)}
      {...props}
      {...rest}
    >
      <span className={styles.text}>{children}</span>
      {arrowName && (
        <span
          className={styles.arrow}
          style={{ '--ia-nudge-x': `${vector[0] * 3}px`, '--ia-nudge-y': `${vector[1] * 3}px` }}
          aria-hidden="true"
        >
          <Icon name={arrowName} size={16} />
        </span>
      )}
    </Tag>
  );
});

export default TextLink;
