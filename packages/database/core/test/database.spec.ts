
import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'vitest';

import { database, SEEDS, QUERIES, RECORDS, RECORD_TYPES, RESULTS, SORTS, VALUES } from './fixtures/index.js';

beforeAll(async () =>
{
    await database.connect();
});

afterAll(async () =>
{
    await database.disconnect();
});

beforeEach(async () =>
{
    await SEEDS.withEverything();
});

describe('Database', () =>
{
    describe('.readRecord', () =>
    {
        it('should read a full record by id', async () =>
        {
            const result = await database.readRecord(RECORD_TYPES.PIZZAS, QUERIES.MARGHERITA);

            expect(result.record).toMatchObject(RECORDS.PIZZAS.MARGHERITA);
        });

        it('should read a partial record by id', async () =>
        {
            const fields = [VALUES.FIELDS.ID, VALUES.FIELDS.FOLDED];
            const result = await database.readRecord(RECORD_TYPES.PIZZAS, QUERIES.MARGHERITA, fields);
            const record = result.record;

            expect(record).toBeDefined();
            expect(Object.keys(record!)).toHaveLength(2);
            expect(record?.id).toBe(VALUES.IDS.MARGHERITA);
            expect(record?.folded).toBeFalsy();
        });

        it('should not read a record when no records match the query', async () =>
        {
            const result = await database.readRecord(RECORD_TYPES.PIZZAS, QUERIES.NO_MATCH);

            expect(result.record).toBeUndefined();
        });
    });

    describe('.searchRecords', () =>
    {
        it('should find records based on EQUAL condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.EQUALS);

            expect(result.count).toBe(2);
            expect(result.records).toMatchObject(RESULTS.EQUAL);
        });

        it('should find records based on NOT EQUAL condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.NOT_EQUALS);

            expect(result.count).toBe(2);
            expect(result.records).toMatchObject(RESULTS.NOT_EQUAL);
        });

        it('should find records based on LESS THAN condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.LESS_THAN);

            expect(result.count).toBe(1);
            expect(result.records).toMatchObject(RESULTS.LESS_THAN);
        });

        it('should find records based on LESS THAN OR EQUALS condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.LESS_THAN_OR_EQUALS);

            expect(result.count).toBe(2);
            expect(result.records).toMatchObject(RESULTS.LESS_THAN_OR_EQUALS);
        });

        it('should find records based on GREATER THAN condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.GREATER_THAN);

            expect(result.count).toBe(1);
            expect(result.records).toMatchObject(RESULTS.GREATER_THAN);
        });

        it('should find records based on GREATER THAN OR EQUALS condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.GREATER_THAN_OR_EQUALS);

            expect(result.count).toBe(2);
            expect(result.records).toMatchObject(RESULTS.GREATER_THAN_OR_EQUALS);
        });

        it('should find records based on IN condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.IN);

            expect(result.count).toBe(2);
            expect(result.records).toMatchObject(RESULTS.IN);
        });

        it('should find records based on NOT IN condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.NOT_IN);

            expect(result.count).toBe(1);
            expect(result.records).toMatchObject(RESULTS.NOT_IN);
        });

        it('should find records based on CONTAINS condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.CONTAINS);

            expect(result.count).toBe(1);
            expect(result.records).toMatchObject(RESULTS.CONTAINS);
        });

        it('should find records based on STARTS_WITH condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.STARTS_WITH);

            expect(result.count).toBe(1);
            expect(result.records).toMatchObject(RESULTS.STARTS_WITH);
        });

        it('should find records based on ENDS_WITH condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.ENDS_WITH);

            expect(result.count).toBe(1);
            expect(result.records).toMatchObject(RESULTS.ENDS_WITH);
        });

        it('should find records based on AND condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.AND);

            expect(result.count).toBe(1);
            expect(result.records).toMatchObject(RESULTS.AND);
        });

        it('should find records based on OR condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.OR);

            expect(result.count).toBe(2);
            expect(result.records).toMatchObject(RESULTS.OR);
        });

        it('should find records based on AND with nested OR condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.AND_OR);

            expect(result.count).toBe(1);
            expect(result.records).toMatchObject(RESULTS.AND_OR);
        });

        it('should find records based on OR with nested AND condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.OR_AND);

            expect(result.count).toBe(2);
            expect(result.records).toMatchObject(RESULTS.OR_AND);
        });

        it('should find no records that match the AND condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.AND_NO_RESULT);

            expect(result.count).toBe(0);
        });

        it('should find no records that match the OR condition', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.OR_NO_RESULT);

            expect(result.count).toBe(0);
        });
    });

    describe('.updateRecord', () =>
    {
        it('should update a record with a query', async () =>
        {
            const updateResult = await database.updateRecord(RECORD_TYPES.PIZZAS, QUERIES.MARGHERITA, VALUES.SIZE);
            const readResult = await database.readRecord(RECORD_TYPES.PIZZAS, QUERIES.MARGHERITA);

            expect(updateResult.affectedCount).toBe(1);
            expect(readResult.record?.size).toBe(VALUES.SIZE.size);
        });

        it('should not update a record when no records match the query', async () =>
        {
            const result = await database.updateRecord(RECORD_TYPES.PIZZAS, QUERIES.NO_MATCH, {});

            expect(result.affectedCount).toBe(0);
        });
    });

    describe('.updateRecords', () =>
    {
        it('should update all records matching the query', async () =>
        {
            const updateResult = await database.updateRecords(RECORD_TYPES.PIZZAS, QUERIES.EQUALS, VALUES.SIZE);
            const readResult = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.UPDATED);

            expect(updateResult.affectedCount).toBe(2);
            expect(readResult.count).toBe(2);
            expect(readResult.records[0].size).toBe(VALUES.SIZE.size);
            expect(readResult.records[1].size).toBe(VALUES.SIZE.size);
        });

        it('should not update records that not match the query', async () =>
        {
            const result = await database.updateRecords(RECORD_TYPES.PIZZAS, QUERIES.NO_MATCH, {});

            expect(result.affectedCount).toBe(0);
        });
    });

    describe('.deleteRecord', () =>
    {
        it('should delete a record with a query', async () =>
        {
            const updateResult = await database.deleteRecord(RECORD_TYPES.PIZZAS, QUERIES.MARGHERITA);
            const readResult = await database.readRecord(RECORD_TYPES.PIZZAS, QUERIES.MARGHERITA);

            expect(updateResult.affectedCount).toBe(1);
            expect(readResult.record).toBeUndefined();
        });

        it('should not delete a record when no records match the query', async () =>
        {
            const result = await database.deleteRecord(RECORD_TYPES.PIZZAS, QUERIES.NO_MATCH);

            expect(result.affectedCount).toBe(0);
        });
    });

    describe('.deleteRecords', () =>
    {
        it('should delete all records matching the query', async () =>
        {
            const deleteResult = await database.deleteRecords(RECORD_TYPES.PIZZAS, QUERIES.EQUALS);
            const searchResult = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.EQUALS);

            expect(deleteResult.affectedCount).toBe(2);
            expect(searchResult.count).toBe(0);
        });

        it('should not delete records when no records match the query', async () =>
        {
            const deleteResult = await database.deleteRecords(RECORD_TYPES.PIZZAS, QUERIES.NO_MATCH);
            const searchResult = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.EMPTY);

            expect(deleteResult.affectedCount).toBe(0);
            expect(searchResult.count).toBe(5);
        });
    });

    describe('.limitNumberOfRecords', () =>
    {
        it('should limit the result', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.EMPTY, undefined, undefined, 2);
            expect(result.count).toBe(2);
            expect(result.records).toMatchObject(RESULTS.LIMITED_BY_NUMBER);
        });

        it('should give the result starting an offset', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.EMPTY, undefined, undefined, undefined, 2);
            expect(result.count).toBe(3);
            expect(result.records).toMatchObject(RESULTS.LIMITED_BY_OFFSET);
        });
    });

    describe('.sortRecords', () =>
    {
        it('should sort records ascending', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.EMPTY, undefined, SORTS.ASCENDING);

            expect(result.count).toBe(5);
            expect(result.records).toMatchObject(RESULTS.SORTED_ASCENDING);
        });

        it('should sort the records descending', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.EMPTY, undefined, SORTS.DESCENDING);

            expect(result.count).toBe(5);
            expect(result.records).toMatchObject(RESULTS.SORTED_DESCENDING);
        });

        it('should sort the records by multiple fields in the same direction', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.EMPTY, undefined, SORTS.MULTIPLE_SAME);

            expect(result.count).toBe(5);
            expect(result.records).toMatchObject(RESULTS.SORTED_MULTIPLE_SAME);
        });

        it('should sort the records by multiple fields in different direction', async () =>
        {
            const result = await database.searchRecords(RECORD_TYPES.PIZZAS, QUERIES.EMPTY, undefined, SORTS.MULTIPLE_DIFFERENT);

            expect(result.count).toBe(5);
            expect(result.records).toMatchObject(RESULTS.SORTED_MULTIPLE_DIFFERENT);
        });
    });
});
