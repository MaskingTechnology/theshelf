
import type { Driver } from './definitions/interfaces.js';

export default class NotificationService implements Driver
{
    readonly #driver: Driver;

    constructor(driver: Driver)
    {
        this.#driver = driver;
    }

    get connected(): boolean
    {
        return this.#driver.connected;
    }

    get subscriptions(): Map<string, unknown>
    {
        return new Map(this.#driver.subscriptions);
    }

    connect(): Promise<void>
    {
        return this.#driver.connect();
    }

    disconnect(): Promise<void>
    {
        return this.#driver.disconnect();
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
