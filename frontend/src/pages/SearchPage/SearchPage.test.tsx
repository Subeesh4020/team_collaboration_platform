import { screen, within } from '@testing-library/react';

import { mockDb } from '@/mocks/db';
import { renderApp } from '@/test/renderWithProviders';

describe('Universal search', () => {
  it('searches every module through the provider registry', async () => {
    renderApp({ route: '/search?q=launch' });

    expect(await screen.findByText(/results for “launch”/)).toBeInTheDocument();

    const messages = screen.getByRole('region', { name: 'Messages' });
    expect(
      within(messages).getByRole('link', { name: /Launch checklist v2 attached/ }),
    ).toHaveAttribute('href', '/chat/c_partners');
    expect(
      within(screen.getByRole('region', { name: 'Meetings & recordings' })).getByText(
        'Q1 launch planning',
      ),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole('region', { name: 'Files' })).getByText('launch-checklist-v2.pdf'),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole('region', { name: 'Documents' })).getByText('Launch press release'),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole('region', { name: 'Tasks' })).getByText('Draft launch checklist'),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole('region', { name: 'Wiki' })).getByText('How to run a launch'),
    ).toBeInTheDocument();
  });

  it('asks for a longer query and reports when nothing matches', async () => {
    const { user } = renderApp({ route: '/search' });
    const input = await screen.findByRole('searchbox', { name: 'Search everything' });
    expect(screen.getByText('Type at least 2 characters to search.')).toBeInTheDocument();

    await user.type(input, 'zzqx');

    expect(await screen.findByRole('heading', { name: 'No results' })).toBeInTheDocument();
  });

  it('skips providers the user may not use', async () => {
    mockDb.setCurrentRole('guest');
    renderApp({ route: '/search?q=launch' });

    expect(await screen.findByText(/results for “launch”/)).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Wiki' })).not.toBeInTheDocument();
    // Guests still find items shared with them.
    expect(screen.getByRole('region', { name: 'Files' })).toBeInTheDocument();
  });

  it('opens the search page from the top bar', async () => {
    const { user } = renderApp({ route: '/chat' });
    const banner = await screen.findByRole('banner');
    const box = within(banner).getByRole('searchbox', { name: 'Quick search' });

    await user.type(box, 'holiday{Enter}');

    expect(await screen.findByRole('heading', { level: 1, name: 'Search' })).toBeInTheDocument();
    expect(
      await within(await screen.findByRole('region', { name: 'Wiki' })).findByText(
        'Holiday schedule',
      ),
    ).toBeInTheDocument();
  });
});
