
import type Logger from '@theshelf/logging';

import type { Driver } from './definitions/interfaces.js';
import NotConnected from './errors/NotConnected.js';

export default class FileStore
{
    readonly #driver: Driver;

    readonly #logger?: Logger;

    constructor(driver: Driver, logger?: Logger)
    {
        this.#driver = driver;
        
        this.#logger = logger?.for(FileStore.name)
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

    async hasFile(path: string): Promise<boolean>
    {
        this.#logger?.debug('Checking has file', path);

        try
        {
            this.#validateConnection();

            return await this.#driver.hasFile(path);
        }
        catch (error)
        {
            this.#logger?.error('Check has file', path, 'failed with error', error);

            throw error;
        }
    }

    async writeFile(path: string, data: Buffer): Promise<void>
    {
        this.#logger?.debug('Writing file', path);

        try
        {
            this.#validateConnection();

            return await this.#driver.writeFile(path, data);
        }
        catch (error)
        {
            this.#logger?.error('Write file', path, 'failed with error', error);

            throw error;
        }
    }

    async readFile(path: string): Promise<Buffer>
    {
        this.#logger?.debug('Reading file', path);

        try
        {
            this.#validateConnection();

            return await this.#driver.readFile(path);
        }
        catch (error)
        {
            this.#logger?.error('Read file', path, 'failed with error', error);

            throw error;
        }
    }

    async deleteFile(path: string): Promise<void>
    {
        this.#logger?.debug('Deleting file', path);

        try
        {
            this.#validateConnection();

            return await this.#driver.deleteFile(path);
        }
        catch (error)
        {
            this.#logger?.error('Delete file', path, 'failed with error', error);

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
