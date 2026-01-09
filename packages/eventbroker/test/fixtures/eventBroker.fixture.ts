
import EventBroker, { MemoryDriver } from '../../src/index.js';

const driver = new MemoryDriver();
const eventBroker = new EventBroker(driver);

function empty()
{
    driver.clear();
}

export { eventBroker };

export const SEEDS = { empty };
