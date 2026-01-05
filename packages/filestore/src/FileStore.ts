
import type { Driver } from './definitions/interfaces.js';

import Memory from './drivers/Memory.js';

export default class FileStore implements Driver
{
    #driver: Driver = new Memory();

    set driver(driver: Driver)
    {
        this.#driver = driver;
    }

    get driver(): Driver
    {
        return this.#driver;
    }

    get connected() { return this.driver.connected; }

    async connect(): Promise<void>
    {
        return this.driver.connect();
    }

    async disconnect(): Promise<void>
    {
        return this.driver.disconnect();
    }

    hasFile(path: string): Promise<boolean>
    {
        return this.driver.hasFile(path);
    }

    writeFile(path: string, data: Buffer): Promise<void>
    {
        return this.driver.writeFile(path, data);
    }

    readFile(path: string): Promise<Buffer>
    {
        return this.driver.readFile(path);
    }

    deleteFile(path: string): Promise<void>
    {
        return this.driver.deleteFile(path);
    }

    clear(): Promise<void>
    {
        return this.driver.clear();
    }
}
