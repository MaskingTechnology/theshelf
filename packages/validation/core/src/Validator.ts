
import type Logger from '@theshelf/logging';

import type { Driver } from './definitions/interfaces.js';
import type { ValidationSchema } from './definitions/types.js';
import type ValidationResult from './ValidationResult.js';

export default class Validator
{
    readonly #driver: Driver;

    readonly #logger?: Logger;

    constructor(driver: Driver, logger?: Logger)
    {
        this.#driver = driver;

        this.#logger = logger?.for(Validator.name)
                              .for(this.#driver.name);
    }

    validate<T>(data: T, schema: ValidationSchema<T>): ValidationResult
    {
        this.#logger?.debug('Validating schema', schema);

        try
        {
            return this.#driver.validate<T>(data, schema);
        }
        catch (error)
        {
            this.#logger?.error('Validating schema', schema, 'failed with error', error);

            throw error;
        }
    }
}
