import { ResultRow } from '@/components/ui/ResultRow';
import { paths } from '@/config/paths';
import type { SearchProvider } from '@/lib/search';
import { formatDateTime } from '@/lib/utils';

import { searchDocuments } from './api/documentsApi';
import { documentsPermissions } from './permissions';
import type { DocumentSummary } from './types';

export const documentsSearchProvider: SearchProvider<DocumentSummary> = {
  type: 'documents',
  label: 'Documents',
  permission: documentsPermissions.view,
  search: (query, { signal, limit }) => searchDocuments(query, limit, signal),
  renderResult: (doc) => (
    <ResultRow icon="document" title={doc.title} meta={`Edited ${formatDateTime(doc.updatedAt)}`} />
  ),
  getKey: (doc) => doc.id,
  getHref: () => paths.documents(),
};
