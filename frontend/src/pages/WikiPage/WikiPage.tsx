import { PageContainer } from '@/components/layout/PageContainer';
import { WikiOverview } from '@/features/wiki';

export function WikiPage() {
  return (
    <PageContainer title="Knowledge base" description="Policies, guides and procedures.">
      <WikiOverview />
    </PageContainer>
  );
}
