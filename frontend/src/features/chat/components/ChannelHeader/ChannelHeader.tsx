import { Link } from 'react-router';

import { Icon } from '@/components/ui/Icon';
import { paths } from '@/config/paths';

import type { Channel } from '../../types';
import styles from './ChannelHeader.module.css';

export interface ChannelHeaderProps {
  channel: Pick<Channel, 'kind' | 'visibility' | 'topic' | 'memberIds'>;
  title: string;
}

export function ChannelHeader({ channel, title }: ChannelHeaderProps) {
  const icon =
    channel.kind !== 'channel' ? 'users' : channel.visibility === 'private' ? 'lock' : 'hash';
  const memberCount = channel.memberIds.length;
  return (
    <header className={styles.header}>
      <Link to={paths.chat()} className={styles.back} aria-label="Back to conversations">
        <Icon name="chevronDown" size="sm" className={styles.backIcon} />
      </Link>
      <Icon name={icon} size="sm" className={styles.icon} />
      <div className={styles.text}>
        <h1 className={styles.title}>{title}</h1>
        {channel.topic && <p className={styles.topic}>{channel.topic}</p>}
      </div>
      <span className={styles.members}>
        <Icon name="users" size="sm" />
        {memberCount}
        <span className={styles.srOnly}> {memberCount === 1 ? 'member' : 'members'}</span>
      </span>
    </header>
  );
}
