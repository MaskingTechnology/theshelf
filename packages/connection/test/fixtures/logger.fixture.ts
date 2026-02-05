
import Logger, { MemoryDriver } from '../../../logging/core/dist/index.js';

export const logDriver = new MemoryDriver();

export const logger = new Logger(logDriver);
