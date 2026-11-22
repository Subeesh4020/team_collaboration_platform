import { delay, http, HttpResponse } from 'msw';

import type { Session, SwitchDevRoleRequest } from '@/features/auth';
import { isRole } from '@/types';

import { mockDb } from '../db';
import { apiUrl, errorResponse } from '../utils';

function currentSession(): Session {
  const user = mockDb.currentUser();
  return { user, workspace: mockDb.workspace, accessToken: `mock-token-${user.id}` };
}

export const authHandlers = [
  http.get(apiUrl('/session'), async () => {
    await delay();
    return HttpResponse.json(currentSession());
  }),

  http.put(apiUrl('/dev/session/role'), async ({ request }) => {
    const body = (await request.json()) as Partial<SwitchDevRoleRequest> | null;
    if (!isRole(body?.role)) return errorResponse(400, 'invalid_role', 'Unknown role');
    mockDb.setCurrentRole(body.role);
    await delay();
    return HttpResponse.json(currentSession());
  }),
];
