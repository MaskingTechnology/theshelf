
import Logger from './Logger.js';
import implementation from './implementation.js';

const debugEnabled = process.env.LOGGING_DEBUG_ENABLED === 'true';
const logger = new Logger(implementation, debugEnabled);

export default logger;
