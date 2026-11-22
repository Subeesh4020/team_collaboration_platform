import { useParams } from 'react-router';

import { SplitPane } from '@/components/layout/SplitPane';
import { ChannelView, ChatEmptyState, ChatNavigation } from '@/features/chat';

/** Route: /chat and /chat/:channelId. Composes the chat feature only. */
export function ChatPage() {
  const { channelId } = useParams<{ channelId: string }>();
  return (
    <SplitPane
      primaryLabel="Conversations"
      secondaryLabel="Conversation"
      mobileView={channelId ? 'secondary' : 'primary'}
      primary={<ChatNavigation activeChannelId={channelId} />}
      secondary={
        channelId ? <ChannelView key={channelId} channelId={channelId} /> : <ChatEmptyState />
      }
    />
  );
}
