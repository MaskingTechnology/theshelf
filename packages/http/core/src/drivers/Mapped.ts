
/* eslint @typescript-eslint/no-unused-vars: "off" */

import { HttpMethods } from '../definitions/constants.js';
import type { HttpMethod } from '../definitions/constants.js';
import type { Driver } from '../definitions/interfaces.js';

export default class Mapped implements Driver
{
    readonly #mappings = new Map<string, Response>();

    get name(): string { return Mapped.name; }

    setMapping(method: HttpMethod, url: string, response: Response): void
    {
        const id = this.#createCacheId(method, url);

        this.#mappings.set(id, response);
    }

    getMapping(method: HttpMethod, url: string): Response | undefined
    {
        const id = this.#createCacheId(method, url);

        return this.#mappings.get(id)?.clone();
    }

    removeMapping(method: HttpMethod, url: string): void
    {
        const id = this.#createCacheId(method, url);

        this.#mappings.delete(id);
    }

    async get(url: string, headers?: Record<string, string> | undefined): Promise<Response>
    {
        return this.getMapping(HttpMethods.GET, url)
            ?? this.#createNotMappedResponse();
    }

    async post(url: string, body: unknown, headers?: Record<string, string> | undefined): Promise<Response>
    {
        return this.getMapping(HttpMethods.POST, url)
            ?? this.#createNotMappedResponse();
    }

    async put(url: string, body: unknown, headers?: Record<string, string> | undefined): Promise<Response>
    {
        return this.getMapping(HttpMethods.PUT, url)
            ?? this.#createNotMappedResponse();
    }

    async patch(url: string, body: unknown, headers?: Record<string, string> | undefined): Promise<Response>
    {
        return this.getMapping(HttpMethods.PATCH, url)
            ?? this.#createNotMappedResponse();
    }

    async delete(url: string, headers?: Record<string, string> | undefined): Promise<Response>
    {
        return this.getMapping(HttpMethods.DELETE, url)
            ?? this.#createNotMappedResponse();
    }

    async head(url: string, headers?: Record<string, string> | undefined): Promise<Response>
    {
        return this.getMapping(HttpMethods.HEAD, url)
            ?? this.#createNotMappedResponse();
    }

    clear(): void
    {
        this.#mappings.clear();
    }

    #createCacheId(method: HttpMethod, url: string): string
    {
        return `${method.toUpperCase()} ${url}`;
    }

    #createNotMappedResponse(): Response
    {
        return new Response('Not mapped', { status: 404 });
    }
}
