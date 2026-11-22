import { useQuery } from '@tanstack/react-query';

import { fetchFiles } from './filesApi';
import { filesKeys } from './filesKeys';

export function useFilesQuery() {
  return useQuery({ queryKey: filesKeys.list(), queryFn: ({ signal }) => fetchFiles(signal) });
}
