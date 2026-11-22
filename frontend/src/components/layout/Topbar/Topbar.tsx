import type { ReactNode } from 'react';

import { IconButton } from '@/components/ui/IconButton';

import styles from './Topbar.module.css';

export interface TopbarProps {
  /** Opens the mobile navigation drawer. */
  onMenuClick: () => void;
  menuExpanded: boolean;
  /** Center slot, e.g. the universal search box. */
  center?: ReactNode;
  /** Right-aligned actions, e.g. notifications and the user menu. */
  actions?: ReactNode;
}

export function Topbar({ onMenuClick, menuExpanded, center, actions }: TopbarProps) {
  return (
    <header className={styles.topbar}>
      <IconButton
        className={styles.menuButton}
        icon="menu"
        label="Open navigation"
        aria-expanded={menuExpanded}
        onClick={onMenuClick}
      />
      <div className={styles.center}>{center}</div>
      <div className={styles.actions}>{actions}</div>
    </header>
  );
}
