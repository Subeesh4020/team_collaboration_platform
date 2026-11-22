import { screen, waitFor, within } from '@testing-library/react';
import { http } from 'msw';

import { server } from '@/mocks/node';
import { apiUrl, errorResponse } from '@/mocks/utils';
import { renderApp } from '@/test/renderWithProviders';

describe('App shell', () => {
  it('loads the session and renders the shell with navigation', async () => {
    renderApp({ route: '/' });

    expect(screen.getByRole('status')).toHaveTextContent('Loading workspace');

    // "/" redirects to the chat module.
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Select a conversation' }),
    ).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(within(nav).getByRole('link', { name: 'Chat' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('Acme Inc.')).toBeInTheDocument();
  });

  it('opens the real-time connection once the session has loaded', async () => {
    const { realtime } = renderApp({ route: '/chat' });
    await screen.findByRole('navigation', { name: 'Primary' });
    expect(realtime.status).toBe('open');
  });

  it('switches role from the dev user menu', async () => {
    const { user } = renderApp({ route: '/chat' });
    const trigger = await screen.findByRole('button', { name: /user menu for ada lovelace/i });
    expect(within(trigger).getByText('owner')).toBeInTheDocument();

    await user.click(trigger);
    await user.click(screen.getByRole('menuitemradio', { name: 'Admin' }));

    await waitFor(() => {
      expect(within(trigger).getByText('admin')).toBeInTheDocument();
    });
  });

  it('shows the not found page inside the shell for unknown routes', async () => {
    renderApp({ route: '/does-not-exist' });
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
  });

  it('shows a retryable error when the session fails to load', async () => {
    server.use(
      http.get(apiUrl('/session'), () => errorResponse(500, 'server_error', 'Server unavailable')),
    );
    renderApp({ route: '/chat' });

    expect(await screen.findByRole('alert')).toHaveTextContent('Server unavailable');
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });
});
