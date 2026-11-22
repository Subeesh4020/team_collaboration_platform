import { render, type RenderResult } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider, type RouteObject } from 'react-router';

import { AppProviders } from '@/app/providers';
import { createQueryClient } from '@/app/queryClient';
import { buildRoutes } from '@/app/routes';
import { createMemoryRealtimeClient, type MemoryRealtimeClient } from '@/lib/realtime';

export interface RenderAppOptions {
  /** Initial URL. Defaults to "/". */
  route?: string;
  /** Custom routes instead of the app's real route tree. */
  routes?: RouteObject[];
}

export interface RenderAppResult extends RenderResult {
  user: UserEvent;
  realtime: MemoryRealtimeClient;
}

/**
 * Renders the app (or custom routes) with real providers, the MSW mock API
 * and an in-memory real-time client the test can push events through.
 */
export function renderApp({ route = '/', routes }: RenderAppOptions = {}): RenderAppResult {
  const queryClient = createQueryClient();
  queryClient.setDefaultOptions({
    queries: { ...queryClient.getDefaultOptions().queries, retry: false },
  });
  const realtime = createMemoryRealtimeClient();
  const router = createMemoryRouter(routes ?? buildRoutes(), { initialEntries: [route] });
  const user = userEvent.setup();

  const result = render(
    <AppProviders queryClient={queryClient} realtimeClient={realtime}>
      <RouterProvider router={router} />
    </AppProviders>,
  );

  return { ...result, user, realtime };
}
