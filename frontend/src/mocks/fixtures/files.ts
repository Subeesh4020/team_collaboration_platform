import type { FileItem } from '@/features/files';

import { daysAgo } from './time';

export const filesFixture: FileItem[] = [
  {
    id: 'f_checklist',
    name: 'launch-checklist-v2.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 182_000,
    ownerId: 'u_linus',
    sharedWithIds: ['u_ada', 'u_marie'],
    updatedAt: daysAgo(1),
    version: 2,
  },
  {
    id: 'f_roadmap',
    name: 'Roadmap Q1.pptx',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    sizeBytes: 2_400_000,
    ownerId: 'u_ada',
    sharedWithIds: [],
    updatedAt: daysAgo(4),
    version: 5,
  },
];
