import type { IsoDateString } from '@/types';

export type NotificationKind = 'mention' | 'task-assigned' | 'meeting-starting' | 'file-shared';

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  createdAt: IsoDateString;
  read: boolean;
  /** App-relative link to the related item. */
  href?: string;
}

declare module '@/lib/realtime' {
  interface RealtimeEvents {
    'notifications.created': AppNotification;
  }
}
