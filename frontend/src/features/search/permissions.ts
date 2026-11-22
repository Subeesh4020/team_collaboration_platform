import type { Permission } from '@/lib/permissions';

export const searchPermissions = {
  use: 'search:use',
} as const satisfies Record<string, Permission>;
