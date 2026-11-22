/** Workspace roles, ordered from most to least privileged. */
export const ROLES = ['owner', 'admin', 'member', 'guest'] as const;

export type Role = (typeof ROLES)[number];

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (ROLES as readonly string[]).includes(value);
}
