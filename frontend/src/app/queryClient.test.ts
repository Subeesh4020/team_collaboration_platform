import { ApiError } from '@/lib/api';

import { shouldRetry } from './queryClient';

const error = (status: number, code = `http_${status}`) =>
  new ApiError({ status, code, message: 'x' });

describe('shouldRetry', () => {
  it('retries server and network errors up to the limit', () => {
    expect(shouldRetry(0, error(500))).toBe(true);
    expect(shouldRetry(1, error(0, 'network_error'))).toBe(true);
    expect(shouldRetry(2, error(500))).toBe(false);
  });

  it('never retries client errors or aborted requests', () => {
    expect(shouldRetry(0, error(404))).toBe(false);
    expect(shouldRetry(0, error(403))).toBe(false);
    expect(shouldRetry(0, error(0, 'aborted'))).toBe(false);
  });
});
