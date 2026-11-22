import { useQuery } from '@tanstack/react-query';

import { fetchNotifications } from './notificationsApi';
import { notificationsKeys } from './notificationsKeys';

export function useNotificationsQuery() {
  return useQuery({
    queryKey: notificationsKeys.list(),
    queryFn: ({ signal }) => fetchNotifications(signal),
  });
}
