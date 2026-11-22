import { useLayoutEffect, useRef, type ReactNode } from 'react';

import { Button } from '@/components/ui/Button';
import { formatDayLabel } from '@/lib/utils';

import type { ChatMessage } from '../../types';
import styles from './MessageList.module.css';
import { buildMessageRows, type MessageRow } from './messageRows';

/** Distance from the bottom (px) within which new messages keep the view pinned. */
const STICKY_THRESHOLD_PX = 80;

export interface MessageListProps {
  messages: readonly ChatMessage[];
  /** Accessible name, e.g. "Messages in #general". */
  label: string;
  hasOlder: boolean;
  isLoadingOlder: boolean;
  onLoadOlder: () => void;
  renderMessage: (message: ChatMessage, isGrouped: boolean) => ReactNode;
}

/**
 * Scrollable, live-updating message log.
 *
 * Virtualization-ready: rendering goes through a flat `rows` array with
 * stable keys and a single `renderRow`, so swapping the `.map` for a
 * windowing library (e.g. @tanstack/react-virtual) is a local change.
 */
export function MessageList({
  messages,
  label,
  hasOlder,
  isLoadingOlder,
  onLoadOlder,
  renderMessage,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const snapshot = useRef({ newestKey: '', oldestKey: '', scrollHeight: 0, scrollTop: 0 });
  const pinnedToBottom = useRef(true);

  const rows = buildMessageRows(messages);
  const newest = messages.at(-1);
  const oldest = messages.at(0);

  useLayoutEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const previous = snapshot.current;
    const newestKey = newest?.clientId ?? newest?.id ?? '';
    const oldestKey = oldest?.id ?? '';

    const loadedOlder = previous.oldestKey !== '' && oldestKey !== previous.oldestKey;
    const gotNewer = newestKey !== previous.newestKey;

    if (previous.newestKey === '') {
      element.scrollTop = element.scrollHeight; // first render: start at the bottom
    } else if (loadedOlder && !gotNewer) {
      // Keep the visible message in place when history is prepended.
      element.scrollTop = element.scrollHeight - previous.scrollHeight + previous.scrollTop;
    } else if (gotNewer && (pinnedToBottom.current || newest?.status === 'pending')) {
      element.scrollTop = element.scrollHeight;
    }

    snapshot.current = {
      newestKey,
      oldestKey,
      scrollHeight: element.scrollHeight,
      scrollTop: element.scrollTop,
    };
  }, [newest, oldest]);

  const onScroll = () => {
    const element = scrollRef.current;
    if (!element) return;
    const distance = element.scrollHeight - element.scrollTop - element.clientHeight;
    pinnedToBottom.current = distance < STICKY_THRESHOLD_PX;
    snapshot.current.scrollHeight = element.scrollHeight;
    snapshot.current.scrollTop = element.scrollTop;
  };

  const renderRow = (row: MessageRow) => {
    if (row.type === 'day') {
      return (
        <li key={row.key} className={styles.day}>
          <span className={styles.dayLabel}>{formatDayLabel(row.date)}</span>
        </li>
      );
    }
    return (
      <li key={row.key} className={row.isGrouped ? styles.grouped : styles.message}>
        {renderMessage(row.message, row.isGrouped)}
      </li>
    );
  };

  return (
    <div
      ref={scrollRef}
      className={styles.scroller}
      role="log"
      aria-label={label}
      aria-relevant="additions"
      tabIndex={0}
      onScroll={onScroll}
    >
      <div className={styles.top}>
        {hasOlder ? (
          <Button size="sm" variant="ghost" loading={isLoadingOlder} onClick={onLoadOlder}>
            {isLoadingOlder ? 'Loading…' : 'Load older messages'}
          </Button>
        ) : (
          messages.length > 0 && (
            <p className={styles.start}>This is the start of the conversation.</p>
          )
        )}
      </div>
      {messages.length === 0 ? (
        <p className={styles.empty}>No messages yet. Say hello!</p>
      ) : (
        <ol className={styles.rows}>{rows.map(renderRow)}</ol>
      )}
    </div>
  );
}
