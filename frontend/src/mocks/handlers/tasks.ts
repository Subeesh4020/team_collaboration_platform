import { delay, http, HttpResponse } from 'msw';

import { taskResource, type CreateTaskFromActionItemRequest, type Task } from '@/features/tasks';
import { checkPermission } from '@/lib/permissions';

import { mockDb } from '../db';
import { createTasksFixture } from '../fixtures/tasks';
import { searchableResource } from '../resource';
import { apiUrl, errorResponse } from '../utils';

let tasks = createTasksFixture();
mockDb.onReset(() => {
  tasks = createTasksFixture();
});

export const tasksHandlers = [
  ...searchableResource({
    path: '/tasks',
    items: () => tasks,
    text: (task) => task.title,
    permission: 'tasks:view',
    resource: taskResource,
  }),

  // Meeting action item → task (cross-feature hand-off through public APIs).
  http.post(apiUrl('/tasks/from-action-item'), async ({ request }) => {
    const user = mockDb.currentUser();
    if (!checkPermission({ id: user.id, role: user.role }, 'tasks:create')) {
      return errorResponse(403, 'forbidden', 'Not allowed.');
    }
    const { actionItem, projectId } = (await request.json()) as CreateTaskFromActionItemRequest;
    const task: Task = {
      id: `t_${String(tasks.length + 1)}`,
      title: actionItem.title,
      status: 'todo',
      projectId,
      reporterId: user.id,
      memberIds: [user.id],
      sourceActionItemId: actionItem.id,
      ...(actionItem.assigneeId ? { assigneeId: actionItem.assigneeId } : {}),
      ...(actionItem.dueDate ? { dueDate: actionItem.dueDate } : {}),
    };
    tasks.push(task);
    await delay();
    return HttpResponse.json(task, { status: 201 });
  }),
];
