
import type { RecordData, RecordField, RecordId, RecordQuery, RecordSort, RecordType } from './types.js';

export interface Driver
{
    get name(): string;
    get connected(): boolean;

    connect(): Promise<void>;
    disconnect(): Promise<void>;
    createRecord<T extends RecordData>(type: RecordType, data: T): Promise<RecordId>;
    readRecord<T extends RecordData>(type: RecordType, query: RecordQuery<T>, fields?: RecordField[], sort?: RecordSort<T>): Promise<T | undefined>;
    searchRecords<T extends RecordData>(type: RecordType, query: RecordQuery<T>, fields?: RecordField[], sort?: RecordSort<T>, limit?: number, offset?: number): Promise<T[]>;
    updateRecord<T extends RecordData>(type: RecordType, query: RecordQuery<T>, data: T): Promise<number>;
    updateRecords<T extends RecordData>(type: RecordType, query: RecordQuery<T>, data: T): Promise<number>;
    deleteRecord<T extends RecordData>(type: RecordType, query: RecordQuery<T>): Promise<number>;
    deleteRecords<T extends RecordData>(type: RecordType, query: RecordQuery<T>): Promise<number>;
}
