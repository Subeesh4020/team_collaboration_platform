import { ResultRow } from '@/components/ui/ResultRow';
import { paths } from '@/config/paths';
import type { SearchProvider } from '@/lib/search';

import { searchWikiPages } from './api/wikiApi';
import { wikiPermissions } from './permissions';
import type { WikiPage } from './types';

export const wikiSearchProvider: SearchProvider<WikiPage> = {
  type: 'wiki',
  label: 'Wiki',
  permission: wikiPermissions.view,
  search: (query, { signal, limit }) => searchWikiPages(query, limit, signal),
  renderResult: (page) => (
    <ResultRow
      icon="book"
      title={page.title}
      meta={`${page.section}${page.status === 'draft' ? ' · Draft' : ''}`}
    />
  ),
  getKey: (page) => page.id,
  getHref: () => paths.wiki(),
};
