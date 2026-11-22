import type { Permission, PermissionResource } from '@/lib/permissions';

import type { FileItem } from './types';

export const filesPermissions = {
  view: 'files:view',
  upload: 'files:upload',
  edit: 'files:edit',
  delete: 'files:delete',
  share: 'files:share',
} as const satisfies Record<string, Permission>;

export function fileResource(
  file: Pick<FileItem, 'ownerId' | 'sharedWithIds'>,
): PermissionResource {
  return { ownerId: file.ownerId, memberIds: file.sharedWithIds, visibility: 'private' };
}
