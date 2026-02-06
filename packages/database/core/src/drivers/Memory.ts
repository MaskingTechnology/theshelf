
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

    async createRecord(type: string, data: RecordData): Promise<string>
    {
        const collection = this.#getCollection(type);

        const record = data.id === undefined
            ? { id: this.#createId(), ...data }
            : data;

        collection.push(record);

        return record.id as string;
    }

    async readRecord(type: string, query: RecordQuery, fields?: string[], sort?: RecordSort): Promise<RecordData | undefined>
    {
        const result = await this.searchRecords(type, query, fields, sort, 1, 0);

        return result[0];
    }

    async searchRecords(type: string, query: RecordQuery, fields?: string[], sort?: RecordSort, limit?: number, offset?: number): Promise<RecordData[]>
    {
        const records = this.#fetchRecords(type, query);

        const sortedRecords = this.#sortRecords(records, sort);
        const limitedRecords = this.#limitNumberOfRecords(sortedRecords, offset, limit);

        return limitedRecords.map(record => this.#buildRecordData(record, fields));
    }

    async updateRecord(type: string, query: RecordQuery, data: RecordData): Promise<number>
    {
        const record = this.#fetchRecord(type, query);

        if (record === undefined)
        {
            return 0;
        }

        this.#updateRecordData(record, data);

        return 1;
    }

    async updateRecords(type: string, query: RecordQuery, data: RecordData): Promise<number>
    {
        const records = this.#fetchRecords(type, query);

        records.forEach(record => this.#updateRecordData(record, data));

        return records.length;
    }

    async deleteRecord(type: string, query: RecordQuery): Promise<number>
    {
        const filterFunction = this.#buildFilterFunction(query);

        const collection = this.#getCollection(type);
        const index = collection.findIndex(filterFunction);

        if (index === -1)
        {
            return 0;
        }

        collection.splice(index, 1);

        return 1;
    }

    async deleteRecords(type: string, query: RecordQuery): Promise<number>
    {
        const collection = this.#getCollection(type);
        const records = this.#fetchRecords(type, query);

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

    #fetchRecord(type: string, query: RecordQuery): RecordData | undefined
    {
        const collection = this.#getCollection(type);
        const filterFunction = this.#buildFilterFunction(query);

        return collection.find(filterFunction);
    }

    #fetchRecords(type: string, query: RecordQuery): RecordData[]
    {
        const collection = this.#getCollection(type);
        const filterFunction = this.#buildFilterFunction(query);

        return collection.filter(filterFunction);
    }

    #updateRecordData(record: RecordData, data: RecordData): void
    {
        for (const key of Object.keys(data))
        {
            record[key] = data[key];
        }
    }

    #limitNumberOfRecords(result: RecordData[], offset?: number, limit?: number): RecordData[]
    {
        if (offset === undefined && limit === undefined)
        {
            return result;
        }

        const first = offset ?? 0;
        const last = limit === undefined ? undefined : first + limit;

        return result.slice(first, last);
    }

    #sortRecords(result: RecordData[], sort?: RecordSort): RecordData[]
    {
        if (sort === undefined)
        {
            return result;
        }

        return result.sort((a: RecordData, b: RecordData) =>
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

    #buildFilterFunction(query: RecordQuery): FilterFunction
    {
        const statementCode = this.#buildStatementCode(query);
        const functionCode = statementCode === '' ? 'true' : statementCode;

        // eslint-disable-next-line sonarjs/code-eval
        return new Function('record', `return ${functionCode}`) as FilterFunction;
    }

    #buildStatementCode(query: RecordQuery): string
    {
        const multiStatements = query as QueryMultiExpressionStatement;
        const singleStatements = query as QuerySingleExpressionStatement;

        const statementCodes = [];

        for (const key in multiStatements)
        {
            const code = key === 'AND' || key === 'OR'
                ? this.#buildMultiStatementCode(key, multiStatements[key] ?? [])
                : this.#buildExpressionCode(key, singleStatements[key]);

            statementCodes.push(code);
        }

        return statementCodes.join(' && ');
    }

    #buildMultiStatementCode(operator: string, statements: QuerySingleExpressionStatement[])
    {
        const codeOperator = LOGICAL_OPERATORS[operator];
        const statementCodes = [];

        for (const statement of statements)
        {
            const statementCode = this.#buildStatementCode(statement);

            statementCodes.push(statementCode);
        }

        const code = statementCodes.join(` ${codeOperator} `);

        return `(${code})`;
    }

    #buildExpressionCode(key: string, expression: QueryExpression)
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

    #getCollection(type: string): RecordData[]
    {
        const memory = this.memory;

        let collection = memory.get(type);

        if (collection === undefined)
        {
            collection = [];

            memory.set(type, collection);
        }

        return collection;
    }

    #buildRecordData(data: RecordData, fields?: RecordField[]): RecordData
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

        return result;
    }
}
