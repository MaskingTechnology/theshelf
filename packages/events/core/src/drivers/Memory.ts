
import { EventEmitter } from 'node:events';

import type { Driver } from '../definitions/interfaces.js';
import type { Event, Publication, Subscription, ErrorHandler, EventHandler } from '../definitions/types.js';

import NotConnected from '../errors/NotConnected.js';

export default class Memory implements Driver
{
    readonly #emitters = new Map<string, EventEmitter>();
    readonly #handlers = new Map<string, Map<EventHandler<unknown>, EventHandler<unknown>>>;
    
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
        const emitter = this.#getEmitter(publication)
            ?? this.#createEmitter(publication);

        emitter.emit(publication.name, publication.data);
    }

    async subscribe<T>(subscription: Subscription<T>): Promise<void>
    {
        const emitter = this.#getEmitter(subscription)
            ?? this.#createEmitter(subscription);

        const handler = this.#createHandler(subscription);
        
        emitter.on(subscription.name, handler);
    }

    async unsubscribe<T>(subscription: Subscription<T>): Promise<void>
    {
        const emitter = this.#getEmitter(subscription);

        if (emitter === undefined) return;

        const handler = this.#getHandler(subscription);

        if (handler === undefined) return;

        emitter.off(subscription.name, handler);
    }

    clear(): void
    {
        this.emitters.clear();
    }

    #getEmitter(event: Event): EventEmitter | undefined
    {
        return this.emitters.get(event.topic) as EventEmitter;
    }

    #createEmitter(event: Event): EventEmitter
    {
        const emitter = new EventEmitter();

        this.emitters.set(event.topic, emitter);

        return emitter;
    }

    #getHandler<T>(subscription: Subscription<T>): EventHandler<T> | undefined
    {
        const handlers = this.#getHandlers(subscription);

        if (handlers === undefined) return;

        return handlers.get(subscription.handler);
    }

    #createHandler<T>(subscription: Subscription<T>): EventHandler<T>
    {

        const handler: EventHandler<T> = (data) => this.#handle<T>(subscription, data);

        const handlers = this.#getHandlers(subscription)
            ?? this.#createHandlers(subscription);

        handlers.set(subscription.handler as EventHandler<unknown>, handler as EventHandler<unknown>);

        return handler;
    }

    #getHandlers<T>(subscription: Subscription<T>): Map<EventHandler<T>, EventHandler<T>> | undefined
    {
        const key = `${subscription.topic}.${subscription.name}`;

        return this.#handlers.get(key)!;
    }

    #createHandlers<T>(subscription: Subscription<T>): Map<EventHandler<T>, EventHandler<T>>
    {
        const key = `${subscription.topic}.${subscription.name}`;

        const handlers = new Map<EventHandler<unknown>, EventHandler<unknown>>();

        this.#handlers.set(key, handlers);

        return handlers;
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

    async #handleError(event: Event, error: unknown): Promise<void>
    {
        if (this.#errorHandler === undefined) return;

        await this.#errorHandler(event, error);
    }
}
