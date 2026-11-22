import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Spinner } from '@/components/ui/Spinner';
import { paths } from '@/config/paths';
import { Can } from '@/lib/permissions';

import { useChannelsQuery } from '../../api/queries';
import { useChatInboxSubscription } from '../../hooks/useChatInboxSubscription';
import { getDmPartner, useConversationNamer } from '../../hooks/useConversationName';
import { chatPermissions } from '../../permissions';
import type { ChannelId } from '../../types';
import { ChannelList } from '../ChannelList';
import { CreateChannelDialog } from '../CreateChannelDialog';
import { DirectMessageList, type DirectConversation } from '../DirectMessageList';
import styles from './ChatNavigation.module.css';

export interface ChatNavigationProps {
  activeChannelId?: ChannelId | undefined;
}

/** Channel and direct-message lists for the chat module. */
export function ChatNavigation({ activeChannelId }: ChatNavigationProps) {
  const channelsQuery = useChannelsQuery();
  const { members, currentUserId, nameOf } = useConversationNamer();
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useChatInboxSubscription(activeChannelId);

  if (channelsQuery.isPending) {
    return (
      <div className={styles.state}>
        <Spinner label="Loading conversations" />
      </div>
    );
  }

  if (channelsQuery.isError) {
    return (
      <div className={styles.state} role="alert">
        <p>Couldn&apos;t load conversations.</p>
        <Button size="sm" onClick={() => void channelsQuery.refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  const channels = channelsQuery.data
    .filter((channel) => channel.kind === 'channel')
    .sort((a, b) => a.name.localeCompare(b.name));

  const conversations: DirectConversation[] = channelsQuery.data
    .filter((channel) => channel.kind !== 'channel')
    .sort((a, b) => (b.lastMessageAt ?? '').localeCompare(a.lastMessageAt ?? ''))
    .map((channel) => {
      const partner = getDmPartner(channel, members, currentUserId);
      return {
        id: channel.id,
        kind: channel.kind === 'dm' ? 'dm' : 'group',
        label: nameOf(channel),
        unreadCount: channel.unreadCount,
        ...(partner
          ? {
              partner: {
                name: partner.name,
                avatarUrl: partner.avatarUrl,
                presence: partner.presence,
              },
            }
          : {}),
      };
    });

  return (
    <nav className={styles.nav} aria-label="Conversations">
      <ChannelList
        channels={channels}
        action={
          <Can permission={chatPermissions.createChannel}>
            <IconButton
              icon="plus"
              size="sm"
              label="Create channel"
              onClick={() => {
                setCreating(true);
              }}
            />
          </Can>
        }
      />
      <DirectMessageList conversations={conversations} />
      <CreateChannelDialog
        open={creating}
        onClose={() => {
          setCreating(false);
        }}
        onCreated={(channel) => {
          setCreating(false);
          void navigate(paths.chatChannel(channel.id));
        }}
      />
    </nav>
  );
}
