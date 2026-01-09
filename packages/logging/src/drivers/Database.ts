
import type Database from '@theshelf/database';
import type { RecordType } from '@theshelf/database';

import type { Driver } from '../definitions/interfaces.js';

export default class DatabaseDriver implements Driver
{
    readonly #recordType: RecordType;
    readonly #database: Database;

    constructor(recordType: RecordType, database: Database)
    {
        this.#recordType = recordType;
        this.#database = database;
    }

    logDebug(message: string): Promise<void>
    {
        return this.#logRecord('DEBUG', message);
    }

    logInfo(message: string): Promise<void>
    {
        return this.#logRecord('INFO', message);
    }

    logWarn(message: string): Promise<void>
    {
        return this.#logRecord('WARN', message);
    }

    logError(message: string): Promise<void>
    {
        return this.#logRecord('ERROR', message);
    }

    logFatal(message: string): Promise<void>
    {
        return this.#logRecord('FATAL', message);
    }

    async #logRecord(level: string, message: string): Promise<void>
    {
        const data = {
            timestamp: new Date().toISOString(),
            level,
            message
        };

        await this.#database.createRecord(this.#recordType, data);
    }
}
