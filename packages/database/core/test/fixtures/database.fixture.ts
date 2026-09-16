
import Database, { MemoryDriver } from '../../src/index.js';

import { type Pizza, RECORD_TYPES, RECORDS } from './records.fixture.js';

const driver = new MemoryDriver();
const database = new Database(driver);

async function clear()
{
    await Promise.all([
        database.deleteRecords(RECORD_TYPES.PIZZAS, {})
    ]);
}

async function withEverything(): Promise<void>
{
    await clear();

    await Promise.all([
        database.createRecord<Pizza>(RECORD_TYPES.PIZZAS, { ...RECORDS.PIZZAS.MARGHERITA }),
        database.createRecord<Pizza>(RECORD_TYPES.PIZZAS, { ...RECORDS.PIZZAS.CALZONE }),
        database.createRecord<Pizza>(RECORD_TYPES.PIZZAS, { ...RECORDS.PIZZAS.PEPPERONI }),
        database.createRecord<Pizza>(RECORD_TYPES.PIZZAS, { ...RECORDS.PIZZAS.VEGETARIAN }),
        database.createRecord<Pizza>(RECORD_TYPES.PIZZAS, { ...RECORDS.PIZZAS.HAWAII })
    ]);
}

export { database };

export const SEEDS = { withEverything };
