
import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'vitest';

import { createSubscription, eventBroker, SEEDS, EVENTS, PUBLICATIONS } from './fixtures/index.js';

beforeAll(async () =>
{
    await eventBroker.connect();
});

afterAll(async () =>
{
    await eventBroker.disconnect();
});

beforeEach(() =>
{
    SEEDS.empty();
});

describe('EventBroker', () =>
{
    describe('publish and subscribe', () =>
    {
        it('should publish to multiple subscribers', async () =>
        {
            const subscription1 = createSubscription(EVENTS.FIRST_CREATED);
            const subscription2 = createSubscription(EVENTS.FIRST_CREATED);

            await eventBroker.publish(PUBLICATIONS.FIRST_CREATED);

            const [data1, data2] = await Promise.all([subscription1, subscription2]);

            expect(data1).toStrictEqual(PUBLICATIONS.FIRST_CREATED.data);
            expect(data2).toStrictEqual(PUBLICATIONS.FIRST_CREATED.data);
        });

        it('should publish to different channels', async () =>
        {
            const firstSubscription = createSubscription(EVENTS.FIRST_CREATED);
            const secondSubscription = createSubscription(EVENTS.SECOND_CREATED);

            await eventBroker.publish(PUBLICATIONS.FIRST_CREATED);
            await eventBroker.publish(PUBLICATIONS.SECOND_CREATED);

            const [firstData, secondData] = await Promise.all([firstSubscription, secondSubscription]);

            expect(firstData).toStrictEqual(PUBLICATIONS.FIRST_CREATED.data);
            expect(secondData).toStrictEqual(PUBLICATIONS.SECOND_CREATED.data);
        });
    });
});
