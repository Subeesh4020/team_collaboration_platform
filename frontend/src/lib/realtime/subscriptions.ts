import type { RealtimeEventMeta } from './types';

type AnyHandler = (payload: unknown, meta: RealtimeEventMeta) => void;

/**
 * Topic → event → handlers registry shared by every RealtimeClient
 * implementation. Reports when a topic gains its first or loses its last
 * handler so the transport can (un)subscribe on the server.
 */
export class SubscriptionRegistry {
  private readonly topics = new Map<string, Map<string, Set<AnyHandler>>>();

  /** Adds a handler. Returns whether this is the first handler for the topic. */
  add(topic: string, event: string, handler: AnyHandler): boolean {
    let events = this.topics.get(topic);
    const isNewTopic = !events;
    if (!events) {
      events = new Map();
      this.topics.set(topic, events);
    }
    let handlers = events.get(event);
    if (!handlers) {
      handlers = new Set();
      events.set(event, handlers);
    }
    handlers.add(handler);
    return isNewTopic;
  }

  /** Removes a handler. Returns whether the topic has no handlers left. */
  remove(topic: string, event: string, handler: AnyHandler): boolean {
    const events = this.topics.get(topic);
    if (!events) return false;
    const handlers = events.get(event);
    handlers?.delete(handler);
    if (handlers?.size === 0) events.delete(event);
    if (events.size === 0) {
      this.topics.delete(topic);
      return true;
    }
    return false;
  }

  dispatch(topic: string, event: string, payload: unknown): void {
    const handlers = this.topics.get(topic)?.get(event);
    if (!handlers) return;
    for (const handler of [...handlers]) {
      try {
        handler(payload, { topic });
      } catch (error) {
        console.error(`[realtime] handler for "${event}" on "${topic}" threw`, error);
      }
    }
  }

  topicNames(): string[] {
    return [...this.topics.keys()];
  }
}
