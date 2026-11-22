import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Can } from '@/lib/permissions';

import { filesPermissions } from '../../permissions';

/** Skeleton. Co-editing will plug into `lib/realtime` once a CRDT library is chosen. */
export function FilesOverview() {
  return (
    <EmptyState
      icon="file"
      title="Files are coming soon"
      description="Upload, share and co-edit files with full version history."
    >
      <Can permission={filesPermissions.upload}>
        <Button variant="primary" iconStart="plus" disabled>
          Upload file
        </Button>
      </Can>
    </EmptyState>
  );
}
