
import { jsonDeserializer, Consumer as KafkaConsumer, type Message, type MessagesStream, stringDeserializer } from '@platformatic/kafka';

import type { EventHandler, Event, ErrorHandler } from '@theshelf/events';

type Options =
{
    readonly topic: string;
    readonly brokers: string[];
    readonly groupId: string;
    readonly clientId: string;
}

export default class Consumer
{
    readonly #consumer: KafkaConsumer<string, Record<string, unknown>, string, string>;

    readonly #topic: string;
    readonly #handlers = new Map<string, EventHandler<unknown>[]>();
    readonly #errorHandler: ErrorHandler;

    #stream: MessagesStream<string, Record<string, unknown>, string, string> | undefined;
    #listenerPromise: Promise<void> | undefined;

    constructor(options: Options, errorHandler: ErrorHandler)
    {
        this.#topic = options.topic;

        this.#consumer = new KafkaConsumer({
            groupId: options.groupId,
            clientId: options.clientId,
            bootstrapBrokers: options.brokers,
            deserializers: {
                key: stringDeserializer,
                value: jsonDeserializer,
                headerKey: stringDeserializer,
                headerValue: stringDeserializer
            }
        });

        this.#errorHandler = errorHandler;
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
    }

    listen(): void
    {
        if (this.#stream === undefined)
        {
            return;
        }

        this.#listenerPromise = this.#listen(this.#stream);
    }

    async close(): Promise<void>
    {
        await this.#stream?.close();

        if (this.#listenerPromise)
        {
            await this.#listenerPromise;
        }

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

        if (eventHandlers.length === 0)
        {
            this.#handlers.delete(eventName);
        }
    }

    hasEventHandlers(): boolean
    {
        return this.#handlers.size > 0;
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

    async #listen(stream: MessagesStream<string, Record<string, unknown>, string, string>): Promise<void>
    {
        for await (const message of stream)
        {
            await this.#handle(message);
        }
    }

    async #handle(message: Message<string, Record<string, unknown>, string, string>): Promise<void>
    {
        const handlers = this.#handlers.get(message.key) ?? [];

        for (const handler of handlers)
        {
            try
            {
                await handler(message.value);
            }
            catch(error: unknown)
            {
                const event: Event = { topic: message.topic, name: message.key };

                await this.#errorHandler(event, error);
            }
        }
    }
}
