import { useId, type ReactNode } from 'react';

import styles from './ConversationSection.module.css';

export interface ConversationSectionProps {
  title: string;
  /** Header action, e.g. a "create" button. */
  action?: ReactNode;
  isEmpty: boolean;
  emptyText: string;
  /** `<li>` elements. */
  children: ReactNode;
}

export function ConversationSection({
  title,
  action,
  isEmpty,
  emptyText,
  children,
}: ConversationSectionProps) {
  const headingId = useId();
  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <div className={styles.header}>
        <h2 id={headingId} className={styles.heading}>
          {title}
        </h2>
        {action}
      </div>
      {isEmpty ? (
        <p className={styles.empty}>{emptyText}</p>
      ) : (
        <ul className={styles.list}>{children}</ul>
      )}
    </section>
  );
}
