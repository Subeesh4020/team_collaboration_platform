import { apiClient } from '@/lib/api';
import type { SearchHitsPage } from '@/lib/search';
import type { ActionItem } from '@/types';

import type { CreateTaskFromActionItemRequest, Task } from '../types';

export function fetchTasks(signal?: AbortSignal): Promise<Task[]> {
  return apiClient.get<Task[]>('/tasks', { signal });
}

export function searchTasks(
  query: string,
  limit: number,
  signal?: AbortSignal,
): Promise<SearchHitsPage<Task>> {
  return apiClient.get('/tasks/search', { signal, query: { q: query, limit } });
}

/** Turns a meeting action item into a task. Called by the meetings feature via the public API. */
export function createTaskFromActionItem(actionItem: ActionItem, projectId: string): Promise<Task> {
  const body: CreateTaskFromActionItemRequest = { actionItem, projectId };
  return apiClient.post<Task>('/tasks/from-action-item', body);
}
