import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query';

import { createClientId } from '@/lib/utils';
import type { UserId } from '@/types';

import type { Channel, ChannelId, ChatMessage, CreateChannelRequest, MessageId } from '../types';
import {
  createChannel,
  deleteMessage,
  fetchChannel,
  fetchChannels,
  fetchMessages,
  markChannelRead,
  postMessage,
} from './chatApi';
import { chatKeys } from './chatKeys';
import {
  flattenMessages,
  removeMessage,
  updateMessage,
  upsertMessage,
  type MessagesCache,
} from './messageCache';

/* ---------------- Channels ---------------- */

export function useChannelsQuery() {
  return useQuery({
    queryKey: chatKeys.channels(),
    queryFn: ({ signal }) => fetchChannels(signal),
  });
}

/** A single channel; seeded from the channel list when it's already loaded. */
export function useChannelQuery(channelId: ChannelId) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: chatKeys.channel(channelId),
    queryFn: ({ signal }) => fetchChannel(channelId, signal),
    initialData: () =>
      queryClient
        .getQueryData<Channel[]>(chatKeys.channels())
        ?.find((channel) => channel.id === channelId),
    initialDataUpdatedAt: () => queryClient.getQueryState(chatKeys.channels())?.dataUpdatedAt,
  });
}

export function setChannelUnread(queryClient: QueryClient, channelId: ChannelId, count: number) {
  const apply = (channel: Channel) =>
    channel.id === channelId ? { ...channel, unreadCount: count } : channel;
  queryClient.setQueryData<Channel[]>(chatKeys.channels(), (channels) => channels?.map(apply));
}

export function useMarkChannelReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markChannelRead,
    onMutate: (channelId) => {
      setChannelUnread(queryClient, channelId, 0);
    },
  });
}

export function useCreateChannelMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateChannelRequest) => createChannel(request),
    onSuccess: (channel) => {
      queryClient.setQueryData<Channel[]>(chatKeys.channels(), (channels) =>
        channels && !channels.some((c) => c.id === channel.id) ? [...channels, channel] : channels,
      );
      queryClient.setQueryData(chatKeys.channel(channel.id), channel);
    },
  });
}

/* ---------------- Messages ---------------- */

export function useMessagesQuery(channelId: ChannelId) {
  return useInfiniteQuery({
    queryKey: chatKeys.messages(channelId),
    queryFn: ({ pageParam, signal }) => fetchMessages(channelId, pageParam, signal),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    select: flattenMessages,
    staleTime: Number.POSITIVE_INFINITY, // kept fresh by real-time events
  });
}

export interface SendMessageVariables {
  body: string;
  authorId: UserId;
  /** Reuse to retry a failed message. */
  clientId?: string;
}

export function useSendMessageMutation(channelId: ChannelId) {
  const queryClient = useQueryClient();
  const key = chatKeys.messages(channelId);

  return useMutation({
    mutationFn: ({ body, clientId }: SendMessageVariables & { clientId: string }) =>
      postMessage(channelId, { body, clientId }),
    onMutate: async ({ body, authorId, clientId }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const optimistic: ChatMessage = {
        id: `pending:${clientId}`,
        clientId,
        channelId,
        authorId,
        body,
        createdAt: new Date().toISOString(),
        status: 'pending',
      };
      queryClient.setQueryData<MessagesCache>(key, (cache) => upsertMessage(cache, optimistic));
    },
    onSuccess: (message) => {
      queryClient.setQueryData<MessagesCache>(key, (cache) => upsertMessage(cache, message));
    },
    onError: (_error, { clientId }) => {
      queryClient.setQueryData<MessagesCache>(key, (cache) =>
        updateMessage(
          cache,
          (m) => m.clientId === clientId,
          (m) => ({ ...m, status: 'failed' }),
        ),
      );
    },
  });
}

/** Convenience wrapper that generates the clientId for new messages. */
export function useSendMessage(channelId: ChannelId) {
  const mutation = useSendMessageMutation(channelId);
  return {
    ...mutation,
    send: (variables: SendMessageVariables) => {
      mutation.mutate({ ...variables, clientId: variables.clientId ?? createClientId('msg') });
    },
  };
}

export function useDeleteMessageMutation(channelId: ChannelId) {
  const queryClient = useQueryClient();
  const key = chatKeys.messages(channelId);

  return useMutation({
    mutationFn: (messageId: MessageId) => deleteMessage(channelId, messageId),
    onMutate: async (messageId) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<MessagesCache>(key);
      queryClient.setQueryData<MessagesCache>(key, (cache) => removeMessage(cache, messageId));
      return { previous };
    },
    onError: (_error, _messageId, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },
  });
}

/** Removes a failed optimistic message the user chose to discard. */
export function discardFailedMessage(
  queryClient: QueryClient,
  channelId: ChannelId,
  clientId: string,
) {
  queryClient.setQueryData<MessagesCache>(chatKeys.messages(channelId), (cache) =>
    cache
      ? {
          ...cache,
          pages: cache.pages.map((page) => ({
            ...page,
            items: page.items.filter((m: ChatMessage) => m.clientId !== clientId),
          })),
        }
      : cache,
  );
}
