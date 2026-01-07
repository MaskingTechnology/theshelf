
import EventBroker, { MemoryDriver } from '../../src/index.js';

const driver = new MemoryDriver();
const eventBroker = new EventBroker(driver);

export { eventBroker };
