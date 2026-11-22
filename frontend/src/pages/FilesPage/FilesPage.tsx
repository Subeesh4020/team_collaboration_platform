import { PageContainer } from '@/components/layout/PageContainer';
import { FilesOverview } from '@/features/files';

export function FilesPage() {
  return (
    <PageContainer title="Files" description="Upload, share and co-edit files.">
      <FilesOverview />
    </PageContainer>
  );
}
