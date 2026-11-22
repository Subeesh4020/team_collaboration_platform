import { apiClient } from '@/lib/api';

import type { AppNotification } from '../types';

export function fetchNotifications(signal?: AbortSignal): Promise<AppNotification[]> {
  return apiClient.get<AppNotification[]>('/notifications', { signal });
}
