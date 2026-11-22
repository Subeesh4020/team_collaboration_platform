import { useId, type KeyboardEvent, type SubmitEvent } from 'react';

import { IconButton } from '@/components/ui/IconButton';

import { useDraft } from '../../store/draftStore';
import { MESSAGE_MAX_LENGTH, type ChannelId } from '../../types';
import styles from './MessageComposer.module.css';

export interface MessageComposerProps {
  channelId: ChannelId;
  /** Used in the placeholder and label, e.g. "#general" or "Grace Hopper". */
  conversationName: string;
  canPost: boolean;
  onSend: (body: string) => void;
}

const COUNTER_THRESHOLD = MESSAGE_MAX_LENGTH - 200;

export function MessageComposer({
  channelId,
  conversationName,
  canPost,
  onSend,
}: MessageComposerProps) {
  const { draft, setDraft, clearDraft } = useDraft(channelId);
  const hintId = useId();
  const trimmed = draft.trim();
  const tooLong = draft.length > MESSAGE_MAX_LENGTH;
  const canSubmit = canPost && trimmed.length > 0 && !tooLong;

  if (!canPost) {
    return (
      <div className={styles.readOnly} role="note">
        You can read this conversation, but you don&apos;t have permission to post here.
      </div>
    );
  }

  const submit = (event?: SubmitEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!canSubmit) return;
    onSend(trimmed);
    clearDraft();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form className={styles.composer} onSubmit={submit}>
      <div className={styles.box}>
        <textarea
          className={styles.input}
          value={draft}
          rows={1}
          placeholder={`Message ${conversationName}`}
          aria-label={`Message ${conversationName}`}
          aria-describedby={hintId}
          aria-invalid={tooLong || undefined}
          onChange={(event) => {
            setDraft(event.target.value);
          }}
          onKeyDown={onKeyDown}
        />
        <IconButton icon="send" label="Send message" type="submit" disabled={!canSubmit} />
      </div>
      <p id={hintId} className={styles.hint}>
        <span>
          <kbd>Enter</kbd> to send, <kbd>Shift</kbd>+<kbd>Enter</kbd> for a new line
        </span>
        {draft.length > COUNTER_THRESHOLD && (
          <span className={tooLong ? styles.counterError : styles.counter}>
            {draft.length}/{MESSAGE_MAX_LENGTH}
          </span>
        )}
      </p>
    </form>
  );
}
