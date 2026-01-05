
import type { Driver } from '../../src/index.js';
import { MemoryDriver} from '../../src/index.js';

import { RECORD_TYPES, RECORDS } from './records.fixture.js';

async function withEverything(): Promise<Driver>
{
    const driver = new MemoryDriver();

    await driver.connect();

    await driver.createRecord(RECORD_TYPES.FRUITS, { ...RECORDS.FRUITS.APPLE });
    await driver.createRecord(RECORD_TYPES.FRUITS, { ...RECORDS.FRUITS.PEAR });

    await driver.createRecord(RECORD_TYPES.PIZZAS, { ...RECORDS.PIZZAS.MARGHERITA });
    await driver.createRecord(RECORD_TYPES.PIZZAS, { ...RECORDS.PIZZAS.CALZONE });
    await driver.createRecord(RECORD_TYPES.PIZZAS, { ...RECORDS.PIZZAS.PEPPERONI });
    await driver.createRecord(RECORD_TYPES.PIZZAS, { ...RECORDS.PIZZAS.VEGETARIAN });
    await driver.createRecord(RECORD_TYPES.PIZZAS, { ...RECORDS.PIZZAS.HAWAII });

    return driver;
}

export const DRIVERS = { withEverything };
