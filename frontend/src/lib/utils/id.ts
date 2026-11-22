/** Random id for client-generated entities (e.g. optimistic messages). */
export function createClientId(prefix = 'c'): string {
  return `${prefix}_${crypto.randomUUID()}`;
}
