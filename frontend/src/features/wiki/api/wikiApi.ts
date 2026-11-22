import { apiClient } from '@/lib/api';
import type { SearchHitsPage } from '@/lib/search';

import type { WikiPage } from '../types';

export function fetchWikiPages(signal?: AbortSignal): Promise<WikiPage[]> {
  return apiClient.get<WikiPage[]>('/wiki/pages', { signal });
}

export function searchWikiPages(
  query: string,
  limit: number,
  signal?: AbortSignal,
): Promise<SearchHitsPage<WikiPage>> {
  return apiClient.get('/wiki/pages/search', { signal, query: { q: query, limit } });
}
