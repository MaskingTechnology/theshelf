
import type Database from '@theshelf/database';
import type { RecordType } from '@theshelf/database';

import type { Driver } from '../definitions/interfaces.js';
import type { Log } from '../definitions/types.js';

export default class DatabaseDriver implements Driver
{
    readonly #database: Database;
    readonly #recordType: RecordType;
    readonly #backup?: Driver;

    constructor(database: Database, recordType: RecordType, backup?: Driver)
    {
        this.#recordType = recordType;
        this.#database = database;
        this.#backup = backup;
    }

    async log(log: Log): Promise<void>
    {
        return this.#database.connected
            ? this.#logDatabase(log)
            : this.#logBackup(log);
    }

    async #logDatabase(log: Log): Promise<void>
    {
        await this.#database.createRecord(this.#recordType, log);
    }

    async #logBackup(log: Log): Promise<void>
    {
        if (this.#backup === undefined)
        {
            return;
        }

        await this.#backup.log(log);
    }
}
