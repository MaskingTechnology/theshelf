
export default class SearchResult<T>
{
    readonly #records: T[];

    constructor(records: T[])
    {
        this.#records = records;
    }

    get count(): number
    {
        return this.#records.length;
    }

    get found(): boolean
    {
        return this.count > 0;
    }

    get notFound(): boolean
    {
        return this.count === 0;
    }

    get records(): T[]
    {
        return this.#records;
    }
}
