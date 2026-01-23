
import type Logger from '@theshelf/logging';

import { States } from './definitions/constants.js';
import type { State } from './definitions/constants.js';
import type { Connectable } from './definitions/interfaces.js';

type Configuration = {
    readonly name: string;
    readonly connectable: Connectable;
    readonly logger: Logger;
    readonly monitoringTimeout?: number;
};

const DEFAULT_MONITORING_TIMEOUT = 3000;

export default class ConnectionManager
{
    readonly #name: string;
    readonly #connectable: Connectable;
    readonly #logger: Logger;
    readonly #timeoutDuration: number;

    #state: State = States.DISCONNECTED;

    #monitorTimeout?: NodeJS.Timeout;
    
    #connectPromise?: Promise<void>;
    #disconnectPromise?: Promise<void>;

    constructor(configuration: Configuration)
    {
        this.#name = configuration.name;
        this.#connectable = configuration.connectable;
        this.#logger = configuration.logger;
        this.#timeoutDuration = configuration.monitoringTimeout ?? DEFAULT_MONITORING_TIMEOUT;
    }

    get name(): string { return this.#name; }

    get state(): State { return this.#state; }

    async connect(): Promise<void>
    {
        if (this.#connectPromise !== undefined)
        {
            this.#logger.logWarn(this.#createLogMessage('connect already in progress'));

            return this.#connectPromise;
        }

        if (this.#state !== States.DISCONNECTED)
        {
            this.#logger.logWarn(this.#createLogMessage('connect in invalid state'));

            return;
        }

        await this.#connect();

        this.#startMonitoring();
    }

    async disconnect(): Promise<void>
    {
        if (this.#disconnectPromise !== undefined)
        {
            this.#logger.logWarn(this.#createLogMessage('disconnect already in progress'));

            return this.#disconnectPromise;
        }

        if (this.#state !== States.CONNECTED)
        {
            this.#logger.logWarn(this.#createLogMessage('disconnect in invalid state'));

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

            this.#logger.logInfo(this.#createLogMessage('connected successfully'));
        }
        catch (error)
        {
            this.#state = States.DISCONNECTED;
            
            this.#logger.logError(this.#createLogMessage('connection failure'), error);

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

            this.#logger.logInfo(this.#createLogMessage('disconnected successfully'));
        }
        catch (error)
        {
            this.#state = States.CONNECTED;

            this.#logger.logError(this.#createLogMessage('disconnection failure'), error);

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
            this.#logger.logWarn(this.#createLogMessage('monitoring already started'));

            return;
        }

        this.#scheduleMonitoring();

        this.#logger.logInfo(this.#createLogMessage('monitoring started'));
    }

    #scheduleMonitoring(): void
    {
        this.#monitorTimeout = setTimeout(async () =>
        {
            await this.#monitorConnection();

            this.#scheduleMonitoring();

        }, this.#timeoutDuration);
    }

    #stopMonitoring(): void
    {
        if (this.#monitorTimeout === undefined)
        {
            this.#logger.logWarn(this.#createLogMessage('monitoring already stopped'));

            return;
        }

        clearTimeout(this.#monitorTimeout);

        this.#monitorTimeout = undefined;

        this.#logger.logInfo(this.#createLogMessage('monitoring stopped'));
    }

    async #monitorConnection(): Promise<void>
    {
        this.#logger.logDebug(this.#createLogMessage('monitoring connection'));

        if (this.#connectable.connected)
        {
            return;
        }

        if (this.#connectPromise !== undefined)
        {
            return this.#connectPromise;
        }

        this.#logger.logWarn(this.#createLogMessage('connection lost'));

        this.#state = States.DISCONNECTED;

        return this.#connect();
    }

    #createLogMessage(message: string): string
    {
        return `[CONNECTION][${this.#name}] ${message}`;
    }
}
