
import type Logger from '@theshelf/logging';

import type { Driver } from './definitions/interfaces.js';

export default class Http
{
    readonly #driver: Driver;
    
    readonly #logger?: Logger;
    readonly #logPrefix: string;

    constructor(driver: Driver, logger?: Logger)
    {
        this.#driver = driver;
        
        this.#logger = logger?.for(Http.name);
        this.#logPrefix = `${this.#driver.name} ->`;
    }

    async get(url: string, headers?: Record<string, string> | undefined): Promise<Response>
    {
        this.#logger?.debug(this.#logPrefix, 'Getting', url);

        try
        {
            return await this.#driver.get(url, headers);
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Get', url, 'failed with error', error);

            throw error;
        }
    }

    async post(url: string, body: unknown, headers?: Record<string, string> | undefined): Promise<Response>
    {
        this.#logger?.debug(this.#logPrefix, 'Posting', url);

        try
        {
            return await this.#driver.post(url, body, headers);
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Post', url, 'failed with error', error);

            throw error;
        }
    }

    async put(url: string, body: unknown, headers?: Record<string, string> | undefined): Promise<Response>
    {
        this.#logger?.debug(this.#logPrefix, 'Putting', url);

        try
        {
            return await this.#driver.put(url, body, headers);
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Put', url, 'failed with error', error);

            throw error;
        }
    }

    async patch(url: string, body: unknown, headers?: Record<string, string> | undefined): Promise<Response>
    {
        this.#logger?.debug(this.#logPrefix, 'Patching', url);

        try
        {
            return await this.#driver.patch(url, body, headers);
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Patch', url, 'failed with error', error);

            throw error;
        }
    }

    async delete(url: string, headers?: Record<string, string> | undefined): Promise<Response>
    {
        this.#logger?.debug(this.#logPrefix, 'Deleting', url);

        try
        {
            return await this.#driver.delete(url, headers);
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Delete', url, 'failed with error', error);

            throw error;
        }
    }

    async head(url: string, headers?: Record<string, string> | undefined): Promise<Response>
    {
        this.#logger?.debug(this.#logPrefix, 'Heading', url);

        try
        {
            return await this.#driver.head(url, headers);
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Head', url, 'failed with error', error);

            throw error;
        }
    }
}
