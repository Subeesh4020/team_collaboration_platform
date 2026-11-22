import type { IsoDateString, UserId } from '@/types';

export interface WikiPage {
  id: string;
  title: string;
  slug: string;
  /** e.g. "Policies", "Guides", "Procedures". */
  section: string;
  status: 'draft' | 'published';
  authorId: UserId;
  updatedAt: IsoDateString;
}
