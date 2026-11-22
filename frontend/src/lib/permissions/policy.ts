/*
 * SECURITY NOTE: UI permission checks exist ONLY for usability: hiding or
 * disabling things the user cannot do. They are not a security boundary.
 * Anyone can modify the client. The server MUST enforce every permission on
 * every request, and the UI must handle 403 responses gracefully.
 */
import type { Role, UserId } from '@/types';

import type { Permission } from './permissions';
import { ROLE_PERMISSIONS, type PermissionScope } from './roles';

/** The user a permission is checked for. `null` means signed out. */
export interface PermissionSubject {
  id: UserId;
  role: Role;
}

/** Optional facts about the resource being acted on. */
export interface PermissionResource {
  ownerId?: UserId | undefined;
  memberIds?: readonly UserId[] | undefined;
  /** Defaults to `public` when omitted. */
  visibility?: 'public' | 'private' | undefined;
}

export type CanFn = (permission: Permission, resource?: PermissionResource) => boolean;

function scopeAllows(
  scope: PermissionScope,
  subject: PermissionSubject,
  resource: PermissionResource,
): boolean {
  const isOwner = resource.ownerId !== undefined && resource.ownerId === subject.id;
  const isMember = resource.memberIds?.includes(subject.id) ?? false;

  switch (scope) {
    case 'any':
      return true;
    case 'own':
      return isOwner;
    case 'invited':
      return isOwner || isMember;
    case 'member':
      return isOwner || isMember || resource.visibility !== 'private';
  }
}

/**
 * Checks whether `subject` may perform `permission`.
 *
 * Without a `resource`, this answers "does the role have this capability at
 * all?" (e.g. whether to show a "Delete" menu item). With a resource, the
 * scope (own / invited / member / any) is applied to it.
 */
export function checkPermission(
  subject: PermissionSubject | null,
  permission: Permission,
  resource?: PermissionResource,
): boolean {
  if (!subject) return false;
  const scope = ROLE_PERMISSIONS[subject.role][permission];
  if (!scope) return false;
  if (!resource) return true;
  return scopeAllows(scope, subject, resource);
}

/** Returns a `can(permission, resource?)` function bound to one subject. */
export function createCan(subject: PermissionSubject | null): CanFn {
  return (permission, resource) => checkPermission(subject, permission, resource);
}
