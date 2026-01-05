
import Validator from './Validator.js';

export * from './definitions/constants.js';
export type * from './definitions/interfaces.js';
export type * from './definitions/types.js';

export { default as UnknownValidator } from './errors/UnknownValidator.js';
export { default as ValidationError } from './errors/ValidationError.js';

export default new Validator();
