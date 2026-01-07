
import Database, { MemoryDriver } from '../../src/index.js';

import { RECORD_TYPES, RECORDS } from './records.fixture.js';

const driver = new MemoryDriver();
const database = new Database(driver);

await database.connect();

async function clear()
{
    await Promise.all([
        database.deleteRecords(RECORD_TYPES.FRUITS, {}),
        database.deleteRecords(RECORD_TYPES.PIZZAS, {})
    ]);
}

async function withEverything(): Promise<void>
{
    await clear();

    await Promise.all([
        database.createRecord(RECORD_TYPES.FRUITS, { ...RECORDS.FRUITS.APPLE }),
        database.createRecord(RECORD_TYPES.FRUITS, { ...RECORDS.FRUITS.PEAR }),

        database.createRecord(RECORD_TYPES.PIZZAS, { ...RECORDS.PIZZAS.MARGHERITA }),
        database.createRecord(RECORD_TYPES.PIZZAS, { ...RECORDS.PIZZAS.CALZONE }),
        database.createRecord(RECORD_TYPES.PIZZAS, { ...RECORDS.PIZZAS.PEPPERONI }),
        database.createRecord(RECORD_TYPES.PIZZAS, { ...RECORDS.PIZZAS.VEGETARIAN }),
        database.createRecord(RECORD_TYPES.PIZZAS, { ...RECORDS.PIZZAS.HAWAII })
    ]);
}

export { database };

export const DATABASES = { withEverything };
