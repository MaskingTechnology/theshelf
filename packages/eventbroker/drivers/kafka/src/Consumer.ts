
import { Consumer as KafkaConsumer, type Message, type MessagesStream, stringDeserializers } from '@platformatic/kafka';

import type { EventHandler } from '@theshelf/eventbroker';

type Options =
{
    readonly topic: string;
    readonly brokers: string[];
    readonly groupId: string;
    readonly clientId: string;
}

export default class Consumer
{
    readonly #consumer: KafkaConsumer<string, string, string, string>;

    readonly #topic: string;
    readonly #handlers = new Map<string, EventHandler<unknown>[]>();

    #stream: MessagesStream<string, string, string, string> | undefined;

    constructor(options: Options)
    {
        this.#topic = options.topic;

        this.#consumer = new KafkaConsumer({
            groupId: options.groupId,
            clientId: options.clientId,
            bootstrapBrokers: options.brokers,
            deserializers: stringDeserializers
        });
    }

    get topic(): string { return this.#topic; }

    async consume(): Promise<void>
    {
        this.#stream = await this.#consumer.consume({
            autocommit: true,
            topics: [this.#topic],
            sessionTimeout: 10000,
            heartbeatInterval: 3000,
            mode: 'committed',
            fallbackMode: 'earliest'
        });

        this.#listen(this.#stream).catch(error =>
        {            
            throw error;
        });
    }

    async close(): Promise<void>
    {
        await this.#stream?.close();

        await this.#consumer.close();
    }

    registerHandler<T>(eventName: string, handler: EventHandler<T>): void
    {
        const eventHandlers = this.#getEventHandlers<T>(eventName)
            ?? this.#registerEvent<T>(eventName);
        
        eventHandlers.push(handler);
    }

    unregisterHandler<T>(eventName: string, handler: EventHandler<T>): void
    {
        const eventHandlers = this.#getEventHandlers<T>(eventName);

        if (eventHandlers === undefined) return;

        const index = eventHandlers.indexOf(handler);

        if (index === -1) return;

        eventHandlers.splice(index, 1);
    }

    hasEventHandlers(eventName: string): boolean
    {
        const eventHandlers = this.#getEventHandlers(eventName);

        return eventHandlers !== undefined
            && eventHandlers.length > 0;
    }

    #getEventHandlers<T>(eventName: string): EventHandler<T>[] | undefined
    {
        return this.#handlers.get(eventName) as EventHandler<T>[];
    }

    #registerEvent<T>(eventName: string): EventHandler<T>[]
    {
        const eventHandlers: EventHandler<unknown>[] = [];

        this.#handlers.set(eventName, eventHandlers);

        return eventHandlers as EventHandler<T>[];
    }

    async #listen(stream: MessagesStream<string, string, string, string>): Promise<void>
    {
        for await (const message of stream)
        {
            await this.#handle(message);
        }
    }

    async #handle(message: Message<string, string, string, string>): Promise<void>
    {
        const handlers = this.#handlers.get(message.key) ?? [];

        for (const handler of handlers)
        {
            const value = JSON.parse(message.value);

            await handler(value);
        }
    }
}
