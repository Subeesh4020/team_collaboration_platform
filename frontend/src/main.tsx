import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/app/App';
import { env } from '@/config/env';
import { initTheme } from '@/hooks/useTheme';

import '@/styles/global.css';

async function enableMocking(): Promise<void> {
  if (!env.enableMocks) return;
  const { startMockWorker } = await import('@/mocks/browser');
  await startMockWorker();
}

async function bootstrap(): Promise<void> {
  initTheme();
  await enableMocking();

  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Root element #root not found in index.html');

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void bootstrap();
