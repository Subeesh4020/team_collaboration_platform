import { ws } from 'msw';

import { env } from '@/config/env';
import {
  encode,
  parseClientMessage,
  type RealtimeEventName,
  type RealtimeEvents,
} from '@/lib/realtime';

/**
 * Mock real-time server. Tracks which topics each client subscribed to and
 * lets other mock handlers push events (e.g. after a message is posted).
 */
const link = ws.link(env.realtimeUrl);

type Client = Parameters<Parameters<typeof link.addEventListener<'connection'>>[1]>[0]['client'];

const subscriptions = new Map<Client, Set<string>>();

export const realtimeHandler = link.addEventListener('connection', ({ client }) => {
  subscriptions.set(client, new Set());

  client.addEventListener('message', (event) => {
    const message = parseClientMessage(event.data);
    const topics = subscriptions.get(client);
    if (!message || !topics) return;
    if (message.type === 'subscribe') topics.add(message.topic);
    if (message.type === 'unsubscribe') topics.delete(message.topic);
  });

  client.addEventListener('close', () => {
    subscriptions.delete(client);
  });
});

export const mockRealtime = {
  /** Pushes an event to every client subscribed to `topic`. */
  broadcast<E extends RealtimeEventName>(topic: string, event: E, payload: RealtimeEvents[E]) {
    const frame = encode({ type: 'event', topic, event, payload });
    for (const [client, topics] of subscriptions) {
      if (topics.has(topic)) client.send(frame);
    }
  },
};
