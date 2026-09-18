
export default class UpdateResult
{
    readonly #count: number;

    constructor(count: number)
    {
        this.#count = count;
    }

    get count(): number
    {
        return this.#count;
    }

    get noChanges(): boolean
    {
        return this.#count === 0;
    }

    get hasChanges(): boolean
    {
        return this.#count > 0;
    }
}
