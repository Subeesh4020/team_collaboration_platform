import type { AppNotification } from '@/features/notifications';

import { daysAgo } from './time';

export const notificationsFixture: AppNotification[] = [
  {
    id: 'n_1',
    kind: 'mention',
    title: 'Grace mentioned you in #general',
    createdAt: daysAgo(0),
    read: false,
    href: '/chat/c_general',
  },
  {
    id: 'n_2',
    kind: 'task-assigned',
    title: 'You were assigned "Update roadmap deck"',
    createdAt: daysAgo(1),
    read: true,
    href: '/tasks',
  },
];
