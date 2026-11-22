import type { Permission } from '@/lib/permissions';

export const wikiPermissions = {
  view: 'wiki:view',
  edit: 'wiki:edit',
  publish: 'wiki:publish',
} as const satisfies Record<string, Permission>;
