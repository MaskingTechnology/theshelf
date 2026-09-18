
import type ValidationResult from '../ValidationResult.js';
import type { ValidationSchema } from './types.js';

export interface Driver
{
    get name(): string;
    
    validate<T>(data: T, schema: ValidationSchema<T>): ValidationResult;
}
