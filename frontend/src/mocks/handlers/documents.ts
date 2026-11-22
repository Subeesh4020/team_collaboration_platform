import { documentResource } from '@/features/documents';

import { documentsFixture } from '../fixtures/documents';
import { searchableResource } from '../resource';

export const documentsHandlers = searchableResource({
  path: '/documents',
  items: () => documentsFixture,
  text: (doc) => doc.title,
  permission: 'documents:view',
  resource: documentResource,
});
