import { PageContainer } from '@/components/layout/PageContainer';
import { TasksOverview } from '@/features/tasks';

export function TasksPage() {
  return (
    <PageContainer title="Tasks & projects" description="To-do lists, due dates and Kanban boards.">
      <TasksOverview />
    </PageContainer>
  );
}
