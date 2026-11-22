import { Avatar } from '@/components/ui/Avatar';
import { Icon } from '@/components/ui/Icon';
import type { PresenceStatus } from '@/types';

import type { ChannelId } from '../../types';
import { ConversationLink } from '../ConversationLink';
import { ConversationSection } from '../ConversationSection';

export interface DirectConversation {
  id: ChannelId;
  kind: 'dm' | 'group';
  label: string;
  unreadCount: number;
  /** For DMs: the other person's avatar and presence. */
  partner?: { name: string; avatarUrl?: string | undefined; presence: PresenceStatus };
}

export interface DirectMessageListProps {
  conversations: readonly DirectConversation[];
}

export function DirectMessageList({ conversations }: DirectMessageListProps) {
  return (
    <ConversationSection
      title="Direct messages"
      isEmpty={conversations.length === 0}
      emptyText="No conversations yet."
    >
      {conversations.map((conversation) => (
        <li key={conversation.id}>
          <ConversationLink
            channelId={conversation.id}
            label={conversation.label}
            unreadCount={conversation.unreadCount}
            description={
              conversation.partner
                ? conversation.partner.presence
                : conversation.kind === 'group'
                  ? 'group conversation'
                  : undefined
            }
            leading={
              conversation.partner ? (
                <Avatar
                  name={conversation.partner.name}
                  src={conversation.partner.avatarUrl}
                  presence={conversation.partner.presence}
                  size="sm"
                  decorative
                />
              ) : (
                <Icon name="users" size="sm" />
              )
            }
          />
        </li>
      ))}
    </ConversationSection>
  );
}
