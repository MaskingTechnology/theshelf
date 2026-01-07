
import Logger, { MemoryDriver } from '../../src/index.js';

const driver = new MemoryDriver();
const logger = new Logger(driver);

export { logger, driver };
