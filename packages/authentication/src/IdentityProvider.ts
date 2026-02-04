
import type Logger from '@theshelf/logging';

import type { Driver } from './definitions/interfaces.js';
import type { Session } from './definitions/types.js';
import NotConnected from './errors/NotConnected.js';

export default class IdentityProvider
{
    readonly #driver: Driver;

    readonly #logger?: Logger;
    readonly #logPrefix: string;

    constructor(driver: Driver, logger?: Logger)
    {
        this.#driver = driver;

        this.#logger = logger?.for(IdentityProvider.name);
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

    async getLoginUrl(origin: string): Promise<string>
    {
        this.#logger?.debug(this.#logPrefix, 'Getting login URL for origin', origin);

        try
        {
            this.#validateConnection();

            return await this.#driver.getLoginUrl(origin);
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Get login URL for origin', origin, 'failed with error', error);

            throw error;
        }
    }

    async login(origin: string, data: Record<string, unknown>): Promise<Session>
    {
        this.#logger?.debug(this.#logPrefix, 'Logging in');

        try
        {
            this.#validateConnection();

            return await this.#driver.login(origin, data);
        }
        catch (error)
        {
            // Do NOT log data, as it might contain sensitive information

            this.#logger?.error(this.#logPrefix, 'Login for origin', origin, 'failed with error', error);

            throw error;
        }
    }

    async refresh(session: Session): Promise<Session>
    {
        this.#logger?.debug(this.#logPrefix, 'Refreshing session');

        try
        {
            this.#validateConnection();

            return await this.#driver.refresh(session);
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Refresh session for', session.id, 'failed with error', error);

            throw error;
        }
    }

    async logout(session: Session): Promise<void>
    {
        this.#logger?.debug(this.#logPrefix, 'Logging out');

        try
        {
            this.#validateConnection();
            
            return await this.#driver.logout(session);
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Logout session for', session.id, 'failed with error', error);

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
