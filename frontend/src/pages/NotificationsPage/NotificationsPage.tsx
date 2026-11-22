import { PageContainer } from '@/components/layout/PageContainer';
import { NotificationsOverview } from '@/features/notifications';

export function NotificationsPage() {
  return (
    <PageContainer title="Notifications">
      <NotificationsOverview />
    </PageContainer>
  );
}
