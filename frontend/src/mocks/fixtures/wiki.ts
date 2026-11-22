import type { WikiPage } from '@/features/wiki';

import { daysAgo } from './time';

export const wikiFixture: WikiPage[] = [
  {
    id: 'w_1',
    title: 'Holiday schedule',
    slug: 'holiday-schedule',
    section: 'Policies',
    status: 'published',
    authorId: 'u_linus',
    updatedAt: daysAgo(20),
  },
  {
    id: 'w_2',
    title: 'How to run a launch',
    slug: 'how-to-run-a-launch',
    section: 'Guides',
    status: 'draft',
    authorId: 'u_ada',
    updatedAt: daysAgo(2),
  },
  {
    id: 'w_3',
    title: 'Expense procedure',
    slug: 'expense-procedure',
    section: 'Procedures',
    status: 'published',
    authorId: 'u_grace',
    updatedAt: daysAgo(40),
  },
];
