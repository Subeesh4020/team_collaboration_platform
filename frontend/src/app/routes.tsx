import { Navigate, type RouteObject } from 'react-router';

import { isFeatureEnabled } from '@/config/featureFlags';
import { paths, routePatterns } from '@/config/paths';
import { NotFoundPage } from '@/pages/NotFoundPage';

import { AuthenticatedLayout } from './AuthenticatedLayout';
import { RouteErrorBoundary } from './ErrorBoundary';
import { RequirePermission } from './RequirePermission';
import { appRoutes, type AppRouteDefinition } from './routeRegistry';

function toRouteObjects(route: AppRouteDefinition): RouteObject[] {
  const lazy = async () => {
    const Page = await route.load();
    return {
      Component: () => (
        <RequirePermission permission={route.permission}>
          <Page />
        </RequirePermission>
      ),
    };
  };
  return [route.path, ...(route.childPaths ?? [])].map((path) => ({ path, lazy }));
}

/** Builds the route tree from the registry. Exported for tests. */
export function buildRoutes(): RouteObject[] {
  const moduleRoutes = appRoutes
    .filter((route) => !route.flag || isFeatureEnabled(route.flag))
    .flatMap(toRouteObjects);

  return [
    {
      path: routePatterns.home,
      element: <AuthenticatedLayout />,
      errorElement: <RouteErrorBoundary />,
      children: [
        {
          // Errors inside a page render within the shell, keeping navigation usable.
          errorElement: <RouteErrorBoundary />,
          children: [
            { index: true, element: <Navigate to={paths.chat()} replace /> },
            ...moduleRoutes,
            { path: '*', element: <NotFoundPage /> },
          ],
        },
      ],
    },
  ];
}
