import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Can } from '@/lib/permissions';

import { integrationsPermissions } from '../../permissions';

export function IntegrationsOverview() {
  return (
    <EmptyState
      icon="plug"
      title="Integrations are coming soon"
      description="Connect calendars (Google, Outlook) and cloud drives (Google Drive, OneDrive)."
    >
      <Can
        permission={integrationsPermissions.manage}
        fallback={<p>Only admins can connect integrations.</p>}
      >
        <Button variant="primary" iconStart="plus" disabled>
          Connect an app
        </Button>
      </Can>
    </EmptyState>
  );
}
