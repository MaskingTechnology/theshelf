
import EventBroker, { MemoryDriver } from '../../src/index.js';

import { logger } from './logger.fixture.js';

const driver = new MemoryDriver();
const eventBroker = new EventBroker(driver, logger);

function empty()
{
    driver.clear();
}

export { eventBroker };

export const SEEDS = { empty };
