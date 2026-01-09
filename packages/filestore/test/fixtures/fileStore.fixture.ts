
import FileStore, { MemoryDriver } from '../../src/index.js';

import { FILES } from './files.fixture.js';
import { VALUES } from './values.fixture.js';

const driver = new MemoryDriver();
const fileStore = new FileStore(driver);

async function withFile(): Promise<void>
{
    await fileStore.writeFile(VALUES.FILENAMES.HELLO, FILES.HELLO);
}

export { fileStore };

export const SEEDS = { withFile };
