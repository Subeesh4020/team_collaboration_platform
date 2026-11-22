import type { Permission, PermissionResource } from '@/lib/permissions';

import type { Channel } from './types';

export const chatPermissions = {
  read: 'chat:read',
  post: 'chat:post',
  createChannel: 'chat:create-channel',
  manageChannel: 'chat:manage-channel',
  deleteMessage: 'chat:delete-message',
  directMessage: 'chat:direct-message',
} as const satisfies Record<string, Permission>;

/** Facts about a channel for scoped permission checks. */
export function channelResource(
  channel: Pick<Channel, 'createdBy' | 'memberIds' | 'visibility'>,
): PermissionResource {
  return {
    ownerId: channel.createdBy,
    memberIds: channel.memberIds,
    visibility: channel.visibility,
  };
}
