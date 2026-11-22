import type { Permission, PermissionResource } from '@/lib/permissions';

import type { DocumentSummary } from './types';

export const documentsPermissions = {
  view: 'documents:view',
  edit: 'documents:edit',
} as const satisfies Record<string, Permission>;

export function documentResource(
  doc: Pick<DocumentSummary, 'ownerId' | 'collaboratorIds'>,
): PermissionResource {
  return { ownerId: doc.ownerId, memberIds: doc.collaboratorIds, visibility: 'private' };
}
