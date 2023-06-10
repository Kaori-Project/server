export interface IRequestCache {
  name: string;
  data: any;
  lastRequested: number;
  __timeout: any;
}

const DEFAULT_REQUEST_CACHE_TIMEOUT = 3000;
const DEFAULT_REQUEST_CACHE_EXPIRE = 10000;

export function cacheFactory(
  differenceMillis = DEFAULT_REQUEST_CACHE_TIMEOUT,
  expireTimeMillis = DEFAULT_REQUEST_CACHE_EXPIRE,
) {
  if (expireTimeMillis < differenceMillis)
    throw new Error(
      'expireTimeMillis must be equal or greater than differenceMillis',
    );
  const cache = new Map<string, IRequestCache>();
  return {
    get(name: string): IRequestCache['data'] | null {
      const cachedRequest = cache.get(name);
      if (!cachedRequest) return null;
      const now = Date.now();
      const difference = now - cachedRequest.lastRequested;
      if (difference >= differenceMillis) {
        cache.delete(name);
        return null;
      }
      return cachedRequest.data;
    },
    insert(name: string, data: any) {
      const cachedRequest = cache.get(name);
      if (cachedRequest) clearTimeout(cachedRequest.__timeout);
      cache.set(name, {
        name,
        data,
        lastRequested: Date.now(),
        __timeout: setTimeout(() => {
          cache.delete(name);
        }, expireTimeMillis),
      });
    },
  };
}
