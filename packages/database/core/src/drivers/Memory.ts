
import { LogicalOperators, QueryOperators, SortDirections } from '../definitions/constants.js';
import type { Driver } from '../definitions/interfaces.js';
import type {
    QueryExpression,
    QueryMultiExpressionStatement,
    QueryOperator,
    QuerySingleExpressionStatement,
    RecordData,
    RecordField,
    RecordQuery,
    RecordSort,
    RecordValue
} from '../definitions/types.js';

import NotConnected from '../errors/NotConnected.js';

type FilterFunction = (record: RecordData) => boolean;

const OPERATORS: Record<string, string> =
{
    [QueryOperators.EQUALS]: '==',
    [QueryOperators.GREATER_THAN]: '>',
    [QueryOperators.GREATER_THAN_OR_EQUALS]: '>=',
    [QueryOperators.LESS_THAN]: '<',
    [QueryOperators.LESS_THAN_OR_EQUALS]: '<=',
    [QueryOperators.NOT_EQUALS]: '!=',
} as const;

const LOGICAL_OPERATORS: Record<string, string> =
{
    [LogicalOperators.AND]: '&&',
    [LogicalOperators.OR]: '||'
} as const;

export default class Memory implements Driver
{
    readonly #memory = new Map<string, RecordData[]>();

    #connected = false;
    #recordId = 0;

    get name(): string { return Memory.name; }

    get connected(): boolean { return this.#connected; }

    get memory(): Map<string, RecordData[]>
    {
        if (this.#connected === false)
        {
            throw new NotConnected();
        }

        return this.#memory;
    }

    async connect(): Promise<void>
    {
        this.#connected = true;
    }

    async disconnect(): Promise<void>
    {
        this.#connected = false;
        this.#memory.clear();
    }

    async createRecord<T extends RecordData>(type: string, data: T): Promise<string>
    {
        const collection = this.#getCollection<T>(type);

        const record = data.id === undefined
            ? { id: this.#createId(), ...data }
            : data;

        collection.push(record);

        return record.id as string;
    }

    async readRecord<T extends RecordData>(type: string, query: RecordQuery<T>, fields?: string[], sort?: RecordSort<T>): Promise<T | undefined>
    {
        const result = await this.searchRecords<T>(type, query, fields, sort, 1, 0);

        return result[0];
    }

    async searchRecords<T extends RecordData>(type: string, query: RecordQuery<T>, fields?: string[], sort?: RecordSort<T>, limit?: number, offset?: number): Promise<T[]>
    {
        const records = this.#fetchRecords<T>(type, query);

        const sortedRecords = this.#sortRecords<T>(records, sort);
        const limitedRecords = this.#limitNumberOfRecords<T>(sortedRecords, offset, limit);

        return limitedRecords.map(record => this.#buildRecordData<T>(record, fields));
    }

    async updateRecord<T extends RecordData>(type: string, query: RecordQuery<T>, data: RecordData): Promise<number>
    {
        const record = this.#fetchRecord<T>(type, query);

        if (record === undefined)
        {
            return 0;
        }

        this.#updateRecordData(record, data);

        return 1;
    }

    async updateRecords<T extends RecordData>(type: string, query: RecordQuery<T>, data: RecordData): Promise<number>
    {
        const records = this.#fetchRecords<T>(type, query);

        records.forEach(record => this.#updateRecordData(record, data));

        return records.length;
    }

    async deleteRecord<T extends RecordData>(type: string, query: RecordQuery<T>): Promise<number>
    {
        const filterFunction = this.#buildFilterFunction<T>(query);

        const collection = this.#getCollection<T>(type);
        const index = collection.findIndex(filterFunction);

        if (index === -1)
        {
            return 0;
        }

        collection.splice(index, 1);

        return 1;
    }

    async deleteRecords<T extends RecordData>(type: string, query: RecordQuery<T>): Promise<number>
    {
        const collection = this.#getCollection<T>(type);
        const records = this.#fetchRecords<T>(type, query);

        const indexes = records
            .map(fetchedRecord => collection.findIndex(collectionRecord => collectionRecord.id === fetchedRecord.id))
            .sort((a, b) => b - a); // Reverse the order of indexes to delete from the end to the beginning

        indexes.forEach(index => collection.splice(index, 1));

        return indexes.length;
    }

    clear(): void
    {
        this.memory.clear();
    }

    #fetchRecord<T extends RecordData>(type: string, query: RecordQuery<T>): T | undefined
    {
        const collection = this.#getCollection<T>(type);
        const filterFunction = this.#buildFilterFunction<T>(query);

        return collection.find(filterFunction);
    }

    #fetchRecords<T extends RecordData>(type: string, query: RecordQuery<T>): T[]
    {
        const collection = this.#getCollection<T>(type);
        const filterFunction = this.#buildFilterFunction<T>(query);

        return collection.filter(filterFunction);
    }

    #updateRecordData(record: RecordData, data: RecordData): void
    {
        for (const key of Object.keys(data))
        {
            record[key] = data[key];
        }
    }

    #limitNumberOfRecords<T extends RecordData>(result: T[], offset?: number, limit?: number): T[]
    {
        if (offset === undefined && limit === undefined)
        {
            return result;
        }

        const first = offset ?? 0;
        const last = limit === undefined ? undefined : first + limit;

        return result.slice(first, last);
    }

    #sortRecords<T extends RecordData>(result: T[], sort?: RecordSort<T>): T[]
    {
        if (sort === undefined)
        {
            return result;
        }

        return result.sort((a: T, b: T) =>
        {
            for (const key in sort)
            {
                const order = sort[key];
                const valueA = a[key] as string;
                const valueB = b[key] as string;

                if (valueA > valueB)
                {
                    return order === SortDirections.ASCENDING ? 1 : -1;
                }
                else if (valueA < valueB)
                {
                    return order === SortDirections.ASCENDING ? -1 : 1;
                }
            }

            return 0;
        });
    }

    #buildFilterFunction<T extends RecordData>(query: RecordQuery<T>): FilterFunction
    {
        const statementCode = this.#buildStatementCode<T>(query);
        const functionCode = statementCode === '' ? 'true' : statementCode;

        return new Function('record', `return ${functionCode}`) as FilterFunction;
    }

    #buildStatementCode<T extends RecordData>(query: RecordQuery<T>): string
    {
        const multiStatements = query as QueryMultiExpressionStatement<T>;
        const singleStatements = query as QuerySingleExpressionStatement<T>;

        const statementCodes = [];

        for (const key in multiStatements)
        {
            const code = key === 'AND' || key === 'OR'
                ? this.#buildMultiStatementCode<T>(key, multiStatements[key] ?? [])
                : this.#buildExpressionCode<T>(key, singleStatements[key]!);

            statementCodes.push(code);
        }

        return statementCodes.join(' && ');
    }

    #buildMultiStatementCode<T extends RecordData>(operator: string, statements: QuerySingleExpressionStatement<T>[])
    {
        const codeOperator = LOGICAL_OPERATORS[operator];
        const statementCodes = [];

        for (const statement of statements)
        {
            const statementCode = this.#buildStatementCode<T>(statement);

            statementCodes.push(statementCode);
        }

        const code = statementCodes.join(` ${codeOperator} `);

        return `(${code})`;
    }

    #buildExpressionCode<T extends RecordData>(key: string, expression: QueryExpression<T>)
    {
        const expressionCodes = [];

        for (const operator in expression)
        {
            const value = (expression as RecordData)[operator];
            const expressionCode = this.#buildOperatorCode(key, operator as QueryOperator, value);

            expressionCodes.push(expressionCode);
        }

        return `(${expressionCodes.join(' && ')})`;
    }

    #buildOperatorCode(key: string, operator: QueryOperator, value: RecordValue): string
    {
        const codeValue = JSON.stringify(value);

        switch (operator)
        {
            case QueryOperators.STARTS_WITH: return `record.${key}.startsWith(${codeValue})`;
            case QueryOperators.ENDS_WITH: return `record.${key}.endsWith(${codeValue})`;
            case QueryOperators.CONTAINS: return `record.${key}.includes(${codeValue})`;
            case QueryOperators.IN: return `${codeValue}.includes(record.${key})`;
            case QueryOperators.NOT_IN: return `!${codeValue}.includes(record.${key})`;
        }

        const codeOperator = OPERATORS[operator];

        return `record.${key} ${codeOperator} ${codeValue}`;
    }

    #createId(): string
    {
        return (++this.#recordId).toString().padStart(8, '0');
    }

    #getCollection<T extends RecordData>(type: string): T[]
    {
        const memory = this.memory;

        let collection = memory.get(type) as T[];

        if (collection === undefined)
        {
            collection = [];

            memory.set(type, collection);
        }

        return collection;
    }

    #buildRecordData<T extends RecordData>(data: T, fields?: RecordField[]): T
    {
        if (fields === undefined)
        {
            return { ...data };
        }

        const result: RecordData = {};

        for (const field of fields)
        {
            result[field] = data[field];
        }

        return result as T;
    }
}
