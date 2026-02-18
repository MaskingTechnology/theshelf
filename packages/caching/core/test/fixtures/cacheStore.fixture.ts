
import CacheStore, { MemoryDriver } from '../../src/index.js';

import { VALUES } from './values.fixture.js';

const driver = new MemoryDriver();
const cacheStore = new CacheStore(driver);

function withItems()
{
    driver.clear();

    return Promise.all([
        cacheStore.set(VALUES.ITEMS.FIRST.KEY, VALUES.ITEMS.FIRST.VALUE),
        cacheStore.set(VALUES.ITEMS.SECOND.KEY, VALUES.ITEMS.SECOND.VALUE)
    ]);
}

export { cacheStore };

export const SEEDS = { withItems };
