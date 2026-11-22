import { apiClient } from '@/lib/api';
import type { Role } from '@/types';

import type { Session, SwitchDevRoleRequest } from '../types';

export function fetchSession(signal?: AbortSignal): Promise<Session> {
  return apiClient.get<Session>('/session', { signal });
}

/** Dev only: changes the signed-in user's role on the mock backend. */
export function switchDevRole(role: Role): Promise<Session> {
  const body: SwitchDevRoleRequest = { role };
  return apiClient.put<Session>('/dev/session/role', body);
}
