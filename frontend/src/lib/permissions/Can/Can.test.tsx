import { render, screen } from '@testing-library/react';

import { PermissionProvider } from '../PermissionProvider';
import { Can } from './Can';

describe('<Can>', () => {
  it('renders children when the permission is granted', () => {
    render(
      <PermissionProvider subject={{ id: 'u1', role: 'admin' }}>
        <Can permission="members:invite">
          <button type="button">Invite</button>
        </Can>
      </PermissionProvider>,
    );
    expect(screen.getByRole('button', { name: 'Invite' })).toBeInTheDocument();
  });

  it('renders the fallback when the permission is missing', () => {
    render(
      <PermissionProvider subject={{ id: 'u1', role: 'guest' }}>
        <Can permission="members:invite" fallback={<p>No access</p>}>
          <button type="button">Invite</button>
        </Can>
      </PermissionProvider>,
    );
    expect(screen.queryByRole('button', { name: 'Invite' })).not.toBeInTheDocument();
    expect(screen.getByText('No access')).toBeInTheDocument();
  });

  it('applies resource scope', () => {
    render(
      <PermissionProvider subject={{ id: 'u1', role: 'member' }}>
        <Can permission="chat:delete-message" resource={{ ownerId: 'u2' }}>
          <button type="button">Delete</button>
        </Can>
      </PermissionProvider>,
    );
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
  });
});
