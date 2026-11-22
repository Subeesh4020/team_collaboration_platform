import type { Meeting } from '@/features/meetings';

import { daysAgo } from './time';

export const meetingsFixture: Meeting[] = [
  {
    id: 'mt_1',
    title: 'Q1 launch planning',
    startsAt: daysAgo(1),
    endsAt: daysAgo(1),
    hostId: 'u_ada',
    participantIds: ['u_ada', 'u_linus', 'u_marie'],
    recordingUrl: '/recordings/mt_1',
    notes: {
      decisions: ['Launch date set for March 3'],
      actionItems: [
        {
          id: 'ai_1',
          title: 'Draft launch checklist',
          assigneeId: 'u_linus',
          sourceMeetingId: 'mt_1',
        },
      ],
    },
  },
  {
    id: 'mt_2',
    title: 'Engineering weekly sync',
    startsAt: daysAgo(3),
    endsAt: daysAgo(3),
    hostId: 'u_grace',
    participantIds: ['u_grace', 'u_alan', 'u_katherine'],
  },
];
