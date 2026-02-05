
import type { PushSubscription } from 'web-push';
import webpush from 'web-push';

import { NotConnected, SubscriptionNotFound } from '@theshelf/notification';
import type { Driver } from '@theshelf/notification';

type WebPushConfiguration = { // Vapid details
    subject: string;
    publicKey: string;
    privateKey: string;
};

export default class WebPush implements Driver
{
    readonly #configuration: WebPushConfiguration;
    
    #subscriptions?: Map<string, PushSubscription>;

    constructor(configuration: WebPushConfiguration)
    {
        this.#configuration = configuration;
    }

    get name(): string { return WebPush.name; }

    get connected(): boolean
    {
        return this.#subscriptions !== undefined;
    }

    get subscriptions(): Map<string, PushSubscription>
    {
        return this.#getSubscriptions();
    }

    async connect(): Promise<void>
    {
        if (this.connected)
        {
            return;
        }

        this.#subscriptions = new Map();

        webpush.setVapidDetails(this.#configuration.subject, this.#configuration.publicKey, this.#configuration.privateKey);
    }

    async disconnect(): Promise<void>
    {
        this.#subscriptions = undefined;
    }

    async subscribe(recipientId: string, subscription: PushSubscription): Promise<void>
    {
        const subscriptions = this.#getSubscriptions();

        subscriptions.set(recipientId, subscription);
    }

    async unsubscribe(recipientId: string): Promise<void>
    {
        const subscriptions = this.#getSubscriptions();

        if (subscriptions.has(recipientId) === false)
        {
            throw new SubscriptionNotFound(recipientId);
        }

        subscriptions.delete(recipientId);
    }

    async sendNotification(recipientId: string, title: string, body: string): Promise<void>
    {
        try
        {
            const subscription = this.#getSubscription(recipientId);

            await webpush.sendNotification(subscription, JSON.stringify({ title, body }));
        }
        catch (error)
        {
            if (error instanceof Error && 'statusCode' in error && error.statusCode === 410)
            {
                this.#subscriptions?.delete(recipientId);
            }

            throw error;
        }
    }

    #getSubscriptions(): Map<string, PushSubscription>
    {
        if (this.#subscriptions === undefined)
        {
            throw new NotConnected();
        }

        return this.#subscriptions;
    }

    #getSubscription(recipientId: string): PushSubscription
    {
        const subscriptions = this.#getSubscriptions();
        const subscription = subscriptions.get(recipientId);

        if (subscription === undefined)
        {
            throw new SubscriptionNotFound(recipientId);
        }

        return subscription;
    }
}
