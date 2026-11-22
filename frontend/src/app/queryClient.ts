import { QueryClient } from '@tanstack/react-query';

import { ApiError } from '@/lib/api';

const MAX_RETRIES = 2;

/** Retry network and 5xx errors; never retry 4xx (they won't fix themselves). */
export function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= MAX_RETRIES) return false;
  if (error instanceof ApiError) {
    if (error.isAborted) return false;
    if (error.status >= 400 && error.status < 500) return false;
  }
  return true;
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: shouldRetry,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}
