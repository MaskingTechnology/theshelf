
type CacheItem<T> = {
  readonly key: string;
  readonly value: T;
  readonly ttl?: number;
};

export type { CacheItem };
