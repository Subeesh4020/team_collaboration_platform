import type { Permission } from '@/lib/permissions';

export const settingsPermissions = {
  view: 'settings:view',
} as const satisfies Record<string, Permission>;
