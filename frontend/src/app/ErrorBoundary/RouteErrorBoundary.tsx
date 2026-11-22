import { isRouteErrorResponse, useRouteError } from 'react-router';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { env } from '@/config/env';
import { ApiError } from '@/lib/api';
import { NotFoundPage } from '@/pages/NotFoundPage';

import styles from './RouteErrorBoundary.module.css';

function describe(error: unknown): { title: string; message: string } {
  if (error instanceof ApiError) {
    if (error.isNetworkError) return { title: 'You appear to be offline', message: error.message };
    if (error.isForbidden) {
      return { title: 'Access denied', message: "You don't have access to this content." };
    }
    return { title: 'Something went wrong', message: error.message };
  }
  if (isRouteErrorResponse(error)) {
    return {
      title: `${error.status} ${error.statusText}`,
      message: 'The page could not be loaded.',
    };
  }
  return { title: 'Something went wrong', message: 'An unexpected error occurred.' };
}

/**
 * Route-level error boundary (React Router `errorElement`). Catches render,
 * loader and lazy-import errors so one broken module can't blank the app.
 */
export function RouteErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />;

  const { title, message } = describe(error);

  return (
    <div className={styles.root} role="alert">
      <Icon name="alert" />
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.message}>{message}</p>
      <Button
        variant="primary"
        onClick={() => {
          globalThis.location.reload();
        }}
      >
        Reload page
      </Button>
      {env.isDev && error instanceof Error && (
        <pre className={styles.details}>{error.stack ?? error.message}</pre>
      )}
    </div>
  );
}
