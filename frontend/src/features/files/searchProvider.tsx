import { ResultRow } from '@/components/ui/ResultRow';
import { paths } from '@/config/paths';
import type { SearchProvider } from '@/lib/search';
import { formatDateTime } from '@/lib/utils';

import { searchFiles } from './api/filesApi';
import { filesPermissions } from './permissions';
import type { FileItem } from './types';

export const filesSearchProvider: SearchProvider<FileItem> = {
  type: 'files',
  label: 'Files',
  permission: filesPermissions.view,
  search: (query, { signal, limit }) => searchFiles(query, limit, signal),
  renderResult: (file) => (
    <ResultRow icon="file" title={file.name} meta={`Updated ${formatDateTime(file.updatedAt)}`} />
  ),
  getKey: (file) => file.id,
  getHref: () => paths.files(),
};
