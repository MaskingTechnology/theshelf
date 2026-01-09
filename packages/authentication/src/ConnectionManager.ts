
import { ConnectionStates } from './definitions/constants.js';
import type { ConnectionState } from './definitions/constants.js';
import type { Driver } from './definitions/interfaces.js';

export default class ConnectionManager
{
    readonly #driver: Driver;

    #state: ConnectionState = ConnectionStates.DISCONNECTED;
    
    #connectPromise?: Promise<void>;
    #disconnectPromise?: Promise<void>;

    constructor(driver: Driver)
    {
        this.#driver = driver;
    }

    get state(): ConnectionState { return this.#state; }

    async connect(): Promise<void>
    {
        if (this.#connectPromise !== undefined)
        {
            return this.#connectPromise;
        }

        if (this.#state !== ConnectionStates.DISCONNECTED)
        {
            return;
        }

        this.#state = ConnectionStates.CONNECTING;

        try
        {
            this.#connectPromise = this.#driver.connect();

            await this.#connectPromise;

            this.#state = ConnectionStates.CONNECTED;
        }
        catch (error)
        {
            this.#state = ConnectionStates.DISCONNECTED;
            
            throw error;
        }
        finally
        {
            this.#connectPromise = undefined;
        }
    }

    async disconnect(): Promise<void>
    {
        if (this.#disconnectPromise !== undefined)
        {
            return this.#disconnectPromise;
        }

        if (this.#state !== ConnectionStates.CONNECTED)
        {
            return;
        }

        this.#state = ConnectionStates.DISCONNECTING;

        try
        {
            this.#disconnectPromise = this.#driver.disconnect();

            await this.#disconnectPromise;

            this.#state = ConnectionStates.DISCONNECTED;
        }
        catch (error)
        {
            this.#state = ConnectionStates.CONNECTED;

            throw error;
        }
        finally
        {
            this.#disconnectPromise = undefined;
        }
    }
}
