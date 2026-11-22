import type { ReactNode } from 'react';

import { Icon, type IconName } from '../Icon';
import styles from './ResultRow.module.css';

export interface ResultRowProps {
  icon: IconName;
  title: string;
  /** Secondary line, e.g. owner and date. */
  meta?: ReactNode;
}

/** Compact two-line row for search results and simple lists. */
export function ResultRow({ icon, title, meta }: ResultRowProps) {
  return (
    <div className={styles.row}>
      <Icon name={icon} size="sm" className={styles.icon} />
      <div className={styles.text}>
        <p className={styles.title}>{title}</p>
        {meta && <p className={styles.meta}>{meta}</p>}
      </div>
    </div>
  );
}
