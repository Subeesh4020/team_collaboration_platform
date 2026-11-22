import type { PresenceStatus, UserId } from '@/types';

/**
 * Map of every real-time event name to its payload type.
 *
 * Features add their own events with declaration merging, in their own
 * `types.ts`, so `lib` never imports feature code:
 *
 * ```ts
 * declare module '@/lib/realtime' {
 *   interface RealtimeEvents {
 *     'chat.message.created': Message;
 *   }
 * }
 * ```
 */
export interface RealtimeEvents {
  'presence.changed': { userId: UserId; status: PresenceStatus };
}

export type RealtimeEventName = keyof RealtimeEvents;

export interface RealtimeEventMeta {
  topic: string;
}

export type RealtimeHandler<E extends RealtimeEventName> = (
  payload: RealtimeEvents[E],
  meta: RealtimeEventMeta,
) => void;

export type ConnectionStatus = 'idle' | 'connecting' | 'open' | 'reconnecting' | 'closed';

/**
 * Transport-agnostic real-time client. Features use it through
 * `useRealtimeSubscription` inside their own hooks, never from components.
 */
export interface RealtimeClient {
  readonly status: ConnectionStatus;
  connect(): void;
  disconnect(): void;
  /**
   * Listens for `event` on `topic` (e.g. "chat:channel:general").
   * Returns an unsubscribe function.
   */
  subscribe<E extends RealtimeEventName>(
    topic: string,
    event: E,
    handler: RealtimeHandler<E>,
  ): () => void;
  /** Sends an event. Queued while disconnected and flushed on reconnect. */
  publish<E extends RealtimeEventName>(topic: string, event: E, payload: RealtimeEvents[E]): void;
  /** Listens for connection status changes. Returns an unsubscribe function. */
  onStatusChange(listener: (status: ConnectionStatus) => void): () => void;
}
