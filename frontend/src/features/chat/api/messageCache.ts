/**
 * Pure helpers that update the cached infinite list of messages.
 * Pages hold messages newest first; page 0 is the most recent.
 */
import type { InfiniteData } from '@tanstack/react-query';

import type { ChatMessage, MessageId, MessagesPage } from '../types';

export type MessagesCache = InfiniteData<MessagesPage, string | null>;

function sameMessage(a: ChatMessage, b: ChatMessage): boolean {
  return a.id === b.id || (a.clientId !== undefined && a.clientId === b.clientId);
}

/**
 * Inserts a message at the top, or replaces an existing copy (matched by id
 * or clientId) so optimistic and real-time copies never duplicate.
 */
export function upsertMessage(
  cache: MessagesCache | undefined,
  message: ChatMessage,
): MessagesCache | undefined {
  if (!cache) return cache;
  const exists = cache.pages.some((page) => page.items.some((item) => sameMessage(item, message)));
  if (exists) {
    return updateMessage(
      cache,
      (item) => sameMessage(item, message),
      () => message,
    );
  }
  const first = cache.pages[0];
  if (!first) return { ...cache, pages: [{ items: [message], nextCursor: null }] };
  return {
    ...cache,
    pages: [{ ...first, items: [message, ...first.items] }, ...cache.pages.slice(1)],
  };
}

export function removeMessage(
  cache: MessagesCache | undefined,
  messageId: MessageId,
): MessagesCache | undefined {
  if (!cache) return cache;
  return {
    ...cache,
    pages: cache.pages.map((page) => ({
      ...page,
      items: page.items.filter((item) => item.id !== messageId),
    })),
  };
}

export function updateMessage(
  cache: MessagesCache | undefined,
  match: (message: ChatMessage) => boolean,
  update: (message: ChatMessage) => ChatMessage,
): MessagesCache | undefined {
  if (!cache) return cache;
  return {
    ...cache,
    pages: cache.pages.map((page) => ({
      ...page,
      items: page.items.map((item) => (match(item) ? update(item) : item)),
    })),
  };
}

/** All cached messages, oldest first (display order). */
export function flattenMessages(cache: MessagesCache | undefined): ChatMessage[] {
  if (!cache) return [];
  return cache.pages.flatMap((page) => page.items).reverse();
}
