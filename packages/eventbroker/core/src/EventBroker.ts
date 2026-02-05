
import type Logger from '@theshelf/logging';

import type { Driver } from './definitions/interfaces.js';
import type { Publication, Subscription } from './definitions/types.js';
import NotConnected from './errors/NotConnected.js';

export default class EventBroker
{
    readonly #driver: Driver;

    readonly #logger?: Logger;
    readonly #logPrefix: string;

    constructor(driver: Driver, logger?: Logger)
    {
        this.#driver = driver;

        this.#logger = logger?.for(EventBroker.name);
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
            return await this.#driver.disconnect();
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Disconnect failed with error', error);

            throw error;
        }
    }

    async publish<T>(publication: Publication<T>): Promise<void>
    {
        this.#logger?.debug(this.#logPrefix, 'Publishing to', publication.channel, '->', publication.name);

        try
        {
            this.#validateConnection();
        
            return await this.#driver.publish(publication);
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Publish to', publication.channel, '->', publication.name, 'failed with error', error);

            throw error;
        }
    }

    async subscribe<T>(subscription: Subscription<T>): Promise<void>
    {
        this.#logger?.debug(this.#logPrefix, 'Subscribing to', subscription.channel, '->', subscription.name);

        try
        {
            this.#validateConnection();
        
            return await this.#driver.subscribe(subscription);
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Subscribe to', subscription.channel, '->', subscription.name, 'failed with error', error);

            throw error;
        }
    }

    async unsubscribe<T>(subscription: Subscription<T>): Promise<void>
    {
        this.#logger?.debug(this.#logPrefix, 'Unsubscribing from', subscription.channel, '->', subscription.name);

        try
        {
            this.#validateConnection();
        
            return await this.#driver.unsubscribe(subscription);
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Unsubscribe from', subscription.channel, '->', subscription.name, 'failed with error', error);

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
