
import type Logger from '@theshelf/logging';

import type { Driver } from './definitions/interfaces.js';
import NotConnected from './errors/NotConnected.js';

export default class FileStore
{
    readonly #driver: Driver;

    readonly #logger?: Logger;
    readonly #logPrefix: string;

    constructor(driver: Driver, logger?: Logger)
    {
        this.#driver = driver;
        
        this.#logger = logger?.for(FileStore.name);
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

    async hasFile(path: string): Promise<boolean>
    {
        this.#logger?.debug(this.#logPrefix, 'Checking has file', path);

        try
        {
            this.#validateConnection();

            return await this.#driver.hasFile(path);
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Check has file', path, 'failed with error', error);

            throw error;
        }
    }

    async writeFile(path: string, data: Buffer): Promise<void>
    {
        this.#logger?.debug(this.#logPrefix, 'Writing file', path);

        try
        {
            this.#validateConnection();

            return await this.#driver.writeFile(path, data);
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Write file', path, 'failed with error', error);

            throw error;
        }
    }

    async readFile(path: string): Promise<Buffer>
    {
        this.#logger?.debug(this.#logPrefix, 'Reading file', path);

        try
        {
            this.#validateConnection();

            return await this.#driver.readFile(path);
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Read file', path, 'failed with error', error);

            throw error;
        }
    }

    async deleteFile(path: string): Promise<void>
    {
        this.#logger?.debug(this.#logPrefix, 'Deleting file', path);

        try
        {
            this.#validateConnection();

            return await this.#driver.deleteFile(path);
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Delete file', path, 'failed with error', error);

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
