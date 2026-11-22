import type { IsoDateString, UserId } from '@/types';

export interface FileItem {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  ownerId: UserId;
  /** People the file is shared with (guests only see files shared with them). */
  sharedWithIds: UserId[];
  updatedAt: IsoDateString;
  /** Increments on each saved version; history comes from `/files/:id/versions`. */
  version: number;
}
