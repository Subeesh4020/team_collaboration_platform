import type { Role, User, Workspace } from '@/types';

/** Response of `GET /session`: who is signed in, and where. */
export interface Session {
  user: User;
  workspace: Workspace;
  /** Short-lived token for API and real-time requests. */
  accessToken: string;
}

/** Body of the dev-only `PUT /dev/session/role` endpoint (mock backend only). */
export interface SwitchDevRoleRequest {
  role: Role;
}
