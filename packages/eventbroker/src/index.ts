
import EventBroker from './EventBroker.js';
import implementation from './implementation.js';

const eventBroker = new EventBroker(implementation);

export * from './definitions/types.js';
export type { EventBroker };
export default eventBroker;
