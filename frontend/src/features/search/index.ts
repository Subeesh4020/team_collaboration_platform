/*
 * Universal search. Consumes providers ONLY through the registry in
 * `lib/search` (populated in `app/searchRegistry.ts`); it never imports
 * other features.
 */
export { searchKeys } from './api/searchKeys';
export { SearchBox } from './components/SearchBox';
export { UniversalSearch } from './components/UniversalSearch';
export { useUniversalSearch } from './hooks/useUniversalSearch';
export { searchPermissions } from './permissions';
export type { SearchResultGroup } from './types';
