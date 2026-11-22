export const searchKeys = {
  all: ['search'] as const,
  results: (providerType: string, query: string) =>
    [...searchKeys.all, providerType, query] as const,
};
