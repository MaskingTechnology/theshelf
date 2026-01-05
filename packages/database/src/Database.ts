
import sanitize from './utilities/sanitize.js';

import type { Driver } from './definitions/interfaces.js';
import type { RecordData, RecordField, RecordId, RecordQuery, RecordSort, RecordType } from './definitions/types.js';

import Memory from './drivers/Memory.js';

export default class Database implements Driver
{
    #driver: Driver = new Memory();

    set driver(driver: Driver)
    {
        this.#driver = driver;
    }

    get driver(): Driver
    {
        return this.#driver;
    }

    get connected() { return this.driver.connected; }

    connect(): Promise<void>
    {
        return this.driver.connect();
    }

    disconnect(): Promise<void>
    {
        return this.driver.disconnect();
    }

    createRecord(type: RecordType, data: RecordData): Promise<RecordId>
    {
        const cleanData = sanitize(data);

        return this.driver.createRecord(type, cleanData);
    }

    readRecord(type: RecordType, query: RecordQuery, fields?: RecordField[], sort?: RecordSort): Promise<RecordData | undefined>
    {
        return this.driver.readRecord(type, query, fields, sort);
    }

    searchRecords(type: RecordType, query: RecordQuery, fields?: RecordField[], sort?: RecordSort, limit?: number, offset?: number): Promise<RecordData[]>
    {
        return this.driver.searchRecords(type, query, fields, sort, limit, offset);
    }

    updateRecord(type: RecordType, query: RecordQuery, data: RecordData): Promise<number>
    {
        const cleanData = sanitize(data);

        return this.driver.updateRecord(type, query, cleanData);
    }

    updateRecords(type: RecordType, query: RecordQuery, data: RecordData): Promise<number>
    {
        const cleanData = sanitize(data);

        return this.driver.updateRecords(type, query, cleanData);
    }

    deleteRecord(type: RecordType, query: RecordQuery): Promise<number>
    {
        return this.driver.deleteRecord(type, query);
    }

    deleteRecords(type: RecordType, query: RecordQuery): Promise<number>
    {
        return this.driver.deleteRecords(type, query);
    }

    clear(): Promise<void>
    {
        return this.driver.clear();
    }
}
