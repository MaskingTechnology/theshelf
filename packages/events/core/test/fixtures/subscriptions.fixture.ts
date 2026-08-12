
import type { Event, Subscription } from '../../src/index.js';

import { eventBroker } from './eventBroker.fixture.js';

export function createSubscription<T>(event: Event): Promise<T>
{
    return new Promise<T>((resolve) =>
    {
        const subscription: Subscription<T> = { ...event, handler: async (data: T) => resolve(data) };

        eventBroker.subscribe(subscription);
    });
}

export async function createErrorSubscription(event: Event): Promise<void>
{
    const handler = () => { throw new Error('Error'); };

    const subscription = { ...event, handler };

    eventBroker.subscribe(subscription);
}
