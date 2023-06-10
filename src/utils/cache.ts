export function createCache<T>(ignoreCache = false) {
  const cache = new Map<string, T>();
  return {
    get(key: string, defaultValue?: T): T {
      if (ignoreCache) return defaultValue;
      return cache.get(key) ?? defaultValue;
    },
    has(key: string): boolean {
      if (ignoreCache) return false;
      return cache.has(key);
    },
    set(key: string, value: T): Map<string, T> {
      if (ignoreCache) return cache;
      return cache.set(key, value);
    },
    delete(key: string): boolean {
      if (ignoreCache) return false;
      return cache.delete(key);
    },
  };
}
