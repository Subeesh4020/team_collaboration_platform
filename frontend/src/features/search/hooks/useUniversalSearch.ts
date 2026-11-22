import { useQueries } from '@tanstack/react-query';

import { useCan } from '@/lib/permissions';
import { useSearchRegistry } from '@/lib/search';

import { searchKeys } from '../api/searchKeys';
import { MIN_QUERY_LENGTH, RESULTS_PER_PROVIDER, type SearchResultGroup } from '../types';

/**
 * Queries every registered provider the user may use, in parallel.
 * Knows nothing about individual features: providers come from the registry.
 */
export function useUniversalSearch(query: string): SearchResultGroup[] {
  const registry = useSearchRegistry();
  const can = useCan();
  const trimmed = query.trim();
  const enabled = trimmed.length >= MIN_QUERY_LENGTH;

  const providers = registry
    .getAll()
    .filter((provider) => !provider.permission || can(provider.permission));

  const results = useQueries({
    queries: providers.map((provider) => ({
      queryKey: searchKeys.results(provider.type, trimmed),
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        provider.search(trimmed, { signal, limit: RESULTS_PER_PROVIDER }),
      enabled,
      staleTime: 30_000,
    })),
  });

  return providers.map((provider, index) => {
    const result = results[index];
    const status: SearchResultGroup['status'] =
      !enabled || !result
        ? 'idle'
        : result.isError
          ? 'error'
          : result.isSuccess
            ? 'success'
            : 'pending';
    return { provider, status, data: result?.data };
  });
}
