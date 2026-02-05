
import type Logger from '@theshelf/logging';

import type { Driver } from './definitions/interfaces.js';
import type { ValidationSchema } from './definitions/types.js';
import type ValidationResult from './definitions/ValidationResult.js';

export default class Validator
{
    readonly #driver: Driver;

    readonly #logger?: Logger;
    readonly #logPrefix: string;

    constructor(driver: Driver, logger?: Logger)
    {
        this.#driver = driver;

        this.#logger = logger?.for(Validator.name);
        this.#logPrefix = `${this.#driver.name} ->`;
    }

    validate(data: unknown, schema: ValidationSchema): ValidationResult
    {
        this.#logger?.debug(this.#logPrefix, 'Validating schema', schema);

        try
        {
            return this.#driver.validate(data, schema);
        }
        catch (error)
        {
            this.#logger?.error(this.#logPrefix, 'Validating schema', schema, 'failed with error', error);

            throw error;
        }
    }
}
