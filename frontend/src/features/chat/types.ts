import type { Attachment, IsoDateString, Paginated, UserId } from '@/types';

export type ChannelId = string;
export type MessageId = string;

/** `channel`: named room; `group`: unnamed multi-person chat; `dm`: one-to-one. */
export type ChannelKind = 'channel' | 'group' | 'dm';

export interface Channel {
  id: ChannelId;
  kind: ChannelKind;
  /** Empty for `group` and `dm`; the UI derives a name from participants. */
  name: string;
  topic?: string;
  visibility: 'public' | 'private';
  memberIds: UserId[];
  createdBy: UserId;
  createdAt: IsoDateString;
  /** Unread messages for the current user. */
  unreadCount: number;
  lastMessageAt: IsoDateString | null;
}

export interface Message {
  id: MessageId;
  channelId: ChannelId;
  authorId: UserId;
  body: string;
  createdAt: IsoDateString;
  editedAt?: IsoDateString;
  /** Files, tasks, docs… referenced through the shared Attachment type. */
  attachments?: Attachment[];
  /** Echo of the client-generated id, used to reconcile optimistic messages. */
  clientId?: string;
}

/** A message as held in the client cache, including optimistic states. */
export interface ChatMessage extends Message {
  status?: 'pending' | 'failed';
}

/** Messages page: `items` are newest first; `nextCursor` loads older ones. */
export type MessagesPage = Paginated<Message>;

export interface PostMessageRequest {
  body: string;
  clientId: string;
}

export interface CreateChannelRequest {
  name: string;
  topic?: string;
  visibility: 'public' | 'private';
}

export interface MessageSearchHit {
  message: Message;
  channelId: ChannelId;
  channelLabel: string;
}

export const MESSAGE_MAX_LENGTH = 4000;
export const CHANNEL_NAME_MAX_LENGTH = 80;

/* ---------- Real-time events (merged into lib/realtime's event map) ---------- */

export interface ChannelActivityEvent {
  channelId: ChannelId;
  lastMessageAt: IsoDateString;
  authorId: UserId;
}

declare module '@/lib/realtime' {
  interface RealtimeEvents {
    'chat.message.created': Message;
    'chat.message.deleted': { channelId: ChannelId; messageId: MessageId };
    /** Sent to each member's inbox topic, for unread badges. */
    'chat.channel.activity': ChannelActivityEvent;
    'chat.channel.created': Channel;
  }
}
