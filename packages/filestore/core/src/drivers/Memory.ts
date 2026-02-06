
import type { Driver } from '../definitions/interfaces.js';

import FileNotFound from '../errors/FileNotFound.js';
import NotConnected from '../errors/NotConnected.js';

export default class Memory implements Driver
{
    readonly #files = new Map<string, Buffer>();

    #connected = false;

    get name(): string { return Memory.name; }

    get connected(): boolean { return this.#connected; }

    get files(): Map<string, Buffer>
    {
        if (this.#connected === false)
        {
            throw new NotConnected();
        }

        return this.#files;
    }

    async connect(): Promise<void>
    {
        this.#connected = true;
    }

    async disconnect(): Promise<void>
    {
        this.#connected = false;
        this.#files.clear();
    }

    async hasFile(path: string): Promise<boolean>
    {
        return this.files.has(path);
    }

    async writeFile(path: string, data: Buffer): Promise<void>
    {
        this.files.set(path, data);
    }

    async readFile(path: string): Promise<Buffer>
    {
        const data = this.files.get(path);

        if (data === undefined)
        {
            throw new FileNotFound(path);
        }

        return data;
    }

    async deleteFile(path: string): Promise<void>
    {
        if (this.files.has(path) === false)
        {
            throw new FileNotFound(path);
        }

        this.files.delete(path);
    }

    clear(): void
    {
        this.files.clear();
    }
}
