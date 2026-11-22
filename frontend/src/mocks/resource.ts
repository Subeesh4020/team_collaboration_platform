import { delay, http, HttpResponse } from 'msw';

import { checkPermission, type Permission, type PermissionResource } from '@/lib/permissions';

import { mockDb } from './db';
import { apiUrl, errorResponse } from './utils';

export interface SearchableResourceOptions<T> {
  /** API path, e.g. "/files". Also serves `${path}/search?q=`. */
  path: string;
  items: () => readonly T[];
  /** Text matched by search. */
  text: (item: T) => string;
  /** Permission needed to list or search. */
  permission: Permission;
  /** Per-item facts for scoped checks (e.g. guests only see invited items). */
  resource?: (item: T) => PermissionResource;
}

/**
 * Builds list + search handlers for a module skeleton, enforcing the same
 * permission policy as the UI, the way a real backend would.
 */
export function searchableResource<T>(options: SearchableResourceOptions<T>) {
  const visibleItems = () => {
    const user = mockDb.currentUser();
    const subject = { id: user.id, role: user.role };
    if (!checkPermission(subject, options.permission)) return null;
    return options
      .items()
      .filter((item) =>
        options.resource
          ? checkPermission(subject, options.permission, options.resource(item))
          : true,
      );
  };

  return [
    http.get(apiUrl(`${options.path}/search`), async ({ request }) => {
      const items = visibleItems();
      if (!items) return errorResponse(403, 'forbidden', 'Not allowed.');
      const url = new URL(request.url);
      const query = (url.searchParams.get('q') ?? '').trim().toLowerCase();
      const limit = Number(url.searchParams.get('limit') ?? 10) || 10;
      const matches = query
        ? items.filter((item) => options.text(item).toLowerCase().includes(query))
        : [];
      await delay();
      return HttpResponse.json({ hits: matches.slice(0, limit), total: matches.length });
    }),

    http.get(apiUrl(options.path), async () => {
      const items = visibleItems();
      if (!items) return errorResponse(403, 'forbidden', 'Not allowed.');
      await delay();
      return HttpResponse.json(items);
    }),
  ];
}
