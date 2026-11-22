import type { IsoDateString } from './api';
import type { UserId } from './user';

/**
 * A follow-up captured in meeting notes. Lives in shared types so meetings
 * can hand items to tasks (via `features/tasks` public API) without either
 * feature reaching into the other's folders.
 */
export interface ActionItem {
  id: string;
  title: string;
  assigneeId?: UserId;
  dueDate?: IsoDateString;
  /** Meeting the item was captured in. */
  sourceMeetingId: string;
  /** Set once the item has been turned into a task. */
  taskId?: string;
}
