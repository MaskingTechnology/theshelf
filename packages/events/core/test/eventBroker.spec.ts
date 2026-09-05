
import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'vitest';

import { createSubscription, eventBroker, SEEDS, EVENTS, PUBLICATIONS, createErrorSubscription, logDriver } from './fixtures/index.js';

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
    logDriver.clear();

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

        it('should publish to different topics', async () =>
        {
            const firstSubscription = createSubscription(EVENTS.FIRST_CREATED);
            const secondSubscription = createSubscription(EVENTS.SECOND_CREATED);

            await eventBroker.publish(PUBLICATIONS.FIRST_CREATED);
            await eventBroker.publish(PUBLICATIONS.SECOND_CREATED);

            const [firstData, secondData] = await Promise.all([firstSubscription, secondSubscription]);

            expect(firstData).toStrictEqual(PUBLICATIONS.FIRST_CREATED.data);
            expect(secondData).toStrictEqual(PUBLICATIONS.SECOND_CREATED.data);
        });

        it('should unsubscribe an subscription', async () =>
        {
            const subscription = createErrorSubscription(EVENTS.FIRST_ERRORED);

            await eventBroker.subscribe(subscription);
            await eventBroker.unsubscribe(subscription);

            await eventBroker.publish(EVENTS.FIRST_ERRORED);

            expect(logDriver.logs.length).toBe(3);
            expect(logDriver.logs[0].message).toBe('Memory -> Subscribing to first -> errored');
            expect(logDriver.logs[1].message).toBe('Memory -> Unsubscribing from first -> errored');
            expect(logDriver.logs[2].message).toBe('Memory -> Publishing to first -> errored');
        });

        it('should handle consumer errors', async () =>
        {
            const subscription = createErrorSubscription(EVENTS.FIRST_ERRORED);

            await eventBroker.subscribe(subscription);
            await eventBroker.publish(PUBLICATIONS.FIRST_ERRORED);

            expect(logDriver.logs.length).toBe(3);
            expect(logDriver.logs[0].message).toBe('Memory -> Subscribing to first -> errored');
            expect(logDriver.logs[1].message).toBe('Memory -> Publishing to first -> errored');
            expect(logDriver.logs[2].message).toContain('Memory -> Processing event from first -> errored failed with error Error: Error');
        });
    });
});
