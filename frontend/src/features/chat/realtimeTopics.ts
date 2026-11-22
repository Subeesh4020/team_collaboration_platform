import type { UserId } from '@/types';

import type { ChannelId } from './types';

/** Real-time topic names, shared by the client hooks and the mock server. */
export const chatTopics = {
  channel: (channelId: ChannelId) => `chat:channel:${channelId}`,
  inbox: (userId: UserId) => `chat:inbox:${userId}`,
};
