/* ============================================
   Design Lab — forced interaction states (development only)
   --------------------------------------------
   CSS cannot be told to show :hover, :focus-visible or :active on an
   element nobody is touching. To show every state side by side, the Lab
   copies each style rule that uses one of those pseudo-classes and swaps it
   for an attribute:

     :hover          → [data-force-hover]
     :focus-visible  → [data-force-focus]    (also plain :focus)
     :active         → [data-force-active]

   The copy goes into the same stylesheet and the same @media group, after
   the original rules of that group, so the cascade is the components' own
   (a reduced-motion or hover-only condition still applies). Nothing in the
   kit knows about this: the primitives simply forward `data-force-*` to
   their root element. Only the Lab calls it, and only in development.
   ============================================ */

const PSEUDO = [
  [/:hover(?![\w-])/g, '[data-force-hover]'],
  [/:focus-visible(?![\w-])/g, '[data-force-focus]'],
  [/:focus(?![\w-])/g, '[data-force-focus]'],
  [/:active(?![\w-])/g, '[data-force-active]'],
];

const MARK = '[data-force-';
const seen = new WeakSet();

const rewrite = (selector) => {
  let out = selector;
  PSEUDO.forEach(([re, attr]) => {
    out = out.replace(re, attr);
  });
  return out === selector ? null : out;
};

const processGroup = (group) => {
  let rules;
  try {
    rules = Array.from(group.cssRules || []);
  } catch (e) {
    return; // cross-origin sheet
  }
  const additions = [];
  rules.forEach((rule) => {
    const isStyleRule = typeof CSSStyleRule !== 'undefined' && rule instanceof CSSStyleRule;
    if (!isStyleRule) {
      // @media / @supports: recurse into the group.
      if (rule.cssRules) processGroup(rule);
      return;
    }
    if (!rule.selectorText || rule.selectorText.includes(MARK)) return;
    const selector = rewrite(rule.selectorText);
    if (selector) additions.push(`${selector} { ${rule.style.cssText} }`);
  });
  additions.forEach((text) => {
    try {
      group.insertRule(text, group.cssRules.length);
    } catch (e) {
      /* a selector the engine rejects after rewriting: skip it */
    }
  });
};

/** Add forced-state copies for every stylesheet not processed yet. */
export const installForcedStates = () => {
  if (typeof document === 'undefined') return;
  // Keyed on the sheet object: a <style> whose text is replaced (hot
  // reload) gets a new CSSStyleSheet and is processed again.
  Array.from(document.styleSheets).forEach((sheet) => {
    if (seen.has(sheet)) return;
    seen.add(sheet);
    processGroup(sheet);
  });
};

/** Keep up with stylesheets that arrive later (lazy chunks, hot reload). */
export const watchForcedStates = () => {
  installForcedStates();
  if (typeof MutationObserver === 'undefined') return () => {};
  const observer = new MutationObserver(() => installForcedStates());
  observer.observe(document.head, { childList: true, subtree: true, characterData: true });
  return () => observer.disconnect();
};
