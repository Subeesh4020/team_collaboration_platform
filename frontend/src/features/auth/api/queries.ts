import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { Session } from '../types';
import { fetchSession, switchDevRole } from './authApi';
import { authKeys } from './authKeys';

export function useSessionQuery() {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: ({ signal }) => fetchSession(signal),
    staleTime: Number.POSITIVE_INFINITY,
  });
}

/**
 * Returns the signed-in session. Only call below the authenticated layout,
 * which guarantees the session has loaded.
 */
export function useCurrentSession(): Session {
  const { data } = useSessionQuery();
  if (!data) throw new Error('useCurrentSession called before the session loaded');
  return data;
}

export function useCurrentUser() {
  return useCurrentSession().user;
}

/** Dev only: switch role, then refetch everything (visible data depends on role). */
export function useSwitchDevRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: switchDevRole,
    onSuccess: async (session) => {
      queryClient.setQueryData(authKeys.session(), session);
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] !== authKeys.all[0],
      });
    },
  });
}
