import { useQuery } from '@tanstack/react-query';

import { fetchIntegrations } from './integrationsApi';
import { integrationsKeys } from './integrationsKeys';

export function useIntegrationsQuery() {
  return useQuery({
    queryKey: integrationsKeys.list(),
    queryFn: ({ signal }) => fetchIntegrations(signal),
  });
}
