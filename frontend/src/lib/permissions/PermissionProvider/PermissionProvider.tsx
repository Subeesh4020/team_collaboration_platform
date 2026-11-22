import { useMemo, type ReactNode } from 'react';

import { PermissionContext } from '../context';
import type { PermissionSubject } from '../policy';

export interface PermissionProviderProps {
  /** The signed-in user, or null. Supplied by the app from the auth session. */
  subject: PermissionSubject | null;
  children: ReactNode;
}

export function PermissionProvider({ subject, children }: PermissionProviderProps) {
  const id = subject?.id;
  const role = subject?.role;
  // Keep the context value stable unless id or role actually change.
  const value = useMemo(() => (id && role ? { id, role } : null), [id, role]);
  return <PermissionContext value={value}>{children}</PermissionContext>;
}
