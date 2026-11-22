import { ResultRow } from '@/components/ui/ResultRow';
import { paths } from '@/config/paths';
import type { SearchProvider } from '@/lib/search';
import { formatDateTime } from '@/lib/utils';

import { searchMeetings } from './api/meetingsApi';
import { meetingsPermissions } from './permissions';
import type { Meeting } from './types';

export const meetingsSearchProvider: SearchProvider<Meeting> = {
  type: 'meetings',
  label: 'Meetings & recordings',
  permission: meetingsPermissions.join,
  search: (query, { signal, limit }) => searchMeetings(query, limit, signal),
  renderResult: (meeting) => (
    <ResultRow
      icon="video"
      title={meeting.title}
      meta={`${formatDateTime(meeting.startsAt)}${meeting.recordingUrl ? ' · Recording available' : ''}`}
    />
  ),
  getKey: (meeting) => meeting.id,
  getHref: () => paths.meetings(),
};
