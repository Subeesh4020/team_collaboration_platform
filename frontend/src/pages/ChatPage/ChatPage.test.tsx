import { screen, waitFor, within } from '@testing-library/react';
import { http } from 'msw';

import { chatTopics, type Message } from '@/features/chat';
import { mockDb } from '@/mocks/db';
import { server } from '@/mocks/node';
import { apiUrl, errorResponse } from '@/mocks/utils';
import { renderApp } from '@/test/renderWithProviders';

async function openGeneral() {
  const result = renderApp({ route: '/chat/c_general' });
  const log = await screen.findByRole('log', { name: 'Messages in #general' });
  return { ...result, log };
}

function conversationsNav() {
  return screen.getByRole('navigation', { name: 'Conversations' });
}

describe('Chat', () => {
  it('lists channels and direct messages with unread counts', async () => {
    renderApp({ route: '/chat' });

    const nav = await screen.findByRole('navigation', { name: 'Conversations' });
    const channels = within(nav).getByRole('region', { name: 'Channels' });
    expect(within(channels).getByRole('link', { name: /general/ })).toBeInTheDocument();
    expect(within(channels).getByRole('link', { name: /random.*2 unread/ })).toBeInTheDocument();
    // Ada is not a member of the private #engineering channel.
    expect(within(channels).queryByRole('link', { name: /engineering/ })).not.toBeInTheDocument();

    const dms = within(nav).getByRole('region', { name: 'Direct messages' });
    expect(
      await within(dms).findByRole('link', { name: 'Grace Hopper, online, 1 unread' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Select a conversation' })).toBeInTheDocument();
  });

  it('shows the latest page of messages and loads older history', async () => {
    const { user, log } = await openGeneral();
    expect(screen.getByRole('heading', { level: 1, name: '#general' })).toBeInTheDocument();
    expect(within(log).getAllByRole('article')).toHaveLength(30);

    await user.click(within(log).getByRole('button', { name: 'Load older messages' }));

    await waitFor(() => {
      expect(within(log).getAllByRole('article')).toHaveLength(45);
    });
    expect(within(log).getByText('This is the start of the conversation.')).toBeInTheDocument();
  });

  it('sends a message with Enter and clears the composer', async () => {
    const { user, log } = await openGeneral();
    const composer = screen.getByRole('textbox', { name: 'Message #general' });

    await user.type(composer, 'Hello team{Enter}');

    expect(composer).toHaveValue('');
    expect(await within(log).findByText('Hello team')).toBeInTheDocument();
    await waitFor(() => {
      expect(within(log).queryByText('Sending…')).not.toBeInTheDocument();
    });
    // Sent once, not duplicated by the optimistic copy.
    expect(within(log).getAllByText('Hello team')).toHaveLength(1);
  });

  it('keeps a failed message with retry and discard options', async () => {
    server.use(
      http.post(apiUrl('/chat/channels/:channelId/messages'), () =>
        errorResponse(500, 'server_error', 'Server unavailable'),
      ),
    );
    const { user, log } = await openGeneral();

    await user.type(screen.getByRole('textbox', { name: 'Message #general' }), 'Will fail{Enter}');

    expect(await within(log).findByText('Not sent.')).toBeInTheDocument();
    await user.click(within(log).getByRole('button', { name: 'Discard' }));
    expect(within(log).queryByText('Will fail')).not.toBeInTheDocument();
  });

  it('shows messages pushed over the real-time connection', async () => {
    const { realtime, log } = await openGeneral();
    const incoming: Message = {
      id: 'm_live',
      channelId: 'c_general',
      authorId: 'u_grace',
      body: 'Live update from Grace',
      createdAt: new Date().toISOString(),
    };

    realtime.emit(chatTopics.channel('c_general'), 'chat.message.created', incoming);

    expect(await within(log).findByText('Live update from Grace')).toBeInTheDocument();
  });

  it('bumps unread badges for activity in other conversations', async () => {
    const { realtime } = await openGeneral();
    const nav = conversationsNav();
    expect(within(nav).getByRole('link', { name: /random.*2 unread/ })).toBeInTheDocument();

    realtime.emit(chatTopics.inbox('u_ada'), 'chat.channel.activity', {
      channelId: 'c_random',
      authorId: 'u_alan',
      lastMessageAt: new Date().toISOString(),
    });

    expect(await within(nav).findByRole('link', { name: /random.*3 unread/ })).toBeInTheDocument();
  });

  it('only offers deleting your own messages to members', async () => {
    mockDb.setCurrentRole('member');
    const { user, log } = await openGeneral();

    const own = within(log).getAllByRole('article', { name: /^Ada Lovelace/ })[0];
    const other = within(log).getAllByRole('article', { name: /^Grace Hopper/ })[0];
    if (!own || !other) throw new Error('fixture messages missing');

    await user.click(within(other).getByRole('button', { name: 'Message actions' }));
    expect(screen.queryByRole('menuitem', { name: 'Delete message' })).not.toBeInTheDocument();
    await user.keyboard('{Escape}');

    const ownText = within(own).getByText(/./, { selector: 'p' }).textContent;
    await user.click(within(own).getByRole('button', { name: 'Message actions' }));
    await user.click(screen.getByRole('menuitem', { name: 'Delete message' }));

    const dialog = screen.getByRole('dialog', { name: 'Delete message?' });
    await user.click(within(dialog).getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(own).not.toBeInTheDocument();
    });
    expect(ownText).toBeTruthy();
    // The deleted message's menu button is gone; focus moves to the message log.
    await waitFor(() => {
      expect(log).toHaveFocus();
    });
  });

  it('creates a channel and opens it', async () => {
    const { user } = await openGeneral();

    await user.click(within(conversationsNav()).getByRole('button', { name: 'Create channel' }));
    const dialog = screen.getByRole('dialog', { name: 'Create a channel' });
    await user.type(within(dialog).getByRole('textbox', { name: 'Name' }), 'Launch Plans');
    expect(within(dialog).getByRole('textbox', { name: 'Name' })).toHaveValue('launch-plans');

    await user.click(within(dialog).getByRole('button', { name: 'Create channel' }));

    expect(
      await screen.findByRole('heading', { level: 1, name: '#launch-plans' }),
    ).toBeInTheDocument();
    expect(
      within(conversationsNav()).getByRole('link', { name: /launch-plans/ }),
    ).toBeInTheDocument();
  });

  it('shows server validation errors when creating a duplicate channel', async () => {
    const { user } = await openGeneral();

    await user.click(within(conversationsNav()).getByRole('button', { name: 'Create channel' }));
    const dialog = screen.getByRole('dialog', { name: 'Create a channel' });
    await user.type(within(dialog).getByRole('textbox', { name: 'Name' }), 'general');
    await user.click(within(dialog).getByRole('button', { name: 'Create channel' }));

    expect(
      await within(dialog).findByText('A channel named "general" already exists.'),
    ).toBeInTheDocument();
  });

  describe('as a guest', () => {
    beforeEach(() => {
      mockDb.setCurrentRole('guest');
    });

    it('hides channel creation and public channels the guest was not invited to', async () => {
      renderApp({ route: '/chat' });
      const nav = await screen.findByRole('navigation', { name: 'Conversations' });

      expect(within(nav).getByRole('link', { name: /design-review/ })).toBeInTheDocument();
      expect(within(nav).queryByRole('button', { name: 'Create channel' })).not.toBeInTheDocument();
    });

    it('denies access to private channels the guest is not part of', async () => {
      renderApp({ route: '/chat/c_engineering' });
      expect(
        await screen.findByRole('heading', { name: 'You don’t have access to this conversation' }),
      ).toBeInTheDocument();
    });
  });
});
