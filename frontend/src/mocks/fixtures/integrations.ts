import type { Integration } from '@/features/integrations';

import { daysAgo } from './time';

export const integrationsFixture: Integration[] = [
  {
    id: 'i_gcal',
    provider: 'google-calendar',
    category: 'calendar',
    name: 'Google Calendar',
    connected: true,
    connectedAt: daysAgo(30),
  },
  {
    id: 'i_outlook',
    provider: 'outlook-calendar',
    category: 'calendar',
    name: 'Outlook Calendar',
    connected: false,
  },
  {
    id: 'i_gdrive',
    provider: 'google-drive',
    category: 'storage',
    name: 'Google Drive',
    connected: false,
  },
  {
    id: 'i_onedrive',
    provider: 'onedrive',
    category: 'storage',
    name: 'OneDrive',
    connected: false,
  },
];
