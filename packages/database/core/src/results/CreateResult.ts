
import { type RecordId } from "../definitions/types.js";

export default class CreateResult
{
    readonly #recordId: RecordId;

    constructor(recordId: RecordId)
    {
        this.#recordId = recordId;
    }

    get recordId(): RecordId
    {
        return this.#recordId;
    }
}
