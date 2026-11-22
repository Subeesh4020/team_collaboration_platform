import { delay, http, HttpResponse } from 'msw';

import { notificationsFixture } from '../fixtures/notifications';
import { apiUrl } from '../utils';

export const notificationsHandlers = [
  http.get(apiUrl('/notifications'), async () => {
    await delay();
    return HttpResponse.json(notificationsFixture);
  }),
];
