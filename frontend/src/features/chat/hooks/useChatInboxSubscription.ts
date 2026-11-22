import { useQueryClient } from '@tanstack/react-query';

import { useCurrentUser } from '@/features/auth';
import { useRealtimeSubscription } from '@/lib/realtime';

import { chatKeys } from '../api/chatKeys';
import { chatTopics } from '../realtimeTopics';
import type { Channel, ChannelId } from '../types';

/**
 * Listens to the current user's inbox topic: bumps unread counts for
 * channels other than the open one, and adds channels the user joins.
 */
export function useChatInboxSubscription(activeChannelId: ChannelId | undefined) {
  const queryClient = useQueryClient();
  const user = useCurrentUser();
  const topic = chatTopics.inbox(user.id);

  useRealtimeSubscription(topic, 'chat.channel.activity', (event) => {
    queryClient.setQueryData<Channel[]>(chatKeys.channels(), (channels) =>
      channels?.map((channel) => {
        if (channel.id !== event.channelId) return channel;
        const isOpen = channel.id === activeChannelId;
        const isOwn = event.authorId === user.id;
        return {
          ...channel,
          lastMessageAt: event.lastMessageAt,
          unreadCount: isOpen || isOwn ? channel.unreadCount : channel.unreadCount + 1,
        };
      }),
    );
  });

  useRealtimeSubscription(topic, 'chat.channel.created', (created) => {
    queryClient.setQueryData<Channel[]>(chatKeys.channels(), (channels) =>
      channels && !channels.some((c) => c.id === created.id) ? [...channels, created] : channels,
    );
  });
}
