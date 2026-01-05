
import eventBroker from '../../src/index.js';

await eventBroker.connect();

async function empty(): Promise<void>
{
    await eventBroker.clear();
}

export const EVENT_BROKERS = { empty };
