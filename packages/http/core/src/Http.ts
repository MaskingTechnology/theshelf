
import type Logger from '@theshelf/logging';

import type { Driver } from './definitions/interfaces.js';

export default class Http
{
    readonly #driver: Driver;
    
    readonly #logger?: Logger;

    constructor(driver: Driver, logger?: Logger)
    {
        this.#driver = driver;
        
        this.#logger = logger?.for(Http.name)
                              .for(this.#driver.name);
    }

    async get(url: string, headers?: Record<string, string> | undefined): Promise<Response>
    {
        this.#logger?.debug('Getting', url);

        try
        {
            return await this.#driver.get(url, headers);
        }
        catch (error)
        {
            this.#logger?.error('Get', url, 'failed with error', error);

            throw error;
        }
    }

    async post(url: string, body: unknown, headers?: Record<string, string> | undefined): Promise<Response>
    {
        this.#logger?.debug('Posting', url);

        try
        {
            return await this.#driver.post(url, body, headers);
        }
        catch (error)
        {
            this.#logger?.error('Post', url, 'failed with error', error);

            throw error;
        }
    }

    async put(url: string, body: unknown, headers?: Record<string, string> | undefined): Promise<Response>
    {
        this.#logger?.debug('Putting', url);

        try
        {
            return await this.#driver.put(url, body, headers);
        }
        catch (error)
        {
            this.#logger?.error('Put', url, 'failed with error', error);

            throw error;
        }
    }

    async patch(url: string, body: unknown, headers?: Record<string, string> | undefined): Promise<Response>
    {
        this.#logger?.debug('Patching', url);

        try
        {
            return await this.#driver.patch(url, body, headers);
        }
        catch (error)
        {
            this.#logger?.error('Patch', url, 'failed with error', error);

            throw error;
        }
    }

    async delete(url: string, headers?: Record<string, string> | undefined): Promise<Response>
    {
        this.#logger?.debug('Deleting', url);

        try
        {
            return await this.#driver.delete(url, headers);
        }
        catch (error)
        {
            this.#logger?.error('Delete', url, 'failed with error', error);

            throw error;
        }
    }

    async head(url: string, headers?: Record<string, string> | undefined): Promise<Response>
    {
        this.#logger?.debug('Heading', url);

        try
        {
            return await this.#driver.head(url, headers);
        }
        catch (error)
        {
            this.#logger?.error('Head', url, 'failed with error', error);

            throw error;
        }
    }
}
