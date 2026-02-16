
import type { RedisClientType } from 'redis';
import { createClient } from 'redis';

import type { CacheItem, Driver } from '@theshelf/caching';

export type RedisConfiguration = {
    readonly url: string;
};

export default class Redis implements Driver
{
    #client: RedisClientType;

    constructor(configuration: RedisConfiguration)
    {
        const options =
        {
            url: configuration.url
        };

        this.#client = createClient(options);
    }

    get name(): string { return this.constructor.name; }

    get connected(): boolean { return this.#client.isReady; }

    async connect(): Promise<void>
    {
        if (this.connected === true)
        {
            return;
        }

        await this.#client.connect();
    }

    async disconnect(): Promise<void>
    {
        if (this.connected === false)
        {
            return;
        }

        await this.#client.quit();
    }

    async get<T>(key: string): Promise<CacheItem<T> | undefined>
    {
        const redisValue = await this.#client.get(key);
        
        if (redisValue === null) return undefined;

        const item = JSON.parse(redisValue);

        return item as CacheItem<T>;
    }

    async set<T>(item: CacheItem<T>): Promise<void>
    {
        const key = item.key;
        const value = JSON.stringify(item);
        const expires = item.ttl ? Math.max(1, Math.ceil(item.ttl / 1_000)) : undefined;
        const options = expires ? { EX: expires } : undefined;

        await this.#client.set(key, value, options);
    }

    async delete(key: string): Promise<void>
    {
        await this.#client.del(key);
    }
}
