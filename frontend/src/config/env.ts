/**
 * The ONLY place that reads `import.meta.env`. Everything else imports `env`.
 * Add new variables to `.env.example`, `vite-env.d.ts` and `parseEnv` together.
 */

export interface Env {
  appName: string;
  apiBaseUrl: string;
  realtimeUrl: string;
  enableMocks: boolean;
  isDev: boolean;
  isTest: boolean;
}

export interface RawEnv {
  VITE_APP_NAME?: string | undefined;
  VITE_API_BASE_URL?: string | undefined;
  VITE_REALTIME_URL?: string | undefined;
  VITE_ENABLE_MOCKS?: string | undefined;
  DEV?: boolean | undefined;
  MODE?: string | undefined;
}

function readBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === '') return fallback;
  return value === 'true' || value === '1';
}

/** Returns the trimmed value, or undefined when missing or blank. */
function readString(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed === '' ? undefined : trimmed;
}

function trimTrailingSlash(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

export function parseEnv(raw: RawEnv): Env {
  const isDev = raw.DEV === true;
  return {
    appName: readString(raw.VITE_APP_NAME) ?? 'Teamspace',
    apiBaseUrl: trimTrailingSlash(readString(raw.VITE_API_BASE_URL) ?? '/api'),
    realtimeUrl: readString(raw.VITE_REALTIME_URL) ?? 'ws://localhost:5173/realtime',
    enableMocks: readBoolean(raw.VITE_ENABLE_MOCKS, isDev),
    isDev,
    isTest: raw.MODE === 'test',
  };
}

export const env: Env = parseEnv(import.meta.env);
