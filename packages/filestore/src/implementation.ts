
import type { FileStore } from './definitions/interfaces.js';
import UnknownImplementation from './errors/UnknownImplementation.js';
import createMemoryFS from './implementations/memory/create.js';
import createS3FS from './implementations/s3/create.js';
import createS3AwsFS from './implementations/s3/createAws.js';

const implementations = new Map<string, () => FileStore>([
    ['aws', createS3AwsFS],
    ['memory', createMemoryFS],
    ['s3', createS3FS],
]);

const DEFAULT_FILE_STORE_IMPLEMENTATION = 'memory';

const implementationName = process.env.FILE_STORE_IMPLEMENTATION ?? DEFAULT_FILE_STORE_IMPLEMENTATION;
const creator = implementations.get(implementationName.toLowerCase());

if (creator === undefined)
{
    throw new UnknownImplementation(implementationName);
}

export default creator();
