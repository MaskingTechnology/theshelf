
import type { Driver } from './definitions/interfaces.js';

export default class FileStore implements Driver
{
    readonly #driver: Driver;

    constructor(driver: Driver)
    {
        this.#driver = driver;
    }

    get connected(): boolean
    {
        return this.#driver.connected;
    }

    connect(): Promise<void>
    {
        return this.#driver.connect();
    }

    disconnect(): Promise<void>
    {
        return this.#driver.disconnect();
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
