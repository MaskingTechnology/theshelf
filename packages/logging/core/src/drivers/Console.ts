
/* eslint no-console: "off" */

import { LogLevels } from '../definitions/constants.js';
import type { Driver } from '../definitions/interfaces.js';
import type { Log } from '../definitions/types.js';

import levelToString from '../utils/levelToString.js';

export default class Console implements Driver
{
    async log(log: Log): Promise<void>
    {
        const message = this.#createLogMessage(log);

        switch (log.level)
        {
            case LogLevels.DEBUG: return console.debug(message);
            case LogLevels.INFO: return console.info(message);
            case LogLevels.WARN: return console.warn(message);
            default: return console.error(message);
        }
    }

    #createLogMessage(log: Log): string
    {
        const time = log.timestamp;
        const level = levelToString(log.level);
        const source = log.source;
        const message = log.message;

        return `[${time}][${level}][${source}] ${message}`;
    }
}
