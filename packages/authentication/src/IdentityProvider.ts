
import type { Driver } from './definitions/interfaces.js';
import type { Session } from './definitions/types.js';

import NoDriver from './errors/NoDriver.js';

export default class IdentityProvider implements Driver
{
    #driver?: Driver;

    set driver(driver: Driver)
    {
        this.#driver = driver;
    }

    get driver(): Driver
    {
        if (this.#driver === undefined)
        {
            throw new NoDriver();
        }

        return this.#driver;
    }

    get connected(): boolean
    {
        return this.driver.connected;
    }

    connect(): Promise<void>
    {
        return this.driver.connect();
    }

    disconnect(): Promise<void>
    {
        return this.driver.disconnect();
    }

    getLoginUrl(origin: string): Promise<string>
    {
        return this.driver.getLoginUrl(origin);
    }

    login(origin: string, data: Record<string, unknown>): Promise<Session>
    {
        return this.driver.login(origin, data);
    }

    refresh(session: Session): Promise<Session>
    {
        return this.driver.refresh(session);
    }

    logout(session: Session): Promise<void>
    {
        return this.driver.logout(session);
    }
}
