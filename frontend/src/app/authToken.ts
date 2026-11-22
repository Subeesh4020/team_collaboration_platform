import type { QueryClient } from '@tanstack/react-query';

import { authKeys, type Session } from '@/features/auth';

/** Reads the current access token from the cached session. */
export function createTokenReader(queryClient: QueryClient): () => string | null {
  return () => queryClient.getQueryData<Session>(authKeys.session())?.accessToken ?? null;
}
