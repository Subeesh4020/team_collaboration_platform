import { PageContainer } from '@/components/layout/PageContainer';
import { MembersOverview } from '@/features/members';

export function MembersPage() {
  return (
    <PageContainer title="Members" description="People in your workspace and their roles.">
      <MembersOverview />
    </PageContainer>
  );
}
