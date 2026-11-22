import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { ActionItem } from '@/types';

import { createTaskFromActionItem, fetchTasks } from './tasksApi';
import { tasksKeys } from './tasksKeys';

export function useTasksQuery() {
  return useQuery({ queryKey: tasksKeys.list(), queryFn: ({ signal }) => fetchTasks(signal) });
}

export function useCreateTaskFromActionItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ actionItem, projectId }: { actionItem: ActionItem; projectId: string }) =>
      createTaskFromActionItem(actionItem, projectId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tasksKeys.list() }),
  });
}
