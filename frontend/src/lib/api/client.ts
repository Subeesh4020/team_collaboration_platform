import { env } from '@/config/env';

import { errorFromResponse, normalizeError } from './ApiError';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type QueryParams = Record<string, string | number | boolean | null | undefined>;

export interface RequestOptions<T> {
  method?: HttpMethod;
  query?: QueryParams;
  body?: unknown;
  signal?: AbortSignal | undefined;
  headers?: Record<string, string>;
  /**
   * Optional runtime validator for the response body. Without it the body is
   * trusted to match `T` (the contract is shared with the backend).
   */
  parse?: (data: unknown) => T;
}

type TokenProvider = () => string | null | undefined;

let getAuthToken: TokenProvider = () => null;

/**
 * Registers where the client reads the access token from. Called once by the
 * app after the session loads, so `lib` never depends on the auth feature.
 */
export function setAuthTokenProvider(provider: TokenProvider): void {
  getAuthToken = provider;
}

export function buildUrl(path: string, query?: QueryParams): string {
  const base = env.apiBaseUrl;
  const joined = `${base}${path.startsWith('/') ? path : `/${path}`}`;
  // Relative base URLs (e.g. "/api") are resolved against the current origin.
  const url = new URL(joined, globalThis.location.origin);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

/**
 * Performs a JSON request against the API. Resolves with the parsed body, or
 * rejects with an `ApiError`. A 204 response resolves with `undefined`.
 */
export async function request<T>(path: string, options: RequestOptions<T> = {}): Promise<T> {
  const { method = 'GET', query, body, signal, headers = {}, parse } = options;

  const finalHeaders: Record<string, string> = { Accept: 'application/json', ...headers };
  if (body !== undefined) finalHeaders['Content-Type'] = 'application/json';
  const token = getAuthToken();
  if (token) finalHeaders.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers: finalHeaders,
      body: body === undefined ? null : JSON.stringify(body),
      signal: signal ?? null,
      credentials: 'include',
    });
  } catch (error) {
    throw normalizeError(error);
  }

  if (!response.ok) throw await errorFromResponse(response);
  if (response.status === 204) return undefined as T;

  let data: unknown;
  try {
    data = await response.json();
  } catch (error) {
    throw normalizeError(error);
  }

  // Type boundary: the body is trusted to match the shared contract unless a parser is given.
  return parse ? parse(data) : (data as T);
}

export const apiClient = {
  get: <T>(path: string, options?: Omit<RequestOptions<T>, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions<T>, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions<T>, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions<T>, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: Omit<RequestOptions<T>, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
