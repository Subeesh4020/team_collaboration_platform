import { useQuery } from '@tanstack/react-query';

import { fetchWikiPages } from './wikiApi';
import { wikiKeys } from './wikiKeys';

export function useWikiPagesQuery() {
  return useQuery({ queryKey: wikiKeys.pages(), queryFn: ({ signal }) => fetchWikiPages(signal) });
}
