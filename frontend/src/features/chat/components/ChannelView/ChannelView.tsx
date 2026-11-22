import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { useCurrentUser } from '@/features/auth';
import { ApiError } from '@/lib/api';
import { useCan } from '@/lib/permissions';

import {
  discardFailedMessage,
  useChannelQuery,
  useDeleteMessageMutation,
  useMarkChannelReadMutation,
  useMessagesQuery,
  useSendMessage,
} from '../../api/queries';
import { useChannelMessagesSubscription } from '../../hooks/useChannelMessagesSubscription';
import { useConversationNamer } from '../../hooks/useConversationName';
import { channelResource, chatPermissions } from '../../permissions';
import type { ChannelId, ChatMessage } from '../../types';
import { ChannelHeader } from '../ChannelHeader';
import { MessageComposer } from '../MessageComposer';
import { MessageItem } from '../MessageItem';
import { MessageList } from '../MessageList';
import styles from './ChannelView.module.css';

export interface ChannelViewProps {
  channelId: ChannelId;
}

function ChannelError({ error, onRetry }: { error: Error; onRetry: () => void }) {
  const apiError = error instanceof ApiError ? error : null;
  if (apiError?.isForbidden || apiError?.isNotFound) {
    return (
      <div className={styles.state} role="alert">
        <Icon name="lock" />
        <h1 className={styles.stateTitle}>
          {apiError.isNotFound
            ? 'Conversation not found'
            : 'You don’t have access to this conversation'}
        </h1>
        <p>It may be private, or it may have been deleted.</p>
      </div>
    );
  }
  return (
    <div className={styles.state} role="alert">
      <h1 className={styles.stateTitle}>Couldn&apos;t load this conversation</h1>
      <p>{error.message}</p>
      <Button onClick={onRetry}>Try again</Button>
    </div>
  );
}

/** A full conversation: header, live message log and composer. */
export function ChannelView({ channelId }: ChannelViewProps) {
  const queryClient = useQueryClient();
  const user = useCurrentUser();
  const can = useCan();
  const { members, nameOf } = useConversationNamer();

  const channelQuery = useChannelQuery(channelId);
  const messagesQuery = useMessagesQuery(channelId);
  const sendMessage = useSendMessage(channelId);
  const deleteMessage = useDeleteMessageMutation(channelId);
  const { mutate: markRead } = useMarkChannelReadMutation();
  const [pendingDelete, setPendingDelete] = useState<ChatMessage | null>(null);
  const viewRef = useRef<HTMLDivElement>(null);

  /** The deleted message's menu button is gone, so move focus to the message log. */
  const focusMessageLog = () => {
    setTimeout(() => {
      viewRef.current?.querySelector<HTMLElement>('[role="log"]')?.focus();
    }, 0);
  };

  useChannelMessagesSubscription(channelId);

  // Mark as read when opened and whenever a new message arrives while open.
  const latestMessageId = messagesQuery.data?.at(-1)?.id;
  const channelLoaded = channelQuery.isSuccess;
  useEffect(() => {
    if (channelLoaded) markRead(channelId);
  }, [channelId, channelLoaded, latestMessageId, markRead]);

  if (channelQuery.isPending) {
    return (
      <div className={styles.state}>
        <Spinner label="Loading conversation" />
      </div>
    );
  }

  if (channelQuery.isError) {
    return <ChannelError error={channelQuery.error} onRetry={() => void channelQuery.refetch()} />;
  }

  const channel = channelQuery.data;
  const title = channel.kind === 'channel' ? `#${channel.name}` : nameOf(channel);
  const canPost = can(chatPermissions.post, channelResource(channel));

  return (
    <div ref={viewRef} className={styles.view}>
      <ChannelHeader channel={channel} title={title} />

      {messagesQuery.isPending ? (
        <div className={styles.state}>
          <Spinner label="Loading messages" />
        </div>
      ) : messagesQuery.isError ? (
        <ChannelError error={messagesQuery.error} onRetry={() => void messagesQuery.refetch()} />
      ) : (
        <MessageList
          label={`Messages in ${title}`}
          messages={messagesQuery.data}
          hasOlder={messagesQuery.hasNextPage}
          isLoadingOlder={messagesQuery.isFetchingNextPage}
          onLoadOlder={() => void messagesQuery.fetchNextPage()}
          renderMessage={(message, isGrouped) => (
            <MessageItem
              message={message}
              author={members.get(message.authorId)}
              isGrouped={isGrouped}
              canDelete={can(chatPermissions.deleteMessage, { ownerId: message.authorId })}
              onDelete={() => {
                setPendingDelete(message);
              }}
              onRetry={() => {
                sendMessage.send({
                  body: message.body,
                  authorId: user.id,
                  ...(message.clientId ? { clientId: message.clientId } : {}),
                });
              }}
              onDiscard={() => {
                if (message.clientId)
                  discardFailedMessage(queryClient, channelId, message.clientId);
              }}
            />
          )}
        />
      )}

      <MessageComposer
        channelId={channelId}
        conversationName={title}
        canPost={canPost}
        onSend={(body) => {
          sendMessage.send({ body, authorId: user.id });
        }}
      />

      <Modal
        open={pendingDelete !== null}
        onClose={() => {
          setPendingDelete(null);
        }}
        title="Delete message?"
        description="This permanently removes the message for everyone. It can't be undone."
        footer={
          <>
            <Button
              onClick={() => {
                setPendingDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (pendingDelete) {
                  deleteMessage.mutate(pendingDelete.id);
                  focusMessageLog();
                }
                setPendingDelete(null);
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        {pendingDelete && <blockquote className={styles.quote}>{pendingDelete.body}</blockquote>}
      </Modal>

      {deleteMessage.isError && (
        <p className={styles.toast} role="alert">
          Couldn&apos;t delete the message: {deleteMessage.error.message}
        </p>
      )}
    </div>
  );
}
