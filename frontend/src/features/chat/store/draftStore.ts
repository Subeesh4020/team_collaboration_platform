import { create } from 'zustand';

import type { ChannelId } from '../types';

interface DraftState {
  drafts: Record<ChannelId, string>;
  setDraft: (channelId: ChannelId, text: string) => void;
  clearDraft: (channelId: ChannelId) => void;
}

/** Unsent composer text per channel, kept while switching conversations. */
export const useDraftStore = create<DraftState>()((set) => ({
  drafts: {},
  setDraft: (channelId, text) => {
    set((state) => ({ drafts: { ...state.drafts, [channelId]: text } }));
  },
  clearDraft: (channelId) => {
    set((state) => {
      const { [channelId]: _removed, ...rest } = state.drafts;
      return { drafts: rest };
    });
  },
}));

export function useDraft(channelId: ChannelId) {
  const draft = useDraftStore((state) => state.drafts[channelId] ?? '');
  const setDraft = useDraftStore((state) => state.setDraft);
  const clearDraft = useDraftStore((state) => state.clearDraft);
  return {
    draft,
    setDraft: (text: string) => {
      setDraft(channelId, text);
    },
    clearDraft: () => {
      clearDraft(channelId);
    },
  };
}
