/** Cursor-based page used by every list endpoint. */
export interface Paginated<T> {
  items: T[];
  /** Cursor for the next page, or null when there are no more items. */
  nextCursor: string | null;
}

/** ISO-8601 timestamp string, e.g. "2026-11-19T10:00:00.000Z". */
export type IsoDateString = string;
