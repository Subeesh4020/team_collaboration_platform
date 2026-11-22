import { paths } from '@/config/paths';
import type { SearchProvider } from '@/lib/search';

import { searchMessages } from './api/chatApi';
import { MessageSearchResult } from './components/MessageSearchResult';
import type { MessageSearchHit } from './types';

/** Universal search provider for chat messages. Registered in `app/searchRegistry.ts`. */
export const chatSearchProvider: SearchProvider<MessageSearchHit> = {
  type: 'messages',
  label: 'Messages',
  search: (query, { signal, limit }) => searchMessages(query, limit, signal),
  renderResult: (hit) => <MessageSearchResult hit={hit} />,
  getKey: (hit) => hit.message.id,
  getHref: (hit) => paths.chatChannel(hit.channelId),
};
