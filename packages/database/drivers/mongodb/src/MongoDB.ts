
/* eslint @typescript-eslint/no-explicit-any: "off" */

import type { Collection, Db, Document, Filter, Sort } from 'mongodb';
import { MongoClient, ObjectId } from 'mongodb';

import {
    ID,
    LogicalOperators,
    QueryOperators,
    SortDirections,
    DatabaseError,
    NotConnected
} from '@theshelf/database';

import type {
    Driver,
    QueryMultiExpressionStatement,
    QueryOperator,
    QuerySingleExpressionStatement,
    RecordData,
    RecordField,
    RecordId,
    RecordQuery,
    RecordSort,
    RecordType,
    RecordValue
} from '@theshelf/database';

const UNKNOWN_ERROR = 'Unknown error';

const OPERATORS: Record<string, string> =
{
    [QueryOperators.EQUALS]: '$eq',
    [QueryOperators.GREATER_THAN]: '$gt',
    [QueryOperators.GREATER_THAN_OR_EQUALS]: '$gte',
    [QueryOperators.IN]: '$in',
    [QueryOperators.LESS_THAN]: '$lt',
    [QueryOperators.LESS_THAN_OR_EQUALS]: '$lte',
    [QueryOperators.NOT_EQUALS]: '$ne',
    [QueryOperators.NOT_IN]: '$nin',
    [QueryOperators.CONTAINS]: '$regex',
    [QueryOperators.STARTS_WITH]: '$regex',
    [QueryOperators.ENDS_WITH]: '$regex'
};

const LOGICAL_OPERATORS: Record<string, string> =
{
    [LogicalOperators.AND]: '$and',
    [LogicalOperators.OR]: '$or'
};

const MONGO_ID = '_id';

type MongoDBConfiguration = {
    connectionString: string;
    databaseName: string;
};

export default class MongoDB implements Driver
{
    readonly #connectionString: string;
    readonly #databaseName: string;

    #client?: MongoClient;
    #database?: Db;
    #connected = false;

    constructor(configuration: MongoDBConfiguration)
    {
        this.#connectionString = configuration.connectionString;
        this.#databaseName = configuration.databaseName;
    }

    get name(): string { return MongoDB.name; }

    get connected(): boolean { return this.#connected; }

    async connect(): Promise<void>
    {
        try
        {
            this.#client = await this.#createClient(this.#connectionString);

            this.#client.on('close', () => { this.#connected = false; });
            this.#client.on('serverHeartbeatSucceeded', () => { this.#connected = true; });
            this.#client.on('serverHeartbeatFailed', () => { this.#connected = false; });

            this.#database = this.#getDatabase(this.#databaseName);

            this.#connected = true;
        }
        catch (error)
        {
            const message = error instanceof Error ? error.message : UNKNOWN_ERROR;

            throw new DatabaseError('Database connection failed: ' + message);
        }
    }

    async disconnect(): Promise<void>
    {
        if (this.#client === undefined)
        {
            throw new NotConnected();
        }

        try
        {
            await this.#client.close();

            this.#connected = false;
            this.#client = undefined;
            this.#database = undefined;
        }
        catch (error)
        {
            const message = error instanceof Error ? error.message : UNKNOWN_ERROR;

            throw new DatabaseError('Database disconnection failed: ' + message);
        }
    }

    async createRecord(type: RecordType, data: RecordData): Promise<RecordId>
    {
        const collection = await this.#getCollection(type);
        const dataCopy = { ...data };
        const id = dataCopy.id ?? new ObjectId();

        delete dataCopy.id;

        await collection.insertOne({ _id: id, ...dataCopy });

        return id as RecordId;
    }

    async readRecord(type: RecordType, query: RecordQuery, fields?: RecordField[], sort?: RecordSort): Promise<RecordData | undefined>
    {
        const result = await this.searchRecords(type, query, fields, sort, 1, 0);

        return result[0];
    }

    async searchRecords(type: RecordType, query: RecordQuery, fields?: RecordField[], sort?: RecordSort, limit?: number, offset?: number): Promise<RecordData[]>
    {
        const mongoQuery = this.#buildMongoQuery(query);
        const mongoSort = this.#buildMongoSort(sort);

        const collection = await this.#getCollection(type);
        const cursor = collection.find(mongoQuery, { sort: mongoSort, limit: limit, skip: offset });
        const result = await cursor.toArray();

        return result.map(data => this.#buildRecordData(data, fields));
    }

    async updateRecord(type: RecordType, query: RecordQuery, data: RecordData): Promise<number>
    {
        const mongoQuery = this.#buildMongoQuery(query);
        const mongoData = this.#buildMongoData(data);

        const collection = await this.#getCollection(type);
        const result = await collection.updateOne(mongoQuery, { $set: mongoData });

        return result.modifiedCount;
    }

    async updateRecords(type: RecordType, query: RecordQuery, data: RecordData): Promise<number>
    {
        const mongoQuery = this.#buildMongoQuery(query);
        const mongoData = this.#buildMongoData(data);

        const collection = await this.#getCollection(type);
        const result = await collection.updateMany(mongoQuery, { $set: mongoData });

        return result.modifiedCount;
    }

    async deleteRecord(type: RecordType, query: RecordQuery): Promise<number>
    {
        const mongoQuery = this.#buildMongoQuery(query);

        const collection = await this.#getCollection(type);
        const result = await collection.deleteOne(mongoQuery);

        return result.deletedCount;
    }

    async deleteRecords(type: RecordType, query: RecordQuery): Promise<number>
    {
        const mongoQuery = this.#buildMongoQuery(query);

        const collection = await this.#getCollection(type);
        const result = await collection.deleteMany(mongoQuery);

        return result.deletedCount;
    }

    #buildMongoQuery(query: RecordQuery): Filter<any> 
    {
        const mongoQuery: Filter<any> = {};
        const multiStatements = query as QueryMultiExpressionStatement;
        const singleStatements = query as QuerySingleExpressionStatement;

        for (const key in multiStatements)
        {
            if (key === 'AND' || key === 'OR')
            {
                const singleMultiStatements = multiStatements[key] ?? [];
                const multiMongoQuery: Filter<any>[] = [];

                for (const statement of singleMultiStatements)
                {
                    const mongoQuery = this.#buildMongoQuery(statement);
                    multiMongoQuery.push(mongoQuery);
                }

                const mongoKey = LOGICAL_OPERATORS[key];
                mongoQuery[mongoKey] = multiMongoQuery;

                continue;
            }

            const expression = singleStatements[key];
            const mongoKey = key === ID ? MONGO_ID : key;
            const mongoExpression: Record<string, unknown> = {};

            for (const operator in expression)
            {
                const value = this.#extractValue(expression as RecordData, operator as QueryOperator);
                const mongoOperator = OPERATORS[operator];

                mongoExpression[mongoOperator] = value;
            }

            mongoQuery[mongoKey] = mongoExpression;
        }

        return mongoQuery;
    }

    #buildMongoData(data: RecordData): RecordData
    {
        const mongoData: RecordData = {};

        for (const [key, value] of Object.entries(data))
        {
            const mongoKey = key === ID ? MONGO_ID : key;

            mongoData[mongoKey] = value;
        }

        return mongoData;
    }

    #buildMongoSort(sort?: RecordSort): Sort
    {
        const mongoSort: Record<string, 1 | -1> = {};

        if (sort === undefined)
        {
            return mongoSort;
        }

        for (const key in sort)
        {
            const direction = sort[key];
            const mongoKey = key === ID ? MONGO_ID : key;

            mongoSort[mongoKey] = direction === SortDirections.DESCENDING ? -1 : 1;
        }

        return mongoSort;
    }

    async #getCollection<T>(name: RecordType): Promise<Collection<T extends Document ? any : any>>
    {
        if (this.#database === undefined)
        {
            throw new NotConnected();
        }

        return this.#database.collection(name);
    }

    #getDatabase(databaseName: string): Db
    {
        if (this.#client === undefined)
        {
            throw new NotConnected();
        }

        return this.#client.db(databaseName);
    }

    async #createClient(connectionString: string): Promise<MongoClient>
    {
        return MongoClient.connect(connectionString);
    }

    #buildRecordData(data: Document, fields?: RecordField[]): RecordData
    {
        const result: RecordData = {};

        if (fields === undefined)
        {
            const recordData = { ...data };
            fields = Object.keys(recordData);

            const idIndex = fields.indexOf(MONGO_ID);

            if (idIndex !== -1)
            {
                fields[idIndex] = ID;
            }
        }

        for (const field of fields)
        {
            const value = field === ID
                ? data[MONGO_ID]
                : data[field];

            result[field] = value ?? undefined;
        }

        return result;
    }

    #extractValue(expression: RecordData, operator: QueryOperator): RecordValue
    {
        const value = expression[operator];

        switch (operator)
        {
            case QueryOperators.STARTS_WITH: return '^' + value;
            case QueryOperators.ENDS_WITH: return value + '$';
        }

        return value;
    }
}
