import { Icon } from '@/components/ui/Icon';

import styles from './ChatEmptyState.module.css';

export function ChatEmptyState() {
  return (
    <div className={styles.root}>
      <span className={styles.icon}>
        <Icon name="chat" />
      </span>
      <h1 className={styles.title}>Select a conversation</h1>
      <p className={styles.text}>Pick a channel or direct message to start chatting.</p>
    </div>
  );
}
