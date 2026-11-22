import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Dropdown, type DropdownItem } from '@/components/ui/Dropdown';
import { Icon } from '@/components/ui/Icon';
import type { Member } from '@/features/members';
import { formatDateTime, formatTime } from '@/lib/utils';
import type { Attachment } from '@/types';

import type { ChatMessage } from '../../types';
import styles from './MessageItem.module.css';

export interface MessageItemProps {
  message: ChatMessage;
  author: Member | undefined;
  isGrouped: boolean;
  canDelete: boolean;
  onDelete: () => void;
  onRetry: () => void;
  onDiscard: () => void;
}

function formatSize(bytes: number | undefined): string {
  if (bytes === undefined) return '';
  return bytes >= 1_000_000
    ? `${(bytes / 1_000_000).toFixed(1)} MB`
    : `${String(Math.round(bytes / 1000))} KB`;
}

function AttachmentChip({ attachment }: { attachment: Attachment }) {
  return (
    <li className={styles.attachment}>
      <Icon name={attachment.kind === 'task' ? 'tasks' : 'file'} size="sm" />
      <span className={styles.attachmentTitle}>{attachment.title}</span>
      {attachment.sizeBytes !== undefined && (
        <span className={styles.attachmentMeta}>{formatSize(attachment.sizeBytes)}</span>
      )}
    </li>
  );
}

export function MessageItem({
  message,
  author,
  isGrouped,
  canDelete,
  onDelete,
  onRetry,
  onDiscard,
}: MessageItemProps) {
  const authorName = author?.name ?? 'Unknown user';
  const isSent = message.status === undefined;

  const actions: DropdownItem[] = [
    {
      id: 'copy',
      label: 'Copy text',
      icon: 'document',
      onSelect: () => {
        void navigator.clipboard.writeText(message.body).catch(() => undefined);
      },
    },
  ];
  if (canDelete) {
    actions.push({
      id: 'delete',
      label: 'Delete message',
      icon: 'trash',
      danger: true,
      onSelect: onDelete,
    });
  }

  return (
    <article
      className={[
        styles.item,
        isGrouped && styles.isGrouped,
        message.status === 'pending' && styles.pending,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={`${authorName}, ${formatTime(message.createdAt)}`}
    >
      <div className={styles.gutter}>
        {isGrouped ? (
          <time
            className={styles.hoverTime}
            dateTime={message.createdAt}
            title={formatDateTime(message.createdAt)}
          >
            {formatTime(message.createdAt)}
          </time>
        ) : (
          <Avatar name={authorName} src={author?.avatarUrl} decorative />
        )}
      </div>

      <div className={styles.content}>
        {!isGrouped && (
          <header className={styles.meta}>
            <span className={styles.author}>{authorName}</span>
            <time
              dateTime={message.createdAt}
              title={formatDateTime(message.createdAt)}
              className={styles.time}
            >
              {formatTime(message.createdAt)}
            </time>
          </header>
        )}
        <p className={styles.body}>{message.body}</p>

        {message.attachments && message.attachments.length > 0 && (
          <ul className={styles.attachments} aria-label="Attachments">
            {message.attachments.map((attachment) => (
              <AttachmentChip key={attachment.id} attachment={attachment} />
            ))}
          </ul>
        )}

        {message.status === 'pending' && <p className={styles.status}>Sending…</p>}
        {message.status === 'failed' && (
          <div className={styles.failed} role="alert">
            <Icon name="alert" size="sm" />
            <span>Not sent.</span>
            <Button size="sm" variant="ghost" onClick={onRetry}>
              Retry
            </Button>
            <Button size="sm" variant="ghost" onClick={onDiscard}>
              Discard
            </Button>
          </div>
        )}
      </div>

      {isSent && (
        <div className={styles.actions}>
          <Dropdown
            label="Message actions"
            align="end"
            items={actions}
            trigger={(props) => (
              <button
                {...props}
                type="button"
                className={styles.actionsButton}
                aria-label="Message actions"
              >
                <Icon name="more" size="sm" />
              </button>
            )}
          />
        </div>
      )}
    </article>
  );
}
