import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'vitest';

import { InvalidTTL } from '../src/index.js';

import { cacheStore, SEEDS, VALUES } from './fixtures/index.js';

beforeAll(async () =>
{
    await cacheStore.connect();
});

afterAll(async () =>
{
    await cacheStore.disconnect();
});

beforeEach(async () =>
{
    await SEEDS.withItems();
});

describe('CacheStore', () =>
{
    describe('availability', () =>
    {
        it('should retrieve cached items', async () =>
        {
            const [first, second] = await Promise.all([
                cacheStore.get(VALUES.ITEMS.FIRST.KEY),
                cacheStore.get(VALUES.ITEMS.SECOND.KEY)
            ]);

            expect(first).toEqual(VALUES.ITEMS.FIRST.VALUE);
            expect(second).toEqual(VALUES.ITEMS.SECOND.VALUE);
        });

        it('should NOT retrieve non-cached items', async () =>
        {
            const third = await cacheStore.get(VALUES.ITEMS.THIRD.KEY);

            expect(third).toBeUndefined();
        });

        it('should NOT retrieve deleted items', async () =>
        {
            await cacheStore.delete(VALUES.ITEMS.SECOND.KEY);

            const second = await cacheStore.get(VALUES.ITEMS.SECOND.KEY);

            expect(second).toBeUndefined();
        });
    });

    describe('validation', () =>
    {
        it('should allow a positive TTL', async () =>
        {
            await cacheStore.set(VALUES.ITEMS.FIRST.KEY, VALUES.ITEMS.FIRST.VALUE, 1);

            const third = await cacheStore.get(VALUES.ITEMS.FIRST.KEY);

            expect(third).toEqual(VALUES.ITEMS.FIRST.VALUE);
        });

        it('should NOT allow a non-positive TTL', async () =>
        {
            const zeroPromise = cacheStore.set(VALUES.ITEMS.FIRST.KEY, VALUES.ITEMS.FIRST.VALUE, VALUES.TTLS.ZERO);
            const negativePromise = cacheStore.set(VALUES.ITEMS.FOURTH.KEY, VALUES.ITEMS.FOURTH.VALUE, VALUES.TTLS.NEGATIVE);

            await expect(zeroPromise).rejects.toStrictEqual(new InvalidTTL);
            await expect(negativePromise).rejects.toStrictEqual(new InvalidTTL);
        });
    });

    describe('cleanup', () =>
    {
        it('should delete items beyond the TTL', async () =>
        {
            await cacheStore.set(VALUES.ITEMS.THIRD.KEY, VALUES.ITEMS.THIRD.VALUE, VALUES.TTLS.POSITIVE);

            await new Promise((resolve) => { setTimeout(resolve, VALUES.TTLS.POSITIVE + 2); });

            const third = await cacheStore.get(VALUES.ITEMS.THIRD.KEY);

            expect(third).toBeUndefined();
        });
    });
});
