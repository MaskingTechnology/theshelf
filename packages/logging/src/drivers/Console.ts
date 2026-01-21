
/* eslint no-console: "off" */

import type { Driver } from '../definitions/interfaces.js';

export default class Console implements Driver
{
    async logDebug(message: string): Promise<void>
    {
        return console.debug(`[DEBUG] ${message}`);
    }

    async logInfo(message: string): Promise<void>
    {
        return console.info(`[INFO] ${message}`);
    }

    async logWarn(message: string): Promise<void>
    {
        return console.warn(`[WARN] ${message}`);
    }

    async logError(message: string): Promise<void>
    {
        return console.error(`[ERROR] ${message}`);
    }

    async logFatal(message: string): Promise<void>
    {
        return console.error(`[FATAL] ${message}`);
    }
}
