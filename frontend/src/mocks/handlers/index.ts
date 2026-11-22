import { authHandlers } from './auth';
import { chatHandlers } from './chat';
import { documentsHandlers } from './documents';
import { filesHandlers } from './files';
import { integrationsHandlers } from './integrations';
import { meetingsHandlers } from './meetings';
import { membersHandlers } from './members';
import { notificationsHandlers } from './notifications';
import { realtimeHandler } from './realtime';
import { tasksHandlers } from './tasks';
import { wikiHandlers } from './wiki';

/** Every mock handler, grouped per feature. Add each feature's handlers here. */
export const handlers = [
  ...authHandlers,
  ...membersHandlers,
  ...chatHandlers,
  ...meetingsHandlers,
  ...filesHandlers,
  ...documentsHandlers,
  ...tasksHandlers,
  ...wikiHandlers,
  ...integrationsHandlers,
  ...notificationsHandlers,
  realtimeHandler,
];
