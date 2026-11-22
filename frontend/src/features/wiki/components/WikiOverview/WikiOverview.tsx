import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Can } from '@/lib/permissions';

import { wikiPermissions } from '../../permissions';

export function WikiOverview() {
  return (
    <EmptyState
      icon="book"
      title="The knowledge base is coming soon"
      description="Policies, guides and procedures, all in one searchable place."
    >
      <Can permission={wikiPermissions.edit}>
        <Button iconStart="edit" disabled>
          New page
        </Button>
      </Can>
      <Can permission={wikiPermissions.publish}>
        <Button variant="primary" disabled>
          Publish
        </Button>
      </Can>
    </EmptyState>
  );
}
