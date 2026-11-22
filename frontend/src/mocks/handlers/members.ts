import { delay, http, HttpResponse } from 'msw';

import type { Member } from '@/features/members';

import { chatStore } from '../chatStore';
import { mockDb } from '../db';
import { presenceFixture } from '../fixtures/chat';
import { apiUrl } from '../utils';

export const membersHandlers = [
  http.get(apiUrl('/members'), async () => {
    const user = mockDb.currentUser();
    let visible = mockDb.users.map((u) => (u.id === user.id ? user : u));

    // Guests only see people they share a conversation with.
    if (user.role === 'guest') {
      const shared = new Set(chatStore.listChannels(user).flatMap((channel) => channel.memberIds));
      visible = visible.filter((u) => shared.has(u.id));
    }

    const members: Member[] = visible.map((u) => ({
      ...u,
      presence: presenceFixture[u.id] ?? 'offline',
    }));
    await delay();
    return HttpResponse.json(members);
  }),
];
