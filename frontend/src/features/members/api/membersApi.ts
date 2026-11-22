import { apiClient } from '@/lib/api';

import type { Member } from '../types';

/**
 * Members the current user may see. Guests only receive people they share
 * a conversation with (filtered by the server).
 */
export function fetchMembers(signal?: AbortSignal): Promise<Member[]> {
  return apiClient.get<Member[]>('/members', { signal });
}
