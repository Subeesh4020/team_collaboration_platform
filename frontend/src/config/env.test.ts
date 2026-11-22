import { parseEnv } from './env';

describe('parseEnv', () => {
  it('applies defaults when variables are missing', () => {
    const env = parseEnv({ DEV: true, MODE: 'development' });

    expect(env).toEqual({
      appName: 'Teamspace',
      apiBaseUrl: '/api',
      realtimeUrl: 'ws://localhost:5173/realtime',
      enableMocks: true,
      isDev: true,
      isTest: false,
    });
  });

  it('reads provided values and normalizes them', () => {
    const env = parseEnv({
      VITE_APP_NAME: ' Acme ',
      VITE_API_BASE_URL: 'https://api.example.com/',
      VITE_REALTIME_URL: 'wss://rt.example.com',
      VITE_ENABLE_MOCKS: 'false',
      DEV: true,
      MODE: 'test',
    });

    expect(env.appName).toBe('Acme');
    expect(env.apiBaseUrl).toBe('https://api.example.com');
    expect(env.realtimeUrl).toBe('wss://rt.example.com');
    expect(env.enableMocks).toBe(false);
    expect(env.isTest).toBe(true);
  });

  it('disables mocks by default in production builds', () => {
    expect(parseEnv({ DEV: false, MODE: 'production' }).enableMocks).toBe(false);
  });
});
