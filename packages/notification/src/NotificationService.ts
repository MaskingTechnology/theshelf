
import { ConnectionStates } from './definitions/constants.js';
import type { ConnectionState } from './definitions/constants.js';
import type { Driver } from './definitions/interfaces.js';

import ConnectionManager from './ConnectionManager.js';

export default class NotificationService implements Driver
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

    get subscriptions(): Map<string, unknown>
    {
        return new Map(this.#driver.subscriptions);
    }

    connect(): Promise<void>
    {
        return this.#connectionManager.connect();
    }

    disconnect(): Promise<void>
    {
        return this.#connectionManager.disconnect();
    }

    subscribe(recipientId: string, subscription: unknown): Promise<void>
    {
        return this.#driver.subscribe(recipientId, subscription);
    }

    unsubscribe(recipientId: string): Promise<void>
    {
        return this.#driver.unsubscribe(recipientId);
    }

    sendNotification(recipientId: string, title: string, message: string): Promise<void>
    {
        return this.#driver.sendNotification(recipientId, title, message);
    }
}
