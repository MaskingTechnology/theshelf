
import { LogLevels } from './definitions/constants.js';
import type { LogLevel } from './definitions/constants.js';
import type { Driver } from './definitions/interfaces.js';
import type { Log } from './definitions/types.js';

export default class Logger
{
    readonly #driver: Driver;
    readonly #source: string;

    #logLevel: LogLevel = LogLevels.DEBUG;

    constructor(driver: Driver, source = 'Unknown')
    {
        this.#driver = driver;
        this.#source = source;
    }

    set logLevel(level: LogLevel)
    {
        this.#logLevel = level;
    }

    get logLevel()
    {
        return this.#logLevel;
    }

    for(source: string): Logger
    {
        const tracedSource = `${this.#source}.${source}`;

        const logger = new Logger(this.#driver, tracedSource);
        logger.logLevel = this.#logLevel;

        return logger;
    }

    log(log: Log): Promise<void>
    {
        return this.#driver.log(log);
    }

    debug(...message: unknown[]): Promise<void>
    {
        if (this.#logLevel > LogLevels.DEBUG)
        {
            return Promise.resolve();
        }

        const log = this.#createLog(LogLevels.DEBUG, message);

        return this.log(log);
    }

    info(...message: unknown[]): Promise<void>
    {
        if (this.#logLevel > LogLevels.INFO)
        {
            return Promise.resolve();
        }

        const log = this.#createLog(LogLevels.INFO, message);

        return this.log(log);
    }

    warn(...message: unknown[]): Promise<void>
    {
        if (this.#logLevel > LogLevels.WARN)
        {
            return Promise.resolve();
        }

        const log = this.#createLog(LogLevels.WARN, message);

        return this.log(log);
    }

    error(...message: unknown[]): Promise<void>
    {
        if (this.#logLevel > LogLevels.ERROR)
        {
            return Promise.resolve();
        }

        const log = this.#createLog(LogLevels.ERROR, message);

        return this.log(log);
    }

    fatal(...message: unknown[]): Promise<void>
    {
        const log = this.#createLog(LogLevels.FATAL, message);

        return this.log(log);
    }

    #createLog(level: LogLevel, messages: unknown[]): Log
    {
        const timestamp = new Date().toISOString();
        const source = this.#source;
        const message = this.#createMessage(messages);

        return { timestamp, level, source, message };
    }

    #createMessage(messages: unknown[]): string
    {
        return messages.map(message => this.#interpretValue(message)).join(' ');
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
