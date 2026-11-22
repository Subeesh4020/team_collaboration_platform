import type { IsoDateString, UserId } from '@/types';

/**
 * A collaborative document. The body is NOT loaded here: real-time
 * co-editing (proposed: Tiptap + Yjs) will sync content over `lib/realtime`.
 */
export interface DocumentSummary {
  id: string;
  title: string;
  ownerId: UserId;
  collaboratorIds: UserId[];
  updatedAt: IsoDateString;
}
