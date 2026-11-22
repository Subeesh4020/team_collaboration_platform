export const documentsKeys = {
  all: ['documents'] as const,
  list: () => [...documentsKeys.all, 'list'] as const,
};
