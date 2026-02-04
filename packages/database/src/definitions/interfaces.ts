
import type { RecordData, RecordField, RecordId, RecordQuery, RecordSort, RecordType } from './types.js';

export interface Driver
{
    get name(): string;
    get connected(): boolean;

    connect(): Promise<void>;
    disconnect(): Promise<void>;
    createRecord(type: RecordType, data: RecordData): Promise<RecordId>;
    readRecord(type: RecordType, query: RecordQuery, fields?: RecordField[], sort?: RecordSort): Promise<RecordData | undefined>;
    searchRecords(type: RecordType, query: RecordQuery, fields?: RecordField[], sort?: RecordSort, limit?: number, offset?: number): Promise<RecordData[]>;
    updateRecord(type: RecordType, query: RecordQuery, data: RecordData): Promise<number>;
    updateRecords(type: RecordType, query: RecordQuery, data: RecordData): Promise<number>;
    deleteRecord(type: RecordType, query: RecordQuery): Promise<number>;
    deleteRecords(type: RecordType, query: RecordQuery): Promise<number>;
}
