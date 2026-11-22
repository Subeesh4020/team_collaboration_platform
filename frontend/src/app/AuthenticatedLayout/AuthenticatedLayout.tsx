import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';

import { AppShell } from '@/components/layout/AppShell';
import { Sidebar, type SidebarNavItem } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { isFeatureEnabled } from '@/config/featureFlags';
import { UserMenu, useSessionQuery } from '@/features/auth';
import { SearchBox, searchPermissions } from '@/features/search';
import { Can, PermissionProvider, useCan } from '@/lib/permissions';
import { useRealtimeClient } from '@/lib/realtime';

import { appRoutes } from '../routeRegistry';
import styles from './AuthenticatedLayout.module.css';

function useNavItems(): SidebarNavItem[] {
  const can = useCan();
  return appRoutes
    .filter((route) => route.showInNav)
    .filter((route) => !route.flag || isFeatureEnabled(route.flag))
    .filter((route) => !route.permission || can(route.permission))
    .map((route) => ({ id: route.id, to: route.path, label: route.label, icon: route.icon }));
}

function ShellContent({ workspaceName }: { workspaceName: string }) {
  const { pathname } = useLocation();
  // The drawer remembers the path it was opened on, so navigating closes it.
  const [openedOnPath, setOpenedOnPath] = useState<string | null>(null);
  const sidebarOpen = openedOnPath === pathname;
  const navItems = useNavItems();

  const setSidebarOpen = useCallback(
    (open: boolean) => {
      setOpenedOnPath(open ? pathname : null);
    },
    [pathname],
  );
  const closeSidebar = useCallback(() => {
    setOpenedOnPath(null);
  }, []);

  return (
    <AppShell
      sidebarOpen={sidebarOpen}
      onSidebarOpenChange={setSidebarOpen}
      sidebar={<Sidebar header={workspaceName} items={navItems} onClose={closeSidebar} />}
      topbar={
        <Topbar
          menuExpanded={sidebarOpen}
          onMenuClick={() => {
            setSidebarOpen(true);
          }}
          center={
            isFeatureEnabled('search') && (
              <Can permission={searchPermissions.use}>
                <SearchBox />
              </Can>
            )
          }
          actions={<UserMenu />}
        />
      }
    >
      <Outlet />
    </AppShell>
  );
}

/** Root route: loads the session, then provides permissions and real-time. */
export function AuthenticatedLayout() {
  const session = useSessionQuery();
  const realtime = useRealtimeClient();
  const isReady = session.isSuccess;

  useEffect(() => {
    if (!isReady) return;
    realtime.connect();
    return () => {
      realtime.disconnect();
    };
  }, [isReady, realtime]);

  if (session.isPending) {
    return (
      <div className={styles.fullPage}>
        <Spinner label="Loading workspace" />
      </div>
    );
  }

  if (session.isError) {
    return (
      <div className={styles.fullPage} role="alert">
        <h1 className={styles.errorTitle}>Couldn&apos;t load your workspace</h1>
        <p className={styles.errorMessage}>{session.error.message}</p>
        <Button variant="primary" onClick={() => void session.refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const { user, workspace } = session.data;
  return (
    <PermissionProvider subject={{ id: user.id, role: user.role }}>
      <ShellContent workspaceName={workspace.name} />
    </PermissionProvider>
  );
}
