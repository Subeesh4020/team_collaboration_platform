import { apiClient } from '@/lib/api';
import type { SearchHitsPage } from '@/lib/search';

import type { DocumentSummary } from '../types';

export function fetchDocuments(signal?: AbortSignal): Promise<DocumentSummary[]> {
  return apiClient.get<DocumentSummary[]>('/documents', { signal });
}

export function searchDocuments(
  query: string,
  limit: number,
  signal?: AbortSignal,
): Promise<SearchHitsPage<DocumentSummary>> {
  return apiClient.get('/documents/search', { signal, query: { q: query, limit } });
}
