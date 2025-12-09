
import type { LogProcessor } from './definitions/interfaces.js';
import UnknownImplementation from './errors/UnknownImplementation.js';
import createConsole from './implementations/console/create.js';
import createVoid from './implementations/void/create.js';

const implementations = new Map<string, () => LogProcessor>([
    ['console', createConsole],
    ['void', createVoid]
]);

const DEFAULT_LOGGING_IMPLEMENTATION = 'void';

const implementationName = process.env.LOGGING_IMPLEMENTATION ?? DEFAULT_LOGGING_IMPLEMENTATION;
const creator = implementations.get(implementationName.toLowerCase());

if (creator === undefined)
{
    throw new UnknownImplementation(implementationName);
}

export default creator();
