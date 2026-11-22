import { setupWorker } from 'msw/browser';

import { handlers } from './handlers';
import { startChatSimulation } from './handlers/chat';

export const worker = setupWorker(...handlers);

export async function startMockWorker(): Promise<void> {
  await worker.start({
    onUnhandledFrame: 'bypass',
    quiet: true,
  });
  startChatSimulation();
}
