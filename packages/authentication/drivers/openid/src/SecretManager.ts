
type Secret = {
    codeVerifier: string;
    nonce: string;
}

type Entry = {
    secret: Secret;
    expiresAt: number;
};

const TTL = 40_000;
const CLEANUP_INTERVAL = 10_000;

export default class SecretManager
{
    readonly #cache = new Map<string, Entry>();
    #cleanupInterval?: NodeJS.Timeout;

    set(key: string, secret: Secret): void
    {
        const entry: Entry =
        {
            secret,
            expiresAt: Date.now() + TTL
        };

        this.#cache.set(key, entry);
    }

    get(key: string): Secret | undefined
    {
        const entry = this.#cache.get(key);

        if (entry === undefined) return;

        this.#cache.delete(key);

        if (entry.expiresAt < Date.now())
        {
            return;
        }

        return entry.secret;
    }

    start(): void
    {
        if (this.#cleanupInterval !== undefined) return;

        this.#cleanupInterval = setInterval(() => this.#cleanup(), CLEANUP_INTERVAL);
        this.#cleanupInterval.unref();
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
