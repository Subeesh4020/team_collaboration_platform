import { PageContainer } from '@/components/layout/PageContainer';
import { UniversalSearch } from '@/features/search';

export function SearchPage() {
  return (
    <PageContainer title="Search">
      <UniversalSearch />
    </PageContainer>
  );
}
