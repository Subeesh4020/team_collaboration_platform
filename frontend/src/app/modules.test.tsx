import { screen, within } from '@testing-library/react';

import { mockDb } from '@/mocks/db';
import { renderApp } from '@/test/renderWithProviders';

const moduleRoutes = [
  ['/meetings', 'Meetings'],
  ['/files', 'Files'],
  ['/documents', 'Documents'],
  ['/tasks', 'Tasks & projects'],
  ['/wiki', 'Knowledge base'],
  ['/search', 'Search'],
  ['/notifications', 'Notifications'],
  ['/members', 'Members'],
  ['/integrations', 'Integrations'],
  ['/settings', 'Settings'],
] as const;

describe('module routes', () => {
  it.each(moduleRoutes)('renders %s as a stub inside the app shell', async (route, heading) => {
    renderApp({ route });
    expect(await screen.findByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
  });

  it('shows every module in the navigation for owners', async () => {
    renderApp({ route: '/chat' });
    const nav = await screen.findByRole('navigation', { name: 'Primary' });
    const labels = within(nav)
      .getAllByRole('link')
      .map((link) => link.textContent);
    expect(labels).toEqual([
      'Chat',
      'Meetings',
      'Files',
      'Documents',
      'Tasks',
      'Knowledge base',
      'Notifications',
      'Members',
      'Integrations',
      'Settings',
    ]);
  });

  describe('as a guest', () => {
    beforeEach(() => {
      mockDb.setCurrentRole('guest');
    });

    it('hides modules guests cannot use', async () => {
      renderApp({ route: '/chat' });
      const nav = await screen.findByRole('navigation', { name: 'Primary' });
      expect(within(nav).queryByRole('link', { name: 'Knowledge base' })).not.toBeInTheDocument();
      expect(within(nav).queryByRole('link', { name: 'Members' })).not.toBeInTheDocument();
      expect(within(nav).queryByRole('link', { name: 'Integrations' })).not.toBeInTheDocument();
      expect(within(nav).getByRole('link', { name: 'Files' })).toBeInTheDocument();
    });

    it('shows the forbidden page when opening a hidden module by URL', async () => {
      renderApp({ route: '/wiki' });
      expect(
        await screen.findByRole('heading', { name: "You don't have access to this page" }),
      ).toBeInTheDocument();
    });
  });

  it('gates stub actions by permission', async () => {
    mockDb.setCurrentRole('member');
    renderApp({ route: '/wiki' });
    await screen.findByRole('heading', { level: 1, name: 'Knowledge base' });
    expect(screen.getByRole('button', { name: 'New page' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Publish' })).not.toBeInTheDocument();
  });

  it('shows workspace administration to owners only', async () => {
    const { unmount } = renderApp({ route: '/settings' });
    expect(
      await screen.findByRole('heading', { name: 'Workspace: Acme Inc.' }),
    ).toBeInTheDocument();
    unmount();

    mockDb.setCurrentRole('admin');
    renderApp({ route: '/settings' });
    await screen.findByRole('heading', { level: 1, name: 'Settings' });
    expect(screen.queryByRole('heading', { name: 'Workspace: Acme Inc.' })).not.toBeInTheDocument();
  });
});
