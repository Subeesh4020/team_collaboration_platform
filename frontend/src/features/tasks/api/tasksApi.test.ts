import { createTaskFromActionItem, searchTasks } from './tasksApi';

describe('tasks API', () => {
  it('turns a meeting action item into a task', async () => {
    const task = await createTaskFromActionItem(
      { id: 'ai_9', title: 'Send recap email', assigneeId: 'u_grace', sourceMeetingId: 'mt_1' },
      'p_launch',
    );

    expect(task).toMatchObject({
      title: 'Send recap email',
      status: 'todo',
      assigneeId: 'u_grace',
      sourceActionItemId: 'ai_9',
    });
    const { hits } = await searchTasks('recap', 5);
    expect(hits.map((t) => t.id)).toContain(task.id);
  });
});
