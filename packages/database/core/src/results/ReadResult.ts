
export default class ReadResult<T>
{
    readonly #record?: T;

    constructor(record: T | undefined)
    {
        this.#record = record;
    }

    get found(): boolean
    {
        return this.#record !== undefined;
    }

    get notFound(): boolean
    {
        return this.#record === undefined;
    }

    get record(): T | undefined
    {
        return this.#record;
    }
}
