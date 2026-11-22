import { createContext, useContext, useEffect, useEffectEvent, useSyncExternalStore } from 'react';

import type { ConnectionStatus, RealtimeClient, RealtimeEventName, RealtimeHandler } from './types';

export const RealtimeContext = createContext<RealtimeClient | null>(null);

export function useRealtimeClient(): RealtimeClient {
  const client = useContext(RealtimeContext);
  if (!client) throw new Error('useRealtimeClient must be used inside <RealtimeProvider>');
  return client;
}

/** Current connection status; re-renders when it changes. */
export function useRealtimeStatus(): ConnectionStatus {
  const client = useRealtimeClient();
  return useSyncExternalStore(
    (onChange) => client.onStatusChange(onChange),
    () => client.status,
    () => client.status,
  );
}

/**
 * Subscribes to `event` on `topic` for the lifetime of the component.
 * Pass `null` as the topic to pause the subscription. The handler always
 * sees the latest props and state without re-subscribing.
 */
export function useRealtimeSubscription<E extends RealtimeEventName>(
  topic: string | null,
  event: E,
  handler: RealtimeHandler<E>,
): void {
  const client = useRealtimeClient();
  const onEvent = useEffectEvent(handler);

  useEffect(() => {
    if (!topic) return;
    return client.subscribe(topic, event, (payload, meta) => {
      onEvent(payload, meta);
    });
  }, [client, topic, event]);
}
