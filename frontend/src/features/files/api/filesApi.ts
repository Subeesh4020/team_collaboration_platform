import { apiClient } from '@/lib/api';
import type { SearchHitsPage } from '@/lib/search';

import type { FileItem } from '../types';

export function fetchFiles(signal?: AbortSignal): Promise<FileItem[]> {
  return apiClient.get<FileItem[]>('/files', { signal });
}

export function searchFiles(
  query: string,
  limit: number,
  signal?: AbortSignal,
): Promise<SearchHitsPage<FileItem>> {
  return apiClient.get('/files/search', { signal, query: { q: query, limit } });
}
