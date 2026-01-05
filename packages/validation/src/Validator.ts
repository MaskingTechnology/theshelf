
import type { Driver } from './definitions/interfaces.js';
import type { ValidationSchema } from './definitions/types.js';
import type ValidationResult from './definitions/ValidationResult.js';

import Zod from './drivers/Zod.js';

export default class Validator implements Driver
{
    #driver: Driver = new Zod();

    set driver(driver: Driver)
    {
        this.#driver = driver;
    }

    get driver(): Driver
    {
        return this.#driver;
    }

    validate(data: unknown, schema: ValidationSchema): ValidationResult
    {
        return this.driver.validate(data, schema);
    }
}
