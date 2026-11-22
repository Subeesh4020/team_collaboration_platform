import type { ChatMessage } from '../../types';
import { buildMessageRows } from './messageRows';

const message = (
  id: string,
  authorId: string,
  createdAt: string,
  extra: Partial<ChatMessage> = {},
) => ({ id, channelId: 'c', authorId, body: id, createdAt, ...extra }) satisfies ChatMessage;

describe('buildMessageRows', () => {
  it('inserts a day separator before the first message of each day', () => {
    const rows = buildMessageRows([
      message('a', 'u1', '2026-11-17T10:00:00'),
      message('b', 'u1', '2026-11-18T10:00:00'),
    ]);
    expect(rows.map((r) => r.type)).toEqual(['day', 'message', 'day', 'message']);
  });

  it('groups consecutive messages from the same author within five minutes', () => {
    const rows = buildMessageRows([
      message('a', 'u1', '2026-11-18T10:00:00'),
      message('b', 'u1', '2026-11-18T10:03:00'),
      message('c', 'u1', '2026-11-18T10:20:00'),
      message('d', 'u2', '2026-11-18T10:21:00'),
    ]);
    const grouped = rows.flatMap((r) =>
      r.type === 'message' ? [[r.message.id, r.isGrouped]] : [],
    );
    expect(grouped).toEqual([
      ['a', false],
      ['b', true],
      ['c', false],
      ['d', false],
    ]);
  });

  it('does not group after a failed message and keys optimistic rows by clientId', () => {
    const rows = buildMessageRows([
      message('a', 'u1', '2026-11-18T10:00:00', { status: 'failed', clientId: 'x' }),
      message('b', 'u1', '2026-11-18T10:01:00'),
    ]);
    const messages = rows.flatMap((r) => (r.type === 'message' ? [r] : []));
    expect(messages.map((r) => r.key)).toEqual(['x', 'b']);
    expect(messages.map((r) => r.isGrouped)).toEqual([false, false]);
  });
});
