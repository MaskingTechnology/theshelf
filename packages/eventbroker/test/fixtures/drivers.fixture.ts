
import type { Driver } from '../../src/index.js';
import { MemoryDriver } from '../../src/index.js';

async function empty(): Promise<Driver>
{
    const driver = new MemoryDriver();

    await driver.connect();

    return driver;
}

export const DRIVERS = { empty };
