import { fileResource } from '@/features/files';

import { filesFixture } from '../fixtures/files';
import { searchableResource } from '../resource';

export const filesHandlers = searchableResource({
  path: '/files',
  items: () => filesFixture,
  text: (file) => file.name,
  permission: 'files:view',
  resource: fileResource,
});
