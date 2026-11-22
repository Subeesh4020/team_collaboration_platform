import type { ReactNode } from 'react';

import { Icon, type IconName } from '../Icon';
import styles from './EmptyState.module.css';

export interface EmptyStateProps {
  icon: IconName;
  title: string;
  description?: ReactNode;
  /** Actions such as buttons. */
  children?: ReactNode;
}

export function EmptyState({ icon, title, description, children }: EmptyStateProps) {
  return (
    <div className={styles.root}>
      <span className={styles.icon}>
        <Icon name={icon} />
      </span>
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
      {children && <div className={styles.actions}>{children}</div>}
    </div>
  );
}
