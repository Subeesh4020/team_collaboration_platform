import { PageContainer } from '@/components/layout/PageContainer';
import { IntegrationsOverview } from '@/features/integrations';

export function IntegrationsPage() {
  return (
    <PageContainer title="Integrations" description="Calendars and cloud drives.">
      <IntegrationsOverview />
    </PageContainer>
  );
}
