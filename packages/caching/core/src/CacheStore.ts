
import type Logger from '@theshelf/logging';

import type { Driver } from './definitions/interfaces.js';
import type { CacheItem } from './definitions/types.js';
import NotConnected from './errors/NotConnected.js';
import InvalidTTL from './errors/InvalidTTL.js';

export default class CacheStore
{
    readonly #driver: Driver;

    readonly #logger?: Logger;
    readonly #logPrefix: string;

    constructor(driver: Driver, logger?: Logger)
    {
        this.#driver = driver;

        this.#logger = logger?.for(this.constructor.name);
        this.#logPrefix = `${this.#driver.name} ->`;
    }

    get connected(): boolean
    {
        return this.#driver.connected;
    }

    async connect(): Promise<void>
    {
        if (this.connected === true)
        {
            return;
        }

        this.#logger?.debug(this.#logPrefix, 'Connecting');
        
        try
        {
            await this.#driver.connect();

            this.#logger?.debug(this.#logPrefix, 'Connected');
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Connect failed with error', error);

            throw error;
        }
    }

    async disconnect(): Promise<void>
    {
        if (this.connected === false)
        {
            return;
        }

        this.#logger?.debug(this.#logPrefix, 'Disconnecting');
        
        try
        {
            await this.#driver.disconnect();

            this.#logger?.debug(this.#logPrefix, 'Disconnected');
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Disconnect failed with error', error);

            throw error;
        }
    }

    async get<T>(key: string): Promise<T | undefined>
    {
        this.#logger?.debug(this.#logPrefix, 'Getting cache for key', key);

        try
        {
            this.#validateConnection();
        
            const item = await this.#driver.get<T>(key);

            if (item === undefined)
            {
                this.#logger?.debug(this.#logPrefix, 'Cache miss for key', key);

                return;
            }

            this.#logger?.debug(this.#logPrefix, 'Cache found for key', key);

            return item.value;
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Get cache for key', key, 'failed with error', error);

            throw error;
        }
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<void>
    {
        this.#logger?.debug(this.#logPrefix, 'Setting cache for key', key);

        try
        {
            if (ttl !== undefined && (Number.isFinite(ttl) === false || ttl <= 0))
            {
                throw new InvalidTTL();
            }

            this.#validateConnection();
        
            const item: CacheItem<T> = { key, value, ttl };

            await this.#driver.set(item);
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Set cache for key', key, 'failed with error', error);

            throw error;
        }
    }

    async delete(key: string): Promise<void>
    {
        this.#logger?.debug(this.#logPrefix, 'Deleting cache for key', key);

        try
        {
            this.#validateConnection();
        
            await this.#driver.delete(key);
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Delete cache for key', key, 'failed with error', error);

            throw error;
        }
    }

    #validateConnection(): void
    {
        if (this.connected === false)
        {
            throw new NotConnected();
        }
    }
}
