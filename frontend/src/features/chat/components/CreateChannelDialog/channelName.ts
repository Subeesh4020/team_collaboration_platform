import { CHANNEL_NAME_MAX_LENGTH } from '../../types';

/** Lowercases and swaps spaces for dashes as the user types. */
export function normalizeChannelName(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function validateChannelName(name: string): string | undefined {
  if (!name) return 'Enter a channel name.';
  if (name.length > CHANNEL_NAME_MAX_LENGTH) {
    return `Use at most ${String(CHANNEL_NAME_MAX_LENGTH)} characters.`;
  }
  if (name.startsWith('-')) return 'Names cannot start with a dash.';
  return undefined;
}
