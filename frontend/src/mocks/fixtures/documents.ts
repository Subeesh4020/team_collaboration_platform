import type { DocumentSummary } from '@/features/documents';

import { daysAgo } from './time';

export const documentsFixture: DocumentSummary[] = [
  {
    id: 'd_launch',
    title: 'Launch press release',
    ownerId: 'u_linus',
    collaboratorIds: ['u_ada', 'u_marie'],
    updatedAt: daysAgo(1),
  },
  {
    id: 'd_onboarding',
    title: 'Onboarding plan',
    ownerId: 'u_grace',
    collaboratorIds: ['u_alan'],
    updatedAt: daysAgo(6),
  },
];
