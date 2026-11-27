/* ============================================
   FactList — label / value pairs that stay silent when empty
   --------------------------------------------
   <FactList items={[
     { label: 'Category', value: 'Interior Design' },
     { label: 'Location', value: project.location },   // '' → the pair is not rendered
     { label: 'Address', value: studioAddressLines },  // an array → one line each
   ]} />

   A <dl> whose pairs each sit in a <div>. A pair whose value is undefined,
   null, false, an empty / blank string or an empty array is skipped — no
   "—", "N/A" or "On request" ever stands in. If nothing is left the list
   renders nothing. `layout`: "stack" (label above value, default) or "row"
   (label beside value from 768 px).
   ============================================ */

import React, { forwardRef } from 'react';
import cx from '../_shared/cx';
import styles from './FactList.module.css';

export const isEmptyValue = (value) =>
  value === undefined ||
  value === null ||
  value === false ||
  (typeof value === 'string' && value.trim() === '') ||
  (Array.isArray(value) && value.filter((v) => !isEmptyValue(v)).length === 0);

/** The pairs that will render. */
export const presentFacts = (items = []) => items.filter((item) => item && !isEmptyValue(item.value));

const FactList = forwardRef(function FactList({ items = [], layout = 'stack', className, ...rest }, ref) {
  const facts = presentFacts(items);
  if (!facts.length) return null;
  return (
    <dl ref={ref} className={cx(styles.facts, layout === 'row' && styles.row, className)} {...rest}>
      {facts.map(({ label, value, key }) => (
        <div key={key || label} className={styles.pair}>
          <dt className={cx('ia-t-label', styles.term)}>{label}</dt>
          <dd className={cx('ia-t-body', styles.value)}>
            {Array.isArray(value)
              ? value
                  .filter((v) => !isEmptyValue(v))
                  .map((line, i) => (
                    <span key={i} className={styles.line}>
                      {line}
                    </span>
                  ))
              : value}
          </dd>
        </div>
      ))}
    </dl>
  );
});

export default FactList;
