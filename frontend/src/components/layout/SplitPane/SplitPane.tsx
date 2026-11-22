import type { ReactNode } from 'react';

import styles from './SplitPane.module.css';

export interface SplitPaneProps {
  /** The list side (e.g. channels). */
  primary: ReactNode;
  /** The detail side (e.g. the open conversation). */
  secondary: ReactNode;
  primaryLabel: string;
  secondaryLabel: string;
  /**
   * Mobile only: which pane is visible. On tablet and desktop (≥768px)
   * both panes are always shown.
   */
  mobileView: 'primary' | 'secondary';
}

export function SplitPane({
  primary,
  secondary,
  primaryLabel,
  secondaryLabel,
  mobileView,
}: SplitPaneProps) {
  return (
    <div className={styles.split} data-mobile-view={mobileView}>
      <section className={styles.primary} aria-label={primaryLabel}>
        {primary}
      </section>
      <section className={styles.secondary} aria-label={secondaryLabel}>
        {secondary}
      </section>
    </div>
  );
}
