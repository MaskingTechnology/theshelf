
import { ConnectionStates } from './definitions/constants.js';
import type { ConnectionState } from './definitions/constants.js';
import type { Driver } from './definitions/interfaces.js';
import type { Session } from './definitions/types.js';

import ConnectionManager from './ConnectionManager.js';

export default class IdentityProvider implements Driver
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

    getLoginUrl(origin: string): Promise<string>
    {
        return this.#driver.getLoginUrl(origin);
    }

    login(origin: string, data: Record<string, unknown>): Promise<Session>
    {
        return this.#driver.login(origin, data);
    }

    refresh(session: Session): Promise<Session>
    {
        return this.#driver.refresh(session);
    }

    logout(session: Session): Promise<void>
    {
        return this.#driver.logout(session);
    }
}
