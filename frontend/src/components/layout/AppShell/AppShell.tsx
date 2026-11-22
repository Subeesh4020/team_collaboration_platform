import { useEffect, type ReactNode } from 'react';

import styles from './AppShell.module.css';

const MAIN_CONTENT_ID = 'main-content';

export interface AppShellProps {
  sidebar: ReactNode;
  topbar: ReactNode;
  children: ReactNode;
  /** Mobile only: whether the off-canvas sidebar is open. */
  sidebarOpen: boolean;
  onSidebarOpenChange: (open: boolean) => void;
}

/**
 * Top-level layout: sidebar + topbar + main content.
 * Mobile: the sidebar is an off-canvas drawer. Desktop (≥1024px): always visible.
 */
export function AppShell({
  sidebar,
  topbar,
  children,
  sidebarOpen,
  onSidebarOpenChange,
}: AppShellProps) {
  useEffect(() => {
    if (!sidebarOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onSidebarOpenChange(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [sidebarOpen, onSidebarOpenChange]);

  return (
    <div className={styles.shell} data-sidebar-open={sidebarOpen || undefined}>
      <a className={styles.skipLink} href={`#${MAIN_CONTENT_ID}`}>
        Skip to main content
      </a>
      <div className={styles.sidebar}>{sidebar}</div>
      {sidebarOpen && (
        <button
          type="button"
          className={styles.overlay}
          tabIndex={-1}
          aria-label="Close navigation"
          onClick={() => {
            onSidebarOpenChange(false);
          }}
        />
      )}
      <div className={styles.topbar}>{topbar}</div>
      <main id={MAIN_CONTENT_ID} className={styles.main} tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
