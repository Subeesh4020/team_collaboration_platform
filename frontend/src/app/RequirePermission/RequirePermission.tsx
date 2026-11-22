import type { ReactNode } from 'react';

import { useCan, type Permission } from '@/lib/permissions';
import { ForbiddenPage } from '@/pages/ForbiddenPage';

export interface RequirePermissionProps {
  permission?: Permission | undefined;
  children: ReactNode;
}

/**
 * Route guard. Renders the forbidden page in place (keeping the URL) when
 * the user lacks `permission`. Usability only: the API still enforces access.
 */
export function RequirePermission({ permission, children }: RequirePermissionProps) {
  const can = useCan();
  if (permission && !can(permission)) return <ForbiddenPage />;
  return children;
}
