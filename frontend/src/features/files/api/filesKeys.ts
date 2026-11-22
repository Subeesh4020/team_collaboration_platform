export const filesKeys = {
  all: ['files'] as const,
  list: () => [...filesKeys.all, 'list'] as const,
};
