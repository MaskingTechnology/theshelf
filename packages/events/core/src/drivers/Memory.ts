
import { EventEmitter } from 'node:events';

import type { Driver } from '../definitions/interfaces.js';
import type { Event, Publication, Subscription, ErrorHandler } from '../definitions/types.js';

import NotConnected from '../errors/NotConnected.js';

export default class Memory implements Driver
{
    readonly #emitters = new Map<string, EventEmitter>();
    
    #errorHandler: ErrorHandler | undefined;
    #connected = false;

    get name(): string { return Memory.name; }
    
    get connected(): boolean { return this.#connected; }

    get emitters(): Map<string, EventEmitter>
    {
        if (this.#connected === false)
        {
            throw new NotConnected();
        }

        return this.#emitters;
    }

    async connect(errorHandler: ErrorHandler): Promise<void>
    {
        this.#errorHandler = errorHandler;

        this.#connected = true;
    }

    async disconnect(): Promise<void>
    {
        this.#connected = false;
        this.#emitters.clear();
    }

    async publish<T>(publication: Publication<T>): Promise<void>
    {
        const emitter = this.#getEmitter(publication);

        emitter.emit(publication.name, publication.data);
    }

    async subscribe<T>(subscription: Subscription<T>): Promise<void>
    {
        const emitter = this.#getEmitter(subscription);

        emitter.on(subscription.name, data => this.#handle<T>(subscription, data));
    }

    async unsubscribe<T>(subscription: Subscription<T>): Promise<void>
    {
        const emitter = this.#getEmitter(subscription);

        emitter.off(subscription.name, subscription.handler);
    }

    clear(): void
    {
        this.emitters.clear();
    }

    #getEmitter(event: Event): EventEmitter
    {
        const emitters = this.emitters;

        if (emitters.has(event.topic) === false)
        {
            emitters.set(event.topic, new EventEmitter());
        }

        return emitters.get(event.topic) as EventEmitter;
    }

    async #handle<T>(subscription: Subscription<T>, data: T): Promise<void>
    {
        try
        {
            await subscription.handler(data);
        }
        catch(error: unknown)
        {
            await this.#handleError(subscription, error);
        }
    }

    async #handleError(event: Event, error: unknown)
    {
        if (this.#errorHandler === undefined) return;

        await this.#errorHandler(event, error);
    }
}
