
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

    #state: State = States.DISCONNECTED;

    #monitorTimeout?: NodeJS.Timeout;
    
    #connectPromise?: Promise<void>;
    #disconnectPromise?: Promise<void>;

    constructor(configuration: Configuration, logger?: Logger)
    {
        this.#name = configuration.name;
        this.#connectable = configuration.connectable;
        this.#timeoutDuration = configuration.monitoringTimeout ?? DEFAULT_MONITORING_TIMEOUT;

        this.#logger = logger?.for(ConnectionManager.name)
                              .for(this.#name);
    }

    get name(): string { return this.#name; }

    get state(): State { return this.#state; }

    async connect(): Promise<void>
    {
        if (this.#connectPromise !== undefined)
        {
            this.#logger?.warn('Connect already in progress');

            return this.#connectPromise;
        }

        if (this.#state !== States.DISCONNECTED)
        {
            this.#logger?.warn('Connect in invalid state');

            return;
        }

        await this.#connect();

        this.#startMonitoring();
    }

    async disconnect(): Promise<void>
    {
        if (this.#disconnectPromise !== undefined)
        {
            this.#logger?.warn('Disconnect already in progress');

            return this.#disconnectPromise;
        }

        if (this.#state !== States.CONNECTED)
        {
            this.#logger?.warn('Disconnect in invalid state');

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

            this.#logger?.info('Connected successfully');
        }
        catch (error)
        {
            this.#state = States.DISCONNECTED;
            
            this.#logger?.error('Connection failure', error);

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

            this.#logger?.info('Disconnected successfully');
        }
        catch (error)
        {
            this.#state = States.CONNECTED;

            this.#logger?.error('Disconnection failure', error);

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
            this.#logger?.warn('Monitoring already started');

            return;
        }

        this.#scheduleMonitoring();

        this.#logger?.info('Monitoring started');
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
            this.#logger?.warn('Monitoring already stopped');

            return;
        }

        clearTimeout(this.#monitorTimeout);

        this.#monitorTimeout = undefined;

        this.#logger?.info('Monitoring stopped');
    }

    async #monitorConnection(): Promise<void>
    {
        this.#logger?.debug('Monitoring connection');

        if (this.#connectable.connected)
        {
            return;
        }

        if (this.#connectPromise !== undefined)
        {
            return this.#connectPromise;
        }

        this.#logger?.warn('Connection lost');

        this.#state = States.DISCONNECTED;

        return this.#connect();
    }
}
