import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

import { resetMockDb } from '@/mocks/db';
import { server } from '@/mocks/node';

// jsdom has no matchMedia; components that read the colour scheme need it.
Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// jsdom does not implement <dialog>.showModal()/close(); minimal polyfill.
if (typeof HTMLDialogElement.prototype.showModal !== 'function') {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    if (!this.open) return;
    this.open = false;
    this.dispatchEvent(new Event('close'));
  };
}

// jsdom does not implement scrolling APIs used by the message list.
Element.prototype.scrollIntoView = vi.fn();

beforeAll(() => {
  server.listen({ onUnhandledFrame: 'error' });
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  resetMockDb();
  globalThis.localStorage.clear();
});

afterAll(() => {
  server.close();
});
