
import { type MessageToProduce, jsonSerializer, Producer as KafkaProducer, stringSerializer } from '@platformatic/kafka';
import { type Publication } from '@theshelf/events';

export type Options =
{
    readonly brokers: string[];
    readonly clientId: string;
}

export default class Producer
{
    readonly #producer: KafkaProducer<string, Record<string, unknown>, string, string>;
    
    readonly #brokers: string[];
    readonly #clientId: string;

    constructor(options: Options)
    {
        this.#brokers = options.brokers;
        this.#clientId = options.clientId;

        this.#producer = new KafkaProducer({
            clientId: this.#clientId,
            bootstrapBrokers: this.#brokers,
            idempotent: true,
            serializers: {
                key: stringSerializer,
                value: jsonSerializer,
                headerKey: stringSerializer,
                headerValue: stringSerializer
            }
        });
    }

    async send(publication: Publication<unknown>): Promise<void>
    {
        const message: MessageToProduce<string, Record<string, unknown>, string, string> =
        {
            topic: publication.topic,
            key: publication.name,
            value: publication.data as Record<string, unknown>
        };

        await this.#producer.send({
            messages: [message]
        });
    }

    async close(): Promise<void>
    {
        await this.#producer.close();
    }
}
