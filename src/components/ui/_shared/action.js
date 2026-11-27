/* ============================================
   Kit internals — one element for every action
   --------------------------------------------
   Button, TextLink, IconButton and Chip render:
   - `to`   → the LinkProvider's link component (react-router `Link` today);
   - `href` → a plain <a> (new-tab links get rel="noopener noreferrer");
   - else   → a <button type="button"> (or the `type` given).

   Disabled and busy states:
   - `disabled` on a <button> → the native attribute (not focusable);
   - `disabled` on a link, or `aria-disabled` passed explicitly → stays
     focusable, announced as unavailable, and every activation is swallowed;
   - `loading` → aria-busy="true" and every activation is swallowed too
     (including the implicit submit of a form), so a second press does
     nothing.
   ============================================ */

import { useLinkComponent } from '../LinkProvider/LinkProvider';

const truthy = (value) => value === true || value === 'true';

export const useAction = ({ to, href, type, disabled, loading, onClick, target, rel, ariaDisabled }) => {
  const LinkComponent = useLinkComponent();
  const isLink = to !== undefined || href !== undefined;
  const softDisabled = truthy(ariaDisabled) || (isLink && disabled);
  const inactive = Boolean(disabled) || softDisabled;
  const blocked = inactive || Boolean(loading);

  const handleClick = (event) => {
    if (blocked) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (onClick) onClick(event);
  };

  let Tag;
  const props = { onClick: handleClick };

  if (to !== undefined) {
    Tag = LinkComponent;
    props.to = to;
  } else if (href !== undefined) {
    Tag = 'a';
    props.href = href;
  } else {
    Tag = 'button';
    props.type = type || 'button';
    if (disabled && !softDisabled) props.disabled = true;
  }

  if (isLink) {
    if (target) props.target = target;
    if (target === '_blank') props.rel = rel || 'noopener noreferrer';
    else if (rel) props.rel = rel;
  }

  if (softDisabled) props['aria-disabled'] = 'true';
  if (loading) props['aria-busy'] = 'true';

  return { Tag, props, inactive, blocked };
};
