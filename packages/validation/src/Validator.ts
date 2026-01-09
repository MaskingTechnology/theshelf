
import type { Driver } from './definitions/interfaces.js';
import type { ValidationSchema } from './definitions/types.js';
import type ValidationResult from './definitions/ValidationResult.js';

export default class Validator implements Driver
{
    #driver: Driver;

    constructor(driver: Driver)
    {
        this.#driver = driver;
    }

    validate(data: unknown, schema: ValidationSchema): ValidationResult
    {
        return this.#driver.validate(data, schema);
    }
}
