
import type ValidationResult from './ValidationResult.js';
import type { ValidationSchema } from './types.js';

export interface Validator
{
    validate(data: unknown, schema: ValidationSchema): ValidationResult;
}
