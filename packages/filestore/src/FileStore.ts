
import { ConnectionStates } from './definitions/constants.js';
import type { ConnectionState } from './definitions/constants.js';
import type { Driver } from './definitions/interfaces.js';

import ConnectionManager from './ConnectionManager.js';

export default class FileStore implements Driver
{
    readonly #driver: Driver;
    readonly #connectionManager: ConnectionManager;

    constructor(driver: Driver)
    {
        this.#driver = driver;
        this.#connectionManager = new ConnectionManager(driver);
    }

    get connectionState(): ConnectionState
    {
        return this.#connectionManager.state;
    }

    get connected(): boolean
    {
        return this.connectionState === ConnectionStates.CONNECTED;
    }

    connect(): Promise<void>
    {
        return this.#connectionManager.connect();
    }

    disconnect(): Promise<void>
    {
        return this.#connectionManager.disconnect();
    }

    hasFile(path: string): Promise<boolean>
    {
        return this.#driver.hasFile(path);
    }

    writeFile(path: string, data: Buffer): Promise<void>
    {
        return this.#driver.writeFile(path, data);
    }

    readFile(path: string): Promise<Buffer>
    {
        return this.#driver.readFile(path);
    }

    deleteFile(path: string): Promise<void>
    {
        return this.#driver.deleteFile(path);
    }
}
