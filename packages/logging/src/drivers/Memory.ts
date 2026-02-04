
import type { Driver } from '../definitions/interfaces.js';
import type { Log } from '../definitions/types.js';

export default class Memory implements Driver
{
    #logs: Log[] = [];

    get logs() { return this.#logs; }

    async log(log: Log): Promise<void>
    {
        this.#logs.push(log);
    }

    clear(): void
    {
        this.#logs.splice(0);
    }
}
