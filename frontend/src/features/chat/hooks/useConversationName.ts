import { useCurrentUser } from '@/features/auth';
import { useMemberMap, type Member } from '@/features/members';
import type { UserId } from '@/types';

import type { Channel } from '../types';

/** Display name: "#name" for channels, participant names for DMs and groups. */
export function getConversationName(
  channel: Pick<Channel, 'kind' | 'name' | 'memberIds'>,
  members: ReadonlyMap<UserId, Member>,
  currentUserId: UserId,
): string {
  if (channel.kind === 'channel') return channel.name;
  const others = channel.memberIds.filter((id) => id !== currentUserId);
  const names = others.map((id) => members.get(id)?.name ?? 'Unknown user');
  return names.length > 0 ? names.join(', ') : 'Just you';
}

/** The other participant of a DM, if any. */
export function getDmPartner(
  channel: Pick<Channel, 'kind' | 'memberIds'>,
  members: ReadonlyMap<UserId, Member>,
  currentUserId: UserId,
): Member | undefined {
  if (channel.kind !== 'dm') return undefined;
  const otherId = channel.memberIds.find((id) => id !== currentUserId);
  return otherId ? members.get(otherId) : undefined;
}

export function useConversationNamer() {
  const members = useMemberMap();
  const user = useCurrentUser();
  return {
    members,
    currentUserId: user.id,
    nameOf: (channel: Pick<Channel, 'kind' | 'name' | 'memberIds'>) =>
      getConversationName(channel, members, user.id),
  };
}
