import { encode, parseClientMessage, type ClientMessage } from './protocol';
import { createWebSocketClient, type WebSocketLike } from './websocketClient';

class FakeSocket implements WebSocketLike {
  readyState = 0;
  sent: ClientMessage[] = [];
  onopen: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;

  send(data: string) {
    const message = parseClientMessage(data);
    if (message) this.sent.push(message);
  }

  close() {
    this.readyState = 3;
    this.onclose?.(new CloseEvent('close'));
  }

  // Test helpers
  open() {
    this.readyState = 1;
    this.onopen?.(new Event('open'));
  }

  drop() {
    this.readyState = 3;
    this.onclose?.(new CloseEvent('close'));
  }

  receive(topic: string, event: string, payload: unknown) {
    this.onmessage?.(
      new MessageEvent('message', { data: encode({ type: 'event', topic, event, payload }) }),
    );
  }
}

function setup() {
  const sockets: FakeSocket[] = [];
  const client = createWebSocketClient({
    url: 'ws://test/realtime',
    getToken: () => 'token-123',
    createSocket: () => {
      const socket = new FakeSocket();
      sockets.push(socket);
      return socket;
    },
    reconnect: { initialDelayMs: 100, maxDelayMs: 1000 },
  });
  const latest = () => {
    const socket = sockets.at(-1);
    if (!socket) throw new Error('no socket created');
    return socket;
  };
  return { client, sockets, latest };
}

describe('createWebSocketClient', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('authenticates and subscribes when the connection opens', () => {
    const { client, latest } = setup();
    client.subscribe('chat:channel:general', 'presence.changed', vi.fn());
    client.connect();
    latest().open();

    expect(client.status).toBe('open');
    expect(latest().sent).toEqual([
      { type: 'auth', token: 'token-123' },
      { type: 'subscribe', topic: 'chat:channel:general' },
    ]);
  });

  it('dispatches incoming events to matching handlers only', () => {
    const { client, latest } = setup();
    const handler = vi.fn();
    const other = vi.fn();
    client.subscribe('topic-a', 'presence.changed', handler);
    client.subscribe('topic-b', 'presence.changed', other);
    client.connect();
    latest().open();

    latest().receive('topic-a', 'presence.changed', { userId: 'u1', status: 'online' });

    expect(handler).toHaveBeenCalledWith({ userId: 'u1', status: 'online' }, { topic: 'topic-a' });
    expect(other).not.toHaveBeenCalled();
  });

  it('unsubscribes from the server when the last handler is removed', () => {
    const { client, latest } = setup();
    client.connect();
    latest().open();
    const off1 = client.subscribe('t', 'presence.changed', vi.fn());
    const off2 = client.subscribe('t', 'presence.changed', vi.fn());

    off1();
    expect(latest().sent).not.toContainEqual({ type: 'unsubscribe', topic: 't' });
    off2();
    expect(latest().sent).toContainEqual({ type: 'unsubscribe', topic: 't' });
  });

  it('reconnects with backoff and re-subscribes active topics', () => {
    const { client, sockets, latest } = setup();
    client.subscribe('t', 'presence.changed', vi.fn());
    client.connect();
    latest().open();

    latest().drop();
    expect(client.status).toBe('reconnecting');
    expect(sockets).toHaveLength(1);

    vi.advanceTimersByTime(1000);
    expect(sockets).toHaveLength(2);
    latest().open();

    expect(client.status).toBe('open');
    expect(latest().sent).toContainEqual({ type: 'subscribe', topic: 't' });
  });

  it('queues publishes while offline and flushes them on reconnect', () => {
    const { client, latest } = setup();
    client.connect();
    client.publish('t', 'presence.changed', { userId: 'u1', status: 'away' });
    expect(latest().sent).toEqual([]);

    latest().open();

    expect(latest().sent).toContainEqual({
      type: 'publish',
      topic: 't',
      event: 'presence.changed',
      payload: { userId: 'u1', status: 'away' },
    });
  });

  it('does not reconnect after a manual disconnect', () => {
    const { client, sockets, latest } = setup();
    client.connect();
    latest().open();

    client.disconnect();
    vi.advanceTimersByTime(60_000);

    expect(client.status).toBe('closed');
    expect(sockets).toHaveLength(1);
  });

  it('notifies status listeners', () => {
    const { client, latest } = setup();
    const statuses: string[] = [];
    client.onStatusChange((status) => statuses.push(status));
    client.connect();
    latest().open();
    latest().drop();

    expect(statuses).toEqual(['connecting', 'open', 'reconnecting']);
  });
});
