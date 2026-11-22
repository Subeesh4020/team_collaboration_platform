import { useCurrentSession } from '@/features/auth';
import type { Workspace } from '@/types';

/** The current workspace (delivered with the session). */
export function useWorkspace(): Workspace {
  return useCurrentSession().workspace;
}
