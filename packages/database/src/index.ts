
import Database from './Database.js';
import implementation from './implementation.js';

const database = new Database(implementation);

export * from './definitions/constants.js';
export * from './definitions/types.js';
export { default as DatabaseError } from './errors/DatabaseError.js';
export { default as NotConnected } from './errors/NotConnected.js';
export type { Database };
export default database;
