import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

import { setAuthTokenProvider } from '@/lib/api';
import { RealtimeProvider, type RealtimeClient } from '@/lib/realtime';
import { SearchRegistryProvider, type SearchRegistry } from '@/lib/search';

import { createTokenReader } from '../authToken';
import { createQueryClient } from '../queryClient';
import { createAppRealtimeClient } from '../realtimeClient';
import { searchRegistry as defaultSearchRegistry } from '../searchRegistry';

export interface AppProvidersProps {
  children: ReactNode;
  /** Overrides for tests. */
  queryClient?: QueryClient;
  realtimeClient?: RealtimeClient;
  searchRegistry?: SearchRegistry;
}

interface AppServices {
  queryClient: QueryClient;
  realtimeClient: RealtimeClient;
}

function createServices(props: AppProvidersProps): AppServices {
  const queryClient = props.queryClient ?? createQueryClient();
  const readToken = createTokenReader(queryClient);
  setAuthTokenProvider(readToken);
  const realtimeClient = props.realtimeClient ?? createAppRealtimeClient(readToken);
  return { queryClient, realtimeClient };
}

/**
 * Global, router-independent providers. The real-time connection is opened
 * by the authenticated layout once the session (and its token) has loaded.
 */
export function AppProviders(props: AppProvidersProps) {
  const [services] = useState(() => createServices(props));
  return (
    <QueryClientProvider client={services.queryClient}>
      <RealtimeProvider client={services.realtimeClient} autoConnect={false}>
        <SearchRegistryProvider registry={props.searchRegistry ?? defaultSearchRegistry}>
          {props.children}
        </SearchRegistryProvider>
      </RealtimeProvider>
    </QueryClientProvider>
  );
}
