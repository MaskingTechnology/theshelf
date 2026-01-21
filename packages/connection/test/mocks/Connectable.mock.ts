
import type { Connectable } from '../../src/index.js';

export class ConnectableMock implements Connectable
{
    readonly #connectDelay: number;
    readonly #disconnectDelay: number;
    
    #connected = false;
    #failed = false;

    constructor(connectDelay: number, disconnectDelay: number)
    {
        this.#connectDelay = connectDelay;
        this.#disconnectDelay = disconnectDelay;
    }

    get connected(): boolean
    {
        return this.#connected;
    }

    fail(): void
    {
        this.#connected = false;
        this.#failed = true;
    }

    restore(): void
    {
        this.#failed = false;
    }
    
    sleep(amount: number): Promise<void>
    {
        return new Promise(resolve =>
        {
            setTimeout(() => resolve(), amount);
        });
    }

    async connect(): Promise<void>
    {
        if (this.#connectDelay <= 0)
        {
            return this.#connect();
        }

        await this.sleep(this.#connectDelay);

        return this.#connect();
    }

    async disconnect(): Promise<void>
    {
        if (this.#disconnectDelay <= 0)
        {
            return this.#disconnect();
        }

        await this.sleep(this.#connectDelay);

        return this.#disconnect();
    }

    #connect(): void
    {
        if (this.#failed)
        {
            throw new Error();
        }

        this.#connected = true;
    }

    #disconnect(): void
    {
        if (this.#failed)
        {
            throw new Error();
        }

        this.#connected = false;
    }
}
