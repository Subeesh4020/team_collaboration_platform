/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { msw } from 'msw/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  // `worker-only` serves mockServiceWorker.js in dev and emits it on build;
  // the app starts the worker itself (see src/main.tsx) only when mocks are enabled.
  plugins: [react(), msw({ mode: 'worker-only' })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
    restoreMocks: true,
  },
});
