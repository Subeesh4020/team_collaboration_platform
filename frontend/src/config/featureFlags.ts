/**
 * Static feature flags. A disabled module keeps its code but its route and
 * navigation entry are hidden. Replace with a remote flag service later
 * without changing call sites: keep using `isFeatureEnabled`.
 */
export const featureFlags = {
  chat: true,
  meetings: true,
  files: true,
  documents: true,
  tasks: true,
  wiki: true,
  search: true,
  integrations: true,
  members: true,
  notifications: true,
  settings: true,
} as const satisfies Record<string, boolean>;

export type FeatureFlag = keyof typeof featureFlags;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return featureFlags[flag];
}
