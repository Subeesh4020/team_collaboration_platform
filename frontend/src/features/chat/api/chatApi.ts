import { apiClient } from '@/lib/api';

import type {
  Channel,
  ChannelId,
  CreateChannelRequest,
  Message,
  MessageId,
  MessageSearchHit,
  MessagesPage,
  PostMessageRequest,
} from '../types';

const enc = encodeURIComponent;

export const MESSAGES_PAGE_SIZE = 30;

export function fetchChannels(signal?: AbortSignal): Promise<Channel[]> {
  return apiClient.get<Channel[]>('/chat/channels', { signal });
}

export function fetchChannel(channelId: ChannelId, signal?: AbortSignal): Promise<Channel> {
  return apiClient.get<Channel>(`/chat/channels/${enc(channelId)}`, { signal });
}

export function fetchMessages(
  channelId: ChannelId,
  cursor: string | null,
  signal?: AbortSignal,
): Promise<MessagesPage> {
  return apiClient.get<MessagesPage>(`/chat/channels/${enc(channelId)}/messages`, {
    signal,
    query: { cursor, limit: MESSAGES_PAGE_SIZE },
  });
}

export function postMessage(channelId: ChannelId, body: PostMessageRequest): Promise<Message> {
  return apiClient.post<Message>(`/chat/channels/${enc(channelId)}/messages`, body);
}

export function deleteMessage(channelId: ChannelId, messageId: MessageId): Promise<void> {
  return apiClient.delete<undefined>(`/chat/channels/${enc(channelId)}/messages/${enc(messageId)}`);
}

export function createChannel(body: CreateChannelRequest): Promise<Channel> {
  return apiClient.post<Channel>('/chat/channels', body);
}

export function markChannelRead(channelId: ChannelId): Promise<void> {
  return apiClient.post<undefined>(`/chat/channels/${enc(channelId)}/read`);
}

export function searchMessages(
  query: string,
  limit: number,
  signal?: AbortSignal,
): Promise<{ hits: MessageSearchHit[]; total: number }> {
  return apiClient.get('/chat/search', { signal, query: { q: query, limit } });
}
