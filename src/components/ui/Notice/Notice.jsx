/* ============================================
   Notice — an inline message
   --------------------------------------------
   <Notice variant="error" title="We could not send your enquiry." actions={<Button …/>}>
     {message}
   </Notice>

   | variant | icon  | role   | colour                 |
   |---------|-------|--------|------------------------|
   | info    | info  | status | --ia-fg                |
   | success | check | status | --ia-feedback-success  |
   | error   | alert | alert  | --ia-feedback-error    |

   Each variant has its own icon and a 1 px border in its colour on the
   field surface (--ia-field-bg), so the meaning never rests on colour alone.
   `role` can be overridden (e.g. role={undefined} for a notice that is
   rendered on arrival and should not be announced).
   ============================================ */

import React, { forwardRef } from 'react';
import cx from '../_shared/cx';
import Icon from '../Icon/Icon';
import styles from './Notice.module.css';

const VARIANTS = {
  info: { icon: 'info', role: 'status' },
  success: { icon: 'check', role: 'status' },
  error: { icon: 'alert', role: 'alert' },
};

const Notice = forwardRef(function Notice({ variant = 'info', title, actions, className, children, ...rest }, ref) {
  const v = VARIANTS[variant] || VARIANTS.info;
  return (
    <div ref={ref} role={v.role} className={cx(styles.notice, styles[variant], className)} {...rest}>
      <Icon name={v.icon} size={20} className={styles.icon} />
      <div className={styles.body}>
        {title && <p className={styles.title}>{title}</p>}
        {children && <div className={styles.message}>{children}</div>}
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </div>
  );
});

export default Notice;
