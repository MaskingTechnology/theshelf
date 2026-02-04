
import type { LogLevel } from './constants.js';

export type Log = {
    timestamp: string;
    level: LogLevel;
    source: string;
    message: string;
};
