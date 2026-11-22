import { useQuery } from '@tanstack/react-query';

import { fetchDocuments } from './documentsApi';
import { documentsKeys } from './documentsKeys';

export function useDocumentsQuery() {
  return useQuery({
    queryKey: documentsKeys.list(),
    queryFn: ({ signal }) => fetchDocuments(signal),
  });
}
