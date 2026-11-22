import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';

import { AppProviders } from './providers';
import { buildRoutes } from './routes';

export function App() {
  const [router] = useState(() => createBrowserRouter(buildRoutes()));
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}
