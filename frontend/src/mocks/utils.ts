import { HttpResponse } from 'msw';

import { env } from '@/config/env';
import type { ApiErrorBody } from '@/lib/api';

/** Full mock URL for an API path, matching what `lib/api` requests. */
export function apiUrl(path: string): string {
  return `${env.apiBaseUrl}${path}`;
}

export function errorResponse(status: number, code: string, message: string) {
  const body: ApiErrorBody = { code, message };
  return HttpResponse.json(body, { status });
}
