/**
 * In-memory "database" for the mock backend. Handlers read and mutate it so
 * the UI behaves like it talks to a real server. Call `resetMockDb()` in tests.
 */
import { isRole, type Role, type User } from '@/types';

import { CURRENT_USER_ID, usersFixture, workspaceFixture } from './fixtures/users';

const ROLE_STORAGE_KEY = 'teamspace:mock-role';

function readStoredRole(): Role | null {
  try {
    const value = globalThis.localStorage.getItem(ROLE_STORAGE_KEY);
    return isRole(value) ? value : null;
  } catch {
    return null;
  }
}

function createState() {
  return {
    workspace: { ...workspaceFixture },
    users: usersFixture.map((user) => ({ ...user })),
    currentUserId: CURRENT_USER_ID,
  };
}

let state = createState();

/** Seeds per-feature tables. Features register a reset callback here. */
const resetCallbacks = new Set<() => void>();

export const mockDb = {
  get workspace() {
    return state.workspace;
  },
  get users(): readonly User[] {
    return state.users;
  },
  findUser(id: string): User | undefined {
    return state.users.find((user) => user.id === id);
  },
  currentUser(): User {
    const user = state.users.find((u) => u.id === state.currentUserId);
    if (!user) throw new Error('Mock current user missing');
    const storedRole = readStoredRole();
    return storedRole ? { ...user, role: storedRole } : user;
  },
  setCurrentRole(role: Role): void {
    try {
      globalThis.localStorage.setItem(ROLE_STORAGE_KEY, role);
    } catch {
      // Without storage, the role still applies until the page reloads.
    }
    state.users = state.users.map((user) =>
      user.id === state.currentUserId ? { ...user, role } : user,
    );
  },
  onReset(callback: () => void): void {
    resetCallbacks.add(callback);
  },
};

export function resetMockDb(): void {
  try {
    globalThis.localStorage.removeItem(ROLE_STORAGE_KEY);
  } catch {
    // ignore
  }
  state = createState();
  for (const callback of resetCallbacks) callback();
}
