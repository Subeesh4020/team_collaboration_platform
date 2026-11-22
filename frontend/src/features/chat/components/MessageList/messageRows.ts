import { dayKey, msBetween } from '@/lib/utils';

import type { ChatMessage } from '../../types';

/** Consecutive messages from one author within this window are visually grouped. */
const GROUP_WINDOW_MS = 5 * 60_000;

export type MessageRow =
  | { type: 'day'; key: string; date: string }
  | { type: 'message'; key: string; message: ChatMessage; isGrouped: boolean };

/**
 * Flattens messages (oldest first) into display rows with day separators.
 * A flat array with stable keys is exactly what a virtualizer consumes, so
 * the list can switch to windowed rendering without changing this logic.
 */
function continuesGroup(previous: ChatMessage | undefined, message: ChatMessage): boolean {
  if (!previous) return false;
  return (
    previous.authorId === message.authorId &&
    previous.status !== 'failed' &&
    msBetween(previous.createdAt, message.createdAt) < GROUP_WINDOW_MS
  );
}

export function buildMessageRows(messages: readonly ChatMessage[]): MessageRow[] {
  const rows: MessageRow[] = [];
  let previous: ChatMessage | undefined;

  for (const message of messages) {
    const day = dayKey(message.createdAt);
    const newDay = !previous || dayKey(previous.createdAt) !== day;
    if (newDay) rows.push({ type: 'day', key: `day-${day}`, date: message.createdAt });

    const isGrouped = !newDay && continuesGroup(previous, message);

    rows.push({ type: 'message', key: message.clientId ?? message.id, message, isGrouped });
    previous = message;
  }
  return rows;
}
