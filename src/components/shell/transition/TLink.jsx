/* ============================================
   TLink — the transition-aware internal link
   --------------------------------------------
   <TLink to="/portfolio">Portfolio</TLink>

   A react-router `Link` in every respect (it renders one), except that a
   plain left click on a link to a DIFFERENT path is handed to
   TransitionProvider.navigate(), which runs the page curtain. Left alone,
   and so behaving as a normal link:
   - clicks with a modifier key or another mouse button (new tab, new window),
   - links with a `target` other than _self, or `reloadDocument`,
   - external URLs (any scheme, or protocol-relative `//`),
   - hash-only links and links to the current path (`#enquiry`,
     `/expertise#e03` while on /expertise) — ScrollManager handles those,
   - clicks a parent handler already prevented,
   - everything, when there is no TransitionProvider above it.

   It also warms the target route's chunk on pointerenter, focus and
   touchstart, so it is usually loaded before the curtain has covered.

   The kit (Button, TextLink, IconButton, ProjectTile) renders it through
   <LinkProvider component={TLink}> in src/App.jsx.
   ============================================ */

import React, { forwardRef, useContext } from 'react';
import { Link, useLocation, useResolvedPath } from 'react-router-dom';
import { TransitionContext } from './TransitionProvider';

const EXTERNAL = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i;

/** True for `to` values the router must not handle (https:, tel:, //host …). */
export const isExternal = (to) => typeof to === 'string' && EXTERNAL.test(to);

const normalise = (pathname = '/') => (pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname);

/**
 * Whether a click on a link should run the page transition.
 * Pure, so the rules are unit-tested on their own.
 */
export const shouldTransition = (event, { to, target, reloadDocument, currentPath, nextPath }) => {
  if (!event || event.defaultPrevented) return false;
  if (event.button !== undefined && event.button !== 0) return false;
  if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) return false;
  if (target && target !== '_self') return false;
  if (reloadDocument) return false;
  if (isExternal(to)) return false;
  if (typeof to === 'string' && to.startsWith('#')) return false;
  if (!nextPath) return false;
  return normalise(nextPath) !== normalise(currentPath);
};

const chain = (own, mine) => (event) => {
  if (own) own(event);
  mine(event);
};

const TLink = forwardRef(function TLink(
  { to, onClick, onPointerEnter, onFocus, onTouchStart, target, reloadDocument, replace, state, ...rest },
  ref
) {
  const transition = useContext(TransitionContext);
  const location = useLocation();
  const external = isExternal(to);
  // Hooks run unconditionally; an external URL resolves against '.' and is
  // never used.
  const resolved = useResolvedPath(external ? '.' : to);
  const nextPath = external ? null : resolved.pathname;

  const handleClick = (event) => {
    if (onClick) onClick(event);
    if (!transition) return;
    if (!shouldTransition(event, { to, target, reloadDocument, currentPath: location.pathname, nextPath })) return;
    event.preventDefault();
    transition.navigate(to, { replace, state });
  };

  const warm = () => {
    if (transition && nextPath && !external) transition.preload(nextPath);
  };

  return (
    <Link
      ref={ref}
      to={to}
      target={target}
      reloadDocument={reloadDocument}
      replace={replace}
      state={state}
      onClick={handleClick}
      onPointerEnter={chain(onPointerEnter, warm)}
      onFocus={chain(onFocus, warm)}
      onTouchStart={chain(onTouchStart, warm)}
      {...rest}
    />
  );
});

export default TLink;
