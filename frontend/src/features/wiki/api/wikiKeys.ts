export const wikiKeys = {
  all: ['wiki'] as const,
  pages: () => [...wikiKeys.all, 'pages'] as const,
};
