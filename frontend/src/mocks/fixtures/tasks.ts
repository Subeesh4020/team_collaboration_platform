import type { Task } from '@/features/tasks';

export function createTasksFixture(): Task[] {
  return [
    {
      id: 't_1',
      title: 'Draft launch checklist',
      status: 'in_progress',
      projectId: 'p_launch',
      assigneeId: 'u_linus',
      reporterId: 'u_ada',
      memberIds: ['u_ada', 'u_linus', 'u_marie'],
      sourceActionItemId: 'ai_1',
    },
    {
      id: 't_2',
      title: 'Update roadmap deck',
      status: 'todo',
      projectId: 'p_planning',
      assigneeId: 'u_ada',
      reporterId: 'u_ada',
      memberIds: ['u_ada'],
    },
    {
      id: 't_3',
      title: 'Fix login bug',
      status: 'done',
      projectId: 'p_eng',
      assigneeId: 'u_alan',
      reporterId: 'u_grace',
      memberIds: ['u_grace', 'u_alan'],
    },
  ];
}
