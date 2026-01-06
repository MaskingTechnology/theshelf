
import IdentityProvider from './IdentityProvider.js';

export type * from './definitions/interfaces.js';
export type * from './definitions/types.js';

export { default as AuthenticationError } from './errors/AuthenticationError.js';
export { default as NotConnected } from './errors/NotConnected.js';
export { default as UnknownImplementation } from './errors/NoDriver.js';

export { default as GoogleDriver } from './drivers/Google.js';
export { default as OpenIDDriver } from './drivers/OpenID.js';

export default new IdentityProvider();
