import type { ReactNode } from 'react';

import { Icon } from '@/components/ui/Icon';

import type { Channel } from '../../types';
import { ConversationLink } from '../ConversationLink';
import { ConversationSection } from '../ConversationSection';

export interface ChannelListProps {
  channels: readonly Channel[];
  /** Header action, e.g. the "create channel" button. */
  action?: ReactNode;
}

export function ChannelList({ channels, action }: ChannelListProps) {
  return (
    <ConversationSection
      title="Channels"
      action={action}
      isEmpty={channels.length === 0}
      emptyText="No channels yet."
    >
      {channels.map((channel) => {
        const isPrivate = channel.visibility === 'private';
        return (
          <li key={channel.id}>
            <ConversationLink
              channelId={channel.id}
              label={channel.name}
              unreadCount={channel.unreadCount}
              description={isPrivate ? 'private channel' : undefined}
              leading={<Icon name={isPrivate ? 'lock' : 'hash'} size="sm" />}
            />
          </li>
        );
      })}
    </ConversationSection>
  );
}
