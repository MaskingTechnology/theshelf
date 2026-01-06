
import { MemoryDriver } from '../../src/index.js';

import { FILES } from './files.fixture.js';
import { VALUES } from './values.fixture.js';

async function withFile()
{
    const driver = new MemoryDriver();

    await driver.connect();

    await driver.writeFile(VALUES.FILENAMES.HELLO, FILES.HELLO);

    return driver;
}

export const DRIVERS = { withFile };
