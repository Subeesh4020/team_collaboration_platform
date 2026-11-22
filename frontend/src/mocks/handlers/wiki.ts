import { wikiFixture } from '../fixtures/wiki';
import { searchableResource } from '../resource';

export const wikiHandlers = searchableResource({
  path: '/wiki/pages',
  items: () => wikiFixture,
  text: (page) => `${page.title} ${page.section}`,
  permission: 'wiki:view',
});
