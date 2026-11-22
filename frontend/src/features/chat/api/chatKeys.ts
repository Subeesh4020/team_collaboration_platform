import type { ChannelId } from '../types';

export const chatKeys = {
  all: ['chat'] as const,
  channels: () => [...chatKeys.all, 'channels'] as const,
  channel: (channelId: ChannelId) => [...chatKeys.all, 'channel', channelId] as const,
  messages: (channelId: ChannelId) => [...chatKeys.all, 'messages', channelId] as const,
  search: (query: string) => [...chatKeys.all, 'search', query] as const,
};
