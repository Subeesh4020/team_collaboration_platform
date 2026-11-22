import type { ReactNode } from 'react';
import { NavLink } from 'react-router';

import { paths } from '@/config/paths';

import type { ChannelId } from '../../types';
import styles from './ConversationLink.module.css';

export interface ConversationLinkProps {
  channelId: ChannelId;
  label: string;
  /** Extra context for screen readers, e.g. "private channel". */
  description?: string | undefined;
  /** Decorative leading visual: an icon or avatar. */
  leading: ReactNode;
  unreadCount: number;
}

export function ConversationLink({
  channelId,
  label,
  description,
  leading,
  unreadCount,
}: ConversationLinkProps) {
  const hasUnread = unreadCount > 0;
  const accessibleName = [label, description, hasUnread ? `${String(unreadCount)} unread` : null]
    .filter(Boolean)
    .join(', ');

  return (
    <NavLink
      to={paths.chatChannel(channelId)}
      aria-label={accessibleName}
      className={({ isActive }) =>
        [styles.link, isActive && styles.active, hasUnread && styles.unread]
          .filter(Boolean)
          .join(' ')
      }
    >
      <span className={styles.leading} aria-hidden="true">
        {leading}
      </span>
      <span className={styles.label}>{label}</span>
      {hasUnread && (
        <span className={styles.badge} aria-hidden="true">
          {unreadCount}
        </span>
      )}
    </NavLink>
  );
}
