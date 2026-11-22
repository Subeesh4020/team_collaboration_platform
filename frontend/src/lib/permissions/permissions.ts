/**
 * Every permission name in the app, as `<resource>:<action>`.
 *
 * Features list the subset they use in their own `permissions.ts`
 * (typed with `satisfies Record<string, Permission>`), but the canonical
 * list lives here so the role matrix can cover all of them.
 */
export const PERMISSIONS = [
  'chat:read',
  'chat:post',
  'chat:create-channel',
  'chat:manage-channel',
  'chat:delete-message',
  'chat:direct-message',

  'meetings:join',
  'meetings:create',
  'meetings:record',

  'files:view',
  'files:upload',
  'files:edit',
  'files:delete',
  'files:share',

  'documents:view',
  'documents:edit',

  'tasks:view',
  'tasks:create',
  'tasks:edit',
  'tasks:assign',

  'wiki:view',
  'wiki:edit',
  'wiki:publish',

  'search:use',

  'integrations:view',
  'integrations:manage',

  'members:view',
  'members:invite',
  'members:manage-roles',

  'notifications:view',
  'settings:view',
  'workspace:manage',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export function isPermission(value: unknown): value is Permission {
  return typeof value === 'string' && (PERMISSIONS as readonly string[]).includes(value);
}
