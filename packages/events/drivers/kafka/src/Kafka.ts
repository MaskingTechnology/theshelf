
import type { Driver, Publication, Subscription, ErrorHandler, Event } from '@theshelf/events';

import Consumer from './Consumer.js';
import Producer from './Producer.js';

type KafkaConfiguration = {
    readonly brokers: string[];
    readonly groupId: string;
    readonly clientId: string;
};

export default class Kafka implements Driver
{
    readonly #producer: Producer;
    readonly #consumers = new Map<string, Consumer>();
    
    readonly #brokers: string[];
    readonly #groupId: string;
    readonly #clientId: string;

    #connected = false;
    #errorHandler: ErrorHandler | undefined;

    constructor(configuration: KafkaConfiguration)
    {
        this.#brokers = configuration.brokers;
        this.#groupId = configuration.groupId;
        this.#clientId = configuration.clientId;

        this.#producer = new Producer({
            clientId: this.#clientId,
            brokers: this.#brokers
        });
    }

    get name(): string { return Kafka.name; }

    get connected(): boolean { return this.#connected; }

    async connect(errorHandler: ErrorHandler): Promise<void>
    {
        this.#errorHandler = errorHandler;

        this.#connected = true;
    }

    async disconnect(): Promise<void>
    {
        const consumers = this.#consumers.values().toArray();

        await Promise.all([
            ...consumers.map(consumer => consumer.close()),
            this.#producer.close()
        ]);

        this.#consumers.clear();

        this.#connected = false;
    }
    
    publish<T>(publication: Publication<T>): Promise<void>
    {
        return this.#producer.send(publication);
    }
    
    async subscribe<T>(subscription: Subscription<T>): Promise<void>
    {
        const consumer = this.#getConsumer(subscription.topic)
            ?? await this.#createConsumer(subscription.topic);

        consumer.registerHandler(subscription.name, subscription.handler);

        consumer.listen();
    }

    async unsubscribe<T>(subscription: Subscription<T>): Promise<void>
    {
        const consumer = this.#getConsumer(subscription.topic);

        if (consumer === undefined) return;

        consumer.unregisterHandler(subscription.name, subscription.handler);

        if (consumer.hasEventHandlers() === false)
        {
            return this.#removeConsumer(consumer);
        }
    }

    #getConsumer(topic: string): Consumer | undefined
    {
        return this.#consumers.get(topic);
    }

    async #createConsumer(topic: string): Promise<Consumer>
    {
        const errorHandler: ErrorHandler = (event, error) => this.#handleError(event, error);

        const consumer = new Consumer({
            topic,
            clientId: this.#clientId,
            groupId: this.#groupId,
            brokers: this.#brokers
        }, errorHandler);

        await consumer.consume();

        this.#consumers.set(topic, consumer);

        return consumer;
    }

    #removeConsumer(consumer: Consumer): Promise<void>
    {
        this.#consumers.delete(consumer.topic);

        return consumer.close();
    }

    async #handleError(event: Event, error: unknown): Promise<void>
    {
        if (this.#errorHandler === undefined) return;
        
        await this.#errorHandler(event, error);
    }
}
