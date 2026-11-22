import type { Permission, PermissionResource } from '@/lib/permissions';

import type { Meeting } from './types';

export const meetingsPermissions = {
  join: 'meetings:join',
  create: 'meetings:create',
  record: 'meetings:record',
} as const satisfies Record<string, Permission>;

export function meetingResource(
  meeting: Pick<Meeting, 'hostId' | 'participantIds'>,
): PermissionResource {
  return { ownerId: meeting.hostId, memberIds: meeting.participantIds, visibility: 'private' };
}
