
import { type MessageToProduce, Producer as KafkaProducer, stringSerializers } from '@platformatic/kafka';
import { type Publication } from '@theshelf/eventbroker';

export type Options =
{
    readonly brokers: string[];
    readonly clientId: string;
}

export default class Producer
{
    readonly #producer: KafkaProducer<string, string, string, string>;
    
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
            serializers: stringSerializers
        });
    }

    async send(publication: Publication<unknown>): Promise<void>
    {
        const message: MessageToProduce<string, string, string, string> =
        {
            topic: publication.channel,
            key: publication.name,
            value: JSON.stringify(publication.data)
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
