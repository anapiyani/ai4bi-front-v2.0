
export type QueryKeyT = [string, object | undefined];

export const createQueryKeys = (endpoint: string) => ({
  all: [endpoint] as const,
  lists: () => [...createQueryKeys(endpoint).all, 'list'] as const,
  list: (filters: string) => [...createQueryKeys(endpoint).lists(), { filters }] as const,
  details: () => [...createQueryKeys(endpoint).all, 'detail'] as const,
  detail: (id: number) => [...createQueryKeys(endpoint).details(), id] as const,
});

