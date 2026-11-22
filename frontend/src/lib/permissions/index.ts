/*
 * Frontend permissions layer.
 *
 * IMPORTANT: UI gating is ONLY for usability. It hides or disables actions a
 * user cannot perform so the interface stays clear. It is NOT security.
 * The real enforcement MUST happen on the server for every request.
 */
export { Can, type CanProps } from './Can';
export { PermissionProvider, type PermissionProviderProps } from './PermissionProvider';
export { useCan, usePermission, usePermissionSubject } from './context';
export { PERMISSIONS, isPermission, type Permission } from './permissions';
export {
  checkPermission,
  createCan,
  type CanFn,
  type PermissionResource,
  type PermissionSubject,
} from './policy';
export { ROLE_PERMISSIONS, type PermissionScope, type RolePermissions } from './roles';
