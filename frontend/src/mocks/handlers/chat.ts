import { delay, http, HttpResponse } from 'msw';

import {
  CHANNEL_NAME_MAX_LENGTH,
  MESSAGE_MAX_LENGTH,
  channelResource,
  chatTopics,
  type CreateChannelRequest,
  type MessageSearchHit,
  type MessagesPage,
  type PostMessageRequest,
} from '@/features/chat';
import { checkPermission } from '@/lib/permissions';

import { canRead, chatStore, isListedFor, subjectOf, toChannel } from '../chatStore';
import { mockDb } from '../db';
import { apiUrl, errorResponse } from '../utils';
import { mockRealtime } from './realtime';

const CHANNEL_NAME_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

function forbidden() {
  return errorResponse(403, 'forbidden', "You don't have access to this conversation.");
}

function notFound() {
  return errorResponse(404, 'not_found', 'Conversation not found.');
}

function channelLabel(id: string, userId: string): string {
  const channel = chatStore.findChannel(id);
  if (!channel) return 'Unknown';
  if (channel.kind === 'channel') return `#${channel.name}`;
  return channel.memberIds
    .filter((memberId) => memberId !== userId)
    .map((memberId) => mockDb.findUser(memberId)?.name ?? 'Unknown')
    .join(', ');
}

export const chatHandlers = [
  http.get(apiUrl('/chat/channels'), async () => {
    await delay();
    return HttpResponse.json(chatStore.listChannels(mockDb.currentUser()));
  }),

  http.get(apiUrl('/chat/channels/:channelId'), async ({ params }) => {
    const user = mockDb.currentUser();
    const channel = chatStore.findChannel(String(params.channelId));
    if (!channel) return notFound();
    if (!canRead(channel, user)) return forbidden();
    await delay();
    return HttpResponse.json(toChannel(channel, user));
  }),

  http.post(apiUrl('/chat/channels'), async ({ request }) => {
    const user = mockDb.currentUser();
    if (!checkPermission(subjectOf(user), 'chat:create-channel')) return forbidden();

    const body = (await request.json()) as Partial<CreateChannelRequest> | null;
    const name = body?.name?.trim().toLowerCase() ?? '';
    if (!name || name.length > CHANNEL_NAME_MAX_LENGTH || !CHANNEL_NAME_PATTERN.test(name)) {
      return errorResponse(400, 'invalid_name', 'Use lowercase letters, numbers and dashes.');
    }
    if (chatStore.channelNameTaken(name)) {
      return errorResponse(409, 'name_taken', `A channel named "${name}" already exists.`);
    }

    const visibility = body?.visibility === 'private' ? 'private' : 'public';
    const topic = body?.topic?.trim();
    const record = chatStore.createChannel({
      kind: 'channel',
      name,
      ...(topic ? { topic } : {}),
      visibility,
      memberIds: [user.id],
      createdBy: user.id,
    });

    // Tell everyone else who can see it, so it appears in their sidebar.
    for (const other of mockDb.users) {
      if (other.id !== user.id && isListedFor(record, other)) {
        mockRealtime.broadcast(
          chatTopics.inbox(other.id),
          'chat.channel.created',
          toChannel(record, other),
        );
      }
    }

    await delay();
    return HttpResponse.json(toChannel(record, user), { status: 201 });
  }),

  http.post(apiUrl('/chat/channels/:channelId/read'), ({ params }) => {
    const user = mockDb.currentUser();
    const channel = chatStore.findChannel(String(params.channelId));
    if (!channel) return notFound();
    chatStore.markRead(user.id, channel.id);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(apiUrl('/chat/channels/:channelId/messages'), async ({ params, request }) => {
    const user = mockDb.currentUser();
    const channel = chatStore.findChannel(String(params.channelId));
    if (!channel) return notFound();
    if (!canRead(channel, user)) return forbidden();

    const url = new URL(request.url);
    const cursor = url.searchParams.get('cursor');
    const limit = Math.min(Number(url.searchParams.get('limit') ?? 30) || 30, 100);

    const all = chatStore.messagesNewestFirst(channel.id);
    const start = cursor ? all.findIndex((m) => m.id === cursor) + 1 : 0;
    const items = all.slice(start, start + limit);
    const last = items.at(-1);
    const hasMore = start + limit < all.length;
    const page: MessagesPage = { items, nextCursor: hasMore && last ? last.id : null };

    await delay();
    return HttpResponse.json(page);
  }),

  http.post(apiUrl('/chat/channels/:channelId/messages'), async ({ params, request }) => {
    const user = mockDb.currentUser();
    const channel = chatStore.findChannel(String(params.channelId));
    if (!channel) return notFound();
    if (!checkPermission(subjectOf(user), 'chat:post', channelResource(channel))) {
      return forbidden();
    }

    const body = (await request.json()) as Partial<PostMessageRequest> | null;
    const text = body?.body?.trim() ?? '';
    if (!text) return errorResponse(400, 'empty_message', 'Message cannot be empty.');
    if (text.length > MESSAGE_MAX_LENGTH) {
      return errorResponse(400, 'message_too_long', 'Message is too long.');
    }

    await delay();
    const message = chatStore.addMessage({
      channelId: channel.id,
      authorId: user.id,
      body: text,
      ...(body?.clientId ? { clientId: body.clientId } : {}),
    });
    return HttpResponse.json(message, { status: 201 });
  }),

  http.delete(apiUrl('/chat/channels/:channelId/messages/:messageId'), async ({ params }) => {
    const user = mockDb.currentUser();
    const channelId = String(params.channelId);
    const message = chatStore.findMessage(channelId, String(params.messageId));
    if (!message) return notFound();
    if (!checkPermission(subjectOf(user), 'chat:delete-message', { ownerId: message.authorId })) {
      return forbidden();
    }
    await delay();
    chatStore.deleteMessage(channelId, message.id);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(apiUrl('/chat/search'), async ({ request }) => {
    const user = mockDb.currentUser();
    const url = new URL(request.url);
    const query = (url.searchParams.get('q') ?? '').trim().toLowerCase();
    const limit = Number(url.searchParams.get('limit') ?? 10) || 10;
    const matches = query
      ? chatStore.allMessages().filter((message) => {
          const channel = chatStore.findChannel(message.channelId);
          return (
            channel !== undefined &&
            isListedFor(channel, user) &&
            canRead(channel, user) &&
            message.body.toLowerCase().includes(query)
          );
        })
      : [];
    const hits: MessageSearchHit[] = matches
      .slice(-limit)
      .reverse()
      .map((message) => ({
        message,
        channelId: message.channelId,
        channelLabel: channelLabel(message.channelId, user.id),
      }));
    await delay();
    return HttpResponse.json({ hits, total: matches.length });
  }),
];

/**
 * Dev only: other "people" occasionally post in #general so real-time
 * updates and unread badges can be seen without a second browser.
 */
export function startChatSimulation(intervalMs = 30_000): () => void {
  const lines = [
    'Quick update: the deploy finished successfully ✅',
    'Does anyone have the link to the design spec?',
    'Heads up, the 3pm sync is moved to 3:30.',
    'Just shared the meeting notes in the wiki.',
  ];
  let index = 0;
  const timer = setInterval(() => {
    const authors = ['u_grace', 'u_alan', 'u_katherine'];
    const authorId = authors[index % authors.length] ?? 'u_grace';
    chatStore.addMessage({
      channelId: index % 2 === 0 ? 'c_general' : 'c_random',
      authorId,
      body: lines[index % lines.length] ?? 'Hello!',
    });
    index += 1;
  }, intervalMs);
  return () => {
    clearInterval(timer);
  };
}
