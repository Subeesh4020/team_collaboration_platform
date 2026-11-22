import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Can } from '@/lib/permissions';

import { meetingsPermissions } from '../../permissions';

/**
 * Skeleton. Video calls will go through `lib/rtc` (interfaces only today);
 * recordings and notes through this feature's API.
 */
export function MeetingsOverview() {
  return (
    <EmptyState
      icon="video"
      title="Meetings are coming soon"
      description="Video meetings, screen sharing, recordings and notes with decisions and action items."
    >
      <Can permission={meetingsPermissions.create}>
        <Button variant="primary" iconStart="plus" disabled>
          New meeting
        </Button>
      </Can>
    </EmptyState>
  );
}
