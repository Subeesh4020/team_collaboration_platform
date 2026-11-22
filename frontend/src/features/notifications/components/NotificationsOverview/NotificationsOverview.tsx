import { EmptyState } from '@/components/ui/EmptyState';

/** Skeleton. New notifications will arrive via the `notifications.created` real-time event. */
export function NotificationsOverview() {
  return (
    <EmptyState
      icon="bell"
      title="Notifications are coming soon"
      description="Mentions, task assignments, meeting reminders and shared files in one inbox."
    />
  );
}
