import { ResultRow } from '@/components/ui/ResultRow';
import { paths } from '@/config/paths';
import type { SearchProvider } from '@/lib/search';

import { searchTasks } from './api/tasksApi';
import { tasksPermissions } from './permissions';
import type { Task, TaskStatus } from './types';

const statusLabel: Record<TaskStatus, string> = {
  todo: 'To do',
  in_progress: 'In progress',
  done: 'Done',
};

export const tasksSearchProvider: SearchProvider<Task> = {
  type: 'tasks',
  label: 'Tasks',
  permission: tasksPermissions.view,
  search: (query, { signal, limit }) => searchTasks(query, limit, signal),
  renderResult: (task) => (
    <ResultRow icon="tasks" title={task.title} meta={statusLabel[task.status]} />
  ),
  getKey: (task) => task.id,
  getHref: () => paths.tasks(),
};
