
import sanitize from './utilities/sanitize.js';

import { ConnectionStates } from './definitions/constants.js';
import type { ConnectionState } from './definitions/constants.js';
import type { Driver } from './definitions/interfaces.js';
import type { RecordData, RecordField, RecordId, RecordQuery, RecordSort, RecordType } from './definitions/types.js';

import ConnectionManager from './ConnectionManager.js';

export default class Database implements Driver
{
    readonly #driver: Driver;
    readonly #connectionManager: ConnectionManager;

    constructor(driver: Driver)
    {
        this.#driver = driver;
        this.#connectionManager = new ConnectionManager(driver);
    }

    get connectionState(): ConnectionState
    {
        return this.#connectionManager.state;
    }

    get connected(): boolean
    {
        return this.connectionState === ConnectionStates.CONNECTED;
    }

    connect(): Promise<void>
    {
        return this.#connectionManager.connect();
    }

    disconnect(): Promise<void>
    {
        return this.#connectionManager.disconnect();
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
