import { http, HttpResponse } from 'msw';

import { server } from '@/mocks/node';
import { apiUrl } from '@/mocks/utils';

import { ApiError } from './ApiError';
import { apiClient, setAuthTokenProvider } from './client';

describe('apiClient', () => {
  afterEach(() => {
    setAuthTokenProvider(() => null);
  });

  it('returns the parsed JSON body', async () => {
    server.use(http.get(apiUrl('/things'), () => HttpResponse.json({ ok: true })));
    await expect(apiClient.get<{ ok: boolean }>('/things')).resolves.toEqual({ ok: true });
  });

  it('sends query params and the bearer token', async () => {
    let seen: { auth: string | null; cursor: string | null } | null = null;
    server.use(
      http.get(apiUrl('/things'), ({ request }) => {
        seen = {
          auth: request.headers.get('Authorization'),
          cursor: new URL(request.url).searchParams.get('cursor'),
        };
        return HttpResponse.json([]);
      }),
    );
    setAuthTokenProvider(() => 'secret');

    await apiClient.get('/things', { query: { cursor: 'abc', skip: undefined } });

    expect(seen).toEqual({ auth: 'Bearer secret', cursor: 'abc' });
  });

  it('normalizes API error bodies into ApiError', async () => {
    server.use(
      http.post(apiUrl('/things'), () =>
        HttpResponse.json({ code: 'forbidden', message: 'Nope' }, { status: 403 }),
      ),
    );

    const error = await apiClient.post('/things', { a: 1 }).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 403, code: 'forbidden', message: 'Nope' });
    expect((error as ApiError).isForbidden).toBe(true);
  });

  it('falls back to a generic error for non-JSON failures', async () => {
    server.use(http.get(apiUrl('/things'), () => new HttpResponse('boom', { status: 500 })));
    await expect(apiClient.get('/things')).rejects.toMatchObject({ status: 500, code: 'http_500' });
  });

  it('turns network failures into a network_error', async () => {
    server.use(http.get(apiUrl('/things'), () => HttpResponse.error()));
    await expect(apiClient.get('/things')).rejects.toMatchObject({ code: 'network_error' });
  });

  it('resolves undefined for 204 responses', async () => {
    server.use(http.delete(apiUrl('/things/1'), () => new HttpResponse(null, { status: 204 })));
    await expect(apiClient.delete('/things/1')).resolves.toBeUndefined();
  });
});
