import { createContext, useContext, useMemo } from 'react';

import type { Permission } from './permissions';
import { createCan, type CanFn, type PermissionResource, type PermissionSubject } from './policy';

export const PermissionContext = createContext<PermissionSubject | null>(null);

/** Returns the current subject (id + role), or null when signed out. */
export function usePermissionSubject(): PermissionSubject | null {
  return useContext(PermissionContext);
}

/** Returns `can(permission, resource?)` bound to the current user. */
export function useCan(): CanFn {
  const subject = usePermissionSubject();
  return useMemo(() => createCan(subject), [subject]);
}

/** Returns whether the current user has `permission` (optionally for a resource). */
export function usePermission(permission: Permission, resource?: PermissionResource): boolean {
  const can = useCan();
  return can(permission, resource);
}
