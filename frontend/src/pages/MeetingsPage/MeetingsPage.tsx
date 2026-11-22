import { PageContainer } from '@/components/layout/PageContainer';
import { MeetingsOverview } from '@/features/meetings';

export function MeetingsPage() {
  return (
    <PageContainer title="Meetings" description="Video meetings, recordings and meeting notes.">
      <MeetingsOverview />
    </PageContainer>
  );
}
