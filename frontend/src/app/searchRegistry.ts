import { chatSearchProvider } from '@/features/chat';
import { documentsSearchProvider } from '@/features/documents';
import { filesSearchProvider } from '@/features/files';
import { meetingsSearchProvider } from '@/features/meetings';
import { tasksSearchProvider } from '@/features/tasks';
import { wikiSearchProvider } from '@/features/wiki';
import { createSearchRegistry, type SearchProvider } from '@/lib/search';

/**
 * Universal search providers, one per feature, in display order. Each
 * feature exports its provider from its `index.ts`; register it here.
 * `features/search` reads providers only through this registry.
 */
const providers: SearchProvider[] = [
  chatSearchProvider,
  meetingsSearchProvider,
  filesSearchProvider,
  documentsSearchProvider,
  tasksSearchProvider,
  wikiSearchProvider,
];

export const searchRegistry = createSearchRegistry(providers);
