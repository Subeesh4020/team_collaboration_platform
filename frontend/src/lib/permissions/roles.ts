import type { Role } from '@/types';

import { PERMISSIONS, type Permission } from './permissions';

/**
 * How far a granted permission reaches:
 * - `any`:     every resource of that kind
 * - `member`:  public resources, plus private ones the user is a member of
 * - `invited`: only resources the user was explicitly added to (or owns)
 * - `own`:     only resources the user owns
 */
export type PermissionScope = 'any' | 'member' | 'invited' | 'own';

export type RolePermissions = Partial<Record<Permission, PermissionScope>>;

function grantAll(scope: PermissionScope, except: readonly Permission[] = []): RolePermissions {
  return Object.fromEntries(PERMISSIONS.filter((p) => !except.includes(p)).map((p) => [p, scope]));
}

/** Role → permission matrix. A missing entry means "not allowed". */
export const ROLE_PERMISSIONS: Readonly<Record<Role, RolePermissions>> = {
  owner: grantAll('any'),

  admin: grantAll('any', ['workspace:manage']),

  member: {
    'chat:read': 'member',
    'chat:post': 'member',
    'chat:create-channel': 'any',
    'chat:manage-channel': 'own',
    'chat:delete-message': 'own',
    'chat:direct-message': 'any',

    'meetings:join': 'member',
    'meetings:create': 'any',
    'meetings:record': 'any',

    'files:view': 'member',
    'files:upload': 'any',
    'files:edit': 'member',
    'files:delete': 'own',
    'files:share': 'own',

    'documents:view': 'member',
    'documents:edit': 'member',

    'tasks:view': 'member',
    'tasks:create': 'any',
    'tasks:edit': 'member',
    'tasks:assign': 'any',

    'wiki:view': 'any',
    'wiki:edit': 'any',

    'search:use': 'any',
    'integrations:view': 'any',
    'members:view': 'any',
    'notifications:view': 'any',
    'settings:view': 'any',
  },

  // Guests only see channels, files and meetings they are invited to.
  guest: {
    'chat:read': 'invited',
    'chat:post': 'invited',

    'meetings:join': 'invited',

    'files:view': 'invited',
    'files:upload': 'invited',

    'documents:view': 'invited',
    'tasks:view': 'invited',

    'search:use': 'any',
    'notifications:view': 'any',
    'settings:view': 'any',
  },
};
