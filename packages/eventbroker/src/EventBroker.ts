
import type { Driver } from './definitions/interfaces.js';
import type { Publication, Subscription } from './definitions/types.js';

import Memory from './drivers/Memory.js';

export default class EventBroker implements Driver
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

    get connected() { return this.driver.connected; }

    connect(): Promise<void>
    {
        return this.driver.connect();
    }

    disconnect(): Promise<void>
    {
        return this.driver.disconnect();
    }

    publish<T>(publication: Publication<T>): Promise<void>
    {
        return this.driver.publish(publication);
    }

    subscribe<T>(subscription: Subscription<T>): Promise<void>
    {
        return this.driver.subscribe(subscription);
    }

    unsubscribe<T>(subscription: Subscription<T>): Promise<void>
    {
        return this.driver.unsubscribe(subscription);
    }

    clear(): Promise<void>
    {
        return this.driver.clear();
    }
}
