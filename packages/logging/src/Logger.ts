
import { LogLevels } from './definitions/constants.js';
import type { LogLevel } from './definitions/constants.js';
import type { Driver } from './definitions/interfaces.js';

import Void from './drivers/Void.js';

export default class Logger implements Driver
{
    #driver: Driver = new Void();
    #logLevel: LogLevel = LogLevels.DEBUG;

    set driver(driver: Driver)
    {
        this.#driver = driver;
    }

    get driver(): Driver
    {
        return this.#driver;
    }

    set logLevel(level: LogLevel)
    {
        this.#logLevel = level;
    }

    get logLevel()
    {
        return this.#logLevel;
    }

    logDebug(...message: unknown[]): Promise<void>
    {
        if (this.#logLevel > LogLevels.DEBUG)
        {
            return Promise.resolve();
        }

        const messageString = this.#createMessage(message);

        return this.driver.logDebug(messageString);
    }

    logInfo(...message: unknown[]): Promise<void>
    {
        if (this.#logLevel > LogLevels.INFO)
        {
            return Promise.resolve();
        }

        const messageString = this.#createMessage(message);

        return this.driver.logInfo(messageString);
    }

    logWarn(...message: unknown[]): Promise<void>
    {
        if (this.#logLevel > LogLevels.WARN)
        {
            return Promise.resolve();
        }

        const messageString = this.#createMessage(message);

        return this.driver.logWarn(messageString);
    }

    logError(...message: unknown[]): Promise<void>
    {
        if (this.#logLevel > LogLevels.ERROR)
        {
            return Promise.resolve();
        }

        const messageString = this.#createMessage(message);

        return this.driver.logError(messageString);
    }

    logFatal(...message: unknown[]): Promise<void>
    {
        const messageString = this.#createMessage(message);

        return this.driver.logFatal(messageString);
    }

    #createMessage(message: unknown[]): string
    {
        return message.map(value => this.#interpretValue(value)).join(' ');
    }

    #interpretValue(value: unknown): string
    {
        switch (typeof value)
        {
            case 'string': return value;
            case 'object': return this.#interpretObject(value);
            case 'undefined': return 'undefined';
            case 'function': return 'function';
            default: return String(value);
        }
    }

    #interpretObject(object: unknown): string
    {
        if (object === null)
        {
            return 'null';
        }

        if (Array.isArray(object))
        {
            return object.map(value => this.#interpretValue(value)).join(' ');
        }

        if (object instanceof Error)
        {
            return object.stack ?? object.message;
        }

        return JSON.stringify(object);
    }
}
