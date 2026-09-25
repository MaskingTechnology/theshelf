
import type Logger from '@theshelf/logging';

import sanitize from './utilities/sanitize.js';

import type { Driver } from './definitions/interfaces.js';
import type { RecordData, RecordField, RecordQuery, RecordSort, RecordType } from './definitions/types.js';
import NotConnected from './errors/NotConnected.js';
import CreateResult from './results/CreateResult.js';
import ReadResult from './results/ReadResult.js';
import UpdateResult from './results/UpdateResult.js';
import DeleteResult from './results/DeleteResult.js';
import SearchResult from './results/SearchResult.js';

export default class Database
{
    readonly #driver: Driver;

    readonly #logger?: Logger;

    constructor(driver: Driver, logger?: Logger)
    {
        this.#driver = driver;

        this.#logger = logger?.for(Database.name)
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

    async createRecord<T extends RecordData>(type: RecordType, data: T): Promise<CreateResult>
    {
        this.#logger?.debug('Creating record for type', type);

        try
        {
            this.#validateConnection();
        
            const cleanData = sanitize(data);

            const recordId = await this.#driver.createRecord(type, cleanData);

            return new CreateResult(recordId);
        }
        catch (error)
        {
            this.#logger?.error('Create record for type', type, 'failed with error', error);

            throw error;
        }
    }

    async readRecord<T extends RecordData>(type: RecordType, query: RecordQuery<T>, fields?: RecordField[], sort?: RecordSort<T>): Promise<ReadResult<T>>
    {
        this.#logger?.debug('Reading record for type', type);

        try
        {
            this.#validateConnection();
        
            const record =  await this.#driver.readRecord(type, query, fields, sort);

            return new ReadResult<T>(record);
        }
        catch (error)
        {
            this.#logger?.error('Read record for type', type, 'failed with error', error);

            throw error;
        }
    }

    async searchRecords<T extends RecordData>(type: RecordType, query: RecordQuery<T>, fields?: RecordField[], sort?: RecordSort<T>, limit?: number, offset?: number): Promise<SearchResult<T>>
    {
        this.#logger?.debug('Searching record for type', type);

        try
        {
            this.#validateConnection();
        
            const records = await this.#driver.searchRecords(type, query, fields, sort, limit, offset);

            return new SearchResult<T>(records);
        }
        catch (error)
        {
            this.#logger?.error('Search record for type', type, 'failed with error', error);

            throw error;
        }
    }

    async updateRecord<T extends RecordData>(type: RecordType, query: RecordQuery<T>, data: RecordData): Promise<UpdateResult>
    {
        this.#logger?.debug('Updating record for type', type);

        try
        {
            this.#validateConnection();

            const cleanData = sanitize(data);
        
            const affectedCount = await this.#driver.updateRecord(type, query, cleanData);

            return new UpdateResult(affectedCount);
        }
        catch (error)
        {
            this.#logger?.error('Update record for type', type, 'failed with error', error);

            throw error;
        }
    }

    async updateRecords<T extends RecordData>(type: RecordType, query: RecordQuery<T>, data: RecordData): Promise<UpdateResult>
    {
        this.#logger?.debug('Updating records for type', type);

        try
        {
            this.#validateConnection();

            const cleanData = sanitize(data);
        
            const affectedCount = await this.#driver.updateRecords(type, query, cleanData);

            return new UpdateResult(affectedCount);
        }
        catch (error)
        {
            this.#logger?.error('Update records for type', type, 'failed with error', error);

            throw error;
        }
    }

    async deleteRecord<T extends RecordData>(type: RecordType, query: RecordQuery<T>): Promise<DeleteResult>
    {
        this.#logger?.debug('Deleting record for type', type);

        try
        {
            this.#validateConnection();
        
            const affectedCount = await this.#driver.deleteRecord(type, query);

            return new DeleteResult(affectedCount);
        }
        catch (error)
        {
            this.#logger?.error('Delete record for type', type, 'failed with error', error);

            throw error;
        }
    }

    async deleteRecords<T extends RecordData>(type: RecordType, query: RecordQuery<T>): Promise<DeleteResult>
    {
        this.#logger?.debug('Deleting records for type', type);

        try
        {
            this.#validateConnection();
        
            const affectedCount = await this.#driver.deleteRecords(type, query);

            return new DeleteResult(affectedCount);
        }
        catch (error)
        {
            this.#logger?.error('Delete records for type', type, 'failed with error', error);

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
