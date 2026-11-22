import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Can } from '@/lib/permissions';

import { tasksPermissions } from '../../permissions';

/** Skeleton. The Kanban board (drag and drop) is a heavy module, lazy-loaded at route level. */
export function TasksOverview() {
  return (
    <EmptyState
      icon="tasks"
      title="Tasks & projects are coming soon"
      description="Shared to-do lists, due dates and Kanban boards. Meeting action items will land here."
    >
      <Can permission={tasksPermissions.create}>
        <Button variant="primary" iconStart="plus" disabled>
          New task
        </Button>
      </Can>
    </EmptyState>
  );
}
