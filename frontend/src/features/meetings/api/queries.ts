import { useQuery } from '@tanstack/react-query';

import { fetchMeetings } from './meetingsApi';
import { meetingsKeys } from './meetingsKeys';

export function useMeetingsQuery() {
  return useQuery({
    queryKey: meetingsKeys.list(),
    queryFn: ({ signal }) => fetchMeetings(signal),
  });
}
