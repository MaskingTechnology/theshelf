
export default class UpdateResult
{
    readonly #affectedCount: number;

    constructor(affectedCount: number)
    {
        this.#affectedCount = affectedCount;
    }

    get affectedCount(): number
    {
        return this.#affectedCount;
    }

    get noChanges(): boolean
    {
        return this.#affectedCount === 0;
    }

    get hasChanges(): boolean
    {
        return this.#affectedCount > 0;
    }
}
