import type { ReactNode } from 'react';

import { SearchRegistryContext } from '../context';
import type { SearchRegistry } from '../registry';

export interface SearchRegistryProviderProps {
  registry: SearchRegistry;
  children: ReactNode;
}

export function SearchRegistryProvider({ registry, children }: SearchRegistryProviderProps) {
  return <SearchRegistryContext value={registry}>{children}</SearchRegistryContext>;
}
