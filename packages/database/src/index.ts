
import Database from './Database.js';

export * from './definitions/constants.js';
export type * from './definitions/interfaces.js';
export type * from './definitions/types.js';

export { default as DatabaseError } from './errors/DatabaseError.js';
export { default as NotConnected } from './errors/NotConnected.js';

export { default as MemoryDriver } from './drivers/Memory.js';
export { default as MongoDBDriver } from './drivers/MongoDB.js';

export default new Database();
