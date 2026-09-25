
import type Logger from '@theshelf/logging';

import type { Driver } from './definitions/interfaces.js';
import type { Session } from './definitions/types.js';
import NotConnected from './errors/NotConnected.js';

export default class IdentityProvider
{
    readonly #driver: Driver;

    readonly #logger?: Logger;

    constructor(driver: Driver, logger?: Logger)
    {
        this.#driver = driver;

        this.#logger = logger?.for(IdentityProvider.name)
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

    async getLoginUrl(origin: string): Promise<string>
    {
        this.#logger?.debug('Getting login URL for origin', origin);

        try
        {
            this.#validateConnection();

            return await this.#driver.getLoginUrl(origin);
        }
        catch (error)
        {
            this.#logger?.error('Get login URL for origin', origin, 'failed with error', error);

            throw error;
        }
    }

    async login(origin: string, data: Record<string, unknown>): Promise<Session>
    {
        this.#logger?.debug('Logging in');

        try
        {
            this.#validateConnection();

            return await this.#driver.login(origin, data);
        }
        catch (error)
        {
            // Do NOT log data, as it might contain sensitive information

            this.#logger?.error('Login for origin', origin, 'failed with error', error);

            throw error;
        }
    }

    async refresh(session: Session): Promise<Session>
    {
        this.#logger?.debug('Refreshing session');

        try
        {
            this.#validateConnection();

            return await this.#driver.refresh(session);
        }
        catch (error)
        {
            this.#logger?.error('Refresh session for', session.id, 'failed with error', error);

            throw error;
        }
    }

    async logout(session: Session): Promise<void>
    {
        this.#logger?.debug('Logging out');

        try
        {
            this.#validateConnection();
            
            return await this.#driver.logout(session);
        }
        catch (error)
        {
            this.#logger?.error('Logout session for', session.id, 'failed with error', error);

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
