import type { Permission } from '@/lib/permissions';

export const workspacePermissions = {
  manage: 'workspace:manage',
} as const satisfies Record<string, Permission>;
