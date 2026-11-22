import { checkPermission, type PermissionSubject } from './policy';

const owner: PermissionSubject = { id: 'u1', role: 'owner' };
const admin: PermissionSubject = { id: 'u2', role: 'admin' };
const member: PermissionSubject = { id: 'u3', role: 'member' };
const guest: PermissionSubject = { id: 'u4', role: 'guest' };

describe('checkPermission', () => {
  it('denies everything when signed out', () => {
    expect(checkPermission(null, 'chat:read')).toBe(false);
  });

  it('grants owners every permission', () => {
    expect(checkPermission(owner, 'workspace:manage')).toBe(true);
    expect(checkPermission(owner, 'chat:delete-message', { ownerId: 'someone-else' })).toBe(true);
  });

  it('grants admins everything except workspace management', () => {
    expect(checkPermission(admin, 'members:manage-roles')).toBe(true);
    expect(checkPermission(admin, 'workspace:manage')).toBe(false);
  });

  it('limits members to their own items for "own" scoped permissions', () => {
    expect(checkPermission(member, 'chat:delete-message')).toBe(true);
    expect(checkPermission(member, 'chat:delete-message', { ownerId: 'u3' })).toBe(true);
    expect(checkPermission(member, 'chat:delete-message', { ownerId: 'u1' })).toBe(false);
  });

  it('lets members read public resources and private ones they belong to', () => {
    expect(checkPermission(member, 'chat:read', { visibility: 'public' })).toBe(true);
    expect(checkPermission(member, 'chat:read', { visibility: 'private', memberIds: ['u3'] })).toBe(
      true,
    );
    expect(checkPermission(member, 'chat:read', { visibility: 'private', memberIds: ['u1'] })).toBe(
      false,
    );
  });

  it('denies members permissions they do not have at all', () => {
    expect(checkPermission(member, 'wiki:publish')).toBe(false);
    expect(checkPermission(member, 'integrations:manage')).toBe(false);
  });

  it('only lets guests into resources they were invited to', () => {
    expect(checkPermission(guest, 'chat:read', { visibility: 'public' })).toBe(false);
    expect(checkPermission(guest, 'chat:read', { visibility: 'public', memberIds: ['u4'] })).toBe(
      true,
    );
    expect(checkPermission(guest, 'chat:create-channel')).toBe(false);
    expect(checkPermission(guest, 'members:view')).toBe(false);
  });
});
