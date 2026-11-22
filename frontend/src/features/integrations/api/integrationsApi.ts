import { apiClient } from '@/lib/api';

import type { Integration } from '../types';

export function fetchIntegrations(signal?: AbortSignal): Promise<Integration[]> {
  return apiClient.get<Integration[]>('/integrations', { signal });
}
