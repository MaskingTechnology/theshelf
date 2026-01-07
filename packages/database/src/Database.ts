
import sanitize from './utilities/sanitize.js';

import { States } from './definitions/constants.js';
import type { State } from './definitions/constants.js';
import type { Driver } from './definitions/interfaces.js';
import type { RecordData, RecordField, RecordId, RecordQuery, RecordSort, RecordType } from './definitions/types.js';

export default class Database implements Driver
{
    #driver: Driver;
    #state: State = States.DISCONNECTED;

    constructor(driver: Driver)
    {
        this.#driver = driver;
    }

    get connected(): boolean
    {
        return this.#state === States.CONNECTED;
    }

    async connect(): Promise<void>
    {
        if (this.#state !== States.DISCONNECTED)
        {
            return;
        }

        this.#state = States.CONNECTING;

        try
        {
            await this.#driver.connect();

            this.#state = this.#driver.connected
                ? States.CONNECTED
                : States.DISCONNECTED;
        }
        catch (error)
        {
            this.#state = States.DISCONNECTED;
            
            throw error;
        }
    }

    async disconnect(): Promise<void>
    {
        if (this.#state !== States.CONNECTED)
        {
            return;
        }

        this.#state = States.DISCONNECTING;

        try
        {
        await this.#driver.disconnect();

        this.#state = this.#driver.connected
            ? States.CONNECTED
            : States.DISCONNECTED;
        }
        catch (error)
        {
            this.#state = States.CONNECTED;

            throw error;
        }
    }

    createRecord(type: RecordType, data: RecordData): Promise<RecordId>
    {
        const cleanData = sanitize(data);

        return this.#driver.createRecord(type, cleanData);
    }

    readRecord(type: RecordType, query: RecordQuery, fields?: RecordField[], sort?: RecordSort): Promise<RecordData | undefined>
    {
        return this.#driver.readRecord(type, query, fields, sort);
    }

    searchRecords(type: RecordType, query: RecordQuery, fields?: RecordField[], sort?: RecordSort, limit?: number, offset?: number): Promise<RecordData[]>
    {
        return this.#driver.searchRecords(type, query, fields, sort, limit, offset);
    }

    updateRecord(type: RecordType, query: RecordQuery, data: RecordData): Promise<number>
    {
        const cleanData = sanitize(data);

        return this.#driver.updateRecord(type, query, cleanData);
    }

    updateRecords(type: RecordType, query: RecordQuery, data: RecordData): Promise<number>
    {
        const cleanData = sanitize(data);

        return this.#driver.updateRecords(type, query, cleanData);
    }

    deleteRecord(type: RecordType, query: RecordQuery): Promise<number>
    {
        return this.#driver.deleteRecord(type, query);
    }

    deleteRecords(type: RecordType, query: RecordQuery): Promise<number>
    {
        return this.#driver.deleteRecords(type, query);
    }
}
