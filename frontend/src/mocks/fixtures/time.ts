const DAY = 86_400_000;

/** ISO timestamp `days` days before now. */
export const daysAgo = (days: number) => new Date(Date.now() - days * DAY).toISOString();
