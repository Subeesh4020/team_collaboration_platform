import { PageContainer } from '@/components/layout/PageContainer';
import { SettingsOverview } from '@/features/settings';
import { WorkspaceSettingsCard } from '@/features/workspace';

export function SettingsPage() {
  return (
    <PageContainer title="Settings">
      <SettingsOverview />
      <WorkspaceSettingsCard />
    </PageContainer>
  );
}
