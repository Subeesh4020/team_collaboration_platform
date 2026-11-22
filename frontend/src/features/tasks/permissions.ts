import type { Permission, PermissionResource } from '@/lib/permissions';

import type { Task } from './types';

export const tasksPermissions = {
  view: 'tasks:view',
  create: 'tasks:create',
  edit: 'tasks:edit',
  assign: 'tasks:assign',
} as const satisfies Record<string, Permission>;

export function taskResource(task: Pick<Task, 'reporterId' | 'memberIds'>): PermissionResource {
  return { ownerId: task.reporterId, memberIds: task.memberIds, visibility: 'private' };
}
