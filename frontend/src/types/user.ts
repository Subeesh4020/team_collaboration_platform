import type { Role } from './role';

export type UserId = string;

export type PresenceStatus = 'online' | 'away' | 'offline';

/** Public profile of a workspace member, safe to show to other members. */
export interface User {
  id: UserId;
  name: string;
  email: string;
  avatarUrl?: string;
  title?: string;
  role: Role;
}
