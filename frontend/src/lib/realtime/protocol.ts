/**
 * Wire protocol shared by the WebSocket client and the MSW mock server.
 * All frames are JSON strings.
 */

export type ClientMessage =
  | { type: 'auth'; token: string }
  | { type: 'subscribe'; topic: string }
  | { type: 'unsubscribe'; topic: string }
  | { type: 'publish'; topic: string; event: string; payload: unknown };

export interface ServerEventMessage {
  type: 'event';
  topic: string;
  event: string;
  payload: unknown;
}

export type ServerMessage = ServerEventMessage;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseJson(data: unknown): unknown {
  if (typeof data !== 'string') return null;
  try {
    return JSON.parse(data) as unknown;
  } catch {
    return null;
  }
}

export function parseServerMessage(data: unknown): ServerMessage | null {
  const value = parseJson(data);
  if (
    isRecord(value) &&
    value.type === 'event' &&
    typeof value.topic === 'string' &&
    typeof value.event === 'string'
  ) {
    return { type: 'event', topic: value.topic, event: value.event, payload: value.payload };
  }
  return null;
}

export function parseClientMessage(data: unknown): ClientMessage | null {
  const value = parseJson(data);
  if (!isRecord(value)) return null;
  switch (value.type) {
    case 'auth':
      return typeof value.token === 'string' ? { type: 'auth', token: value.token } : null;
    case 'subscribe':
    case 'unsubscribe':
      return typeof value.topic === 'string' ? { type: value.type, topic: value.topic } : null;
    case 'publish':
      return typeof value.topic === 'string' && typeof value.event === 'string'
        ? { type: 'publish', topic: value.topic, event: value.event, payload: value.payload }
        : null;
    default:
      return null;
  }
}

export function encode(message: ClientMessage | ServerMessage): string {
  return JSON.stringify(message);
}
