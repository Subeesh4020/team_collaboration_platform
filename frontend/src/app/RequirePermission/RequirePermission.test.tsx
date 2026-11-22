import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { PermissionProvider } from '@/lib/permissions';
import type { Role } from '@/types';

import { RequirePermission } from './RequirePermission';

function renderAs(role: Role) {
  render(
    <MemoryRouter>
      <PermissionProvider subject={{ id: 'u1', role }}>
        <RequirePermission permission="integrations:manage">
          <p>Integration settings</p>
        </RequirePermission>
      </PermissionProvider>
    </MemoryRouter>,
  );
}

describe('<RequirePermission>', () => {
  it('renders the page when allowed', () => {
    renderAs('admin');
    expect(screen.getByText('Integration settings')).toBeInTheDocument();
  });

  it('renders the forbidden page when not allowed', () => {
    renderAs('member');
    expect(screen.queryByText('Integration settings')).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: "You don't have access to this page" }),
    ).toBeInTheDocument();
  });
});
