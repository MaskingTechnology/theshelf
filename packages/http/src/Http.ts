
import { HttpMethods } from './definitions/constants.js';
import type { Driver } from './definitions/interfaces.js';

export default class Http implements Driver
{
    readonly #driver: Driver;

    readonly #cache = new Map<string, Response>();

    constructor(driver: Driver)
    {
        this.#driver = driver;
    }

    setCache(method: string, url: string, response: Response): void
    {
        const id = this.#createCacheId(method, url);

        this.#cache.set(id, response);
    }

    getCache(method: string, url: string): Response | undefined
    {
        const id = this.#createCacheId(method, url);

        return this.#cache.get(id);
    }

    removeCache(method: string, url: string): void
    {
        const id = this.#createCacheId(method, url);

        this.#cache.delete(id);
    }

    clearCache(): void
    {
        this.#cache.clear();
    }

    async get(url: string, headers?: Record<string, string> | undefined): Promise<Response>
    {
        return this.getCache(HttpMethods.GET, url)
            ?? this.#driver.get(url, headers);
    }

    async post(url: string, body: unknown, headers?: Record<string, string> | undefined): Promise<Response>
    {
        return this.getCache(HttpMethods.POST, url)
            ?? this.#driver.post(url, body, headers);
    }

    async put(url: string, body: unknown, headers?: Record<string, string> | undefined): Promise<Response>
    {
        return this.getCache(HttpMethods.PUT, url)
            ?? this.#driver.put(url, body, headers);
    }

    async patch(url: string, body: unknown, headers?: Record<string, string> | undefined): Promise<Response>
    {
        return this.getCache(HttpMethods.PATCH, url)
            ?? this.#driver.patch(url, body, headers);
    }

    async delete(url: string, headers?: Record<string, string> | undefined): Promise<Response>
    {
        return this.getCache(HttpMethods.DELETE, url)
            ?? this.#driver.delete(url, headers);
    }

    async head(url: string, headers?: Record<string, string> | undefined): Promise<Response>
    {
        return this.getCache(HttpMethods.HEAD, url)
            ?? this.#driver.head(url, headers);
    }

    #createCacheId(method: string, url: string): string
    {
        return `${method.toUpperCase()} ${url.toLowerCase()}`;
    }
}
