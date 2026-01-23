
import Logger, { MemoryDriver } from '@theshelf/logging';

export const logDriver = new MemoryDriver();

export const logger = new Logger(logDriver);
