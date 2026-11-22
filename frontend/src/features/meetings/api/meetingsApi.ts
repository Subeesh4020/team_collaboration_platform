import { apiClient } from '@/lib/api';
import type { SearchHitsPage } from '@/lib/search';

import type { Meeting } from '../types';

export function fetchMeetings(signal?: AbortSignal): Promise<Meeting[]> {
  return apiClient.get<Meeting[]>('/meetings', { signal });
}

export function searchMeetings(
  query: string,
  limit: number,
  signal?: AbortSignal,
): Promise<SearchHitsPage<Meeting>> {
  return apiClient.get('/meetings/search', { signal, query: { q: query, limit } });
}
