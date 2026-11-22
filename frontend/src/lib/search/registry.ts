import type { SearchProvider } from './types';

export interface SearchRegistry {
  getAll(): readonly SearchProvider[];
  get(type: string): SearchProvider | undefined;
}

/** Builds an immutable registry. Throws on duplicate provider types. */
export function createSearchRegistry(providers: readonly SearchProvider[]): SearchRegistry {
  const byType = new Map<string, SearchProvider>();
  for (const provider of providers) {
    if (byType.has(provider.type)) {
      throw new Error(`Duplicate search provider type "${provider.type}"`);
    }
    byType.set(provider.type, provider);
  }
  const all = Object.freeze([...providers]);
  return {
    getAll: () => all,
    get: (type) => byType.get(type),
  };
}
