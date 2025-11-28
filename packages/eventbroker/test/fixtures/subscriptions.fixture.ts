
import type { Event } from '../../src';
import eventBroker from '../../src';

export function createSubscription<T>(event: Event): Promise<T>
{
    return new Promise<T>((resolve) =>
    {
        const subscription = { ...event, handler: (data: T) => resolve(data) };

        eventBroker.subscribe(subscription);
    });
}
