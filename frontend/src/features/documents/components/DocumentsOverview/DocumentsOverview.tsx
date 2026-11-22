import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Can } from '@/lib/permissions';

import { documentsPermissions } from '../../permissions';

/** Skeleton. The editor is a heavy module and will stay lazy-loaded at route level. */
export function DocumentsOverview() {
  return (
    <EmptyState
      icon="document"
      title="Documents are coming soon"
      description="Write together in real time, with comments and version history."
    >
      <Can permission={documentsPermissions.edit}>
        <Button variant="primary" iconStart="plus" disabled>
          New document
        </Button>
      </Can>
    </EmptyState>
  );
}
