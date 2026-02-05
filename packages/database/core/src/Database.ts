
import type Logger from '@theshelf/logging';

import sanitize from './utilities/sanitize.js';

import type { Driver } from './definitions/interfaces.js';
import type { RecordData, RecordField, RecordId, RecordQuery, RecordSort, RecordType } from './definitions/types.js';
import NotConnected from './errors/NotConnected.js';

export default class Database
{
    readonly #driver: Driver;

    readonly #logger?: Logger;
    readonly #logPrefix: string;

    constructor(driver: Driver, logger?: Logger)
    {
        this.#driver = driver;

        this.#logger = logger?.for(Database.name);
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

    async createRecord(type: RecordType, data: RecordData): Promise<RecordId>
    {
        this.#logger?.debug(this.#logPrefix, 'Creating record for type', type);

        try
        {
            this.#validateConnection();
        
            const cleanData = sanitize(data);

            return await this.#driver.createRecord(type, cleanData);
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Create record for type', type, 'failed with error', error);

            throw error;
        }
    }

    async readRecord(type: RecordType, query: RecordQuery, fields?: RecordField[], sort?: RecordSort): Promise<RecordData | undefined>
    {
        this.#logger?.debug(this.#logPrefix, 'Reading record for type', type);

        try
        {
            this.#validateConnection();
        
            return await this.#driver.readRecord(type, query, fields, sort);
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Read record for type', type, 'failed with error', error);

            throw error;
        }
    }

    async searchRecords(type: RecordType, query: RecordQuery, fields?: RecordField[], sort?: RecordSort, limit?: number, offset?: number): Promise<RecordData[]>
    {
        this.#logger?.debug(this.#logPrefix, 'Searching record for type', type);

        try
        {
            this.#validateConnection();
        
            return await this.#driver.searchRecords(type, query, fields, sort, limit, offset);
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Search record for type', type, 'failed with error', error);

            throw error;
        }
    }

    async updateRecord(type: RecordType, query: RecordQuery, data: RecordData): Promise<number>
    {
        this.#logger?.debug(this.#logPrefix, 'Updating record for type', type);

        try
        {
            this.#validateConnection();

            const cleanData = sanitize(data);
        
            return await this.#driver.updateRecord(type, query, cleanData);
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Update record for type', type, 'failed with error', error);

            throw error;
        }
    }

    async updateRecords(type: RecordType, query: RecordQuery, data: RecordData): Promise<number>
    {
        this.#logger?.debug(this.#logPrefix, 'Updating records for type', type);

        try
        {
            this.#validateConnection();

            const cleanData = sanitize(data);
        
            return await this.#driver.updateRecords(type, query, cleanData);
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Update records for type', type, 'failed with error', error);

            throw error;
        }
    }

    async deleteRecord(type: RecordType, query: RecordQuery): Promise<number>
    {
        this.#logger?.debug(this.#logPrefix, 'Deleting record for type', type);

        try
        {
            this.#validateConnection();
        
            return await this.#driver.deleteRecord(type, query);
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Delete record for type', type, 'failed with error', error);

            throw error;
        }
    }

    async deleteRecords(type: RecordType, query: RecordQuery): Promise<number>
    {
        this.#logger?.debug(this.#logPrefix, 'Deleting records for type', type);

        try
        {
            this.#validateConnection();
        
            return await this.#driver.deleteRecords(type, query);
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Delete records for type', type, 'failed with error', error);

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
