
import type Logger from '@theshelf/logging';

import type { Driver } from './definitions/interfaces.js';
import NotConnected from './errors/NotConnected.js';

export default class NotificationService
{
    readonly #driver: Driver;

    readonly #logger?: Logger;

    constructor(driver: Driver, logger?: Logger)
    {
        this.#driver = driver;

        this.#logger = logger?.for(NotificationService.name)
                              .for(this.#driver.name);
    }

    get connected(): boolean
    {
        return this.#driver.connected;
    }

    get subscriptions(): Map<string, unknown>
    {
        return new Map(this.#driver.subscriptions);
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
            return await this.#driver.disconnect();
        }
        catch (error)
        {
            this.#logger?.error('Disconnect failed with error', error);

            throw error;
        }
    }

    async subscribe(recipientId: string, subscription: unknown): Promise<void>
    {
        this.#logger?.debug('Subscribing with id', recipientId);

        try
        {
            this.#validateConnection();

            return await this.#driver.subscribe(recipientId, subscription);
        }
        catch (error)
        {
            this.#logger?.error('Subscribe with id', recipientId, 'failed with error', error);

            throw error;
        }
    }

    async unsubscribe(recipientId: string): Promise<void>
    {
        this.#logger?.debug('Unsubscribing with id', recipientId);

        try
        {
            this.#validateConnection();

            return await this.#driver.unsubscribe(recipientId);
        }
        catch (error)
        {
            this.#logger?.error('Unsubscribe with id', recipientId, 'failed with error', error);

            throw error;
        }
    }

    async sendNotification(recipientId: string, title: string, message: string): Promise<void>
    {
        this.#logger?.debug('Sending notification to id', recipientId);

        try
        {
            this.#validateConnection();

            return await this.#driver.sendNotification(recipientId, title, message);
        }
        catch (error)
        {
            this.#logger?.error('Send notification to id', recipientId, 'failed with error', error);

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
