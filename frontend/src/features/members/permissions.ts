import type { Permission } from '@/lib/permissions';

export const membersPermissions = {
  view: 'members:view',
  invite: 'members:invite',
  manageRoles: 'members:manage-roles',
} as const satisfies Record<string, Permission>;
