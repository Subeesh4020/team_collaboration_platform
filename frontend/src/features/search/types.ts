import type { SearchHitsPage, SearchProvider } from '@/lib/search';

export interface SearchResultGroup {
  provider: SearchProvider;
  status: 'idle' | 'pending' | 'error' | 'success';
  data: SearchHitsPage<unknown> | undefined;
}

export const MIN_QUERY_LENGTH = 2;
export const RESULTS_PER_PROVIDER = 5;
