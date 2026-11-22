import type { ReactNode } from 'react';

import styles from './PageContainer.module.css';

export interface PageContainerProps {
  title: string;
  description?: ReactNode;
  /** Right-aligned header actions. */
  actions?: ReactNode;
  children: ReactNode;
}

/** Standard padded page with a heading. Full-bleed pages (e.g. chat) skip it. */
export function PageContainer({ title, description, actions, children }: PageContainerProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <h1>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </header>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
