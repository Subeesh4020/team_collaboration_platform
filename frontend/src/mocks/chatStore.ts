/**
 * Mock chat "tables" and the server-side rules around them. Access checks
 * reuse the same policy as the UI (`checkPermission`), mimicking a backend
 * that enforces permissions on every request.
 */
import {
  channelResource,
  chatTopics,
  type Channel,
  type ChannelId,
  type Message,
} from '@/features/chat';
import { checkPermission, type PermissionSubject } from '@/lib/permissions';
import type { User, UserId } from '@/types';

import { mockDb } from './db';
import { createChannelFixtures, createMessageFixtures, type ChannelRecord } from './fixtures/chat';
import { mockRealtime } from './handlers/realtime';

function initialLastRead(channels: ChannelRecord[], messages: Message[]) {
  const lastRead = new Map<string, string>();
  for (const channel of channels) {
    const channelMessages = messages.filter((m) => m.channelId === channel.id);
    // Leave a few unread messages in some conversations for a realistic start.
    const unread = channel.id === 'c_random' ? 2 : channel.id === 'd_ada_grace' ? 1 : 0;
    const marker = channelMessages.at(-(unread + 1));
    for (const userId of mockDb.users.map((u) => u.id)) {
      if (marker) lastRead.set(`${userId}:${channel.id}`, marker.createdAt);
    }
  }
  return lastRead;
}

function createState() {
  const channels = createChannelFixtures();
  const messages = createMessageFixtures(channels);
  return { channels, messages, lastRead: initialLastRead(channels, messages), nextId: 10_000 };
}

let state = createState();
mockDb.onReset(() => {
  state = createState();
});

export function subjectOf(user: User): PermissionSubject {
  return { id: user.id, role: user.role };
}

/** Channels shown in a user's sidebar: ones they belong to, plus public channels for non-guests. */
export function isListedFor(channel: ChannelRecord, user: User): boolean {
  if (channel.memberIds.includes(user.id)) return true;
  return channel.kind === 'channel' && channel.visibility === 'public' && user.role !== 'guest';
}

export function canRead(channel: ChannelRecord, user: User): boolean {
  return checkPermission(subjectOf(user), 'chat:read', channelResource(channel));
}

export function toChannel(record: ChannelRecord, user: User): Channel {
  const channelMessages = state.messages.filter((m) => m.channelId === record.id);
  const lastRead = state.lastRead.get(`${user.id}:${record.id}`) ?? '';
  const unreadCount = channelMessages.filter(
    (m) => m.authorId !== user.id && m.createdAt > lastRead,
  ).length;
  return { ...record, unreadCount, lastMessageAt: channelMessages.at(-1)?.createdAt ?? null };
}

export const chatStore = {
  findChannel(id: ChannelId): ChannelRecord | undefined {
    return state.channels.find((c) => c.id === id);
  },

  listChannels(user: User): Channel[] {
    return state.channels.filter((c) => isListedFor(c, user)).map((c) => toChannel(c, user));
  },

  channelNameTaken(name: string): boolean {
    return state.channels.some((c) => c.kind === 'channel' && c.name === name);
  },

  createChannel(record: Omit<ChannelRecord, 'id' | 'createdAt'>): ChannelRecord {
    const channel: ChannelRecord = {
      ...record,
      id: `c_${(state.nextId++).toString()}`,
      createdAt: new Date().toISOString(),
    };
    state.channels.push(channel);
    return channel;
  },

  /** Messages newest first. */
  messagesNewestFirst(channelId: ChannelId): Message[] {
    return state.messages.filter((m) => m.channelId === channelId).reverse();
  },

  addMessage(input: Omit<Message, 'id' | 'createdAt'>): Message {
    const message: Message = {
      ...input,
      id: `m_${(state.nextId++).toString()}`,
      createdAt: new Date().toISOString(),
    };
    state.messages.push(message);
    state.lastRead.set(`${message.authorId}:${message.channelId}`, message.createdAt);
    publishMessageCreated(message);
    return message;
  },

  findMessage(channelId: ChannelId, messageId: string): Message | undefined {
    return state.messages.find((m) => m.channelId === channelId && m.id === messageId);
  },

  deleteMessage(channelId: ChannelId, messageId: string): void {
    state.messages = state.messages.filter((m) => m.id !== messageId);
    mockRealtime.broadcast(chatTopics.channel(channelId), 'chat.message.deleted', {
      channelId,
      messageId,
    });
  },

  markRead(userId: UserId, channelId: ChannelId): void {
    state.lastRead.set(`${userId}:${channelId}`, new Date().toISOString());
  },

  allMessages(): readonly Message[] {
    return state.messages;
  },
};

function publishMessageCreated(message: Message) {
  mockRealtime.broadcast(chatTopics.channel(message.channelId), 'chat.message.created', message);
  const channel = chatStore.findChannel(message.channelId);
  if (!channel) return;
  for (const user of mockDb.users) {
    if (!isListedFor(channel, user)) continue;
    mockRealtime.broadcast(chatTopics.inbox(user.id), 'chat.channel.activity', {
      channelId: message.channelId,
      lastMessageAt: message.createdAt,
      authorId: message.authorId,
    });
  }
}
