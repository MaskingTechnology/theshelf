
/* eslint no-console: "off" */
import type { Driver } from '../definitions/interfaces.js';

export default class Console implements Driver
{
    async logDebug(message: string): Promise<void>
    {
        return console.debug(message);
    }

    async logInfo(message: string): Promise<void>
    {
        return console.info(message);
    }

    async logWarn(message: string): Promise<void>
    {
        return console.warn(message);
    }

    async logError(message: string): Promise<void>
    {
        return console.error(message);
    }

    async logFatal(message: string): Promise<void>
    {
        return console.error(message);
    }
}
