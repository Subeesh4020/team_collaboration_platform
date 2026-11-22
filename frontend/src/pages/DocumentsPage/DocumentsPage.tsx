import { PageContainer } from '@/components/layout/PageContainer';
import { DocumentsOverview } from '@/features/documents';

export function DocumentsPage() {
  return (
    <PageContainer title="Documents" description="Collaborative documents with version history.">
      <DocumentsOverview />
    </PageContainer>
  );
}
