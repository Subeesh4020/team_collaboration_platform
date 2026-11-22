import type { Permission } from '@/lib/permissions';

export const integrationsPermissions = {
  view: 'integrations:view',
  manage: 'integrations:manage',
} as const satisfies Record<string, Permission>;
