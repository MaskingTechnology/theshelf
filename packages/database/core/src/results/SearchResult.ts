
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

    get filled(): boolean
    {
        return this.count > 0;
    }

    get empty(): boolean
    {
        return this.count === 0;
    }

    get record(): T | undefined
    {
        return this.#records[0];
    }

    get records(): T[]
    {
        return this.#records;
    }
}
