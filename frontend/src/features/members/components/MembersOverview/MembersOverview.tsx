import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Can } from '@/lib/permissions';

import { useMembersQuery } from '../../api/queries';
import { membersPermissions } from '../../permissions';

/** Skeleton. The directory data already exists (chat uses it); role management comes later. */
export function MembersOverview() {
  const { data } = useMembersQuery();
  const count = data?.length;
  return (
    <EmptyState
      icon="users"
      title="Member management is coming soon"
      description={
        count === undefined
          ? 'Invite people, manage roles and remove access.'
          : `${String(count)} people in this workspace. Invite people, manage roles and remove access.`
      }
    >
      <Can permission={membersPermissions.invite}>
        <Button variant="primary" iconStart="plus" disabled>
          Invite people
        </Button>
      </Can>
    </EmptyState>
  );
}
