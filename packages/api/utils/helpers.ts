// centralised way to get the redis cache key for search
export const getSearchCacheKey = (search: string) => {
  return `search:${search}`;
}