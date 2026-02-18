
import type { Driver } from '../definitions/interfaces.js';
import type { CacheItem } from '../definitions/types.js';
import InvalidTTL from '../errors/InvalidTTL.js';

type MemoryCacheItem = CacheItem<unknown> & {
    readonly expiresAt: number;
};

const DEFAULT_TTL = 60_000;
const CLEANUP_INTERVAL = 3_000;

export default class Memory implements Driver
{
    readonly #cache = new Map<string, MemoryCacheItem>();

    readonly #defaultTTL: number;

    #connected = false;
    #cleanupInterval?: NodeJS.Timeout;

    constructor(defaultTTL = DEFAULT_TTL)
    {
        if (Number.isFinite(defaultTTL) === false || defaultTTL <= 0)
        {
            throw new InvalidTTL();
        }

        this.#defaultTTL = defaultTTL;
    }

    get name(): string { return this.constructor.name; }

    get connected(): boolean { return this.#connected; }

    async connect(): Promise<void>
    {
        if (this.#connected === true)
        {
            return;
        }

        this.#connected = true;

        this.#startCleanup();
    }

    async disconnect(): Promise<void>
    {
        if (this.#connected === false)
        {
            return;
        }

        this.#stopCleanup();

        this.#connected = false;

        this.#cache.clear();
    }

    async get<T>(key: string): Promise<CacheItem<T> | undefined>
    {
        const memoryItem = this.#cache.get(key);

        if (memoryItem === undefined) return;

        if (memoryItem.expiresAt < Date.now())
        {
            this.#cache.delete(key);

            return;
        }

        return {
            key: memoryItem.key,
            value: memoryItem.value as T,
            ttl: memoryItem.ttl
        };
    }

    async set<T>(item: CacheItem<T>): Promise<void>
    {
        const ttl = item.ttl ?? this.#defaultTTL;
        const expiresAt = Date.now() + ttl;

        const memoryItem = { ...item, expiresAt};

        this.#cache.set(memoryItem.key, memoryItem);
    }

    async delete(key: string): Promise<void>
    {
        this.#cache.delete(key);
    }

    clear(): void
    {
        this.#cache.clear();
    }

    #startCleanup()
    {
        if (this.#cleanupInterval !== undefined) return;

        this.#cleanupInterval = setInterval(() => this.#cleanup(), CLEANUP_INTERVAL);
        this.#cleanupInterval.unref();
    }

    #stopCleanup()
    {
        if (this.#cleanupInterval === undefined) return;

        clearInterval(this.#cleanupInterval);

        this.#cleanupInterval = undefined;
    }

    #cleanup()
    {
        const now = Date.now();

        for (const [key, entry] of this.#cache.entries())
        {
            if (entry.expiresAt < now)
            {
                this.#cache.delete(key);
            }
        }
    }
}
