import { Icon } from '@/components/ui/Icon';
import { formatDateTime } from '@/lib/utils';

import type { MessageSearchHit } from '../../types';
import styles from './MessageSearchResult.module.css';

export interface MessageSearchResultProps {
  hit: MessageSearchHit;
}

export function MessageSearchResult({ hit }: MessageSearchResultProps) {
  return (
    <div className={styles.result}>
      <Icon name="chat" size="sm" />
      <div className={styles.text}>
        <p className={styles.body}>{hit.message.body}</p>
        <p className={styles.meta}>
          {hit.channelLabel} ·{' '}
          <time dateTime={hit.message.createdAt}>{formatDateTime(hit.message.createdAt)}</time>
        </p>
      </div>
    </div>
  );
}
