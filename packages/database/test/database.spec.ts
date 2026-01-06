
import { beforeEach, afterEach, describe, expect, it } from 'vitest';

import type { RecordData } from '../src/index.js';
import database from '../src/index.js';

import { DRIVERS, QUERIES, RECORDS, RECORD_TYPES, RESULTS, SORTS, VALUES } from './fixtures/index.js';

beforeEach(async () =>
{
    database.driver = await DRIVERS.withEverything();
});

afterEach(async () =>
{
    await database.disconnect();
});

describe('implementation', () =>
{
    describe('.readRecord', () =>
    {
        it('should read a full record by id', async () =>
        {
            const result = await database.readRecord(RECORD_TYPES.PIZZAS, QUERIES.MARGHERITA);

            expect(result).toMatchObject(RECORDS.PIZZAS.MARGHERITA);
        });

        it('should read a partial record by id', async () =>
        {
            const fields = [VALUES.FIELDS.ID, VALUES.FIELDS.FOLDED];
            const result = await database.readRecord(RECORD_TYPES.PIZZAS, QUERIES.MARGHERITA, fields) as RecordData;

            expect(result).toBeDefined();
            expect(Object.keys(result)).toHaveLength(2);
            expect(result?.id).toBe(VALUES.IDS.MARGHERITA);
            expect(result?.folded).toBeFalsy();
        });

        it('should not read a record when no records match the query', async () =>
        {
            const result = await database.readRecord(RECORD_TYPES.PIZZAS, QUERIES.NO_MATCH);

            expect(result).toBeUndefined();
        });
    });

    describe('.searchRecords', () =>
    {
        it('should find records based on EQUAL condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.EQUALS);

            expect(result).toHaveLength(2);
            expect(result).toMatchObject(RESULTS.EQUAL);
        });

        it('should find records based on NOT EQUAL condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.NOT_EQUALS);

            expect(result).toHaveLength(2);
            expect(result).toMatchObject(RESULTS.NOT_EQUAL);
        });

        it('should find records based on LESS THAN condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.LESS_THAN);

            expect(result).toHaveLength(1);
            expect(result).toMatchObject(RESULTS.LESS_THAN);
        });

        it('should find records based on LESS THAN OR EQUALS condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.LESS_THAN_OR_EQUALS);

            expect(result).toHaveLength(2);
            expect(result).toMatchObject(RESULTS.LESS_THAN_OR_EQUALS);
        });

        it('should find records based on GREATER THAN condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.GREATER_THAN);

            expect(result).toHaveLength(1);
            expect(result).toMatchObject(RESULTS.GREATER_THAN);
        });

        it('should find records based on GREATER THAN OR EQUALS condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.GREATER_THAN_OR_EQUALS);

            expect(result).toHaveLength(2);
            expect(result).toMatchObject(RESULTS.GREATER_THAN_OR_EQUALS);
        });

        it('should find records based on IN condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.IN);

            expect(result).toHaveLength(2);
            expect(result).toMatchObject(RESULTS.IN);
        });

        it('should find records based on NOT IN condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.NOT_IN);

            expect(result).toHaveLength(1);
            expect(result).toMatchObject(RESULTS.NOT_IN);
        });

        it('should find records based on CONTAINS condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.CONTAINS);

            expect(result).toHaveLength(1);
            expect(result).toMatchObject(RESULTS.CONTAINS);
        });

        it('should find records based on STARTS_WITH condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.STARTS_WITH);

            expect(result).toHaveLength(1);
            expect(result).toMatchObject(RESULTS.STARTS_WITH);
        });

        it('should find records based on ENDS_WITH condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.ENDS_WITH);

            expect(result).toHaveLength(1);
            expect(result).toMatchObject(RESULTS.ENDS_WITH);
        });

        it('should find records based on AND condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.AND);

            expect(result).toHaveLength(1);
            expect(result).toMatchObject(RESULTS.AND);
        });

        it('should find records based on OR condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.OR);

            expect(result).toHaveLength(2);
            expect(result).toMatchObject(RESULTS.OR);
        });

        it('should find records based on AND with nested OR condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.AND_OR);

            expect(result).toHaveLength(1);
            expect(result).toMatchObject(RESULTS.AND_OR);
        });

        it('should find records based on OR with nested AND condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.OR_AND);

            expect(result).toHaveLength(2);
            expect(result).toMatchObject(RESULTS.OR_AND);
        });

        it('should find no records that match the AND condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.AND_NO_RESULT);

            expect(result).toHaveLength(0);
        });

        it('should find no records that match the OR condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.OR_NO_RESULT);

            expect(result).toHaveLength(0);
        });
    });

    describe('.updateRecord', () =>
    {
        it('should update a record with a query', async () =>
        {
            const count = await database.updateRecord(RECORD_TYPES.FRUITS, QUERIES.PEAR, { country: VALUES.UPDATES.COUNTRY });
            const result = await database.readRecord(RECORD_TYPES.FRUITS, QUERIES.PEAR);

            expect(count).toBe(1);
            expect(result?.country).toBe(VALUES.UPDATES.COUNTRY);
        });

        it('should not update a record when no records match the query', async () =>
        {
            const count = await database.updateRecord(RECORD_TYPES.FRUITS, QUERIES.NO_MATCH, {});

            expect(count).toBe(0);
        });
    });

    describe('.updateRecords', () =>
    {
        it('should update all records matching the query', async () =>
        {
            const count = await database.updateRecords(RECORD_TYPES.PIZZAS, QUERIES.EQUALS, VALUES.SIZE);
            const records = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.UPDATED);

            expect(count).toBe(2);
            expect(records).toHaveLength(2);
            expect(records[0].size).toBe(VALUES.SIZE.size);
            expect(records[1].size).toBe(VALUES.SIZE.size);
        });

        it('should not update records that not match the query', async () =>
        {
            const count = await database.updateRecords(RECORD_TYPES.PIZZAS, QUERIES.NO_MATCH, {});

            expect(count).toBe(0);
        });
    });

    describe('.deleteRecord', () =>
    {
        it('should delete a record with a query', async () =>
        {
            const count = await database.deleteRecord(RECORD_TYPES.FRUITS, QUERIES.APPLE);
            const record = await database.readRecord(RECORD_TYPES.FRUITS, QUERIES.APPLE);

            expect(count).toBe(1);
            expect(record).toBeUndefined();
        });

        it('should not delete a record when no records match the query', async () =>
        {
            const count = await database.deleteRecord(RECORD_TYPES.PIZZAS, QUERIES.NO_MATCH);

            expect(count).toBe(0);
        });
    });

    describe('.deleteRecords', () =>
    {
        it('should delete all records matching the query', async () =>
        {
            const count = await database.deleteRecords(RECORD_TYPES.PIZZAS, QUERIES.EQUALS);
            const records = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.EQUALS);

            expect(count).toBe(2);
            expect(records).toHaveLength(0);
        });

        it('should not delete records when no records match the query', async () =>
        {
            const count = await database.deleteRecords(RECORD_TYPES.PIZZAS, QUERIES.NO_MATCH);
            const records = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.EMPTY);

            expect(count).toBe(0);
            expect(records).toHaveLength(5);
        });
    });

    describe('.limitNumberOfRecords', () =>
    {
        it('should limit the result', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.EMPTY, undefined, undefined, 2);
            expect(result).toHaveLength(2);
            expect(result).toMatchObject(RESULTS.LIMITED_BY_NUMBER);
        });

        it('should give the result starting an offset', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.EMPTY, undefined, undefined, undefined, 2);
            expect(result).toHaveLength(3);
            expect(result).toMatchObject(RESULTS.LIMITED_BY_OFFSET);
        });
    });

    describe('.sortRecords', () =>
    {
        it('should sort records ascending', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.EMPTY, undefined, SORTS.ASCENDING);
            expect(result).toHaveLength(5);
            expect(result).toMatchObject(RESULTS.SORTED_ASCENDING);
        });

        it('should sort the records descending', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.EMPTY, undefined, SORTS.DESCENDING);
            expect(result).toHaveLength(5);
            expect(result).toMatchObject(RESULTS.SORTED_DESCENDING);
        });

        it('should sort the records by multiple fields in the same direction', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.EMPTY, undefined, SORTS.MULTIPLE_SAME);
            expect(result).toHaveLength(5);
            expect(result).toMatchObject(RESULTS.SORTED_MULTIPLE_SAME);
        });

        it('should sort the records by multiple fields in different direction', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.EMPTY, undefined, SORTS.MULTIPLE_DIFFERENT);
            expect(result).toHaveLength(5);
            expect(result).toMatchObject(RESULTS.SORTED_MULTIPLE_DIFFERENT);
        });
    });
});
