import { delay, http, HttpResponse } from 'msw';

import { integrationsFixture } from '../fixtures/integrations';
import { apiUrl } from '../utils';

export const integrationsHandlers = [
  http.get(apiUrl('/integrations'), async () => {
    await delay();
    return HttpResponse.json(integrationsFixture);
  }),
];
