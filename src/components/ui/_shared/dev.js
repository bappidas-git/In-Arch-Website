/* ============================================
   Kit internals — development-only warnings
   --------------------------------------------
   `devWarn` prints once per message, so a primitive rendered in a list does
   not flood the console. In a production build `process.env.NODE_ENV` is the
   constant 'production', so every call site is dead code and removed.
   ============================================ */

const seen = new Set();

export const isDev = process.env.NODE_ENV !== 'production';

export const devWarn = (message) => {
  if (!isDev || seen.has(message)) return;
  seen.add(message);
  // eslint-disable-next-line no-console
  console.warn(`[IN-ARCH ui] ${message}`);
};

/** Test hook: forget which warnings were printed. */
export const resetDevWarnings = () => seen.clear();
