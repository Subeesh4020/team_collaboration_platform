import type { ActionItem, IsoDateString, UserId } from '@/types';

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  projectId: string;
  assigneeId?: UserId;
  reporterId: UserId;
  /** People who can see the task (guests only see tasks shared with them). */
  memberIds: UserId[];
  dueDate?: IsoDateString;
  /** Set when the task was created from a meeting action item. */
  sourceActionItemId?: string;
}

/** Body for `POST /tasks/from-action-item`. */
export interface CreateTaskFromActionItemRequest {
  actionItem: ActionItem;
  projectId: string;
}

declare module '@/lib/realtime' {
  interface RealtimeEvents {
    /** A task changed column on a board (Kanban). */
    'tasks.task.moved': { taskId: string; status: TaskStatus };
  }
}
