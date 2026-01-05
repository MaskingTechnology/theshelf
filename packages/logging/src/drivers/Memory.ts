
import type { LogLevel } from '../definitions/constants.js';
import { LogLevels } from '../definitions/constants.js';
import type { Driver } from '../definitions/interfaces.js';

type Log = {
    level: LogLevel;
    message: string;
};

export default class Memory implements Driver
{
    #logs: Log[] = [];

    get logs() { return this.#logs; }

    async logDebug(message: string): Promise<void>
    {
        this.#logs.push({ level: LogLevels.DEBUG, message });
    }

    async logInfo(message: string): Promise<void>
    {
        this.#logs.push({ level: LogLevels.INFO, message });
    }

    async logWarn(message: string): Promise<void>
    {
        this.#logs.push({ level: LogLevels.WARN, message });
    }

    async logError(message: string): Promise<void>
    {
        this.#logs.push({ level: LogLevels.ERROR, message });
    }

    async logFatal(message: string): Promise<void>
    {
        this.#logs.push({ level: LogLevels.FATAL, message });
    }
}
