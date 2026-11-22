import type { ReactNode } from 'react';

import type { Permission } from '@/lib/permissions';

export interface SearchContext {
  signal: AbortSignal;
  /** Max number of hits wanted from this provider. */
  limit: number;
}

export interface SearchHitsPage<THit> {
  hits: THit[];
  total: number;
}

/**
 * Contract each feature implements to take part in universal search.
 * Exported from the feature's `index.ts` and registered in `app/searchRegistry.ts`.
 *
 * Methods use method syntax on purpose, so providers with different hit
 * types can live in one registry.
 */
export interface SearchProvider<THit = unknown> {
  /** Unique key, e.g. "messages", "files". */
  type: string;
  /** Group heading in the results, e.g. "Messages". */
  label: string;
  /** Users without this permission don't query this provider. */
  permission?: Permission;
  search(query: string, context: SearchContext): Promise<SearchHitsPage<THit>>;
  renderResult(hit: THit): ReactNode;
  /** Stable React key for a hit. */
  getKey(hit: THit): string;
  /** App-relative URL to open the hit. */
  getHref(hit: THit): string;
}
