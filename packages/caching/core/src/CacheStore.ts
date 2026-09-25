
import type Logger from '@theshelf/logging';

import type { Driver } from './definitions/interfaces.js';
import type { CacheItem } from './definitions/types.js';
import NotConnected from './errors/NotConnected.js';
import InvalidTTL from './errors/InvalidTTL.js';

export default class CacheStore
{
    readonly #driver: Driver;

    readonly #logger?: Logger;

    constructor(driver: Driver, logger?: Logger)
    {
        this.#driver = driver;

        this.#logger = logger?.for(this.constructor.name)
                              .for(this.#driver.name);
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

        this.#logger?.debug('Connecting');
        
        try
        {
            await this.#driver.connect();

            this.#logger?.debug('Connected');
        }
        catch (error)
        {
            this.#logger?.error('Connect failed with error', error);

            throw error;
        }
    }

    async disconnect(): Promise<void>
    {
        if (this.connected === false)
        {
            return;
        }

        this.#logger?.debug('Disconnecting');
        
        try
        {
            await this.#driver.disconnect();

            this.#logger?.debug('Disconnected');
        }
        catch (error)
        {
            this.#logger?.error('Disconnect failed with error', error);

            throw error;
        }
    }

    async get<T>(key: string): Promise<T | undefined>
    {
        this.#logger?.debug('Getting cache for key', key);

        try
        {
            this.#validateConnection();
        
            const item = await this.#driver.get<T>(key);

            if (item === undefined)
            {
                this.#logger?.debug('Cache miss for key', key);

                return;
            }

            this.#logger?.debug('Cache found for key', key);

            return item.value;
        }
        catch (error)
        {
            this.#logger?.error('Get cache for key', key, 'failed with error', error);

            throw error;
        }
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<void>
    {
        this.#logger?.debug('Setting cache for key', key);

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
            this.#logger?.error('Set cache for key', key, 'failed with error', error);

            throw error;
        }
    }

    async delete(key: string): Promise<void>
    {
        this.#logger?.debug('Deleting cache for key', key);

        try
        {
            this.#validateConnection();
        
            await this.#driver.delete(key);
        }
        catch (error)
        {
            this.#logger?.error('Delete cache for key', key, 'failed with error', error);

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
