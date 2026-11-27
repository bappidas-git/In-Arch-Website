/* ============================================
   Kit internals — not exported from the barrel
   ============================================ */

/** Join truthy class names: cx('a', cond && 'b', undefined) → "a b". */
const cx = (...names) => names.filter(Boolean).join(' ');

export default cx;
