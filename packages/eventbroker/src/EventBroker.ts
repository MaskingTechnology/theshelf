
import { ConnectionStates } from './definitions/constants.js';
import type { ConnectionState } from './definitions/constants.js';
import type { Driver } from './definitions/interfaces.js';
import type { Publication, Subscription } from './definitions/types.js';

import ConnectionManager from './ConnectionManager.js';

export default class EventBroker implements Driver
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

    publish<T>(publication: Publication<T>): Promise<void>
    {
        return this.#driver.publish(publication);
    }

    subscribe<T>(subscription: Subscription<T>): Promise<void>
    {
        return this.#driver.subscribe(subscription);
    }

    unsubscribe<T>(subscription: Subscription<T>): Promise<void>
    {
        return this.#driver.unsubscribe(subscription);
    }
}
