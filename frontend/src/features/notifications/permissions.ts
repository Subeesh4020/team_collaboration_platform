import type { Permission } from '@/lib/permissions';

export const notificationsPermissions = {
  view: 'notifications:view',
} as const satisfies Record<string, Permission>;
