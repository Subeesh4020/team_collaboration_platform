import { useState, type SubmitEvent } from 'react';

import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

import { useCreateChannelMutation } from '../../api/queries';
import { CHANNEL_NAME_MAX_LENGTH, type Channel } from '../../types';
import { normalizeChannelName, validateChannelName } from './channelName';
import styles from './CreateChannelDialog.module.css';

export interface CreateChannelDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: (channel: Channel) => void;
}

export function CreateChannelDialog({ open, onClose, onCreated }: CreateChannelDialogProps) {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const createChannel = useCreateChannelMutation();

  const validationError = validateChannelName(name);
  const nameError = submitted ? (validationError ?? createChannel.error?.message) : undefined;

  const reset = () => {
    setName('');
    setTopic('');
    setIsPrivate(false);
    setSubmitted(false);
    createChannel.reset();
  };

  const close = () => {
    reset();
    onClose();
  };

  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (validationError) return;
    createChannel.mutate(
      {
        name,
        visibility: isPrivate ? 'private' : 'public',
        ...(topic.trim() ? { topic: topic.trim() } : {}),
      },
      {
        onSuccess: (channel) => {
          reset();
          onCreated(channel);
        },
      },
    );
  };

  const formId = 'create-channel-form';

  return (
    <Modal
      open={open}
      onClose={close}
      title="Create a channel"
      description="Channels are where conversations happen around a topic."
      footer={
        <>
          <Button onClick={close}>Cancel</Button>
          <Button type="submit" form={formId} variant="primary" loading={createChannel.isPending}>
            Create channel
          </Button>
        </>
      }
    >
      <form id={formId} className={styles.form} onSubmit={submit} noValidate>
        <Input
          label="Name"
          placeholder="e.g. marketing-plans"
          value={name}
          maxLength={CHANNEL_NAME_MAX_LENGTH}
          onChange={(event) => {
            setName(normalizeChannelName(event.target.value));
            createChannel.reset();
          }}
          hint="Lowercase letters, numbers and dashes."
          error={nameError}
          autoComplete="off"
          required
        />
        <Input
          label="Topic (optional)"
          value={topic}
          onChange={(event) => {
            setTopic(event.target.value);
          }}
        />
        <Checkbox
          label="Make private"
          hint="Only invited members can find and read a private channel."
          checked={isPrivate}
          onChange={(event) => {
            setIsPrivate(event.target.checked);
          }}
        />
      </form>
    </Modal>
  );
}
