
/* eslint @typescript-eslint/no-unused-vars: "off" */

import type { Driver } from '../definitions/interfaces.js';

export default class Void implements Driver
{
    logDebug(message: string): Promise<void>
    {
        return Promise.resolve();
    }

    logInfo(message: string): Promise<void>
    {
        return Promise.resolve();
    }

    logWarn(message: string): Promise<void>
    {
        return Promise.resolve();
    }

    logError(message: string): Promise<void>
    {
        return Promise.resolve();
    }

    logFatal(message: string): Promise<void>
    {
        return Promise.resolve();
    }
}
