import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { UserId } from '@/types';

import type { Member } from '../types';
import { fetchMembers } from './membersApi';
import { membersKeys } from './membersKeys';

export function useMembersQuery() {
  return useQuery({
    queryKey: membersKeys.list(),
    queryFn: ({ signal }) => fetchMembers(signal),
    staleTime: 5 * 60_000,
  });
}

/** Members indexed by id, for resolving authors and participants. */
export function useMemberMap(): ReadonlyMap<UserId, Member> {
  const { data } = useMembersQuery();
  return useMemo(() => new Map((data ?? []).map((member) => [member.id, member])), [data]);
}
