import { createContext, useContext } from 'react';

import { createSearchRegistry, type SearchRegistry } from './registry';

const emptyRegistry = createSearchRegistry([]);

export const SearchRegistryContext = createContext<SearchRegistry>(emptyRegistry);

/** The search providers registered by the app. */
export function useSearchRegistry(): SearchRegistry {
  return useContext(SearchRegistryContext);
}
