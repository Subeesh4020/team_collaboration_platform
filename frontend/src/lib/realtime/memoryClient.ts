import { SubscriptionRegistry } from './subscriptions';
import type {
  ConnectionStatus,
  RealtimeClient,
  RealtimeEventMeta,
  RealtimeEventName,
  RealtimeEvents,
} from './types';

export interface PublishedFrame {
  topic: string;
  event: string;
  payload: unknown;
}

export interface MemoryRealtimeClient extends RealtimeClient {
  /** Simulates the server pushing an event to subscribers. */
  emit<E extends RealtimeEventName>(topic: string, event: E, payload: RealtimeEvents[E]): void;
  /** Frames sent with `publish`, for assertions. */
  readonly published: readonly PublishedFrame[];
  /** Topics that currently have subscribers. */
  activeTopics(): string[];
}

/**
 * In-process RealtimeClient with no network. Used in tests and anywhere a
 * transport is not available. Events published by the client are NOT
 * echoed back to subscribers.
 */
export function createMemoryRealtimeClient(): MemoryRealtimeClient {
  const registry = new SubscriptionRegistry();
  const statusListeners = new Set<(status: ConnectionStatus) => void>();
  const published: PublishedFrame[] = [];
  let status: ConnectionStatus = 'idle';

  function setStatus(next: ConnectionStatus) {
    status = next;
    for (const listener of [...statusListeners]) listener(next);
  }

  return {
    get status() {
      return status;
    },
    published,
    connect: () => {
      setStatus('open');
    },
    disconnect: () => {
      setStatus('closed');
    },
    subscribe(topic, event, handler) {
      const anyHandler = handler as (payload: unknown, meta: RealtimeEventMeta) => void;
      registry.add(topic, event, anyHandler);
      return () => {
        registry.remove(topic, event, anyHandler);
      };
    },
    publish(topic, event, payload) {
      published.push({ topic, event, payload });
    },
    emit(topic, event, payload) {
      registry.dispatch(topic, event, payload);
    },
    activeTopics: () => registry.topicNames(),
    onStatusChange(listener) {
      statusListeners.add(listener);
      return () => statusListeners.delete(listener);
    },
  };
}
