import type { ReactNode } from 'react';

import { usePermission } from '../context';
import type { Permission } from '../permissions';
import type { PermissionResource } from '../policy';

export interface CanProps {
  permission: Permission;
  resource?: PermissionResource;
  /** Rendered when the permission is missing. Defaults to nothing. */
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Renders `children` only if the current user has `permission`.
 * Usability only: the server enforces the real rule.
 */
export function Can({ permission, resource, fallback = null, children }: CanProps) {
  const allowed = usePermission(permission, resource);
  return allowed ? children : fallback;
}
