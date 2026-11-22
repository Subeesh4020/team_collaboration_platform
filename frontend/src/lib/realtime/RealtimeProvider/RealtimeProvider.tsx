import { useEffect, type ReactNode } from 'react';

import { RealtimeContext } from '../context';
import type { RealtimeClient } from '../types';

export interface RealtimeProviderProps {
  client: RealtimeClient;
  /** Connect on mount and disconnect on unmount. Defaults to true. */
  autoConnect?: boolean;
  children: ReactNode;
}

export function RealtimeProvider({ client, autoConnect = true, children }: RealtimeProviderProps) {
  useEffect(() => {
    if (!autoConnect) return;
    client.connect();
    return () => {
      client.disconnect();
    };
  }, [client, autoConnect]);

  return <RealtimeContext value={client}>{children}</RealtimeContext>;
}
