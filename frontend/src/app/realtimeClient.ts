import { env } from '@/config/env';
import { createWebSocketClient, type RealtimeClient } from '@/lib/realtime';

/** Creates the app's real-time client. The token is read lazily on each connect. */
export function createAppRealtimeClient(getToken: () => string | null | undefined): RealtimeClient {
  return createWebSocketClient({ url: env.realtimeUrl, getToken });
}
