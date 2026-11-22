import type { ComponentType } from 'react';

import type { IconName } from '@/components/ui/Icon';
import type { FeatureFlag } from '@/config/featureFlags';
import { routePatterns } from '@/config/paths';
import type { Permission } from '@/lib/permissions';

export interface AppRouteDefinition {
  id: string;
  /** Route pattern; nested paths such as `/chat/:channelId` go in `children`. */
  path: string;
  label: string;
  icon: IconName;
  /** Required to see the route and its navigation entry. */
  permission?: Permission;
  /** Hidden entirely when the flag is off. */
  flag?: FeatureFlag;
  showInNav: boolean;
  /** Lazy-loads the page component so each module is its own chunk. */
  load: () => Promise<ComponentType>;
  /** Extra patterns rendered by the same page (e.g. `/chat/:channelId`). */
  childPaths?: readonly string[];
}

/**
 * Every product module route. Add a module by adding one entry here.
 * All pages are lazy-loaded at route level.
 */
export const appRoutes: readonly AppRouteDefinition[] = [
  {
    id: 'chat',
    path: routePatterns.chat,
    childPaths: [routePatterns.chatChannel],
    label: 'Chat',
    icon: 'chat',
    permission: 'chat:read',
    flag: 'chat',
    showInNav: true,
    load: () => import('@/pages/ChatPage').then((m) => m.ChatPage),
  },
  {
    id: 'meetings',
    path: routePatterns.meetings,
    label: 'Meetings',
    icon: 'video',
    permission: 'meetings:join',
    flag: 'meetings',
    showInNav: true,
    load: () => import('@/pages/MeetingsPage').then((m) => m.MeetingsPage),
  },
  {
    id: 'files',
    path: routePatterns.files,
    label: 'Files',
    icon: 'file',
    permission: 'files:view',
    flag: 'files',
    showInNav: true,
    load: () => import('@/pages/FilesPage').then((m) => m.FilesPage),
  },
  {
    id: 'documents',
    path: routePatterns.documents,
    label: 'Documents',
    icon: 'document',
    permission: 'documents:view',
    flag: 'documents',
    showInNav: true,
    load: () => import('@/pages/DocumentsPage').then((m) => m.DocumentsPage),
  },
  {
    id: 'tasks',
    path: routePatterns.tasks,
    label: 'Tasks',
    icon: 'tasks',
    permission: 'tasks:view',
    flag: 'tasks',
    showInNav: true,
    load: () => import('@/pages/TasksPage').then((m) => m.TasksPage),
  },
  {
    id: 'wiki',
    path: routePatterns.wiki,
    label: 'Knowledge base',
    icon: 'book',
    permission: 'wiki:view',
    flag: 'wiki',
    showInNav: true,
    load: () => import('@/pages/WikiPage').then((m) => m.WikiPage),
  },
  {
    id: 'search',
    path: routePatterns.search,
    label: 'Search',
    icon: 'search',
    permission: 'search:use',
    flag: 'search',
    showInNav: false, // reached from the top bar search box
    load: () => import('@/pages/SearchPage').then((m) => m.SearchPage),
  },
  {
    id: 'notifications',
    path: routePatterns.notifications,
    label: 'Notifications',
    icon: 'bell',
    permission: 'notifications:view',
    flag: 'notifications',
    showInNav: true,
    load: () => import('@/pages/NotificationsPage').then((m) => m.NotificationsPage),
  },
  {
    id: 'members',
    path: routePatterns.members,
    label: 'Members',
    icon: 'users',
    permission: 'members:view',
    flag: 'members',
    showInNav: true,
    load: () => import('@/pages/MembersPage').then((m) => m.MembersPage),
  },
  {
    id: 'integrations',
    path: routePatterns.integrations,
    label: 'Integrations',
    icon: 'plug',
    permission: 'integrations:view',
    flag: 'integrations',
    showInNav: true,
    load: () => import('@/pages/IntegrationsPage').then((m) => m.IntegrationsPage),
  },
  {
    id: 'settings',
    path: routePatterns.settings,
    label: 'Settings',
    icon: 'settings',
    permission: 'settings:view',
    flag: 'settings',
    showInNav: true,
    load: () => import('@/pages/SettingsPage').then((m) => m.SettingsPage),
  },
];
