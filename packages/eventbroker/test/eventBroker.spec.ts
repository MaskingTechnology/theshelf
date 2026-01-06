
import { beforeEach, afterEach, describe, expect, it } from 'vitest';

import eventBroker from '../src/index.js';

import { createSubscription, DRIVERS, EVENTS, PUBLICATIONS } from './fixtures/index.js';

beforeEach(async () =>
{
    eventBroker.driver = await DRIVERS.empty();
});

afterEach(async () =>
{
    await eventBroker.disconnect();
});

describe('integrations/eventbroker/implementation', () =>
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
