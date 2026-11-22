import type { User, Workspace } from '@/types';

export const workspaceFixture: Workspace = {
  id: 'ws_acme',
  name: 'Acme Inc.',
  slug: 'acme',
};

export const usersFixture: User[] = [
  {
    id: 'u_ada',
    name: 'Ada Lovelace',
    email: 'ada@acme.test',
    title: 'Head of Product',
    role: 'owner',
  },
  {
    id: 'u_grace',
    name: 'Grace Hopper',
    email: 'grace@acme.test',
    title: 'Engineering Manager',
    role: 'admin',
  },
  { id: 'u_alan', name: 'Alan Turing', email: 'alan@acme.test', title: 'Designer', role: 'member' },
  {
    id: 'u_katherine',
    name: 'Katherine Johnson',
    email: 'katherine@acme.test',
    title: 'Data Analyst',
    role: 'member',
  },
  {
    id: 'u_linus',
    name: 'Linus Pauling',
    email: 'linus@acme.test',
    title: 'Operations',
    role: 'member',
  },
  {
    id: 'u_marie',
    name: 'Marie Curie',
    email: 'marie@partner.test',
    title: 'Contractor',
    role: 'guest',
  },
];

/** The user the mock session signs in as. */
export const CURRENT_USER_ID = 'u_ada';
