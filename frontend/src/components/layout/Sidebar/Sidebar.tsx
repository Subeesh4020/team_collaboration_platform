import type { ReactNode } from 'react';
import { NavLink } from 'react-router';

import { Icon, type IconName } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';

import styles from './Sidebar.module.css';

export interface SidebarNavItem {
  id: string;
  to: string;
  label: string;
  icon: IconName;
  /** Optional count, e.g. unread messages. */
  badge?: number;
}

export interface SidebarProps {
  /** Workspace name or logo shown at the top. */
  header: ReactNode;
  items: readonly SidebarNavItem[];
  footer?: ReactNode;
  /** Mobile only: shows a close button in the header. */
  onClose?: () => void;
}

export function Sidebar({ header, items, footer, onClose }: SidebarProps) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.headerContent}>{header}</div>
        {onClose && (
          <IconButton
            className={styles.closeButton}
            icon="close"
            label="Close navigation"
            variant="onDark"
            onClick={onClose}
          />
        )}
      </div>
      <nav className={styles.nav} aria-label="Primary">
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
              >
                <Icon name={item.icon} size="sm" />
                <span className={styles.label}>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={styles.badge} aria-label={`${item.badge} unread`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
