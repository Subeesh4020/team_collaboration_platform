import type { PresenceStatus, User } from '@/types';

/** A workspace member as returned by the directory endpoint. */
export interface Member extends User {
  presence: PresenceStatus;
}
