import type { ActionItem, IsoDateString, UserId } from '@/types';

export interface MeetingNotes {
  decisions: string[];
  /** Hand off to tasks via `createTaskFromActionItem` from `@/features/tasks`. */
  actionItems: ActionItem[];
}

export interface Meeting {
  id: string;
  title: string;
  startsAt: IsoDateString;
  endsAt: IsoDateString;
  hostId: UserId;
  participantIds: UserId[];
  /** Present once a recording is processed. */
  recordingUrl?: string;
  notes?: MeetingNotes;
}
