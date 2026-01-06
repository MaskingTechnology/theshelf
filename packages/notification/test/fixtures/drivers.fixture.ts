
import type { Driver } from '../../src/index.js';
import { MemoryDriver } from '../../src/index.js';

import { VALUES } from './values.fixture.js';

async function withRecipient(): Promise<Driver>
{
    const driver = new MemoryDriver();

    await driver.connect();
    
    await driver.subscribe(VALUES.RECIPIENTS.FIRST);

    return driver;
}

export const DRIVERS = { withRecipient };
