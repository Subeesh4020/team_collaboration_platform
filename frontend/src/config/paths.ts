/**
 * Every route path in the app. Use these helpers instead of string literals
 * so routes can be renamed in one place.
 */
export const routePatterns = {
  home: '/',
  chat: '/chat',
  chatChannel: '/chat/:channelId',
  meetings: '/meetings',
  files: '/files',
  documents: '/documents',
  tasks: '/tasks',
  wiki: '/wiki',
  search: '/search',
  integrations: '/integrations',
  members: '/members',
  notifications: '/notifications',
  settings: '/settings',
  forbidden: '/forbidden',
} as const;

export const paths = {
  home: () => routePatterns.home,
  chat: () => routePatterns.chat,
  chatChannel: (channelId: string) => `/chat/${encodeURIComponent(channelId)}`,
  meetings: () => routePatterns.meetings,
  files: () => routePatterns.files,
  documents: () => routePatterns.documents,
  tasks: () => routePatterns.tasks,
  wiki: () => routePatterns.wiki,
  search: (query?: string) =>
    query ? `${routePatterns.search}?q=${encodeURIComponent(query)}` : routePatterns.search,
  integrations: () => routePatterns.integrations,
  members: () => routePatterns.members,
  notifications: () => routePatterns.notifications,
  settings: () => routePatterns.settings,
  forbidden: () => routePatterns.forbidden,
} as const;
