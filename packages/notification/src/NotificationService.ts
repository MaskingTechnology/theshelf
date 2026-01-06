
import type { Driver } from './definitions/interfaces.js';

import Memory from './drivers/Memory.js';

export default class NotificationService implements Driver
{
    #driver: Driver = new Memory();

    set driver(driver: Driver)
    {
        this.#driver = driver;
    }

    get driver(): Driver
    {
        return this.#driver;
    }

    get connected(): boolean
    {
        return this.driver.connected;
    }

    get subscriptions(): Map<string, unknown>
    {
        return this.driver.subscriptions;
    }

    connect(): Promise<void>
    {
        return this.driver.connect();
    }

    disconnect(): Promise<void>
    {
        return this.driver.disconnect();
    }

    subscribe(recipientId: string, subscription: unknown): Promise<void>
    {
        return this.driver.subscribe(recipientId, subscription);
    }

    unsubscribe(recipientId: string): Promise<void>
    {
        return this.driver.unsubscribe(recipientId);
    }

    sendNotification(recipientId: string, title: string, message: string): Promise<void>
    {
        return this.driver.sendNotification(recipientId, title, message);
    }
}
