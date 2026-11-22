import { encode, parseServerMessage, type ClientMessage } from './protocol';
import { SubscriptionRegistry } from './subscriptions';
import type { ConnectionStatus, RealtimeClient, RealtimeEventMeta } from './types';

/** Minimal WebSocket surface the client needs; lets tests inject a fake. */
export interface WebSocketLike {
  readonly readyState: number;
  onopen: ((event: Event) => void) | null;
  onclose: ((event: CloseEvent) => void) | null;
  onmessage: ((event: MessageEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  send(data: string): void;
  close(code?: number, reason?: string): void;
}

export type WebSocketFactory = (url: string) => WebSocketLike;

export interface ReconnectOptions {
  initialDelayMs: number;
  maxDelayMs: number;
  /** Stop retrying after this many attempts. Infinity by default. */
  maxAttempts: number;
}

export interface WebSocketClientOptions {
  url: string;
  /** Returns the access token to authenticate with after connecting. */
  getToken?: () => string | null | undefined;
  createSocket?: WebSocketFactory;
  reconnect?: Partial<ReconnectOptions>;
  /** Max frames kept while offline. Oldest frames are dropped first. */
  maxQueueSize?: number;
}

const OPEN = 1;
const DEFAULT_RECONNECT: ReconnectOptions = {
  initialDelayMs: 500,
  maxDelayMs: 30_000,
  maxAttempts: Number.POSITIVE_INFINITY,
};

/** Exponential backoff with full jitter. */
export function getReconnectDelay(attempt: number, options: ReconnectOptions): number {
  const exponential = Math.min(options.maxDelayMs, options.initialDelayMs * 2 ** attempt);
  return Math.round(exponential / 2 + Math.random() * (exponential / 2));
}

export function createWebSocketClient(options: WebSocketClientOptions): RealtimeClient {
  const reconnect = { ...DEFAULT_RECONNECT, ...options.reconnect };
  const maxQueueSize = options.maxQueueSize ?? 100;
  const createSocket: WebSocketFactory = options.createSocket ?? ((url) => new WebSocket(url));

  const registry = new SubscriptionRegistry();
  const statusListeners = new Set<(status: ConnectionStatus) => void>();
  let queue: ClientMessage[] = [];
  let socket: WebSocketLike | null = null;
  let status: ConnectionStatus = 'idle';
  let attempt = 0;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let manuallyClosed = false;

  function setStatus(next: ConnectionStatus) {
    if (next === status) return;
    status = next;
    for (const listener of [...statusListeners]) listener(next);
  }

  function sendNow(message: ClientMessage): boolean {
    if (socket?.readyState !== OPEN) return false;
    socket.send(encode(message));
    return true;
  }

  function sendOrQueue(message: ClientMessage) {
    if (sendNow(message)) return;
    queue.push(message);
    if (queue.length > maxQueueSize) queue = queue.slice(-maxQueueSize);
  }

  function clearReconnectTimer() {
    if (reconnectTimer !== null) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  }

  function scheduleReconnect() {
    if (attempt >= reconnect.maxAttempts) {
      setStatus('closed');
      return;
    }
    setStatus('reconnecting');
    const delay = getReconnectDelay(attempt, reconnect);
    attempt += 1;
    clearReconnectTimer();
    reconnectTimer = setTimeout(open, delay);
  }

  function open() {
    clearReconnectTimer();
    manuallyClosed = false;
    if (status !== 'reconnecting') setStatus('connecting');

    const ws = createSocket(options.url);
    socket = ws;

    ws.onopen = () => {
      attempt = 0;
      const token = options.getToken?.();
      if (token) sendNow({ type: 'auth', token });
      // Re-subscribe to every active topic, then flush queued frames.
      for (const topic of registry.topicNames()) sendNow({ type: 'subscribe', topic });
      const pending = queue;
      queue = [];
      for (const message of pending) {
        // Subscriptions were already re-sent above.
        if (message.type !== 'subscribe' && message.type !== 'unsubscribe') sendNow(message);
      }
      setStatus('open');
    };

    ws.onmessage = (event) => {
      const message = parseServerMessage(event.data);
      if (message) registry.dispatch(message.topic, message.event, message.payload);
    };

    ws.onclose = () => {
      if (socket === ws) socket = null;
      if (manuallyClosed) {
        setStatus('closed');
        return;
      }
      scheduleReconnect();
    };

    ws.onerror = () => {
      // `onclose` always follows `onerror`; reconnection is handled there.
    };
  }

  function handleOnline() {
    if (status === 'reconnecting') {
      attempt = 0;
      open();
    }
  }

  return {
    get status() {
      return status;
    },

    connect() {
      if (status === 'open' || status === 'connecting') return;
      globalThis.addEventListener('online', handleOnline);
      open();
    },

    disconnect() {
      manuallyClosed = true;
      clearReconnectTimer();
      globalThis.removeEventListener('online', handleOnline);
      const ws = socket;
      socket = null;
      ws?.close(1000, 'client disconnect');
      setStatus('closed');
    },

    subscribe(topic, event, handler) {
      const anyHandler = handler as (payload: unknown, meta: RealtimeEventMeta) => void;
      if (registry.add(topic, event, anyHandler)) sendNow({ type: 'subscribe', topic });
      return () => {
        if (registry.remove(topic, event, anyHandler)) sendNow({ type: 'unsubscribe', topic });
      };
    },

    publish(topic, event, payload) {
      sendOrQueue({ type: 'publish', topic, event, payload });
    },

    onStatusChange(listener) {
      statusListeners.add(listener);
      return () => statusListeners.delete(listener);
    },
  };
}
