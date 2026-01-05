
import fileStore from '../../src/index.js';

import { FILES } from './files.fixture.js';
import { VALUES } from './values.fixture.js';

await fileStore.connect();

async function withFile()
{
    await fileStore.clear();

    await fileStore.writeFile(VALUES.FILENAMES.HELLO, FILES.HELLO);
}

export const FILE_STORES = { withFile };
