/** Error body shape returned by the API (and the MSW mocks). */
export interface ApiErrorBody {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * The single error type the UI deals with. Every failure (HTTP error,
 * network failure, invalid JSON, abort) is normalized into an ApiError.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: Record<string, unknown> | undefined;

  constructor(params: {
    status: number;
    code: string;
    message: string;
    details?: Record<string, unknown> | undefined;
    cause?: unknown;
  }) {
    super(params.message, { cause: params.cause });
    this.name = 'ApiError';
    this.status = params.status;
    this.code = params.code;
    this.details = params.details;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isNetworkError(): boolean {
    return this.code === 'network_error';
  }

  get isAborted(): boolean {
    return this.code === 'aborted';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return isRecord(value) && typeof value.code === 'string' && typeof value.message === 'string';
}

/** Converts anything thrown during a request into an ApiError. */
export function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (error instanceof DOMException && error.name === 'AbortError') {
    return new ApiError({
      status: 0,
      code: 'aborted',
      message: 'Request was cancelled',
      cause: error,
    });
  }

  if (error instanceof TypeError) {
    return new ApiError({
      status: 0,
      code: 'network_error',
      message: 'Network error. Check your connection and try again.',
      cause: error,
    });
  }

  const message = error instanceof Error ? error.message : 'Unexpected error';
  return new ApiError({ status: 0, code: 'unknown_error', message, cause: error });
}

/** Builds an ApiError from a non-2xx response. */
export async function errorFromResponse(response: Response): Promise<ApiError> {
  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    // Non-JSON error body; fall through to a generic message.
  }

  if (isApiErrorBody(body)) {
    return new ApiError({
      status: response.status,
      code: body.code,
      message: body.message,
      details: body.details,
    });
  }

  return new ApiError({
    status: response.status,
    code: `http_${response.status}`,
    message: response.statusText || `Request failed with status ${response.status}`,
  });
}
