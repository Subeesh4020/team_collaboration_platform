import { useQueryClient } from '@tanstack/react-query';

import { useRealtimeSubscription } from '@/lib/realtime';

import { chatKeys } from '../api/chatKeys';
import { removeMessage, upsertMessage, type MessagesCache } from '../api/messageCache';
import { chatTopics } from '../realtimeTopics';
import type { ChannelId } from '../types';

/** Keeps the open channel's message cache in sync with real-time events. */
export function useChannelMessagesSubscription(channelId: ChannelId) {
  const queryClient = useQueryClient();
  const topic = chatTopics.channel(channelId);
  const key = chatKeys.messages(channelId);

  useRealtimeSubscription(topic, 'chat.message.created', (message) => {
    queryClient.setQueryData<MessagesCache>(key, (cache) => upsertMessage(cache, message));
  });

  useRealtimeSubscription(topic, 'chat.message.deleted', ({ messageId }) => {
    queryClient.setQueryData<MessagesCache>(key, (cache) => removeMessage(cache, messageId));
  });
}
