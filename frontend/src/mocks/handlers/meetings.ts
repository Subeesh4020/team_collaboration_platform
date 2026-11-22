import { meetingResource } from '@/features/meetings';

import { meetingsFixture } from '../fixtures/meetings';
import { searchableResource } from '../resource';

export const meetingsHandlers = searchableResource({
  path: '/meetings',
  items: () => meetingsFixture,
  text: (meeting) => meeting.title,
  permission: 'meetings:join',
  resource: meetingResource,
});
