
import type { Driver } from '../definitions/interfaces.js';
import NotConnected from '../errors/NotConnected.js';
import SubscriptionNotFound from '../errors/SubscriptionNotFound.js';

type Notification = {
    title: string;
    body: string;
};

export default class Memory implements Driver
{
    #subscriptions = new Map<string, Notification[]>();

    #connected = false;

    get name(): string { return Memory.name; }

    get connected(): boolean { return this.#connected; }

    get subscriptions(): Map<string, Notification[]>
    {
        if (this.#connected === false)
        {
            throw new NotConnected();
        }

        return this.#subscriptions;
    }

    async connect(): Promise<void>
    {
        this.#connected = true;
    }

    async disconnect(): Promise<void>
    {
        this.#connected = false;
        this.#subscriptions.clear();
    }

    async subscribe(recipientId: string): Promise<void>
    {
        this.subscriptions.set(recipientId, []);
    }

    async unsubscribe(recipientId: string): Promise<void>
    {
        if (this.subscriptions.has(recipientId) === false)
        {
            throw new SubscriptionNotFound(recipientId);
        }

        this.subscriptions.delete(recipientId);
    }

    async sendNotification(recipientId: string, title: string, body: string): Promise<void>
    {
        const subscription = this.#getSubscription(recipientId);

        subscription.push({ title, body });
    }

    clear(): void
    {
        this.subscriptions.clear();
    }

    #getSubscription(recipientId: string): Notification[]
    {
        const subscription = this.subscriptions.get(recipientId);

        if (subscription === undefined)
        {
            throw new SubscriptionNotFound(recipientId);
        }

        return subscription;
    }
}
