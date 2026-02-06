
import type Logger from '../../logging/core/dist/index.js';

import { States } from './definitions/constants.js';
import type { State } from './definitions/constants.js';
import type { Connectable } from './definitions/interfaces.js';

type Configuration = {
    readonly name: string;
    readonly connectable: Connectable;
    readonly monitoringTimeout?: number;
};

const DEFAULT_MONITORING_TIMEOUT = 3000;

export default class ConnectionManager
{
    readonly #name: string;
    readonly #connectable: Connectable;
    readonly #timeoutDuration: number;

    readonly #logger?: Logger;
    readonly #logPrefix: string;

    #state: State = States.DISCONNECTED;

    #monitorTimeout?: NodeJS.Timeout;
    
    #connectPromise?: Promise<void>;
    #disconnectPromise?: Promise<void>;

    constructor(configuration: Configuration, logger?: Logger)
    {
        this.#name = configuration.name;
        this.#connectable = configuration.connectable;
        this.#timeoutDuration = configuration.monitoringTimeout ?? DEFAULT_MONITORING_TIMEOUT;

        this.#logger = logger?.for(ConnectionManager.name);
        this.#logPrefix = `${this.#name} ->`;
    }

    get name(): string { return this.#name; }

    get state(): State { return this.#state; }

    async connect(): Promise<void>
    {
        if (this.#connectPromise !== undefined)
        {
            this.#logger?.warn(this.#logPrefix, 'connect already in progress');

            return this.#connectPromise;
        }

        if (this.#state !== States.DISCONNECTED)
        {
            this.#logger?.warn(this.#logPrefix, 'connect in invalid state');

            return;
        }

        await this.#connect();

        this.#startMonitoring();
    }

    async disconnect(): Promise<void>
    {
        if (this.#disconnectPromise !== undefined)
        {
            this.#logger?.warn(this.#logPrefix, 'disconnect already in progress');

            return this.#disconnectPromise;
        }

        if (this.#state !== States.CONNECTED)
        {
            this.#logger?.warn(this.#logPrefix, 'disconnect in invalid state');

            return;
        }

        this.#stopMonitoring();

        await this.#disconnect();
    }

    async #connect(): Promise<void>
    {
        this.#state = States.CONNECTING;

        try
        {
            this.#connectPromise = this.#connectable.connect();

            await this.#connectPromise;

            this.#state = States.CONNECTED;

            this.#logger?.info(this.#logPrefix, 'connected successfully');
        }
        catch (error)
        {
            this.#state = States.DISCONNECTED;
            
            this.#logger?.error(this.#logPrefix, 'connection failure', error);

            // The error isn't re-thrown to make it non-blocking, and let the monitoring do its work.
        }
        finally
        {
            this.#connectPromise = undefined;
        }
    }

    async #disconnect(): Promise<void>
    {
        this.#state = States.DISCONNECTING;

        try
        {
            this.#disconnectPromise = this.#connectable.disconnect();

            await this.#disconnectPromise;

            this.#state = States.DISCONNECTED;

            this.#logger?.info(this.#logPrefix, 'disconnected successfully');
        }
        catch (error)
        {
            this.#state = States.CONNECTED;

            this.#logger?.error(this.#logPrefix, 'disconnection failure', error);

            throw error;
        }
        finally
        {
            this.#disconnectPromise = undefined;
        }
    }

    #startMonitoring(): void
    {
        if (this.#monitorTimeout !== undefined)
        {
            this.#logger?.warn(this.#logPrefix, 'monitoring already started');

            return;
        }

        this.#scheduleMonitoring();

        this.#logger?.info(this.#logPrefix, 'monitoring started');
    }

    #scheduleMonitoring(): void
    {
        this.#monitorTimeout = setTimeout(async () =>
        {
            await this.#monitorConnection();

            this.#scheduleMonitoring();

        }, this.#timeoutDuration);

        this.#monitorTimeout.unref();
    }

    #stopMonitoring(): void
    {
        if (this.#monitorTimeout === undefined)
        {
            this.#logger?.warn(this.#logPrefix, 'monitoring already stopped');

            return;
        }

        clearTimeout(this.#monitorTimeout);

        this.#monitorTimeout = undefined;

        this.#logger?.info(this.#logPrefix, 'monitoring stopped');
    }

    async #monitorConnection(): Promise<void>
    {
        this.#logger?.debug(this.#logPrefix, 'monitoring connection');

        if (this.#connectable.connected)
        {
            return;
        }

        if (this.#connectPromise !== undefined)
        {
            return this.#connectPromise;
        }

        this.#logger?.warn(this.#logPrefix, 'connection lost');

        this.#state = States.DISCONNECTED;

        return this.#connect();
    }
}
