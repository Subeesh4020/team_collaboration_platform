import type { ChatMessage } from '../types';
import { flattenMessages, removeMessage, upsertMessage, type MessagesCache } from './messageCache';

const msg = (id: string, extra: Partial<ChatMessage> = {}): ChatMessage => ({
  id,
  channelId: 'c',
  authorId: 'u',
  body: id,
  createdAt: '2026-11-18T10:00:00Z',
  ...extra,
});

const cache = (...pages: ChatMessage[][]): MessagesCache => ({
  pages: pages.map((items, i) => ({
    items,
    nextCursor: i < pages.length - 1 ? `p${String(i)}` : null,
  })),
  pageParams: pages.map((_, i) => (i === 0 ? null : `p${String(i - 1)}`)),
});

describe('messageCache', () => {
  it('prepends new messages to the newest page', () => {
    const next = upsertMessage(cache([msg('b'), msg('a')]), msg('c'));
    expect(flattenMessages(next).map((m) => m.id)).toEqual(['a', 'b', 'c']);
  });

  it('replaces an optimistic message matched by clientId instead of duplicating it', () => {
    const optimistic = msg('pending:1', { clientId: '1', status: 'pending' });
    const confirmed = msg('m_9', { clientId: '1' });
    const next = upsertMessage(cache([optimistic, msg('a')]), confirmed);
    expect(flattenMessages(next).map((m) => m.id)).toEqual(['a', 'm_9']);
  });

  it('ignores a real-time echo of a message already in the cache', () => {
    const next = upsertMessage(cache([msg('b')], [msg('a')]), msg('a'));
    expect(flattenMessages(next).map((m) => m.id)).toEqual(['a', 'b']);
  });

  it('removes messages from any page', () => {
    const next = removeMessage(cache([msg('c')], [msg('b'), msg('a')]), 'b');
    expect(flattenMessages(next).map((m) => m.id)).toEqual(['a', 'c']);
  });
});
