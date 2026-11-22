const timeFormatter = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });
const dayFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
});
const fullFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'full', timeStyle: 'short' });

/** "3:04 PM" in the user's locale. */
export function formatTime(iso: string): string {
  return timeFormatter.format(new Date(iso));
}

/** Full date and time, for tooltips and titles. */
export function formatDateTime(iso: string): string {
  return fullFormatter.format(new Date(iso));
}

/** Local calendar-day key, e.g. "2026-11-19", for grouping. */
export function dayKey(iso: string): string {
  const date = new Date(iso);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** "Today", "Yesterday" or "Wednesday, November 18". */
export function formatDayLabel(iso: string, now: Date = new Date()): string {
  const key = dayKey(iso);
  if (key === dayKey(now.toISOString())) return 'Today';
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (key === dayKey(yesterday.toISOString())) return 'Yesterday';
  return dayFormatter.format(new Date(iso));
}

/** Milliseconds between two ISO timestamps. */
export function msBetween(a: string, b: string): number {
  return Math.abs(new Date(b).getTime() - new Date(a).getTime());
}
