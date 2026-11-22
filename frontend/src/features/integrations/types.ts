import type { IsoDateString } from '@/types';

export type IntegrationProvider =
  'google-calendar' | 'outlook-calendar' | 'google-drive' | 'onedrive';

export interface Integration {
  id: string;
  provider: IntegrationProvider;
  category: 'calendar' | 'storage';
  name: string;
  connected: boolean;
  connectedAt?: IsoDateString;
}
