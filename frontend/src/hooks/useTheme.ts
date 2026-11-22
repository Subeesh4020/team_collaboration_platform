import { create } from 'zustand';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'teamspace:theme';

function readStoredPreference(): ThemePreference {
  try {
    const value = globalThis.localStorage.getItem(STORAGE_KEY);
    if (value === 'light' || value === 'dark' || value === 'system') return value;
  } catch {
    // Storage can be unavailable (private mode, blocked cookies).
  }
  return 'system';
}

function storePreference(theme: ThemePreference) {
  try {
    globalThis.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Ignore: the preference just won't persist.
  }
}

function systemPrefersDark(): boolean {
  return globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function resolveTheme(theme: ThemePreference): ResolvedTheme {
  if (theme === 'system') return systemPrefersDark() ? 'dark' : 'light';
  return theme;
}

function applyTheme(theme: ThemePreference) {
  document.documentElement.dataset.theme = resolveTheme(theme);
}

interface ThemeState {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
}

const useThemeStore = create<ThemeState>()((set) => ({
  theme: 'system',
  setTheme: (theme) => {
    storePreference(theme);
    applyTheme(theme);
    set({ theme });
  },
}));

/** Applies the stored theme before first render and follows OS changes. */
export function initTheme(): void {
  const theme = readStoredPreference();
  useThemeStore.setState({ theme });
  applyTheme(theme);
  globalThis.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (useThemeStore.getState().theme === 'system') applyTheme('system');
  });
}

export function useTheme(): ThemeState {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  return { theme, setTheme };
}
