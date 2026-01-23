
type Entry = {
    value: string,
    expiresAt: number;
};

const TTL = 40_000;
const CLEANUP_INTERVAL = 10_000;

export default class CacheManager
{
    readonly #cache = new Map<string, Entry>;
    #cleanupInterval?: NodeJS.Timeout = undefined;

    set(key: string, value: string): void
    {
        if (this.#cache.has(key))
        {
            throw new Error('Existing entry');
        }

        const entry: Entry =
        {
            value,
            expiresAt: Date.now() + TTL
        };

        this.#cache.set(key, entry);
    }

    get(key: string): string
    {
        const entry = this.#cache.get(key);
        this.#cache.delete(key);

        if (entry === undefined || entry.expiresAt < Date.now())
        {
            throw new Error('Invalid value');
        }

        return entry.value;
    }

    start(): void
    {
        if (this.#cleanupInterval !== undefined) return;

        this.#cleanupInterval = setInterval(() => this.#cleanup(), CLEANUP_INTERVAL);
    }

    stop(): void
    {
        if (this.#cleanupInterval === undefined) return;

        clearInterval(this.#cleanupInterval);

        this.#cache.clear();
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
